"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*!
 * Copyright (C) 2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
const Tasks = require("@singleware/tasks");
const Assert = require("../helper/assert");
const Memory = require("../helper/memory");
const Events = require("../core/events");
/**
 * All callbacks.
 */
const allEvents = new WeakMap();
/**
 * All elements.
 */
const allJSXElements = new WeakMap();
/**
 * All DOM elements.
 */
const allDOMElements = new WeakMap();
/**
 * List of helper attributes to be performed.
 */
const helperAttributesList = ['perform-error', 'perform-focus'];
/**
 * Get all mouse event details from the specified DOM event.
 * @param domEvent DOM event.
 * @returns Returns all mouse event details or undefined when the specified event isn't valid.
 */
function getMouseDetails(domEvent) {
    if (domEvent instanceof MouseEvent) {
        return {
            screenX: domEvent.screenX,
            screenY: domEvent.screenY,
            clientX: domEvent.clientX,
            clientY: domEvent.clientY,
            offsetX: domEvent.offsetX,
            offsetY: domEvent.offsetY,
            pageX: domEvent.pageX,
            pageY: domEvent.pageY
        };
    }
    return void 0;
}
/**
 * Get all keyboard event details from the specified DOM event.
 * @param domEvent DOM event.
 * @returns Returns all keyboard event details or undefined when the specified event isn't valid.
 */
function getKeyboardDetails(domEvent) {
    if (domEvent instanceof KeyboardEvent) {
        return {
            key: domEvent.key,
            code: domEvent.code,
            altKey: domEvent.altKey,
            ctrlKey: domEvent.ctrlKey,
            shiftKey: domEvent.shiftKey,
            metaKey: domEvent.metaKey,
            repeat: domEvent.repeat
        };
    }
    return void 0;
}
/**
 * Get all input event details from the specified DOM event.
 * @param domEvent DOM event.
 * @returns Returns all input event details or undefined when the specified event isn't valid.
 */
function getInputDetails(domEvent) {
    const target = domEvent.target;
    if (target instanceof HTMLInputElement) {
        return {
            value: target.value,
            checked: target.checked,
            valid: target.validity.valid
        };
    }
    return void 0;
}
/**
 * Dispatch virtual events to the specified callback based on the DOM event.
 * @param domEvent DOM event.
 * @param callback Event callback.
 */
function dispatchEvent(domEvent, callback) {
    const target = domEvent.target;
    if (domEvent.isTrusted && Memory.hasObject(allDOMElements, target)) {
        const event = new Events.Event(domEvent.type, Memory.getObject(allDOMElements, target), {
            ...getMouseDetails(domEvent),
            ...getKeyboardDetails(domEvent),
            ...getInputDetails(domEvent)
        });
        callback(event);
        if (event.stopped) {
            domEvent.stopImmediatePropagation();
            domEvent.preventDefault();
        }
    }
}
/**
 * Set the specified event in the given DOM element.
 * @param element DOM element.
 * @param name Event name.
 * @param callback Event callback.
 */
function setEvent(element, name, callback) {
    const eventName = name.substr(2).toLowerCase();
    const eventMap = Memory.getObject(allEvents, element);
    const eventCallback = (event) => dispatchEvent(event, callback);
    if (eventName in eventMap) {
        element.removeEventListener(eventName, eventMap[eventName]);
    }
    element.addEventListener(eventName, eventCallback);
    eventMap[eventName] = eventCallback;
}
/**
 * Removes the specified event from the given DOM element.
 * @param element DOM element.
 * @param name Event name.
 */
function removeEvent(element, name) {
    const eventName = name.substr(2).toLowerCase();
    const eventMap = Memory.getObject(allEvents, element);
    if (eventName in eventMap) {
        element.removeEventListener(eventName, eventMap[eventName]);
        delete eventMap[eventName];
    }
}
/**
 * Removes the specified attribute from the given DOM element.
 * @param domElement DOM element.
 * @param attributeName Attribute name.
 */
function removeAttribute(domElement, attributeName) {
    if (attributeName.startsWith('on')) {
        removeEvent(domElement, attributeName);
    }
    else {
        domElement.removeAttribute(attributeName);
    }
}
/**
 * Set the specified attribute in the given DOM element.
 * @param domElement DOM element.
 * @param jsxElement JSX element.
 * @param attributeName Attribute name.
 * @param attributeValue Attribute value.
 */
function setAttribute(domElement, attributeName, attributeValue) {
    if (attributeName.startsWith('on')) {
        if (attributeValue === void 0) {
            removeEvent(domElement, attributeName);
        }
        else {
            if (!Assert.isEventCallback(attributeValue)) {
                throw new Error(`Event '${attributeName}' must be a callback.`);
            }
            setEvent(domElement, attributeName, attributeValue);
        }
    }
    else {
        if (typeof attributeValue === 'boolean') {
            if (attributeValue) {
                domElement.setAttribute(attributeName, '');
            }
            else {
                domElement.removeAttribute(attributeName);
            }
        }
        else if (attributeValue === void 0) {
            domElement.removeAttribute(attributeName);
        }
        else {
            domElement.setAttribute(attributeName, `${attributeValue}`);
        }
    }
}
/**
 * Performs the specified attribute according to its value.
 * @param element DOM element.
 * @param name Attribute name.
 * @param value Attribute value.
 */
function performAttribute(element, name, value) {
    switch (name.toLowerCase()) {
        case 'perform-error':
            if (element.setCustomValidity instanceof Function) {
                new Tasks.Task(() => element.setCustomValidity(value || ''));
            }
        case 'perform-focus':
            if (value === true) {
                new Tasks.Task(() => element.focus());
            }
            break;
    }
}
/**
 * Create a new DOM text based on the given JSX element.
 * @param jsxElement JSX element.
 * @returns Returns the generated DOM text.
 */
function createFromTextElement(jsxElement) {
    const jsxParameters = jsxElement.parameters;
    const domText = document.createTextNode(jsxParameters.content !== void 0 ? `${jsxParameters.content}` : '');
    Memory.setObject(allJSXElements, jsxElement, domText, true);
    return domText;
}
/**
 * Create a new DOM element based on the given JSX element.
 * @param jsxElement JSX element.
 * @returns Returns the generated DOM element.
 */
function createFromPlainElement(jsxElement) {
    const jsxParameters = jsxElement.parameters;
    const domElement = document.createElement(jsxParameters.name);
    Memory.setObject(allDOMElements, domElement, jsxElement, true);
    Memory.setObject(allJSXElements, jsxElement, domElement, true);
    Memory.setObject(allEvents, domElement, {});
    for (const jsxChild of jsxElement.children) {
        domElement.append(...createElement(jsxChild));
    }
    for (const name in jsxParameters.attributes) {
        const value = jsxParameters.attributes[name];
        if (helperAttributesList.includes(name)) {
            performAttribute(domElement, name, value);
        }
        else {
            setAttribute(domElement, name, value);
        }
    }
    return domElement;
}
/**
 * Create a new DOM text or element based on the given JSX element.
 * @param jsxElement JSX element.
 * @returns Returns the generated DOM text or element.
 */
function createFromClassElement(jsxElement) {
    const domChildren = [];
    for (const jsxChild of jsxElement.children) {
        for (const domChild of createElement(jsxChild)) {
            domChildren.push(domChild);
        }
    }
    Memory.setObject(allJSXElements, jsxElement, domChildren, true);
    return domChildren;
}
/**
 * Create a new DOM text or element based on the given JSX element.
 * @param jsxElement JSX element.
 * @returns Returns the generated DOM text or element.
 * @throws Throws an error when the element type isn't supported.
 */
function createElement(jsxElement) {
    switch (jsxElement.type) {
        case 'text':
            return [createFromTextElement(jsxElement)];
        case 'plain':
            return [createFromPlainElement(jsxElement)];
        case 'class':
            return createFromClassElement(jsxElement);
        default:
            throw new Error(`Type '${jsxElement.type}' isn't supported by JSX elements.`);
    }
}
exports.createElement = createElement;
/**
 * Append the new JSX element into the given parent JSX element.
 * @param jsxParent Parent JSX element.
 * @param jsxElement JSX element.
 */
function appendElement(jsxParent, jsxElement) {
    const domResult = Memory.getObject(allJSXElements, jsxParent);
    const domParent = domResult instanceof Array ? domResult[domResult.length - 1].parentElement : domResult;
    if (!domParent) {
        throw new Error(`Element has no parent.`);
    }
    const domChildren = createElement(jsxElement);
    for (const domChild of domChildren) {
        domParent.appendChild(domChild);
    }
}
exports.appendElement = appendElement;
/**
 * Replace the specified JSX element by the new one.
 * @param jsxElement JSX element.
 * @param jsxNewElement New JSX element.
 * @throws Throws an error when the element has no parent.
 */
function replaceElement(jsxElement, jsxNewElement) {
    const domResult = Memory.getObject(allJSXElements, jsxElement);
    const domElement = domResult instanceof Array ? domResult[0] : domResult;
    const domParent = domElement.parentElement;
    if (!domParent) {
        throw new Error(`Element has no parent.`);
    }
    const domChildren = createElement(jsxNewElement);
    for (const domChild of domChildren) {
        domParent.insertBefore(domChild, domElement);
    }
    if (domResult instanceof Array) {
        for (const domChild of domResult) {
            domChild.remove();
        }
    }
    else {
        domResult.remove();
    }
}
exports.replaceElement = replaceElement;
/**
 * Remove the specified JSX element.
 * @param jsxElement JSX element.
 */
function removeElement(jsxElement) {
    const domResult = Memory.getObject(allJSXElements, jsxElement);
    if (domResult instanceof Array) {
        for (const domChild of domResult) {
            domChild.remove();
        }
    }
    else {
        domResult.remove();
    }
}
exports.removeElement = removeElement;
/**
 * Updates the specified JSX element by the new one.
 * @param jsxElement JSX element.
 * @param jsxNewElement New JSX element.
 */
function updateElement(jsxElement, jsxNewElement) {
    const domResult = Memory.getObject(allJSXElements, jsxElement);
    Memory.setObject(allJSXElements, jsxNewElement, domResult, true);
}
exports.updateElement = updateElement;
/**
 * Update all attributes in the specified JSX element.
 * @param jsxElement JSX element.
 * @param newAttributes New attributes.
 * @param oldAttributes Old attributes.
 */
function updateAttributes(jsxElement, newAttributes, oldAttributes) {
    const domResult = Memory.getObject(allJSXElements, jsxElement);
    if (domResult instanceof Array) {
        throw new Error(`Updating component attributes isn't allowed.`);
    }
    const attributesNameList = new Set([...Object.keys(newAttributes), ...Object.keys(oldAttributes)]);
    for (const name of attributesNameList) {
        if (helperAttributesList.includes(name)) {
            if (name in newAttributes) {
                performAttribute(domResult, name, newAttributes[name]);
            }
        }
        else {
            if (!(name in newAttributes)) {
                removeAttribute(domResult, name);
            }
            else {
                const value = newAttributes[name];
                if (name.startsWith('on')) {
                    if (!(name in oldAttributes) || value != oldAttributes[name]) {
                        setAttribute(domResult, name, value);
                    }
                }
                else if (name in domResult) {
                    if (!(name in oldAttributes) || value !== domResult[name]) {
                        if (value === void 0) {
                            removeAttribute(domResult, name);
                        }
                        else {
                            domResult[name] = value;
                        }
                    }
                }
                else if (!(name in oldAttributes) || value != oldAttributes[name]) {
                    setAttribute(domResult, name, value);
                }
            }
        }
    }
}
exports.updateAttributes = updateAttributes;
//# sourceMappingURL=browser.js.map