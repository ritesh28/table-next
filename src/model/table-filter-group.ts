import { Filter } from '@/model/table-filters';
import { immerable, produce } from 'immer';

export type AndOr = 'And' | 'Or';
type FilterGroupType = 'simple' | 'advanced';

export class FilterGroup {
  [immerable] = true;

  constructor(
    private _type: FilterGroupType = 'advanced',
    private _filters: Filter<unknown>[] = [],
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
  get isSimpleFilterGroup() {
    return this._type === 'simple';
  }

  setFilterListAndOr(value: AndOr) {
    return produce(this, (draft: this) => {
      draft._filterListAndOr = value;
    });
  }

  /**
   * @description useful in case of *simple filter group* since for a column theres only one filter
   * @returns first matched filter index number
   */
  getFilterIndexByColumnId(columnId: string) {
    return this._filters.findIndex((f) => f.columnId === columnId);
  }
  /**
   * @description useful in case of *simple filter group* since for a column theres only one filter
   * @returns first matched filter
   */
  getFilterByColumnId(columnId: string) {
    return this._filters.find((f) => f.columnId === columnId);
  }

  addNewFilter(filter: Filter<unknown>) {
    return produce(this, (draft: this) => {
      // 'this' type is a workaround to modifying private fields with immer.js
      draft._filters.push(filter);
    });
  }

  replaceFilter(newFilter: Filter<unknown>, index: number) {
    return produce(this, (draft: this) => {
      draft._filters.splice(index, 1, newFilter);
    });
  }

  /**
   * @description this is for simple filter group where for a column id there is one filter
   */
  replaceOrAddFilterByCol(newFilter: Filter<unknown>, columnId: string) {
    return produce(this, (draft: this) => {
      const index = draft.getFilterIndexByColumnId(columnId);
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

  /**
   * @description this is for simple filter group where for a column id there is one filter
   */
  deleteFilterByCol(columnId: string) {
    return produce(this, (draft: this) => {
      const index = draft.getFilterIndexByColumnId(columnId);
      if (index !== -1) {
        draft._filters.splice(index, 1);
      }
    });
  }
}
