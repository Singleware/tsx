/*!
 * Copyright (C) 2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Memory from '../helper/memory';

// Aliases.
export import Map = JSX.ElementExportsMap;

/**
 * Export member.
 */
type ExportMember = {
  method?: (...parameters: unknown[]) => unknown;
  getter?: (...parameters: unknown[]) => unknown;
  setter?: (...parameters: unknown[]) => unknown;
};

/**
 * Export members map.
 */
type ExportMembersMap = {
  [name: string]: ExportMember;
};

/**
 * Export decorator.
 */
type ExportDecorator = (prototype: object, property: string, descriptor: PropertyDescriptor) => void;

/**
 * All exports.
 */
const allExports = new WeakMap<object, ExportMembersMap>();

/**
 * Decorates the member to be exported.
 * @param name Exported name.
 * @returns Returns the method export decorator.
 */
export function Export(name?: string): ExportDecorator {
  return (prototype: object, property: string, descriptor: PropertyDescriptor): void => {
    const member = <ExportMember>{};
    if (descriptor.value instanceof Function) {
      member.method = descriptor.value;
    } else if (descriptor.get instanceof Function || descriptor.set instanceof Function) {
      member.getter = descriptor.get;
      member.setter = descriptor.set;
    } else {
      throw new TypeError(`Unsupported member type.`);
    }
    if (Memory.hasObject(allExports, prototype)) {
      Memory.getObject(allExports, prototype)[name || property] = member;
    } else {
      Memory.setObject(allExports, prototype, { [name || property]: member });
    }
  };
}

/**
 * Get all exported members from the specified component class prototype.
 * @param prototype Class prototype.
 * @returns Returns all exported members.
 */
export function getAllMembers(instance: object): Map {
  const members = <Map>{};
  const prototype = Object.getPrototypeOf(instance);
  if (Memory.hasObject(allExports, prototype)) {
    const exports = Memory.getObject(allExports, prototype);
    for (const name in exports) {
      const { method, getter, setter } = exports[name];
      if (getter && setter) {
        Object.defineProperty(members, name, { get: getter.bind(instance), set: setter.bind(instance) });
      } else if (getter) {
        Object.defineProperty(members, name, { get: getter.bind(instance) });
      } else if (setter) {
        Object.defineProperty(members, name, { set: setter.bind(instance) });
      } else if (method) {
        Object.defineProperty(members, name, { value: method.bind(instance) });
      }
    }
  }
  return Object.freeze(members);
}
