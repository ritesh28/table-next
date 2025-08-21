import moment, { Moment } from 'moment';

abstract class Filter<TOperator> {
  constructor(
    protected _columnId: string,
    protected _operator: TOperator,
  ) {}
  abstract filterRow(row: unknown, columnId: string): boolean;
  get columnId() {
    return this._columnId;
  }
  get operator() {
    return this._operator;
  }
}

type FilterEmptyOperator = 'is empty' | 'is not empty';
export class FilterEmpty extends Filter<FilterEmptyOperator> {
  constructor(columnId: string, operator: FilterEmptyOperator) {
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
    columnId: string,
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
    columnId: string,
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
    columnId: string,
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
    columnId: string,
    operator: FilterNumberRangeOperator,
    private minValue: TColumnValue,
    private maxValue: TColumnValue,
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
    columnId: string,
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
    columnId: string,
    operator: FilterDateRangeOperator,
    private minValue: TColumnValue,
    private maxValue: TColumnValue,
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
  constructor(
    columnId: string,
    operator: FilterDateRelativeOperator,
    private minValue: TColumnValue,
    private maxValue: TColumnValue,
  ) {
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

type AndOr = false | 'And' | 'Or';
interface UIFilterGroup {
  name: string;
  canCancel: boolean;
  isEditable: boolean;
  /**
   * this 'andOr' is a predicate among the filter list
   */
  filterListAndOr: AndOr;
  filters: (FilterEmpty | FilterString | FilterList | FilterNumber | FilterNumberRange | FilterDate | FilterDateRange | FilterDateRelative)[];
}

export interface UIFilterGroups {
  /**
   * this 'andOr' is a predicate among the filter-group list
   */
  filterGroupListAndOr: AndOr;
  filterGroups: UIFilterGroup[];
}

export interface ModelFilterGroups {
  /**
   * this 'andOr' is a predicate among the filter-group list
   */
  filterGroupListAndOr: AndOr;
  filterGroups: Pick<UIFilterGroup, 'filterListAndOr' | 'filters'>[];
}

export const DEFAULT_MODEL_FILTER_GROUPS: ModelFilterGroups = {
  filterGroupListAndOr: false,
  filterGroups: [
    {
      filterListAndOr: false,
      filters: [],
    },
  ],
};

export const DEFAULT_FILTER_LIST_AND_OR: AndOr = 'And';
