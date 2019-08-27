/*!
 * Copyright (C) 2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Components from './core/components';
import * as Elements from './core/elements';
import * as Assert from './helper/assert';

// Aliases
import Child = JSX.ElementClassChild;

/**
 * Condition type.
 */
export type Condition = boolean | (() => boolean);

/**
 * Fragment attributes.
 */
export type Attributes = {
  /**
   * Fragment condition.
   */
  condition?: Condition;
  /**
   * Fragment children.
   */
  children: Child | Child[] | Readonly<Child[]>;
};

/**
 * Fragment state.
 */
export type State = {
  /**
   * Fragment condition.
   */
  condition?: Condition;
};

/**
 * Fragment component.
 */
export class Fragment extends Components.Component<Attributes, State> {
  /**
   * Get default state.
   */
  public get defaultState(): State {
    return {
      condition: this.attributes.condition
    };
  }

  /**
   * Determines whether the fragment will be recycled.
   * @returns Always returns true.
   */
  public canRecycle(): boolean {
    return true;
  }

  /**
   * Prepare all fragments to be rendered.
   * @returns Returns the fragment list.
   */
  public render(): JSX.Element[] {
    if (isValidCondition(this.state.condition)) {
      return getChildElements(this.children);
    }
    return [];
  }
}

/**
 * Determines whether  or not the specified condition is valid.
 * @param condition Condition.
 * @returns Returns true when the condition is valid, false otherwise.
 */
function isValidCondition(condition: undefined | Condition): boolean {
  if (condition !== void 0) {
    if (condition instanceof Function) {
      return condition();
    }
    return condition;
  }
  return true;
}

/**
 * Get all child elements from the specified fragment children.
 * @param children Fragment children.
 * @returns Returns the child element list.
 */
function getChildElements(children: Readonly<Child[]>): JSX.Element[] {
  const list = [];
  for (const child of children) {
    if (child instanceof Array) {
      list.push(...getChildElements(child));
    } else if (Assert.isElementInstance(child)) {
      list.push(child);
    } else {
      list.push(Elements.createTextElement(child));
    }
  }
  return list;
}
