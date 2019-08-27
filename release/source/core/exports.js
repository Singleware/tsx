"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*!
 * Copyright (C) 2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
const Memory = require("../helper/memory");
/**
 * All exports.
 */
const allExports = new WeakMap();
/**
 * Decorates the member to be exported.
 * @param name Exported name.
 * @returns Returns the method export decorator.
 */
function Export(name) {
    return (prototype, property, descriptor) => {
        const member = {};
        if (descriptor.value instanceof Function) {
            member.method = descriptor.value;
        }
        else if (descriptor.get instanceof Function || descriptor.set instanceof Function) {
            member.getter = descriptor.get;
            member.setter = descriptor.set;
        }
        else {
            throw new TypeError(`Unsupported member type.`);
        }
        if (Memory.hasObject(allExports, prototype)) {
            Memory.getObject(allExports, prototype)[name || property] = member;
        }
        else {
            Memory.setObject(allExports, prototype, { [name || property]: member });
        }
    };
}
exports.Export = Export;
/**
 * Get all exported members from the specified component class prototype.
 * @param prototype Class prototype.
 * @returns Returns all exported members.
 */
function getAllMembers(instance) {
    const members = {};
    const prototype = Object.getPrototypeOf(instance);
    if (Memory.hasObject(allExports, prototype)) {
        const exports = Memory.getObject(allExports, prototype);
        for (const name in exports) {
            const { method, getter, setter } = exports[name];
            if (getter && setter) {
                Object.defineProperty(members, name, { get: getter.bind(instance), set: setter.bind(instance) });
            }
            else if (getter) {
                Object.defineProperty(members, name, { get: getter.bind(instance) });
            }
            else if (setter) {
                Object.defineProperty(members, name, { set: setter.bind(instance) });
            }
            else if (method) {
                Object.defineProperty(members, name, { value: method.bind(instance) });
            }
        }
    }
    return Object.freeze(members);
}
exports.getAllMembers = getAllMembers;
//# sourceMappingURL=exports.js.map