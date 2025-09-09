import moment, { Moment } from 'moment';

function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

export function isArrayOfString(value: unknown): value is string[] {
  return isArray(value) && value.every((v) => typeof v === 'string');
}

export function isTupleOfTwoMoment(value: unknown): value is [Moment, Moment] {
  return isArray(value) && value.length === 2 && value.every((v) => moment.isMoment(v));
}

export function isTupleOfTwoNumber(value: unknown): value is [number, number] {
  return isArray(value) && value.length === 2 && value.every((v) => typeof v === 'number');
}
