"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*!
 * Copyright (C) 2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
const Assert = require("../helper/assert");
const Memory = require("../helper/memory");
const Events = require("./events");
/**
 * All properties.
 */
const allProperties = new WeakMap();
/**
 * All components.
 */
const allComponents = new WeakMap();
/**
 * All elements.
 */
const allElements = new WeakMap();
/**
 * Component.
 */
class Component {
    /**
     * Default constructor.
     * @param attributes Component attributes.
     */
    constructor(attributes) {
        Memory.setObject(allProperties, this, {
            state: null,
            events: {},
            attributes: Object.freeze(attributes)
        });
    }
    /**
     * Get component state.
     */
    get state() {
        return Memory.getObject(allProperties, this).state || this.defaultState;
    }
    /**
     * Get component attributes.
     */
    get attributes() {
        return Memory.getObject(allProperties, this).attributes;
    }
    /**
     * Get component children.
     */
    get children() {
        return this.attributes.children;
    }
    /**
     * Start receiving the specified event type in the given callback.
     * @param type Event type.
     * @param callback Event callback.
     */
    attach(type, callback) {
        const properties = Memory.getObject(allProperties, this);
        const events = properties.events[type];
        if (!events) {
            properties.events[type] = new Set([callback]);
        }
        else {
            events.add(callback);
        }
    }
    /**
     * Stop receiving the specified event type in the given callback.
     * @param type Event type.
     * @param callback Event callback.
     */
    detach(type, callback) {
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
    notify(type, details) {
        const element = Memory.getObject(allElements, this);
        const event = new Events.Event(type, element, details);
        return notifyChildComponents(element, event);
    }
    /**
     * Update component state.
     * @param state New component state.
     * @param recycle Determines whether the new state will set the component to recycle. (Default is true)
     */
    update(state, recycle) {
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
    canRecycle(oldState) {
        return !Assert.isEqual(this.state, oldState);
    }
}
exports.Component = Component;
/**
 * Assign the specified element in the given component.
 * @param element Element instance.
 * @param component Component instance.
 */
function assignElement(element, component) {
    if (Memory.hasObject(allComponents, element) || Memory.hasObject(allElements, component)) {
        throw new Error(`Component already associated.`);
    }
    else {
        Memory.setObject(allComponents, element, component, true);
        Memory.setObject(allElements, component, element, true);
    }
}
exports.assignElement = assignElement;
/**
 * Notify all child components from the specified element about the given event.
 * @param element Element instance.
 * @param event Event instance.
 * @returns Returns true when all child components were notified, false otherwise.
 */
function notifyChildComponents(element, event) {
    for (const child of element.children) {
        if (child.type === 'plain') {
            if (!notifyChildComponents(child, event)) {
                return false;
            }
        }
        else if (child.type === 'class') {
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
//# sourceMappingURL=components.js.map