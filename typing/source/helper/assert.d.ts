import * as Elements from '../core/elements';
import PlainNames = JSX.ElementPlainNames;
import Constructor = JSX.ElementClassConstructor;
import Attributes = JSX.ElementClassAttributes;
import Parameters = JSX.ElementParameters;
import Callback = JSX.ElementEventCallback;
import Details = JSX.ElementEventDetails;
/**
 * Determines whether or not both values are equals.
 * @param newer New value.
 * @param older Old value.
 * @returns Returns true when both values are equals, false otherwise.
 */
export declare function isEqual<V>(newer: V, older: V): newer is typeof older;
/**
 * Determines whether or not the specified input will generate plain elements.
 * @param input Input.
 * @returns Returns true when the specified input generates plain elements, false otherwise.
 */
export declare function isPlainType(input: unknown): input is PlainNames;
/**
 * Determines whether or not the specified input will generate class elements.
 * @param input Input.
 * @returns Returns true when the specified input generates class elements, false otherwise.
 */
export declare function isClassType<A extends Attributes>(input: unknown): input is Constructor<A>;
/**
 * Determines whether or not the specified input is an element instance.
 * @param input Input.
 * @returns Returns true when the specified input is an element instance, false otherwise.
 */
export declare function isElementInstance<A extends Attributes>(input: unknown): input is Elements.Element<Parameters<A>>;
/**
 * Determines whether or not the specified input is an event callback.
 * @param input Value.
 * @returns Returns true when the specified input is an event callback, false otherwise.
 */
export declare function isEventCallback<D extends Details>(input: unknown): input is Callback<D>;
