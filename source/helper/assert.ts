/*!
 * Copyright (C) 2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Components from '../core/components';
import * as Elements from '../core/elements';

// Aliases.
import PlainNames = JSX.ElementPlainNames;
import Constructor = JSX.ElementClassConstructor;
import Attributes = JSX.ElementClassAttributes;
import Parameters = JSX.ElementParameters;
import Callback = JSX.ElementEventCallback;
import Details = JSX.ElementEventDetails;

/**
 * Determines whether or not both values are equals.
 * @param newer New value.
 * @param older Old value.
 * @returns Returns true when both values are equals, false otherwise.
 */
export function isEqual<V>(newer: V, older: V): newer is typeof older {
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

/**
 * Determines whether or not the specified input will generate plain elements.
 * @param input Input.
 * @returns Returns true when the specified input generates plain elements, false otherwise.
 */
export function isPlainType(input: unknown): input is PlainNames {
  return typeof input === 'string';
}

/**
 * Determines whether or not the specified input will generate class elements.
 * @param input Input.
 * @returns Returns true when the specified input generates class elements, false otherwise.
 */
export function isClassType<A extends Attributes>(input: unknown): input is Constructor<A> {
  return input instanceof Function && input.prototype instanceof Components.Component;
}

/**
 * Determines whether or not the specified input is an element instance.
 * @param input Input.
 * @returns Returns true when the specified input is an element instance, false otherwise.
 */
export function isElementInstance<A extends Attributes>(input: unknown): input is Elements.Element<Parameters<A>> {
  return input instanceof Elements.Element;
}

/**
 * Determines whether or not the specified input is an event callback.
 * @param input Value.
 * @returns Returns true when the specified input is an event callback, false otherwise.
 */
export function isEventCallback<D extends Details>(input: unknown): input is Callback<D> {
  return input instanceof Function;
}
