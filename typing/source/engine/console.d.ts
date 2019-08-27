/*!
 * Copyright (C) 2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Elements from '../core/elements';
import Attributes = JSX.ElementClassAttributes;
import Parameters = JSX.ElementParameters;
/**
 * Create a new HTML text or element based on the given JSX element.
 * @param element JSX element.
 * @returns Returns the generated HTML text or element.
 * @throws Throws an error when the element type isn't supported.
 */
export declare function createElement<A extends Attributes>(element: Elements.Element<Parameters<A>>): string;
/**
 * Append the new JSX element into the given parent JSX element.
 * @param jsxParent Parent JSX element.
 * @param jsxElement JSX element.
 */
export declare function appendElement<PA extends Attributes, A extends Attributes>(jsxParent: Elements.Element<Parameters<PA>>, jsxElement: Elements.Element<Parameters<A>>): void;
/**
 * Replace the specified JSX element by the new one.
 * @param jsxElement JSX element.
 * @param jsxNewElement New JSX element.
 * @throws Throws an error when the element has no parent.
 */
export declare function replaceElement<A extends Attributes, NA extends Attributes>(jsxElement: Elements.Element<Parameters<A>>, jsxNewElement: Elements.Element<Parameters<NA>>): void;
/**
 * Remove the specified JSX element.
 * @param jsxElement JSX element.
 */
export declare function removeElement<A extends Attributes>(jsxElement: Elements.Element<Parameters<A>>): void;
/**
 * Updates the specified JSX element by the new one.
 * @param jsxElement JSX element.
 * @param jsxNewElement New JSX element.
 */
export declare function updateElement<A extends Attributes>(jsxElement: Elements.Element<Parameters<A>>, jsxNewElement: Elements.Element<Parameters<A>>): void;
/**
 * Update all attributes in the specified JSX element.
 * @param jsxElement JSX element.
 * @param newAttributes New attributes.
 * @param oldAttributes Old attributes.
 */
export declare function updateAttributes<A extends Attributes>(jsxElement: Elements.Element<Parameters<A>>, newAttributes: Readonly<A>, oldAttributes: Readonly<A>): void;
