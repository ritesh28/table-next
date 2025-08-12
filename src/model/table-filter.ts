interface Filter {
  field: string;
}
export interface FilterEmpty extends Filter {
  operator: 'is empty' | 'is not empty';
}
interface FilterString extends Filter {
  operator: 'contains' | 'does not contain' | 'is' | 'is not';
  value: string;
}
export interface FilterList extends Filter {
  operator: 'has any of' | 'has none of';
  values: string[];
}
interface FilterNumber extends Filter {
  operator: 'is' | 'is not' | 'is less than' | 'is less than or equal to' | 'is greater then' | 'is greater then or equal to';
  value: number;
}
interface FilterNumberRange extends Filter {
  operator: 'is between';
  valueA: number;
  valueB: number;
}
interface FilterDate extends Filter {
  operator: 'is' | 'is not' | 'is before' | 'is on or before' | 'is after' | 'is on or after';
  value: string;
}
interface FilterDateRange extends Filter {
  operator: 'is between';
  valueA: string;
  valueB: string;
}
interface FilterDateRelative extends Filter {
  operator: 'a week ago' | 'a month ago' | '3 months ago' | '6 months ago' | '1 year ago';
  value: string;
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
