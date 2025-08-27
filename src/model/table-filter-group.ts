import { Filter, FilterString } from '@/model/table-filters';
import { immerable, produce } from 'immer';

export type AndOr = 'And' | 'Or';
type FilterGroupType = 'simple' | 'advanced';

export class FilterGroup {
  [immerable] = true;

  constructor(
    private _type: FilterGroupType = 'advanced',
    private _filters: Filter<string, unknown>[] = [],
    private _filterListAndOr: AndOr = 'And',
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

  setFilterListAndOr(value: AndOr) {
    return produce(this, (draft: this) => {
      draft._filterListAndOr = value;
    });
  }

  firstFilterIndex(columnId: string) {
    // useful in case of simple filter group since for a column theres only one filter
    return this._filters.findIndex((f) => f.columnId === columnId);
  }
  firstFilter(columnId: string) {
    // useful in case of simple filter group since for a column theres only one filter
    return this._filters.find((f) => f.columnId === columnId);
  }

  addNewFilter(filter: Filter<string, unknown>) {
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

  replaceFilter(newFilter: Filter<string, unknown>, index: number) {
    return produce(this, (draft: this) => {
      draft._filters.splice(index, 1, newFilter);
    });
  }
  replaceOrAddFilterByCol(newFilter: Filter<string, unknown>, columnId: string) {
    // this is for simple filter group where for a column id there is one filter
    return produce(this, (draft: this) => {
      const index = draft.firstFilterIndex(columnId);
      if (index === -1) {
        draft.addNewFilter(newFilter);
      } else {
        draft._filters.splice(index, 1, newFilter);
      }
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
        draft._filters.splice(index, 1);
      }
    });
  }
}
