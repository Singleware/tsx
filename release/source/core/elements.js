"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*!
 * Copyright (C) 2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
const Assert = require("../helper/assert");
const Engine = require("../helper/engine");
const Memory = require("../helper/memory");
const Components = require("./components");
const Exports = require("./exports");
/**
 * All properties.
 */
const allProperties = new WeakMap();
/**
 * Element.
 */
class Element {
    /**
     * Default constructor.
     * @param type Element type.
     * @param parameters Element parameters.
     */
    constructor(type, parameters) {
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
    get type() {
        return Memory.getObject(allProperties, this).type;
    }
    /**
     * Get element parameters.
     */
    get parameters() {
        return Memory.getObject(allProperties, this).parameters;
    }
    /**
     * Get element children.
     */
    get children() {
        return Object.freeze([...Memory.getObject(allProperties, this).children]);
    }
    /**
     * Get component exports.
     */
    get exports() {
        return Memory.getObject(allProperties, this).exports;
    }
    /**
     * Set itself to be recycled.
     * @param state Recycle state.
     */
    recycle(state) {
        const properties = Memory.getObject(allProperties, this);
        if (state) {
            if (properties.recycle !== true) {
                properties.recycle = true;
                if (properties.parent) {
                    properties.parent.recycle(true);
                }
            }
        }
        else {
            if (properties.component) {
                properties.state = properties.component.state;
            }
        }
    }
    /**
     * Render any child which needs to be recycled.
     */
    render() {
        const properties = Memory.getObject(allProperties, this);
        if (properties.recycle) {
            properties.recycle = false;
            if (properties.component && properties.component.canRecycle(properties.state)) {
                properties.state = properties.component.state;
                const results = properties.component.render();
                const oldChildren = properties.children;
                const newChildren = results instanceof Array ? results : [results];
                properties.children = Engine.update(this, allProperties, newChildren, oldChildren);
            }
            else {
                for (const child of properties.children) {
                    child.render();
                }
            }
        }
    }
}
exports.Element = Element;
/**
 * Create a new text element.
 * @param content Text content.
 * @returns Returns the generated text element.
 */
function createTextElement(content) {
    return new Element('text', Object.freeze({ content: content }));
}
exports.createTextElement = createTextElement;
/**
 * Create a new plain element.
 * @param name Plain name.
 * @param attributes Plain attributes.
 * @param children Plain children.
 * @returns Returns the generated plain element.
 */
function createPlainElement(name, attributes, children) {
    attributes = Object.freeze(attributes || {});
    const element = new Element('plain', { name: name, attributes: attributes });
    const properties = Memory.getObject(allProperties, element);
    properties.children = getChildElements(element, children);
    return element;
}
exports.createPlainElement = createPlainElement;
/**
 * Create a new class element.
 * @param constructor Class constructor.
 * @param attributes Class attributes.
 * @param children Class children.
 * @returns Returns the generated class element.
 */
function createClassElement(constructor, attributes, children) {
    attributes = Object.assign(attributes || {}, { children: Object.freeze(children) });
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
exports.createClassElement = createClassElement;
/**
 * Create a new element.
 * @param type Element type.
 * @param attributes Element attributes.
 * @param children Element children.
 * @returns Returns the generated element.
 * @throws Throws an error when the element type isn't supported.
 */
function createElement(type, attributes, ...children) {
    if (Assert.isPlainType(type)) {
        return createPlainElement(type, attributes, children);
    }
    else if (Assert.isClassType(type)) {
        return createClassElement(type, attributes, children);
    }
    else {
        throw new TypeError(`Element type isn't supported.`);
    }
}
exports.createElement = createElement;
/**
 * Get all child elements from the specified children.
 * @param element Parent element.
 * @param children Element children.
 * @returns Returns the child element list.
 */
function getChildElements(element, children) {
    const list = [];
    for (let child of children) {
        if (child instanceof Array) {
            list.push(...getChildElements(element, child));
        }
        else {
            if (!Assert.isElementInstance(child)) {
                child = createTextElement(child);
            }
            Memory.getObject(allProperties, child).parent = element;
            list.push(child);
        }
    }
    return list;
}
//# sourceMappingURL=elements.js.map