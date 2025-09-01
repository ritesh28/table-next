import { produce } from 'immer';
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

export const FilterEmptyOperator = ['is empty', 'is not empty'] as const;
type FilterEmptyOperatorType = (typeof FilterEmptyOperator)[number];
function isFilterEmptyOperator(value: string): value is FilterEmptyOperatorType {
  return (FilterEmptyOperator as readonly string[]).includes(value);
}
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
function isFilterStringOperator(value: string): value is FilterStringOperatorType {
  return (FilterStringOperator as readonly string[]).includes(value);
}
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
function isFilterListOperator(value: string): value is FilterListOperatorType {
  return (FilterListOperator as readonly string[]).includes(value);
}
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
function isFilterNumberOperator(value: string): value is FilterNumberOperatorType {
  return (FilterNumberOperator as readonly string[]).includes(value);
}
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
function isFilterNumberRangeOperator(value: string): value is FilterNumberRangeOperatorType {
  return (FilterNumberRangeOperator as readonly string[]).includes(value);
}
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
function isFilterDateOperator(value: string): value is FilterDateOperatorType {
  return (FilterDateOperator as readonly string[]).includes(value);
}
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
function isFilterDateRangeOperator(value: string): value is FilterDateRangeOperatorType {
  return (FilterDateRangeOperator as readonly string[]).includes(value);
}
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
function isFilterDateRelativeOperator(value: string): value is FilterDateRelativeOperatorType {
  return (FilterDateRelativeOperator as readonly string[]).includes(value);
}
export class FilterDateRelative extends Filter<FilterDateRelativeOperatorType, null> {
  constructor(columnId: keyof Task, operator: FilterDateRelativeOperatorType) {
    super(columnId, operator, null);
  }

  filterRow(row: unknown) {
    const colValue = row[this._columnId] as Moment;
    if (this._operator === 'a week ago') return moment(colValue).isBetween(moment().subtract(1, 'week'), moment());
    if (this._operator === 'a month ago') return moment(colValue).isBetween(moment().subtract(1, 'month'), moment());
    if (this._operator === '3 months ago') return moment(colValue).isBetween(moment().subtract(3, 'month'), moment());
    if (this._operator === '6 months ago') return moment(colValue).isBetween(moment().subtract(6, 'month'), moment());
    if (this._operator === '1 year ago') return moment(colValue).isBetween(moment().subtract(1, 'year'), moment());
    return true;
  }
}

const UI_FOR_FILTER_VALUE = ['noUI', 'textBox', 'multiSelect', 'numericTextBox', '2numericTextBox', 'singleDate', 'rangeDate'] as const;
export const FILTER_OPERATOR_TYPES = {
  Emptiness: {
    operator: FilterEmptyOperator,
    getFilterObj: (columnId: keyof Task, operator: string) => {
      if (isFilterEmptyOperator(operator)) return new FilterEmpty(columnId, operator);
      throw new Error(`Invalid operator '${operator}' for filter type 'Emptiness'`);
    },
    uiTypeForValue: 'noUI',
  },
  Text: {
    operator: FilterStringOperator,
    getFilterObj: (columnId: keyof Task, operator: string, value: string) => {
      if (isFilterStringOperator(operator)) return new FilterString(columnId, operator, value);
      throw new Error(`Invalid operator '${operator}' for filter type 'Text'`);
    },
    uiTypeForValue: 'textBox',
  },
  Choice: {
    operator: FilterListOperator,
    getFilterObj: (columnId: keyof Task, operator: string, value: unknown[]) => {
      if (isFilterListOperator(operator)) return new FilterList(columnId, operator, value);
      throw new Error(`Invalid operator '${operator}' for filter type 'Choice'`);
    },
    uiTypeForValue: 'multiSelect',
  },
  Numeric: {
    operator: FilterNumberOperator,
    getFilterObj: (columnId: keyof Task, operator: string, value: number) => {
      if (isFilterNumberOperator(operator)) return new FilterNumber(columnId, operator, value);
      throw new Error(`Invalid operator '${operator}' for filter type 'Numeric'`);
    },
    uiTypeForValue: 'numericTextBox',
  },
  'Numeric Range': {
    operator: FilterNumberRangeOperator,
    getFilterObj: (columnId: keyof Task, operator: string, value: [number, number]) => {
      if (isFilterNumberRangeOperator(operator)) return new FilterNumberRange(columnId, operator, value);
      throw new Error(`Invalid operator '${operator}' for filter type 'Numeric Range'`);
    },
    uiTypeForValue: '2numericTextBox',
  },
  Date: {
    operator: FilterDateOperator,
    getFilterObj: (columnId: keyof Task, operator: string, value: Moment) => {
      if (isFilterDateOperator(operator)) return new FilterDate(columnId, operator, value);
      throw new Error(`Invalid operator '${operator}' for filter type 'Date'`);
    },
    uiTypeForValue: 'singleDate',
  },
  'Date Range': {
    operator: FilterDateRangeOperator,
    getFilterObj: (columnId: keyof Task, operator: string, value: [Moment, Moment]) => {
      if (isFilterDateRangeOperator(operator)) return new FilterDateRange(columnId, operator, value);
      throw new Error(`Invalid operator '${operator}' for filter type 'Date Range'`);
    },
    uiTypeForValue: 'rangeDate',
  },
  'Date Relative': {
    operator: FilterDateRelativeOperator,
    getFilterObj: (columnId: keyof Task, operator: string) => {
      if (isFilterDateRelativeOperator(operator)) return new FilterDateRelative(columnId, operator);
      throw new Error(`Invalid operator '${operator}' for filter type 'Date Relative'`);
    },
    uiTypeForValue: 'noUI',
  },
} as const satisfies Readonly<
  Record<
    string,
    {
      operator: Readonly<string[]>;
      getFilterObj: (columnId: keyof Task, operator: string, value: unknown) => Filter<string, unknown>;
      uiTypeForValue: (typeof UI_FOR_FILTER_VALUE)[number];
    }
  >
>;

/**
 * This Filter class is used as a placeholder when user is filling out values for a filter
 */
export class FilterPlaceholder extends Filter<string, unknown> {
  private _operatorType: keyof typeof FILTER_OPERATOR_TYPES | null = null;
  constructor(columnId: keyof Task = 'title') {
    super(columnId, '', null);
  }

  // DO NOT REMOVE getter (I know its already present in the parent class)
  // TS does not throw error - https://github.com/microsoft/TypeScript/issues/47581
  get columnId() {
    return this._columnId;
  }
  set columnId(v: keyof Task) {
    this._columnId = v;
  }
  get operator() {
    return this._operator;
  }
  set operator(v: string) {
    this._operator = v;
  }
  get value() {
    return this._value;
  }
  set value(v: unknown) {
    this._value = v;
  }
  get operatorType() {
    return this._operatorType;
  }

  filterRow(_row: unknown) {
    return true;
  }

  setOperator(operator: string, operatorType: keyof typeof FILTER_OPERATOR_TYPES) {
    this._operatorType = operatorType;

    switch (operatorType) {
      case 'Emptiness':
      case 'Date Relative':
        return FILTER_OPERATOR_TYPES[operatorType].getFilterObj(this.columnId, operator);
      default:
        return produce(this, (draft) => {
          draft.operator = operator;
        });
    }
  }
}
