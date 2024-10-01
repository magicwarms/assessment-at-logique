import { FindManyOptions } from "typeorm";

export interface IRepository<T> {
    create(item: T, userDisplayName?: string, userEmail?: string): Promise<T>;
    getSingleById(id: string): Promise<T | null>;
    getAll(): Promise<T[]>;
    getAllByConditions(conditions: FindManyOptions<T>): Promise<[T[], number]>;
    update(item: T, userDisplayName?: string, userEmail?: string): Promise<T>;
    delete(id: string, userDisplayName?: string, userEmail?: string): Promise<void>;
}