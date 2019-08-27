/*!
 * Copyright (C) 2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Elements from '../core/elements';

// Aliases.
import Attributes = JSX.ElementClassAttributes;
import Parameters = JSX.ElementParameters;
import TextParameters = JSX.ElementTextParameters;
import PlainParameters = JSX.ElementPlainParameters;

/**
 * Empty elements.
 */
const emptyElements = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr'
];

/**
 * Escape any special HTML character in the given input string.
 * @param input Input string.
 * @returns Returns the escaped string.
 */
function escape(input: string): string {
  return input.replace(/\"|\'|\<|\>|\&/gi, match => {
    switch (match) {
      case '"':
        return '&quot;';
      case "'":
        return '&39;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
    }
    return match;
  });
}

/**
 * Get the attributes string from the given JSX attributes.
 * @param jsxAttributes JSX attributes.
 * @returns Returns the attributes string.
 */
function getAttributes<A extends Attributes>(jsxAttributes: Readonly<A>): string {
  const buffer = [];
  let index = 0;
  for (const name in jsxAttributes) {
    const value = jsxAttributes[name];
    if (value !== void 0 && !name.startsWith('on')) {
      if (typeof value === 'boolean') {
        if (value === true) {
          buffer[index++] = `${name}`;
        }
      } else {
        buffer[index++] = `${name}="${escape(`${value}`)}"`;
      }
    }
  }
  return buffer.join(' ');
}

/**
 * Get the children string from the given JSX children.
 * @param jsxChildren JSX children.
 * @returns Returns the children string.
 */
function getChildren<A extends Attributes>(jsxChildren: Readonly<Elements.Element<Parameters<A>>[]>): string {
  const buffer = [];
  let index = 0;
  for (const jsxChild of jsxChildren) {
    buffer[index++] = createElement(jsxChild);
  }
  return buffer.join('');
}

/**
 * Create a new HTML text based on the given JSX element.
 * @param jsxElement JSX element.
 * @returns Returns the generated HTML text.
 */
function createFromTextElement<A extends Attributes>(jsxElement: Elements.Element<Parameters<A>>): string {
  const jaxParameters = <Readonly<TextParameters>>jsxElement.parameters;
  return jaxParameters.content !== void 0 ? escape(`${jaxParameters.content}`) : '';
}

/**
 * Create a new HTML element based on the given JSX element.
 * @param jsxElement JSX element.
 * @returns Returns the generated HTML element.
 */
function createFromPlainElement<A extends Attributes>(jsxElement: Elements.Element<Parameters<A>>): string {
  const jaxParameters = <Readonly<PlainParameters<A>>>jsxElement.parameters;
  const tagAttributes = getAttributes(jaxParameters.attributes);
  const tagName = jaxParameters.name.toLowerCase();
  if (emptyElements.includes(tagName)) {
    if (tagAttributes.length) {
      return `<${tagName} ${tagAttributes}>`;
    } else {
      return `<${tagName}>`;
    }
  } else {
    if (tagAttributes.length) {
      return `<${tagName} ${tagAttributes}>${getChildren(jsxElement.children)}</${tagName}>`;
    } else {
      return `<${tagName}>${getChildren(jsxElement.children)}</${tagName}>`;
    }
  }
}

/**
 * Create a new HTML text or element based on the given JSX element.
 * @param jsxElement JSX element.
 * @returns Returns the generated HTML text or element.
 */
function createFromClassElement<A extends Attributes>(jsxElement: Elements.Element<Parameters<A>>): string {
  return getChildren(jsxElement.children);
}

/**
 * Create a new HTML text or element based on the given JSX element.
 * @param element JSX element.
 * @returns Returns the generated HTML text or element.
 * @throws Throws an error when the element type isn't supported.
 */
export function createElement<A extends Attributes>(element: Elements.Element<Parameters<A>>): string {
  switch (element.type) {
    case 'text':
      return createFromTextElement(element);
    case 'plain':
      return createFromPlainElement(element);
    case 'class':
      return createFromClassElement(element);
    default:
      throw new Error(`Element type '${element.type}' isn't supported.`);
  }
}

/**
 * Append the new JSX element into the given parent JSX element.
 * @param jsxParent Parent JSX element.
 * @param jsxElement JSX element.
 */
export function appendElement<PA extends Attributes, A extends Attributes>(
  jsxParent: Elements.Element<Parameters<PA>>,
  jsxElement: Elements.Element<Parameters<A>>
): void {}

/**
 * Replace the specified JSX element by the new one.
 * @param jsxElement JSX element.
 * @param jsxNewElement New JSX element.
 * @throws Throws an error when the element has no parent.
 */
export function replaceElement<A extends Attributes, NA extends Attributes>(
  jsxElement: Elements.Element<Parameters<A>>,
  jsxNewElement: Elements.Element<Parameters<NA>>
): void {}

/**
 * Remove the specified JSX element.
 * @param jsxElement JSX element.
 */
export function removeElement<A extends Attributes>(jsxElement: Elements.Element<Parameters<A>>): void {}

/**
 * Updates the specified JSX element by the new one.
 * @param jsxElement JSX element.
 * @param jsxNewElement New JSX element.
 */
export function updateElement<A extends Attributes>(
  jsxElement: Elements.Element<Parameters<A>>,
  jsxNewElement: Elements.Element<Parameters<A>>
): void {}

/**
 * Update all attributes in the specified JSX element.
 * @param jsxElement JSX element.
 * @param newAttributes New attributes.
 * @param oldAttributes Old attributes.
 */
export function updateAttributes<A extends Attributes>(
  jsxElement: Elements.Element<Parameters<A>>,
  newAttributes: Readonly<A>,
  oldAttributes: Readonly<A>
): void {}
