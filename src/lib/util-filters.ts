import { immerable, produce } from 'immer';
import moment, { Moment } from 'moment';
import { Task } from '../model/task';

export type UiVariantForValue = 'textBox' | 'numericTextBox' | '2numericTextBox' | 'singleDate' | 'rangeDate' | 'multiSelect' | 'noUI';

export abstract class Filter<TValue> {
  [immerable] = true;

  static readonly OPERATOR_GROUP_NAME: string;
  static readonly OPERATOR_LIST: readonly string[];
  static readonly UI_VARIANT_FOR_VALUE: UiVariantForValue;

  private _id: string = crypto.randomUUID();

  constructor(
    protected _columnId: keyof Task,
    protected _operator: string,
    protected _value: TValue | null = null,
  ) {}
  abstract filterRow(row: any): boolean;
  get id() {
    return this._id;
  }
  get columnId() {
    return this._columnId;
  }
  get operator() {
    return this._operator;
  }
  get value() {
    return this._value;
  }
  setValueAndReturnNewFilter(newValue: TValue | null) {
    return produce(this, (draft: this) => {
      draft._value = newValue;
    });
  }
}

class FilterEmpty extends Filter<null> {
  static readonly OPERATOR_GROUP_NAME = 'Emptiness';
  static readonly OPERATOR_LIST = ['is empty', 'is not empty'] as const;
  static readonly UI_VARIANT_FOR_VALUE: UiVariantForValue = 'noUI';

  constructor(columnId: keyof Task, operator: string) {
    if (!(FilterEmpty.OPERATOR_LIST as readonly string[]).includes(operator)) throw Error(`Invalid operator '${operator}'`);
    super(columnId, operator, null);
  }

  filterRow(row: any) {
    const colValue = row[this._columnId];
    if (this._operator === 'is empty') return colValue === null;
    if (this._operator === 'is not empty') return !(colValue === null);
    return true; // default value
  }
}

class FilterString extends Filter<string> {
  static readonly OPERATOR_GROUP_NAME = 'Text';
  static readonly OPERATOR_LIST = ['contains', 'does not contain', 'is', 'is not'] as const;
  static readonly UI_VARIANT_FOR_VALUE: UiVariantForValue = 'textBox';

  constructor(columnId: keyof Task, operator: string, value: string | null = null) {
    if (!(FilterString.OPERATOR_LIST as readonly string[]).includes(operator)) throw Error(`Invalid operator '${operator}'`);
    super(columnId, operator, value);
  }

  filterRow(row: any) {
    if (this.value === null) return true; // don't filter out

    const colValue = row[this._columnId] as string;
    const filterValue = this.value as string;
    if (this._operator === 'contains') return colValue.toLowerCase().includes(filterValue.toLowerCase());
    if (this._operator === 'does not contain') return !colValue.toLowerCase().includes(filterValue.toLowerCase());
    if (this._operator === 'is') return colValue.toLowerCase().trim() === filterValue.toLowerCase().trim();
    if (this._operator === 'is not') return colValue.toLowerCase().trim() !== filterValue.toLowerCase().trim();
    return true; // default value
  }
}

class FilterList extends Filter<unknown[]> {
  static readonly OPERATOR_GROUP_NAME = 'Choice';
  static readonly OPERATOR_LIST = ['has any of', 'has none of'] as const;
  static readonly UI_VARIANT_FOR_VALUE: UiVariantForValue = 'multiSelect';

  constructor(columnId: keyof Task, operator: string, value: unknown[] | null = null) {
    if (!(FilterList.OPERATOR_LIST as readonly string[]).includes(operator)) throw Error(`Invalid operator '${operator}'`);
    super(columnId, operator, value);
  }

  filterRow(row: any) {
    if (this.value === null) return true; // don't filter out

    const colValue = row[this._columnId] as unknown;
    const filterValue = this.value;
    if (this._operator === 'has any of') return filterValue.includes(colValue);
    if (this._operator === 'has none of') return !filterValue.includes(colValue);
    return true; // default value
  }
}

class FilterNumber extends Filter<number> {
  static readonly OPERATOR_GROUP_NAME = 'Numeric';
  static readonly OPERATOR_LIST = [
    'is',
    'is not',
    'is less than',
    'is less than or equal to',
    'is greater than',
    'is greater than or equal to',
  ] as const;
  static readonly UI_VARIANT_FOR_VALUE: UiVariantForValue = 'numericTextBox';

  constructor(columnId: keyof Task, operator: string, value: number | null = null) {
    if (!(FilterNumber.OPERATOR_LIST as readonly string[]).includes(operator)) throw Error(`Invalid operator '${operator}'`);
    super(columnId, operator, value);
  }

  filterRow(row: any) {
    if (this.value === null) return true; // don't filter out

    const colValue = row[this._columnId] as number;
    const filterValue = this.value;
    if (this._operator === 'is') return colValue === filterValue;
    if (this._operator === 'is not') return colValue !== filterValue;
    if (this._operator === 'is less than') return colValue < filterValue;
    if (this._operator === 'is less than or equal to') return colValue <= filterValue;
    if (this._operator === 'is greater than') return colValue > filterValue;
    if (this._operator === 'is greater than or equal to') return colValue >= filterValue;
    return true; // default value
  }
}

class FilterNumberRange extends Filter<[number, number]> {
  static readonly OPERATOR_GROUP_NAME = 'Numeric Range';
  static readonly OPERATOR_LIST = ['is between'] as const;
  static readonly UI_VARIANT_FOR_VALUE: UiVariantForValue = '2numericTextBox';

  constructor(columnId: keyof Task, operator: string, value: [number, number] | null = null) {
    if (!(FilterNumberRange.OPERATOR_LIST as readonly string[]).includes(operator)) throw Error(`Invalid operator '${operator}'`);
    super(columnId, operator, value);
  }

  filterRow(row: any) {
    if (this.value === null) return true; // don't filter out

    const colValue = row[this._columnId] as number;
    const [minValue, maxValue] = this.value;
    if (this._operator === 'is between') return colValue >= minValue && colValue <= maxValue;
    return true; // default value
  }
}

class FilterDate extends Filter<Moment> {
  static readonly OPERATOR_GROUP_NAME = 'Date';
  static readonly OPERATOR_LIST = ['is', 'is not', 'is before', 'is on or before', 'is after', 'is on or after'] as const;
  static readonly UI_VARIANT_FOR_VALUE: UiVariantForValue = 'singleDate';

  constructor(columnId: keyof Task, operator: string, value: Moment | null = null) {
    if (!(FilterDate.OPERATOR_LIST as readonly string[]).includes(operator)) throw Error(`Invalid operator '${operator}'`);
    super(columnId, operator, value);
  }

  filterRow(row: any) {
    if (this.value === null) return true; // don't filter out

    const colValue = row[this._columnId] as Moment;
    if (this._operator === 'is') return moment(colValue).isSame(this.value);
    if (this._operator === 'is not') return !moment(colValue).isSame(this.value);
    if (this._operator === 'is before') return moment(colValue).isBefore(this.value);
    if (this._operator === 'is on or before') return moment(colValue).isSameOrBefore(this.value);
    if (this._operator === 'is after') return moment(colValue).isAfter(this.value);
    if (this._operator === 'is on or after') return moment(colValue).isSameOrAfter(this.value);
    return true; // default value
  }
}

class FilterDateRange extends Filter<[Moment, Moment]> {
  static readonly OPERATOR_GROUP_NAME = 'Date Range';
  static readonly OPERATOR_LIST = ['is between'] as const;
  static readonly UI_VARIANT_FOR_VALUE: UiVariantForValue = 'rangeDate';

  constructor(columnId: keyof Task, operator: string, value: [Moment, Moment] | null = null) {
    if (!(FilterDateRange.OPERATOR_LIST as readonly string[]).includes(operator)) throw Error(`Invalid operator '${operator}'`);
    super(columnId, operator, value);
  }

  filterRow(row: any) {
    if (this.value === null) return true; // don't filter out

    const colValue = row[this._columnId] as Moment;
    const [minValue, maxValue] = this.value;
    if (this._operator === 'is between') return moment(colValue).isBetween(minValue, maxValue, undefined, '[]');
    return true; // default value
  }
}

class FilterDateRelative extends Filter<null> {
  static readonly OPERATOR_GROUP_NAME = 'Date Relative';
  static readonly OPERATOR_LIST = ['a week ago', 'a month ago', '3 months ago', '6 months ago', '1 year ago'] as const;
  static readonly UI_VARIANT_FOR_VALUE: UiVariantForValue = 'noUI';

  constructor(columnId: keyof Task, operator: string) {
    if (!(FilterDateRelative.OPERATOR_LIST as readonly string[]).includes(operator)) throw Error(`Invalid operator '${operator}'`);
    super(columnId, operator, null);
  }

  filterRow(row: any) {
    const colValue = row[this._columnId] as Moment;
    if (this._operator === 'a week ago') return moment(colValue).isBetween(moment().subtract(1, 'week'), moment());
    if (this._operator === 'a month ago') return moment(colValue).isBetween(moment().subtract(1, 'month'), moment());
    if (this._operator === '3 months ago') return moment(colValue).isBetween(moment().subtract(3, 'month'), moment());
    if (this._operator === '6 months ago') return moment(colValue).isBetween(moment().subtract(6, 'month'), moment());
    if (this._operator === '1 year ago') return moment(colValue).isBetween(moment().subtract(1, 'year'), moment());
    return true; // default value
  }
}

export const FILTER_VARIANTS = {
  date: FilterDate,
  dateRange: FilterDateRange,
  dateRelative: FilterDateRelative,
  empty: FilterEmpty,
  list: FilterList,
  number: FilterNumber,
  numberRange: FilterNumberRange,
  string: FilterString,
} as const;
