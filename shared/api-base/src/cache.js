/*
 * Copyright (c) 2015-2021, Episode Six and/or its affiliates. All rights reserved.
 * EPISODE SIX PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 *
 * THIS IS CONFIDENTIAL AND PROPRIETARY TO EPISODE SIX, and any
 * copying, reproduction, redistribution, dissemination, modification, or
 * other use, in whole or in part, is strictly prohibited without the prior
 * written consent of (or as may be specifically permitted in a fully signed
 * agreement with) Episode Six.   Violations may result in severe civil and/or
 * criminal penalties, and Episode Six will enforce its rights to the maximum
 * extent permitted by law.
 */

import { util } from '@e6tech/common';

const {
    isFunction, isString, resolveObjectProperty, setObjectProperty,
} = util;


// Creates an empty cache instance with given configuration and target object

const invalidateCacheFuncName = 'invalidateCache';
const emptyCache = (target, conf) => ({
    conf,
    target,
    cache: {},
    currentPath: '',
    invalidateCache() {
        this.cache = {};
    },
});

// Formats a path using dot notation
const formatPath = (currentPath, prop) => (currentPath === '' ? prop : `${currentPath}.${prop}`);

// Moves the given cache configuration to this prop subpath
const moveToPath = ({ currentPath, ...other }, prop) => ({
    ...other,
    currentPath: formatPath(currentPath, prop),
});

// Constructs the 'key' used to commit this element into the cache
const getArgKey = (currentPath, argList) => [currentPath, ...argList].filter(isString).join('|');

// Updates the cache with the given value for the given argument.
const updateInternalCache = ({ currentPath, cache }, argList, promise) => {
    const argKey = getArgKey(currentPath, argList);
    // eslint-disable-next-line no-param-reassign
    cache[argKey] = {
        computedAt: new Date().getTime(),
        value: promise,
    };
    // This next line is useful debug logging:
    // console.log('Updating cache: ', { argKey });
};

// determines if an object is allowed to be cached.
// eslint-disable-next-line max-len
const cacheAllowed = ({ currentPath, conf: { allowCache } }) => allowCache.filter(regexp => currentPath.match(regexp)).length > 0;

// Retrieves the cache with the given value for the given argList.
const retrieveFromCache = ({ cache, currentPath, conf: { expiry } }, argList) => {
    const argKey = getArgKey(currentPath, argList);
    // This next line is useful debug logging:
    // console.log('Retrieving from cache: ', { argKey });
    const cacheEntry = cache[argKey];

    if (cacheEntry == null) {
        return cacheEntry;
    }

    if (cacheEntry.computedAt < new Date().getTime() - expiry) {
        return undefined;
    }

    return cacheEntry.value;
};


const cacheHandler = {};
cacheHandler.get = (obj, prop) => {
    if (prop === 'cacheInternalState') return obj;
    // Returning this as a new function to preserve "this" being the object.
    if (prop === invalidateCacheFuncName) return () => obj.invalidateCache();

    const value = resolveObjectProperty(formatPath(obj.currentPath, prop), obj.target);

    if (value == null) return value;

    if (isFunction(value)) {
        return new Proxy(value, cacheHandler);
    }

    return new Proxy(moveToPath(obj, prop), cacheHandler);
};

cacheHandler.set = (obj, prop, newValue) => {
    setObjectProperty(formatPath(obj.currentPath, prop), obj.target, newValue);
};

cacheHandler.apply = (func, owner, argList) => {
    const currentObj = moveToPath(owner.cacheInternalState, func.name);

    if (!cacheAllowed(currentObj)) {
        // This next line is useful debug logging:
        // if (currentObj.currentPath) console.log('Cache not allowed', { argKey: getArgKey(currentObj.currentPath, argList) });
        return func(...argList);
    }

    const cached = retrieveFromCache(currentObj, argList);
    if (cached != null) {
        return cached;
    }


    const maybePromise = func(...argList);

    if (maybePromise instanceof Promise) {
        updateInternalCache(currentObj, argList, maybePromise);
    }

    return maybePromise;
};


// eslint-disable-next-line import/prefer-default-export
export const createCache = (api, {
    expiry,
    allowCache,
}) => new Proxy(emptyCache(api, {
    expiry,
    allowCache,
}), cacheHandler);
