"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
function escape(input) {
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
function getAttributes(jsxAttributes) {
    const buffer = [];
    let index = 0;
    for (const name in jsxAttributes) {
        const value = jsxAttributes[name];
        if (value !== void 0 && !name.startsWith('on')) {
            if (typeof value === 'boolean') {
                if (value === true) {
                    buffer[index++] = `${name}`;
                }
            }
            else {
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
function getChildren(jsxChildren) {
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
function createFromTextElement(jsxElement) {
    const jaxParameters = jsxElement.parameters;
    return jaxParameters.content !== void 0 ? escape(`${jaxParameters.content}`) : '';
}
/**
 * Create a new HTML element based on the given JSX element.
 * @param jsxElement JSX element.
 * @returns Returns the generated HTML element.
 */
function createFromPlainElement(jsxElement) {
    const jaxParameters = jsxElement.parameters;
    const tagAttributes = getAttributes(jaxParameters.attributes);
    const tagName = jaxParameters.name.toLowerCase();
    if (emptyElements.includes(tagName)) {
        if (tagAttributes.length) {
            return `<${tagName} ${tagAttributes}>`;
        }
        else {
            return `<${tagName}>`;
        }
    }
    else {
        if (tagAttributes.length) {
            return `<${tagName} ${tagAttributes}>${getChildren(jsxElement.children)}</${tagName}>`;
        }
        else {
            return `<${tagName}>${getChildren(jsxElement.children)}</${tagName}>`;
        }
    }
}
/**
 * Create a new HTML text or element based on the given JSX element.
 * @param jsxElement JSX element.
 * @returns Returns the generated HTML text or element.
 */
function createFromClassElement(jsxElement) {
    return getChildren(jsxElement.children);
}
/**
 * Create a new HTML text or element based on the given JSX element.
 * @param element JSX element.
 * @returns Returns the generated HTML text or element.
 * @throws Throws an error when the element type isn't supported.
 */
function createElement(element) {
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
exports.createElement = createElement;
/**
 * Append the new JSX element into the given parent JSX element.
 * @param jsxParent Parent JSX element.
 * @param jsxElement JSX element.
 */
function appendElement(jsxParent, jsxElement) { }
exports.appendElement = appendElement;
/**
 * Replace the specified JSX element by the new one.
 * @param jsxElement JSX element.
 * @param jsxNewElement New JSX element.
 * @throws Throws an error when the element has no parent.
 */
function replaceElement(jsxElement, jsxNewElement) { }
exports.replaceElement = replaceElement;
/**
 * Remove the specified JSX element.
 * @param jsxElement JSX element.
 */
function removeElement(jsxElement) { }
exports.removeElement = removeElement;
/**
 * Updates the specified JSX element by the new one.
 * @param jsxElement JSX element.
 * @param jsxNewElement New JSX element.
 */
function updateElement(jsxElement, jsxNewElement) { }
exports.updateElement = updateElement;
/**
 * Update all attributes in the specified JSX element.
 * @param jsxElement JSX element.
 * @param newAttributes New attributes.
 * @param oldAttributes Old attributes.
 */
function updateAttributes(jsxElement, newAttributes, oldAttributes) { }
exports.updateAttributes = updateAttributes;
//# sourceMappingURL=console.js.map