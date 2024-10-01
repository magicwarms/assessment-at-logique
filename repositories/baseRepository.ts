import { Repository, EntityTarget, FindOptionsWhere, FindManyOptions, FindOptionsOrder } from 'typeorm';
import AppDataSource from '../database/ormconfig';
import { IRepository } from './IRepository';
import { parseOperator, Op } from '../utils/operatorTypes';
import { injectable, unmanaged } from 'inversify';

@injectable()
export class BaseRepository<T extends object> implements IRepository<T> {
    private entity: EntityTarget<T>;
    protected repository: Repository<T>;

    constructor(@unmanaged() entity: EntityTarget<T>) {
        this.entity = entity;
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

    async countByConditions(conditions: FindOptionsWhere<T>): Promise<number> {
        return this.repository.countBy(conditions);
    }

    async getAll(): Promise<T[]> {
        return this.repository.find();
    }

    async getAllByConditions(conditions: FindOptionsWhere<T>): Promise<T[]> {
        return this.repository.find({ where: conditions });
    }

    async update(item: T, userDisplayName?: string, userEmail?: string): Promise<T> {
        return this.repository.save({
            ...item,
            updatedBy: `${userDisplayName} | ${userEmail ?? ""}`,
            updatedDate: new Date()
        });
    }

    // TODO: consider to implement soft delete
    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    async getPageData(
        filter?: string,
        orderBy: string = 'id',
        page: number = 1,
        pageSize: number = 20,
        isDescending: boolean = false
    ): Promise<[T[], number]> {
        const entityFields = Object.keys(this.repository.metadata.propertiesMap) as (keyof T)[];
        const orderField = this.parseOrderBy(orderBy, entityFields);

        const whereClauses = this.parseFilter(filter);
        const orderOptions = {
            [orderField]: isDescending ? 'DESC' : 'ASC'
        } as FindOptionsOrder<T>;

        const options: FindManyOptions<T> = {
            where: whereClauses.length ? (whereClauses.length > 1 ? whereClauses : whereClauses[0]) : {},
            order: orderOptions,
            skip: (page - 1) * pageSize,
            take: pageSize,
        };

        return this.repository.findAndCount(options);
    }

    private parseFilter(filter?: string): FindOptionsWhere<T>[] {
        if (!filter) return [];
        const conditions = filter.split(',').map((condition) => {
            const subConditions = condition.split(';').reduce((whereClause: FindOptionsWhere<T>, subcondition) => {
                const [field, operator, value] = subcondition.split('_');

                const parsedCondition = parseOperator(field as keyof T, operator as Op, value);
                return { ...whereClause, ...parsedCondition };
            }, {} as FindOptionsWhere<T>);
            return subConditions;
        });
        return conditions;
    }

    private parseOrderBy(orderBy: string, entityFields: (keyof T)[]): keyof T {
        if (entityFields.includes(orderBy as keyof T)) {
            return orderBy as keyof T;
        }
        throw new Error(`Invalid orderBy field: ${orderBy}`);
    }
}