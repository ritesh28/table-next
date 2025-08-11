interface Filter {
  field: string;
  andOr: false | 'And' | 'Or';
}
interface FilterEmpty extends Filter {
  operator: 'is empty' | 'is not empty';
}
interface FilterString extends Filter {
  operator: 'contains' | 'does not contain' | 'is' | 'is not';
  value: string;
}
interface FilterList extends Filter {
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

export interface UIFilterGroup {
  name: string;
  canCancel: boolean;
  isEditable: boolean;
  andOr: false | 'And' | 'Or';
  filters: (FilterEmpty | FilterString | FilterList | FilterNumber | FilterNumberRange | FilterDate | FilterDateRange | FilterDateRelative)[];
}

export type ModelFilterGroup = Pick<UIFilterGroup, 'andOr' | 'filters'>;
