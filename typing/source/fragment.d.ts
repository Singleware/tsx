/*!
 * Copyright (C) 2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Components from './core/components';
import Child = JSX.ElementClassChild;
/**
 * Condition type.
 */
export declare type Condition = boolean | (() => boolean);
/**
 * Fragment attributes.
 */
export declare type Attributes = {
    /**
     * Fragment condition.
     */
    condition?: Condition;
    /**
     * Fragment children.
     */
    children: Child | Child[] | Readonly<Child[]>;
};
/**
 * Fragment state.
 */
export declare type State = {
    /**
     * Fragment condition.
     */
    condition?: Condition;
};
/**
 * Fragment component.
 */
export declare class Fragment extends Components.Component<Attributes, State> {
    /**
     * Get default state.
     */
    readonly defaultState: State;
    /**
     * Determines whether the fragment will be recycled.
     * @returns Always returns true.
     */
    canRecycle(): boolean;
    /**
     * Prepare all fragments to be rendered.
     * @returns Returns the fragment list.
     */
    render(): JSX.Element[];
}
