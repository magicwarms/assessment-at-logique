import {
  FindOptionsWhere,
  ILike,
  In,
  MoreThan,
  LessThan,
  MoreThanOrEqual,
  LessThanOrEqual,
  Not,
  IsNull,
} from 'typeorm';

export enum Op {
  Equals = 'eq',
  NotEquals = 'neq',
  GreaterThan = 'gt',
  LessThan = 'lt',
  GreaterThanOrEqual = 'gte',
  LessThanOrEqual = 'lte',
  Contains = 'contains',
  StartsWith = 'startswith',
  EndsWith = 'endswith',
  In = 'in',
  IsNull = 'isnull',
}

export const parseOperator = <T>(field: keyof T, operator: Op, value: string): FindOptionsWhere<T> => {
  switch (operator) {
    case Op.Equals:
      return { [field]: value } as FindOptionsWhere<T>;
    case Op.NotEquals:
      return { [field]: Not(value) } as FindOptionsWhere<T>;
    case Op.GreaterThan:
      return { [field]: MoreThan(value) } as FindOptionsWhere<T>;
    case Op.LessThan:
      return { [field]: LessThan(value) } as FindOptionsWhere<T>;
    case Op.GreaterThanOrEqual:
      return { [field]: MoreThanOrEqual(value) } as FindOptionsWhere<T>;
    case Op.LessThanOrEqual:
      return { [field]: LessThanOrEqual(value) } as FindOptionsWhere<T>;
    case Op.Contains:
      return { [field]: ILike(`%${value}%`) } as FindOptionsWhere<T>;
    case Op.StartsWith:
      return { [field]: ILike(`${value}%`) } as FindOptionsWhere<T>;
    case Op.EndsWith:
      return { [field]: ILike(`%${value}`) } as FindOptionsWhere<T>;
    case Op.In:
      return { [field]: In(value.split(',')) } as FindOptionsWhere<T>;
    case Op.IsNull:
      return { [field]: IsNull() } as FindOptionsWhere<T>;
    default:
      throw new Error(`Unknown operator: ${operator}`);
  }
};