/** @private */
const _hackery = typeof 'any value';
type CommonTypes = typeof _hackery;

/**
 * Throw a TypeError is the items aren't the expected type.
 *
 * @private
 *
 * @example
 * let name = 'benchmark';
 * expectType({name}, 'string');
 *
 * @param items An object where the key is the same as the value
 * @param expected Expected type of each item
 */
export function expectType(items: Record<string, unknown>, expected: CommonTypes) {
	for (const [key, value] of Object.entries(items)) {
		if (typeof value !== expected) {
			throw new TypeError(`${key} should be a ${expected}`);
		}
	}
}
