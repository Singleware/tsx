"use strict";
/*!
 * Copyright (C) 2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Determines whether or not the instance key exists in the given object map.
 * @param map Object map.
 * @param key Instance key.
 * @returns Returns true when the instance key was found, false otherwise.
 */
function hasObject(map, key) {
    return map.has(key);
}
exports.hasObject = hasObject;
/**
 * Get an object from the specified object map.
 * @param map Object map.
 * @param key Instance key.
 * @returns Returns the object.
 * @throws Throws an error when the instance key doesn't match any object.
 */
function getObject(map, key) {
    const object = map.get(key);
    if (!object) {
        throw new Error(`Instance key doesn't match any object.`);
    }
    return object;
}
exports.getObject = getObject;
/**
 * Set an object in the specified object map.
 * @param map Object map.
 * @param key Instance key.
 * @param value Instance object.
 * @param replace Determines whether objects can be replaced.
 * @throws Throws an error when the object is already set and the replace parameter is false.
 */
function setObject(map, key, value, replace) {
    if (!replace && map.has(key)) {
        throw new Error(`Instance key already match an object.`);
    }
    map.set(key, value);
}
exports.setObject = setObject;
/**
 * Remove from the map the object corresponding to the specified key.
 * @param map Object map.
 * @param key Instance key.
 * @throws Throws an error when the instance key doesn't match any object.
 */
function removeObject(map, key) {
    if (!map.delete(key)) {
        throw new Error(`Instance key doesn't match any object.`);
    }
}
exports.removeObject = removeObject;
//# sourceMappingURL=memory.js.map