import moment, { Moment } from 'moment';

function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

export function isTupleOfTwoMomentItem(value: unknown): value is [Moment, Moment] {
  return isArray(value) && value.length === 2 && value.every((v) => moment.isMoment(v));
}
