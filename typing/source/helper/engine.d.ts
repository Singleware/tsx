import * as Elements from '../core/elements';
import Attributes = JSX.ElementClassAttributes;
import Parameters = JSX.ElementParameters;
/**
 * Properties map.
 */
declare type PropertiesMap = WeakMap<Elements.Element<any>, Elements.Properties<any>>;
/**
 * Get an array containing all updated child components and elements.
 * @param parent Parent element.
 * @param allProperties All properties map.
 * @param newChildren New children.
 * @param oldChildren Old children.
 * @returns Returns the array containing all updated child components and elements..
 */
export declare function update<A extends Attributes>(parent: Elements.Element<Parameters<A>>, allProperties: PropertiesMap, newChildren: Elements.Element<any>[], oldChildren: Elements.Element<any>[]): Elements.Element<any>[];
export {};
