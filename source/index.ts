/*!
 * Copyright (C) 2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
/// <reference path="../utility/jsx.d.ts"/>

// Exported classes.
export { Component } from './core/components';
export { Export } from './core/exports';
export { Event } from './core/events';
export { Engine } from './engine';

// Exported components.
export { Fragment } from './fragment';

// Exported methods.
export { createElement } from './core/elements';

// Exported aliases.
export import Element = JSX.Element;
export import ElementTypes = JSX.ElementTypes;
export import EventDetails = JSX.ElementEventDetails;
export import Attributes = JSX.ElementClassAttributes;
export import Child = JSX.ElementClassChild;
export import State = JSX.ElementClassState;
