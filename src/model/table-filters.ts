import moment, { Moment } from 'moment';
import { Task } from './task';

export abstract class Filter<TOperator extends string, TValue> {
  constructor(
    protected _columnId: keyof Task,
    protected _operator: TOperator,
    protected _value: TValue,
  ) {}
  abstract filterRow(row: unknown): boolean;
  get columnId() {
    return this._columnId;
  }
  get operator() {
    return this._operator;
  }
  get value() {
    return this._value;
  }
}

/**
 * This Filter class is used as a placeholder when user is filling out values for a filter
 */
export class FilterPlaceholder extends Filter<string, unknown> {
  constructor() {
    super('title', '', null);
  }

  // DO NOT REMOVE getter (I know its already present in the parent class)
  // TS does not throw error - https://github.com/microsoft/TypeScript/issues/47581
  get columnId() {
    return this._columnId;
  }
  get operator() {
    return this._operator;
  }
  get value() {
    return this._value;
  }
  set columnId(v: keyof Task) {
    this._columnId = v;
  }
  set operator(v: string) {
    this._operator = v;
  }
  set value(v: unknown) {
    this._value = v;
  }

  filterRow(_row: unknown) {
    return true;
  }
}

export const FilterEmptyOperator = ['is empty', 'is not empty'] as const;
type FilterEmptyOperatorType = (typeof FilterEmptyOperator)[number];
export class FilterEmpty extends Filter<FilterEmptyOperatorType, null> {
  constructor(columnId: keyof Task, operator: FilterEmptyOperatorType) {
    super(columnId, operator, null);
  }

  filterRow(row: unknown) {
    const colValue = row[this._columnId];
    if (this._operator === 'is empty') return colValue === null;
    if (this._operator === 'is not empty') return !(colValue === null);
    return true;
  }
}

export const FilterStringOperator = ['contains', 'does not contain', 'is', 'is not'] as const;
type FilterStringOperatorType = (typeof FilterStringOperator)[number];
export class FilterString extends Filter<FilterStringOperatorType, string> {
  constructor(columnId: keyof Task, operator: FilterStringOperatorType, value: string) {
    super(columnId, operator, value);
  }

  filterRow(row: unknown) {
    const colValue = row[this._columnId] as string;
    if (this._operator === 'contains') return colValue.toLowerCase().includes(this.value.toLowerCase());
    if (this._operator === 'does not contain') return !colValue.toLowerCase().includes(this.value.toLowerCase());
    if (this._operator === 'is') return colValue.toLowerCase().trim() === this.value.toLowerCase().trim();
    if (this._operator === 'is not') return colValue.toLowerCase().trim() !== this.value.toLowerCase().trim();
    return true;
  }
}

export const FilterListOperator = ['has any of', 'has none of'] as const;
type FilterListOperatorType = (typeof FilterListOperator)[number];
export class FilterList extends Filter<FilterListOperatorType, unknown[]> {
  constructor(columnId: keyof Task, operator: FilterListOperatorType, value: unknown[]) {
    super(columnId, operator, value);
  }

  filterRow(row: unknown) {
    const colValue = row[this._columnId] as unknown;
    if (this._operator === 'has any of') return this.value.includes(colValue);
    if (this._operator === 'has none of') return !this.value.includes(colValue);
    return true;
  }
}

export const FilterNumberOperator = [
  'is',
  'is not',
  'is less than',
  'is less than or equal to',
  'is greater than',
  'is greater than or equal to',
] as const;
type FilterNumberOperatorType = (typeof FilterNumberOperator)[number];
export class FilterNumber extends Filter<FilterNumberOperatorType, number> {
  constructor(columnId: keyof Task, operator: FilterNumberOperatorType, value: number) {
    super(columnId, operator, value);
  }

  filterRow(row: unknown) {
    const colValue = row[this._columnId] as number;
    if (this._operator === 'is') return colValue === this.value;
    if (this._operator === 'is not') return colValue !== this.value;
    if (this._operator === 'is less than') return colValue < this.value;
    if (this._operator === 'is less than or equal to') return colValue <= this.value;
    if (this._operator === 'is greater than') return colValue > this.value;
    if (this._operator === 'is greater than or equal to') return colValue >= this.value;
    return true;
  }
}

export const FilterNumberRangeOperator = ['is between'] as const;
type FilterNumberRangeOperatorType = (typeof FilterNumberRangeOperator)[number];
export class FilterNumberRange extends Filter<FilterNumberRangeOperatorType, [number, number]> {
  constructor(columnId: keyof Task, operator: FilterNumberRangeOperatorType, value: [number, number]) {
    super(columnId, operator, value);
  }

  filterRow(row: unknown) {
    const colValue = row[this._columnId] as number;
    const [minValue, maxValue] = this.value;
    if (this._operator === 'is between') return colValue >= minValue && colValue <= maxValue;
    return true;
  }
}

export const FilterDateOperator = ['is', 'is not', 'is before', 'is on or before', 'is after', 'is on or after'] as const;
type FilterDateOperatorType = (typeof FilterDateOperator)[number];
export class FilterDate extends Filter<FilterDateOperatorType, Moment> {
  constructor(columnId: keyof Task, operator: FilterDateOperatorType, value: Moment) {
    super(columnId, operator, value);
  }

  filterRow(row: unknown) {
    const colValue = row[this._columnId] as Moment;
    if (this._operator === 'is') return moment(colValue).isSame(this.value);
    if (this._operator === 'is not') return !moment(colValue).isSame(this.value);
    if (this._operator === 'is before') return moment(colValue).isBefore(this.value);
    if (this._operator === 'is on or before') return moment(colValue).isSameOrBefore(this.value);
    if (this._operator === 'is after') return moment(colValue).isAfter(this.value);
    if (this._operator === 'is on or after') return moment(colValue).isSameOrAfter(this.value);
    return true;
  }
}

export const FilterDateRangeOperator = ['is between'] as const;
type FilterDateRangeOperatorType = (typeof FilterDateRangeOperator)[number];
export class FilterDateRange extends Filter<FilterDateRangeOperatorType, [Moment, Moment]> {
  constructor(columnId: keyof Task, operator: FilterDateRangeOperatorType, value: [Moment, Moment]) {
    super(columnId, operator, value);
  }

  filterRow(row: unknown) {
    const colValue = row[this._columnId] as Moment;
    const [minValue, maxValue] = this.value;
    if (this._operator === 'is between') return moment(colValue).isBetween(minValue, maxValue);
    return true;
  }
}

export const FilterDateRelativeOperator = ['a week ago', 'a month ago', '3 months ago', '6 months ago', '1 year ago'] as const;
type FilterDateRelativeOperatorType = (typeof FilterDateRelativeOperator)[number];
export class FilterDateRelative extends Filter<FilterDateRelativeOperatorType, null> {
  constructor(columnId: keyof Task, operator: FilterDateRelativeOperatorType) {
    super(columnId, operator, null);
  }

  filterRow(row: unknown) {
    const colValue = row[this._columnId] as Moment;
    const today = moment();
    if (this._operator === 'a week ago') return moment(colValue).isBetween(today.subtract(1, 'week'), today);
    if (this._operator === 'a month ago') return moment(colValue).isBetween(today.subtract(1, 'month'), today);
    if (this._operator === '3 months ago') return moment(colValue).isBetween(today.subtract(3, 'month'), today);
    if (this._operator === '6 months ago') return moment(colValue).isBetween(today.subtract(6, 'month'), today);
    if (this._operator === '1 year ago') return moment(colValue).isBetween(today.subtract(1, 'year'), today);
    return true;
  }
}
