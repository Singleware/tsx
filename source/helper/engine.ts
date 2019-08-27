/*!
 * Copyright (C) 2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Memory from './memory';
import * as Assert from './assert';
import * as Components from '../core/components';
import * as Elements from '../core/elements';

import { Engine } from '../engine';

// Aliases.
import Attributes = JSX.ElementClassAttributes;
import Parameters = JSX.ElementParameters;
import TextParameters = JSX.ElementTextParameters;
import PlainParameters = JSX.ElementPlainParameters;
import ClassParameters = JSX.ElementClassParameters;

/**
 * Properties map.
 */
type PropertiesMap = WeakMap<Elements.Element<any>, Elements.Properties<any>>;

/**
 * Get an array containing all updated child components and elements.
 * @param parent Parent element.
 * @param allProperties All properties map.
 * @param newChildren New children.
 * @param oldChildren Old children.
 * @returns Returns the array containing all updated child components and elements..
 */
export function update<A extends Attributes>(
  parent: Elements.Element<Parameters<A>>,
  allProperties: PropertiesMap,
  newChildren: Elements.Element<any>[],
  oldChildren: Elements.Element<any>[]
): Elements.Element<any>[] {
  const length = Math.max(newChildren.length, oldChildren.length);
  const children = [];
  for (let index = 0; index < length; ++index) {
    const newChild = newChildren[index];
    const oldChild = oldChildren[index];
    if (newChild === void 0) {
      Engine.removeElement(oldChild);
    } else if (oldChild === void 0) {
      Engine.appendElement(parent, newChild);
      children.push(newChild);
    } else if (newChild === oldChild) {
      children.push(oldChild);
    } else {
      const newProperties = Memory.getObject(allProperties, newChild);
      const oldProperties = Memory.getObject(allProperties, oldChild);
      if (newProperties.type !== oldProperties.type) {
        newProperties.parent = parent;
        Engine.replaceElement(oldChild, newChild);
        children.push(newChild);
      } else if (newProperties.type === 'text') {
        const newParameters = <TextParameters>newProperties.parameters;
        const oldParameters = <TextParameters>oldProperties.parameters;
        if (newParameters.content != oldParameters.content) {
          newProperties.parent = parent;
          Engine.replaceElement(oldChild, newChild);
          children.push(newChild);
        } else {
          children.push(oldChild);
        }
      } else if (newProperties.type === 'plain') {
        const newParameters = <PlainParameters<any>>newProperties.parameters;
        const oldParameters = <PlainParameters<any>>oldProperties.parameters;
        newProperties.parent = parent;
        if (newParameters.name !== oldParameters.name) {
          Engine.replaceElement(oldChild, newChild);
        } else {
          Engine.updateElement(oldChild, newChild);
          Engine.updateAttributes(newChild, newParameters.attributes, oldParameters.attributes);
          newProperties.children = update(newChild, allProperties, newProperties.children, oldProperties.children);
        }
        children.push(newChild);
      } else if (newProperties.type === 'class') {
        const newParameters = <ClassParameters>newProperties.parameters;
        const oldParameters = <ClassParameters>oldProperties.parameters;
        const newComponent = <Components.Component<any, any>>newProperties.component;
        const oldComponent = <Components.Component<any, any>>oldProperties.component;
        if (newParameters.type !== oldParameters.type || newComponent.canRecycle(oldComponent.state)) {
          newProperties.parent = parent;
          newProperties.children = update(parent, allProperties, newProperties.children, oldProperties.children);
          children.push(newChild);
        } else {
          children.push(oldChild);
        }
      }
    }
  }
  return children;
}
