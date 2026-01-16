import { has } from "lodash";

function normalizeKeys(keys: string | string[]): string[] {
    return Array.isArray(keys) ? keys : [keys];
}

export function assertHas(
    target: any,
    keys: string | string[],
    shouldHave: boolean
) {
    keys = normalizeKeys(keys);
    for (const key of keys) {
        const exists = has(target, key);
        if (shouldHave && !exists) {
            throw new Error(`Response does not contain key ${key}`);
        }
        if (!shouldHave && exists) {
            throw new Error('Response contains key ' + key);
        }
    }
}
