import { AndOr, FilterGroup } from '@/lib/util-filter-group';
import { Filter } from '@/lib/util-filters';
import { immerable, produce } from 'immer';

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
    return this._filterGroups.find((fg) => fg.variant === 'simple');
  }
  get advancedFilterGroupCount() {
    return this._filterGroups.filter((fg) => fg.variant === 'advanced').length;
  }

  static removeColumnFilterFromSimpleFilterGroup(filterGroupCollection: FilterGroupCollection | undefined, columnId: string) {
    if (!filterGroupCollection) return filterGroupCollection;
    if (!filterGroupCollection.simpleFilterGroup) return filterGroupCollection;
    const filterIndex = filterGroupCollection.simpleFilterGroup.getFilterIndexByColumnId(columnId);
    if (filterIndex === -1) return filterGroupCollection;
    const newSimpleFilterGroup = filterGroupCollection.simpleFilterGroup.deleteFilterByCol(columnId);
    const newFilterGroupCollection =
      newSimpleFilterGroup.filters.length === 0
        ? filterGroupCollection.deleteSimpleFilterGroup()
        : filterGroupCollection.replaceSimpleFilterGroup(newSimpleFilterGroup);
    return newFilterGroupCollection.filterGroups.length === 0 ? undefined : newFilterGroupCollection;
  }

  static addOrReplaceColumnFilterFromSimpleFilterGroup(
    filterGroupCollection: FilterGroupCollection | undefined,
    filter: Filter<unknown>,
    columnId: string,
  ) {
    if (!filterGroupCollection) {
      const simpleFilterGroup = new FilterGroup('simple', [filter]);
      const newFilterGroupCollection = new FilterGroupCollection([simpleFilterGroup]);
      return newFilterGroupCollection;
    }
    if (!filterGroupCollection.simpleFilterGroup) {
      const simpleFilterGroup = new FilterGroup('simple', [filter]);
      const newFilterGroupCollection = filterGroupCollection.addNewFilterGroup(simpleFilterGroup);
      return newFilterGroupCollection;
    }
    const filterIndex = filterGroupCollection.simpleFilterGroup.getFilterIndexByColumnId(columnId);
    const newSimpleFilterGroup =
      filterIndex === -1
        ? filterGroupCollection.simpleFilterGroup.addNewFilter(filter)
        : filterGroupCollection.simpleFilterGroup.replaceOrAddFilterByCol(filter, columnId);
    const newFilterGroupCollection = filterGroupCollection.replaceSimpleFilterGroup(newSimpleFilterGroup);
    return newFilterGroupCollection;
  }

  static removeFilterFromFilterGroup(filterGroupCollection: FilterGroupCollection | undefined, filterGroupIndex: number, filterIndex: number) {
    if (!filterGroupCollection) return undefined;
    const filterGroup = filterGroupCollection.filterGroups[filterGroupIndex];
    const newFilterGroup = filterGroup.deleteFilter(filterIndex);
    const newFilterGroupCollection =
      newFilterGroup.filters.length === 0
        ? filterGroupCollection.deleteFilterGroup(filterGroupIndex)
        : filterGroupCollection.replaceFilterGroup(newFilterGroup, filterGroupIndex);
    return newFilterGroupCollection.filterGroups.length === 0 ? undefined : newFilterGroupCollection;
  }

  static addFilterInFilterGroup(filterGroupCollection: FilterGroupCollection | undefined, newFilter: Filter<unknown>, filterGroupIndex: number) {
    if (!filterGroupCollection) return undefined;
    const oldFilterGroup = filterGroupCollection.filterGroups[filterGroupIndex];
    const newFilterGroup = oldFilterGroup.addNewFilter(newFilter);
    const newFilterGroupCollection = filterGroupCollection.replaceFilterGroup(newFilterGroup, filterGroupIndex);
    return newFilterGroupCollection;
  }

  static replaceFilterInFilterGroup(
    filterGroupCollection: FilterGroupCollection | undefined,
    newFilter: Filter<unknown>,
    filterGroupIndex: number,
    filterIndex: number,
  ) {
    if (!filterGroupCollection) return undefined;
    const oldFilterGroup = filterGroupCollection.filterGroups[filterGroupIndex];
    const newFilterGroup = oldFilterGroup.replaceFilter(newFilter, filterIndex);
    const newFilterGroupCollection = filterGroupCollection.replaceFilterGroup(newFilterGroup, filterGroupIndex);
    return newFilterGroupCollection;
  }

  static setFilterListAndOr(filterGroupCollection: FilterGroupCollection | undefined, filterGroupIndex: number, value: AndOr) {
    if (!filterGroupCollection) return undefined;
    const filterGroup = filterGroupCollection.filterGroups[filterGroupIndex];
    const newFilterGroup = filterGroup.setFilterListAndOr(value);
    const newFilterGroupCollection = filterGroupCollection.replaceFilterGroup(newFilterGroup, filterGroupIndex);
    return newFilterGroupCollection;
  }

  setFilterGroupListAndOr(value: AndOr) {
    return produce(this, (draft: this) => {
      draft._filterGroupListAndOr = value;
    });
  }

  addNewFilterGroup(filterGroup: FilterGroup) {
    return produce(this, (draft: this) => {
      if (filterGroup.variant === 'simple') {
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
      draft._filterGroups.splice(0, 1, newSimpleFilterGroup);
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
        draft._filterGroups.splice(0, 1);
      }
    });
  }
}
