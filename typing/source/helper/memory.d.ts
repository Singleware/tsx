/*!
 * Copyright (C) 2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
/**
 * Determines whether or not the instance key exists in the given object map.
 * @param map Object map.
 * @param key Instance key.
 * @returns Returns true when the instance key was found, false otherwise.
 */
export declare function hasObject<K extends object, V extends object>(map: WeakMap<K, V>, key: K): boolean;
/**
 * Get an object from the specified object map.
 * @param map Object map.
 * @param key Instance key.
 * @returns Returns the object.
 * @throws Throws an error when the instance key doesn't match any object.
 */
export declare function getObject<K extends object, V extends object>(map: WeakMap<K, V>, key: K): V;
/**
 * Set an object in the specified object map.
 * @param map Object map.
 * @param key Instance key.
 * @param value Instance object.
 * @param replace Determines whether objects can be replaced.
 * @throws Throws an error when the object is already set and the replace parameter is false.
 */
export declare function setObject<K extends object, V extends object>(map: WeakMap<K, V>, key: K, value: V, replace?: boolean): void;
/**
 * Remove from the map the object corresponding to the specified key.
 * @param map Object map.
 * @param key Instance key.
 * @throws Throws an error when the instance key doesn't match any object.
 */
export declare function removeObject<K extends object, V extends object>(map: WeakMap<K, V>, key: K): void;
