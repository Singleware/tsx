/*!
 * Copyright (C) 2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Assert from '../helper/assert';
import * as Memory from '../helper/memory';
import * as Elements from './elements';
import * as Events from './events';

// Aliases.
import Base = JSX.ElementClass;
import State = JSX.ElementClassState;
import Child = JSX.ElementClassChild;
import Attributes = JSX.ElementClassAttributes;
import Parameters = JSX.ElementParameters;
import Callback = JSX.ElementEventCallback;
import Details = JSX.ElementEventDetails;

/**
 * Map of event set.
 */
type EventSetMap = {
  [type: string]: Set<Callback<any>>;
};

/**
 * All properties.
 */
const allProperties = new WeakMap<Component<any, any>, Properties<any, any>>();

/**
 * All components.
 */
const allComponents = new WeakMap<Elements.Element<any>, Component<any, any>>();

/**
 * All elements.
 */
const allElements = new WeakMap<Component<any, any>, Elements.Element<any>>();

/**
 * Component properties.
 */
export type Properties<A extends Attributes, S extends State> = {
  /**
   * Component state.
   */
  state: Readonly<S> | null;
  /**
   * Component events.
   */
  events: EventSetMap;
  /**
   * Component attributes.
   */
  attributes: Readonly<A>;
};

/**
 * Component.
 */
export abstract class Component<A extends Attributes, S extends State> implements Base {
  /**
   * Default constructor.
   * @param attributes Component attributes.
   */
  constructor(attributes: A) {
    Memory.setObject(allProperties, this, {
      state: null,
      events: {},
      attributes: Object.freeze(attributes)
    });
  }

  /**
   * Get component state.
   */
  public get state(): Readonly<S> {
    return Memory.getObject(allProperties, this).state || this.defaultState;
  }

  /**
   * Get component attributes.
   */
  public get attributes(): Readonly<A> {
    return Memory.getObject(allProperties, this).attributes;
  }

  /**
   * Get component children.
   */
  public get children(): Readonly<Child[]> {
    return (<any>this.attributes).children;
  }

  /**
   * Get default component state.
   */
  public abstract get defaultState(): S;

  /**
   * Start receiving the specified event type in the given callback.
   * @param type Event type.
   * @param callback Event callback.
   */
  public attach<D extends Details>(type: string, callback: Callback<D>): void {
    const properties = Memory.getObject(allProperties, this);
    const events = properties.events[type];
    if (!events) {
      properties.events[type] = new Set([callback]);
    } else {
      events.add(callback);
    }
  }

  /**
   * Stop receiving the specified event type in the given callback.
   * @param type Event type.
   * @param callback Event callback.
   */
  public detach<D extends Details>(type: string, callback: Callback<D>): void {
    const properties = Memory.getObject(allProperties, this);
    const events = properties.events[type];
    if (events) {
      events.delete(callback);
      if (events.size === 0) {
        delete properties.events[type];
      }
    }
  }

  /**
   * Notify a new event to all child components.
   * @param type Event type.
   * @param details Event details.
   * @returns Returns true when all children were notified, false otherwise.
   */
  public notify<D extends Details>(type: string, details: D): boolean {
    const element = Memory.getObject(allElements, this);
    const event = new Events.Event(type, element, details);
    return notifyChildComponents(element, event);
  }

  /**
   * Update component state.
   * @param state New component state.
   * @param recycle Determines whether the new state will set the component to recycle. (Default is true)
   */
  public update(state: Partial<S>, recycle?: boolean): void {
    const properties = Memory.getObject(allProperties, this);
    properties.state = Object.freeze({ ...(properties.state || this.defaultState), ...state });
    if (Memory.hasObject(allElements, this)) {
      Memory.getObject(allElements, this).recycle(recycle !== false ? true : false);
    }
  }

  /**
   * Determines whether or not the component will be recycled.
   * @param oldState Old state.
   * @returns Returns true if the component should recycle, false otherwise.
   */
  public canRecycle(oldState: S): boolean {
    return !Assert.isEqual(this.state, oldState);
  }

  /**
   * Render all component elements.
   * @returns Returns the rendering results.
   */
  public abstract render(): JSX.Element | JSX.Element[];
}

/**
 * Assign the specified element in the given component.
 * @param element Element instance.
 * @param component Component instance.
 */
export function assignElement<A extends Attributes, S extends State>(
  element: Elements.Element<Parameters<A>>,
  component: Component<A, S>
): void {
  if (Memory.hasObject(allComponents, element) || Memory.hasObject(allElements, component)) {
    throw new Error(`Component already associated.`);
  } else {
    Memory.setObject(allComponents, element, component, true);
    Memory.setObject(allElements, component, element, true);
  }
}

/**
 * Notify all child components from the specified element about the given event.
 * @param element Element instance.
 * @param event Event instance.
 * @returns Returns true when all child components were notified, false otherwise.
 */
function notifyChildComponents<A extends Attributes, D extends Details>(
  element: Elements.Element<Parameters<A>>,
  event: Events.Event<D>
): boolean {
  for (const child of element.children) {
    if (child.type === 'plain') {
      if (!notifyChildComponents(child, event)) {
        return false;
      }
    } else if (child.type === 'class') {
      const component = Memory.getObject(allComponents, child);
      const events = Memory.getObject(allProperties, component).events[event.type];
      if (events) {
        for (const callback of events) {
          callback(event);
          if (event.stopped) {
            return false;
          }
        }
      }
      if (!notifyChildComponents(child, event)) {
        return false;
      }
    }
  }
  return true;
}
