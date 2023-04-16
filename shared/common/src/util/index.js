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

// This file should contain raw Javascript utilities that may be needed across multiple pages to solve
// simple problems to avoid code duplication.
// DEV NOTE: If this starts becoming too large (> 500 lines) we should split it up into a better grouping of functions.

export const isFunction = functionToCheck => functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';

export const isString = stringToCheck => typeof stringToCheck === 'string' || stringToCheck instanceof String;

// This takes a string object property path and an object and gets the value
// ex: x = {a: {b: 'c'}, d: 'e'}, resolveObjectProperty('a.b', x) === 'c'.
export const resolveObjectProperty = (path, obj, separator = '.') => {
    const properties = Array.isArray(path) ? path : path.split(separator);
    return properties.reduce((prev, curr) => prev && prev[curr], obj);
};

export const setObjectProperty = (path, obj, newVal, separator = '.') => {
    const properties = Array.isArray(path) ? path : path.split(separator);
    if (properties.length < 1) return;
    let temp = obj;
    for (let i = 0; i < properties.length - 1; i += 1) {
        temp = temp[properties[i]];
    }
    temp[properties[properties.length - 1]] = newVal;
};

export const isEmpty = obj => (Object.getOwnPropertyNames(obj).length === 0);

export const generateRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

export const genRandomNumber = (len) => {
    let s = '';
    for (let i = 0; i < len; i += 1) {
        s += generateRandomNumber(1, 9);
    }
    return s;
};
