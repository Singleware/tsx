"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*!
 * Copyright (C) 2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
const Memory = require("./memory");
const engine_1 = require("../engine");
/**
 * Get an array containing all updated child components and elements.
 * @param parent Parent element.
 * @param allProperties All properties map.
 * @param newChildren New children.
 * @param oldChildren Old children.
 * @returns Returns the array containing all updated child components and elements..
 */
function update(parent, allProperties, newChildren, oldChildren) {
    const length = Math.max(newChildren.length, oldChildren.length);
    const children = [];
    for (let index = 0; index < length; ++index) {
        const newChild = newChildren[index];
        const oldChild = oldChildren[index];
        if (newChild === void 0) {
            engine_1.Engine.removeElement(oldChild);
        }
        else if (oldChild === void 0) {
            engine_1.Engine.appendElement(parent, newChild);
            children.push(newChild);
        }
        else if (newChild === oldChild) {
            children.push(oldChild);
        }
        else {
            const newProperties = Memory.getObject(allProperties, newChild);
            const oldProperties = Memory.getObject(allProperties, oldChild);
            if (newProperties.type !== oldProperties.type) {
                newProperties.parent = parent;
                engine_1.Engine.replaceElement(oldChild, newChild);
                children.push(newChild);
            }
            else if (newProperties.type === 'text') {
                const newParameters = newProperties.parameters;
                const oldParameters = oldProperties.parameters;
                if (newParameters.content != oldParameters.content) {
                    newProperties.parent = parent;
                    engine_1.Engine.replaceElement(oldChild, newChild);
                    children.push(newChild);
                }
                else {
                    children.push(oldChild);
                }
            }
            else if (newProperties.type === 'plain') {
                const newParameters = newProperties.parameters;
                const oldParameters = oldProperties.parameters;
                newProperties.parent = parent;
                if (newParameters.name !== oldParameters.name) {
                    engine_1.Engine.replaceElement(oldChild, newChild);
                }
                else {
                    engine_1.Engine.updateElement(oldChild, newChild);
                    engine_1.Engine.updateAttributes(newChild, newParameters.attributes, oldParameters.attributes);
                    newProperties.children = update(newChild, allProperties, newProperties.children, oldProperties.children);
                }
                children.push(newChild);
            }
            else if (newProperties.type === 'class') {
                const newParameters = newProperties.parameters;
                const oldParameters = oldProperties.parameters;
                const newComponent = newProperties.component;
                const oldComponent = oldProperties.component;
                if (newParameters.type !== oldParameters.type || newComponent.canRecycle(oldComponent.state)) {
                    newProperties.parent = parent;
                    newProperties.children = update(parent, allProperties, newProperties.children, oldProperties.children);
                    children.push(newChild);
                }
                else {
                    children.push(oldChild);
                }
            }
        }
    }
    return children;
}
exports.update = update;
//# sourceMappingURL=engine.js.map