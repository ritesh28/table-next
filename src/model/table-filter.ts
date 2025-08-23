import { immerable, produce } from 'immer';
import moment, { Moment } from 'moment';
import { Task } from './task';

export abstract class Filter<TOperator extends string = string> {
  constructor(
    protected _columnId: keyof Task,
    protected _operator: TOperator,
  ) {}
  abstract filterRow(row: unknown): boolean;
  get columnId() {
    return this._columnId;
  }
  get operator() {
    return this._operator;
  }
}

type FilterEmptyOperator = 'is empty' | 'is not empty';
export class FilterEmpty extends Filter<FilterEmptyOperator> {
  constructor(columnId: keyof Task, operator: FilterEmptyOperator) {
    super(columnId, operator);
  }

  filterRow(row: unknown) {
    const colValue = row[this._columnId];
    if (this._operator === 'is empty') return colValue === undefined || colValue === null;
    if (this._operator === 'is not empty') return !(colValue === undefined || colValue === null);
    return true;
  }
}

type FilterStringOperator = 'contains' | 'does not contain' | 'is' | 'is not';
export class FilterString<TColumnValue extends string = string> extends Filter<FilterStringOperator> {
  constructor(
    columnId: keyof Task,
    operator: FilterStringOperator,
    public value: TColumnValue,
  ) {
    super(columnId, operator);
  }

  filterRow(row: unknown) {
    const colValue = row[this._columnId] as TColumnValue;
    if (this._operator === 'contains') return colValue.toLowerCase().includes(this.value.toLowerCase());
    if (this._operator === 'does not contain') return !colValue.toLowerCase().includes(this.value.toLowerCase());
    if (this._operator === 'is') return colValue.toLowerCase().trim() === this.value.toLowerCase().trim();
    if (this._operator === 'is not') return colValue.toLowerCase().trim() !== this.value.toLowerCase().trim();
    return true;
  }
}

type FilterListOperator = 'has any of' | 'has none of';
export class FilterList extends Filter<FilterListOperator> {
  constructor(
    columnId: keyof Task,
    operator: FilterListOperator,
    public values: unknown[],
  ) {
    super(columnId, operator);
  }

  filterRow(row: unknown) {
    const colValue = row[this._columnId];
    if (this._operator === 'has any of') return this.values.includes(colValue);
    if (this._operator === 'has none of') return !this.values.includes(colValue);
    return true;
  }
}

type FilterNumberOperator = 'is' | 'is not' | 'is less than' | 'is less than or equal to' | 'is greater than' | 'is greater than or equal to';
export class FilterNumber<TColumnValue extends number = number> extends Filter<FilterNumberOperator> {
  constructor(
    columnId: keyof Task,
    operator: FilterNumberOperator,
    public value: TColumnValue,
  ) {
    super(columnId, operator);
  }

  filterRow(row: unknown) {
    const colValue = row[this._columnId] as TColumnValue;
    if (this._operator === 'is') return colValue === this.value;
    if (this._operator === 'is not') return colValue !== this.value;
    if (this._operator === 'is less than') return colValue < this.value;
    if (this._operator === 'is less than or equal to') return colValue <= this.value;
    if (this._operator === 'is greater than') return colValue > this.value;
    if (this._operator === 'is greater than or equal to') return colValue >= this.value;
    return true;
  }
}

type FilterNumberRangeOperator = 'is between';
export class FilterNumberRange<TColumnValue extends number = number> extends Filter<FilterNumberRangeOperator> {
  constructor(
    columnId: keyof Task,
    operator: FilterNumberRangeOperator,
    public minValue: TColumnValue,
    public maxValue: TColumnValue,
  ) {
    super(columnId, operator);
  }

  filterRow(row: unknown) {
    const colValue = row[this._columnId] as TColumnValue;
    if (this._operator === 'is between') return colValue >= this.minValue && colValue <= this.maxValue;
    return true;
  }
}

type FilterDateOperator = 'is' | 'is not' | 'is before' | 'is on or before' | 'is after' | 'is on or after';
export class FilterDate<TColumnValue extends Moment = Moment> extends Filter<FilterDateOperator> {
  constructor(
    columnId: keyof Task,
    operator: FilterDateOperator,
    public value: TColumnValue,
  ) {
    super(columnId, operator);
  }

  filterRow(row: unknown) {
    const colValue = row[this._columnId] as TColumnValue;
    if (this._operator === 'is') return moment(colValue).isSame(this.value);
    if (this._operator === 'is not') return !moment(colValue).isSame(this.value);
    if (this._operator === 'is before') return moment(colValue).isBefore(this.value);
    if (this._operator === 'is on or before') return moment(colValue).isSameOrBefore(this.value);
    if (this._operator === 'is after') return moment(colValue).isAfter(this.value);
    if (this._operator === 'is on or after') return moment(colValue).isSameOrAfter(this.value);
    return true;
  }
}

type FilterDateRangeOperator = 'is between';
export class FilterDateRange<TColumnValue extends Moment = Moment> extends Filter<FilterDateRangeOperator> {
  constructor(
    columnId: keyof Task,
    operator: FilterDateRangeOperator,
    public minValue: TColumnValue,
    public maxValue: TColumnValue,
  ) {
    super(columnId, operator);
  }

  filterRow(row: unknown) {
    const colValue = row[this._columnId] as TColumnValue;
    if (this._operator === 'is between') return moment(colValue).isBetween(this.minValue, this.maxValue);
    return true;
  }
}

type FilterDateRelativeOperator = 'a week ago' | 'a month ago' | '3 months ago' | '6 months ago' | '1 year ago';
export class FilterDateRelative<TColumnValue extends Moment = Moment> extends Filter<FilterDateRelativeOperator> {
  constructor(columnId: keyof Task, operator: FilterDateRelativeOperator) {
    super(columnId, operator);
  }

  filterRow(row: unknown) {
    const colValue = row[this._columnId] as TColumnValue;
    const today = moment();
    if (this._operator === 'a week ago') return moment(colValue).isBetween(today.subtract(1, 'week'), today);
    if (this._operator === 'a month ago') return moment(colValue).isBetween(today.subtract(1, 'month'), today);
    if (this._operator === '3 months ago') return moment(colValue).isBetween(today.subtract(3, 'month'), today);
    if (this._operator === '6 months ago') return moment(colValue).isBetween(today.subtract(6, 'month'), today);
    if (this._operator === '1 year ago') return moment(colValue).isBetween(today.subtract(1, 'year'), today);
    return true;
  }
}

type AndOr = 'And' | 'Or';
type FilterGroupType = 'simple' | 'advanced';

export class FilterGroup {
  [immerable] = true;
  constructor(
    private _type: FilterGroupType = 'advanced',
    private _filters: Filter[] = [],
    private _filterListAndOr: AndOr = 'Or',
  ) {}

  get type() {
    return this._type;
  }
  get filters() {
    return Object.freeze(this._filters);
  }
  get filterListAndOr() {
    return this._filterListAndOr;
  }

  firstFilterIndex(columnId: string) {
    // useful in case of simple filter group since for a column theres only one filter
    return this._filters.findIndex((f) => f.columnId === columnId);
  }

  addNewFilter(filter: Filter) {
    return produce(this, (draft: this) => {
      // 'this' type is a workaround to modifying private fields with immer.js
      draft._filters.push(filter);
    });
  }

  addDefaultFilter() {
    return produce(this, (draft: this) => {
      draft._filters.push(new FilterString('title', 'contains', ''));
    });
  }

  replaceFilter(newFilter: Filter, index: number) {
    return produce(this, (draft: this) => {
      draft._filters.splice(index, 1, newFilter);
    });
  }

  deleteFilter(index: number) {
    return produce(this, (draft: this) => {
      draft._filters.splice(index, 1);
    });
  }

  deleteFilterByCol(columnId: string) {
    // this is for simple filter group where for a column id there is one filter
    return produce(this, (draft: this) => {
      const index = draft.firstFilterIndex(columnId);
      if (index !== -1) {
        draft.deleteFilter(index);
      }
    });
  }
}

export class FilterGroupCollection {
  [immerable] = true;
  constructor(
    private _filterGroups: FilterGroup[] = [],
    private _filterGroupListAndOr: AndOr = 'And',
  ) {}

  get filterGroups() {
    return Object.freeze(this._filterGroups);
  }
  get filterGroupListAndOr() {
    return this._filterGroupListAndOr;
  }
  get simpleFilterGroup() {
    return this._filterGroups.find((fg) => fg.type === 'simple');
  }

  addNewFilterGroup(filterGroup: FilterGroup) {
    return produce(this, (draft: this) => {
      if (filterGroup.type === 'simple') {
        // simple filter group are stored at the start of the list
        draft._filterGroups.splice(0, 0, filterGroup);
      } else {
        draft._filterGroups.push(filterGroup);
      }
    });
  }
  replaceFilterGroup(newFilterGroup: FilterGroup, index: number) {
    return produce(this, (draft: this) => {
      draft._filterGroups.splice(index, 1, newFilterGroup);
    });
  }
  replaceSimpleFilterGroup(newSimpleFilterGroup: FilterGroup) {
    return produce(this, (draft: this) => {
      draft.replaceFilterGroup(newSimpleFilterGroup, 0);
    });
  }
  deleteFilterGroup(index: number) {
    return produce(this, (draft: this) => {
      draft._filterGroups.splice(index, 1);
    });
  }
  deleteSimpleFilterGroup() {
    return produce(this, (draft: this) => {
      if (draft.simpleFilterGroup) {
        draft.deleteFilterGroup(0);
      }
    });
  }
}
