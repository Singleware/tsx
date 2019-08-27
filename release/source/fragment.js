"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*!
 * Copyright (C) 2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
const Components = require("./core/components");
const Elements = require("./core/elements");
const Assert = require("./helper/assert");
/**
 * Fragment component.
 */
class Fragment extends Components.Component {
    /**
     * Get default state.
     */
    get defaultState() {
        return {
            condition: this.attributes.condition
        };
    }
    /**
     * Determines whether the fragment will be recycled.
     * @returns Always returns true.
     */
    canRecycle() {
        return true;
    }
    /**
     * Prepare all fragments to be rendered.
     * @returns Returns the fragment list.
     */
    render() {
        if (isValidCondition(this.state.condition)) {
            return getChildElements(this.children);
        }
        return [];
    }
}
exports.Fragment = Fragment;
/**
 * Determines whether  or not the specified condition is valid.
 * @param condition Condition.
 * @returns Returns true when the condition is valid, false otherwise.
 */
function isValidCondition(condition) {
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
function getChildElements(children) {
    const list = [];
    for (const child of children) {
        if (child instanceof Array) {
            list.push(...getChildElements(child));
        }
        else if (Assert.isElementInstance(child)) {
            list.push(child);
        }
        else {
            list.push(Elements.createTextElement(child));
        }
    }
    return list;
}
//# sourceMappingURL=fragment.js.map