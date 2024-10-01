import { Repository, EntityTarget, FindOptionsWhere, FindManyOptions } from 'typeorm';
import AppDataSource from '../database/ormconfig';
import { IRepository } from './IRepository';
import { injectable, unmanaged } from 'inversify';

@injectable()
export class BaseRepository<T extends object> implements IRepository<T> {
    protected repository: Repository<T>;

    constructor(@unmanaged() entity: EntityTarget<T>) {
        this.repository = AppDataSource.getRepository(entity);
    }

    async create(item: T, userDisplayName?: string, userEmail?: string): Promise<T> {
        const entity = this.repository.create({
            ...item,
            createdBy: `${userDisplayName} | ${userEmail ?? ""}`,
            createdDate: new Date()
        });
        return this.repository.save(entity);
    }

    async getSingleById(id: string): Promise<T | null> {
        return this.repository.findOneBy({ id } as T);
    }

    async getSingleByConditions(conditions: FindOptionsWhere<T>): Promise<T | null> {
        return this.repository.findOne({ where: conditions });
    }

    async countByConditions(conditions: FindOptionsWhere<T>[]): Promise<number> {
        return this.repository.countBy(conditions);
    }

    async getAll(): Promise<T[]> {
        return this.repository.find();
    }

    async getAllByConditions(conditions: FindManyOptions<T>): Promise<[T[], number]> {
        return this.repository.findAndCount(conditions);
    }

    async update(item: T, userDisplayName?: string, userEmail?: string): Promise<T> {
        return this.repository.save({
            ...item,
            updatedBy: `${userDisplayName} | ${userEmail ?? ""}`,
            updatedDate: new Date()
        });
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}