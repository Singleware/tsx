/*!
 * Copyright (C) 2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Assert from '../helper/assert';
import * as Engine from '../helper/engine';
import * as Memory from '../helper/memory';
import * as Components from './components';
import * as Exports from './exports';

// Aliases.
import Base = JSX.Element;
import State = JSX.ElementClassState;
import PlainNames = JSX.ElementPlainNames;
import PlainAttributes = JSX.ElementPlainAttributes;
import TextParameters = JSX.ElementTextParameters;
import Parameters = JSX.ElementParameters;
import Constructor = JSX.ElementClassConstructor;
import Attributes = JSX.ElementClassAttributes;
import Child = JSX.ElementClassChild;
import Types = JSX.ElementTypes;

/**
 * Element input type.
 */
type InputType<I, A> = I extends PlainNames ? I : Constructor<A>;

/**
 * Element input attributes.
 */
type InputAttributes<I, A> = I extends PlainNames ? PlainAttributes[I] : A;

/**
 * All properties.
 */
const allProperties = new WeakMap<Element<any>, Properties<any>>();

/**
 * Element properties.
 */
export type Properties<P extends Parameters<Attributes>> = {
  /**
   * Element type.
   */
  type: Types;
  /**
   * Element parent.
   */
  parent: Base | null;
  /**
   * Element children.
   */
  children: Base[];
  /**
   * Element state.
   */
  state: Readonly<State>;
  /**
   * Element exports.
   */
  exports: Exports.Map;
  /**
   * Element parameters.
   */
  parameters: Readonly<P>;
  /**
   * Element component.
   */
  component: Components.Component<Attributes, State> | null;
  /**
   * Determines whether or not the component needs to be recycled.
   */
  recycle: boolean;
};

/**
 * Element.
 */
export class Element<P extends Parameters<Attributes>> implements Base {
  /**
   * Default constructor.
   * @param type Element type.
   * @param parameters Element parameters.
   */
  constructor(type: Types, parameters: Parameters<P>) {
    Memory.setObject(allProperties, this, {
      type: type,
      parent: null,
      children: [],
      state: {},
      exports: {},
      parameters: Object.freeze(parameters),
      recycle: false,
      component: null
    });
  }

  /**
   * Get element type.
   */
  public get type(): Types {
    return Memory.getObject(allProperties, this).type;
  }

  /**
   * Get element parameters.
   */
  public get parameters(): Readonly<Parameters<Attributes>> {
    return Memory.getObject(allProperties, this).parameters;
  }

  /**
   * Get element children.
   */
  public get children(): Readonly<Base[]> {
    return Object.freeze([...Memory.getObject(allProperties, this).children]);
  }

  /**
   * Get component exports.
   */
  public get exports(): Exports.Map {
    return Memory.getObject(allProperties, this).exports;
  }

  /**
   * Set itself to be recycled.
   * @param state Recycle state.
   */
  public recycle(state: boolean): void {
    const properties = Memory.getObject(allProperties, this);
    if (state) {
      if (properties.recycle !== true) {
        properties.recycle = true;
        if (properties.parent) {
          properties.parent.recycle(true);
        }
      }
    } else {
      if (properties.component) {
        properties.state = properties.component.state;
      }
    }
  }

  /**
   * Render any child which needs to be recycled.
   */
  public render(): void {
    const properties = Memory.getObject(allProperties, this);
    if (properties.recycle) {
      properties.recycle = false;
      if (properties.component && properties.component.canRecycle(properties.state)) {
        properties.state = properties.component.state;
        const results = properties.component.render();
        const oldChildren = properties.children;
        const newChildren = results instanceof Array ? results : [results];
        properties.children = Engine.update(this, allProperties, newChildren, oldChildren);
      } else {
        for (const child of properties.children) {
          child.render();
        }
      }
    }
  }
}

/**
 * Create a new text element.
 * @param content Text content.
 * @returns Returns the generated text element.
 */
export function createTextElement(content: any): Element<TextParameters> {
  return new Element('text', Object.freeze({ content: content }));
}

/**
 * Create a new plain element.
 * @param name Plain name.
 * @param attributes Plain attributes.
 * @param children Plain children.
 * @returns Returns the generated plain element.
 */
export function createPlainElement<N extends PlainNames, A extends PlainAttributes[N]>(
  name: N,
  attributes: A | null,
  children: Child[]
): Element<A> {
  attributes = Object.freeze(attributes || <A>{});
  const element = new Element('plain', { name: name, attributes: <A>attributes });
  const properties = Memory.getObject(allProperties, element);
  properties.children = getChildElements(element, children);
  return element;
}

/**
 * Create a new class element.
 * @param constructor Class constructor.
 * @param attributes Class attributes.
 * @param children Class children.
 * @returns Returns the generated class element.
 */
export function createClassElement<A extends Attributes>(
  constructor: Constructor<A>,
  attributes: A | null,
  children: Child[]
): Element<Parameters<A>> {
  attributes = Object.assign(attributes || <A>{}, { children: Object.freeze(children) });
  const element = new Element('class', { name: constructor.name, type: constructor });
  const component = new constructor(attributes);
  const properties = Memory.getObject(allProperties, element);
  const results = component.render();
  properties.state = component.defaultState;
  properties.component = component;
  properties.children = getChildElements(element, results instanceof Array ? results : [results]);
  properties.exports = Exports.getAllMembers(component);
  Components.assignElement(element, component);
  return element;
}

/**
 * Create a new element.
 * @param type Element type.
 * @param attributes Element attributes.
 * @param children Element children.
 * @returns Returns the generated element.
 * @throws Throws an error when the element type isn't supported.
 */
export function createElement<I extends PlainNames | Constructor<A>, A extends Attributes>(
  type: InputType<I, A>,
  attributes: InputAttributes<I, A> | null,
  ...children: Child[]
): Element<Parameters<A>> {
  if (Assert.isPlainType(type)) {
    return createPlainElement(type, attributes, children);
  } else if (Assert.isClassType(type)) {
    return createClassElement(type, attributes, children);
  } else {
    throw new TypeError(`Element type isn't supported.`);
  }
}

/**
 * Get all child elements from the specified children.
 * @param element Parent element.
 * @param children Element children.
 * @returns Returns the child element list.
 */
function getChildElements<P extends Parameters<Attributes>>(element: Element<P>, children: Child[]): Base[] {
  const list = [];
  for (let child of children) {
    if (child instanceof Array) {
      list.push(...getChildElements(element, child));
    } else {
      if (!Assert.isElementInstance(child)) {
        child = createTextElement(child);
      }
      Memory.getObject(allProperties, child).parent = element;
      list.push(child);
    }
  }
  return list;
}
