"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*!
 * Copyright (C) 2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
const Components = require("../core/components");
const Elements = require("../core/elements");
/**
 * Determines whether or not both values are equals.
 * @param newer New value.
 * @param older Old value.
 * @returns Returns true when both values are equals, false otherwise.
 */
function isEqual(newer, older) {
    if (newer !== older) {
        if (!(newer instanceof Object) || !(older instanceof Object)) {
            return false;
        }
        if (Object.keys(newer).length !== Object.keys(older).length) {
            return false;
        }
        for (const property in older) {
            if (!(property in newer)) {
                return false;
            }
            if (!isEqual(newer[property], older[property])) {
                return false;
            }
        }
    }
    return true;
}
exports.isEqual = isEqual;
/**
 * Determines whether or not the specified input will generate plain elements.
 * @param input Input.
 * @returns Returns true when the specified input generates plain elements, false otherwise.
 */
function isPlainType(input) {
    return typeof input === 'string';
}
exports.isPlainType = isPlainType;
/**
 * Determines whether or not the specified input will generate class elements.
 * @param input Input.
 * @returns Returns true when the specified input generates class elements, false otherwise.
 */
function isClassType(input) {
    return input instanceof Function && input.prototype instanceof Components.Component;
}
exports.isClassType = isClassType;
/**
 * Determines whether or not the specified input is an element instance.
 * @param input Input.
 * @returns Returns true when the specified input is an element instance, false otherwise.
 */
function isElementInstance(input) {
    return input instanceof Elements.Element;
}
exports.isElementInstance = isElementInstance;
/**
 * Determines whether or not the specified input is an event callback.
 * @param input Value.
 * @returns Returns true when the specified input is an event callback, false otherwise.
 */
function isEventCallback(input) {
    return input instanceof Function;
}
exports.isEventCallback = isEventCallback;
//# sourceMappingURL=assert.js.map