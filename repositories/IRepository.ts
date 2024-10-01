import { FindOptionsWhere } from "typeorm";

export interface IRepository<T> {
    create(item: T, userDisplayName?: string, userEmail?: string): Promise<T>;
    getSingleById(id: string): Promise<T | null>;
    getSingleByConditions(conditions: FindOptionsWhere<T>): Promise<T | null>
    countByConditions(conditions: FindOptionsWhere<T>): Promise<number>;
    getAll(): Promise<T[]>;
    getAllByConditions(conditions: FindOptionsWhere<T>): Promise<T[]>;
    update(item: T, userDisplayName?: string, userEmail?: string): Promise<T>;
    delete(id: string, userDisplayName?: string, userEmail?: string): Promise<void>;
    getPageData(
        filter?: string,
        orderBy?: string,
        page?: number,
        pageSize?: number,
        isDescending?: boolean
    ): Promise<[T[], number]>;
}