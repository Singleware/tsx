/*!
 * Copyright (C) 2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Memory from '../helper/memory';
import * as Elements from './elements';

// Aliases.
import Base = JSX.ElementEvent;
import Details = JSX.ElementEventDetails;

/**
 * All properties.
 */
const allProperties = new WeakMap<Event<any>, Properties<any>>();

/**
 * Input event details.
 */
export interface InputDetails<V> extends Details {
  /**
   * Input value.
   */
  value: V;
  /**
   * Determines whether the input is checked or not.
   */
  checked: boolean;
  /**
   * Determines whether the input is valid or not.
   */
  valid: boolean;
}

/**
 * Mouse event details.
 */
export interface MouseDetails extends Details {
  /**
   * Screen X coordinate of the mouse pointer.
   */
  screenX: number;
  /**
   * Screen Y coordinate of the mouse pointer.
   */
  screenY: number;
  /**
   * Client X coordinate of the mouse pointer.
   */
  clientX: number;
  /**
   * Client Y coordinate of the mouse pointer.
   */
  clientY: number;
  /**
   * Offset X coordinate of the mouse pointer.
   */
  offsetX: number;
  /**
   * Offset Y coordinate of the mouse pointer.
   */
  offsetY: number;
  /**
   * Page X coordinate of the mouse pointer.
   */
  pageX: number;
  /**
   * Page Y coordinate of the mouse pointer.
   */
  pageY: number;
}

/**
 * Keyboard event details.
 */
export interface KeyboardDetails extends Details {
  /**
   * Character value representing the event key.
   */
  key: string;
  /**
   * Code value representing the event code.
   */
  code: string;
  /**
   * Determines whether the alt key is active.
   */
  altKey: boolean;
  /**
   * Determines whether the ctrl key is active.
   */
  ctrlKey: boolean;
  /**
   * Determines whether the shift key is active.
   */
  shiftKey: boolean;
  /**
   * Determines whether the meta key is active.
   */
  metaKey: boolean;
  /**
   * Determines whether the key still pressed.
   */
  repeat: boolean;
}

/**
 * Event properties.
 */
export type Properties<D extends Details> = {
  /**
   * Event type.
   */
  type: string;
  /**
   * Event source.
   */
  source: Elements.Element<any> | null;
  /**
   * Determines whether or not the event was stopped.
   */
  stopped: boolean;
  /**
   * Event details.
   */
  details: Readonly<D>;
};

/**
 * Event.
 */
export class Event<D extends Details> implements Base<D> {
  /**
   * Default constructor.
   * @param type Event type.
   * @param source Event source.
   * @param details Event details.
   */
  constructor(type: string, source: Elements.Element<any> | null, details: D) {
    Memory.setObject(allProperties, this, {
      type: type,
      source: source,
      details: Object.freeze(details),
      stopped: false
    });
  }

  /**
   * Get event type.
   */
  public get type(): string {
    return Memory.getObject(allProperties, this).type;
  }

  /**
   * Get event source.
   */
  public get source(): Elements.Element<any> | null {
    return Memory.getObject(allProperties, this).source;
  }

  /**
   * Get event details.
   */
  public get details(): Readonly<D> {
    return Memory.getObject(allProperties, this).details;
  }

  /**
   * Get the stopped state.
   */
  public get stopped(): boolean {
    return Memory.getObject(allProperties, this).stopped;
  }

  /**
   * Stop event propagation.
   */
  public stop(): void {
    Memory.getObject(allProperties, this).stopped = true;
  }
}
