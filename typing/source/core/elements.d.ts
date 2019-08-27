import * as Components from './components';
import * as Exports from './exports';
import Base = JSX.Element;
import State = JSX.ElementClassState;
import PlainNames = JSX.ElementPlainNames;
import PlainAttributes = JSX.ElementPlainAttributes;
import TextParameters = JSX.ElementTextParameters;
import Parameters = JSX.ElementParameters;
import Constructor = JSX.ElementClassConstructor;
import Attributes = JSX.ElementClassAttributes;
import Child = JSX.ElementClassChild;
import Types = JSX.ElementTypes;
/**
 * Element input type.
 */
declare type InputType<I, A> = I extends PlainNames ? I : Constructor<A>;
/**
 * Element input attributes.
 */
declare type InputAttributes<I, A> = I extends PlainNames ? PlainAttributes[I] : A;
/**
 * Element properties.
 */
export declare type Properties<P extends Parameters<Attributes>> = {
    /**
     * Element type.
     */
    type: Types;
    /**
     * Element parent.
     */
    parent: Base | null;
    /**
     * Element children.
     */
    children: Base[];
    /**
     * Element state.
     */
    state: Readonly<State>;
    /**
     * Element exports.
     */
    exports: Exports.Map;
    /**
     * Element parameters.
     */
    parameters: Readonly<P>;
    /**
     * Element component.
     */
    component: Components.Component<Attributes, State> | null;
    /**
     * Determines whether or not the component needs to be recycled.
     */
    recycle: boolean;
};
/**
 * Element.
 */
export declare class Element<P extends Parameters<Attributes>> implements Base {
    /**
     * Default constructor.
     * @param type Element type.
     * @param parameters Element parameters.
     */
    constructor(type: Types, parameters: Parameters<P>);
    /**
     * Get element type.
     */
    readonly type: Types;
    /**
     * Get element parameters.
     */
    readonly parameters: Readonly<Parameters<Attributes>>;
    /**
     * Get element children.
     */
    readonly children: Readonly<Base[]>;
    /**
     * Get component exports.
     */
    readonly exports: Exports.Map;
    /**
     * Set itself to be recycled.
     * @param state Recycle state.
     */
    recycle(state: boolean): void;
    /**
     * Render any child which needs to be recycled.
     */
    render(): void;
}
/**
 * Create a new text element.
 * @param content Text content.
 * @returns Returns the generated text element.
 */
export declare function createTextElement(content: any): Element<TextParameters>;
/**
 * Create a new plain element.
 * @param name Plain name.
 * @param attributes Plain attributes.
 * @param children Plain children.
 * @returns Returns the generated plain element.
 */
export declare function createPlainElement<N extends PlainNames, A extends PlainAttributes[N]>(name: N, attributes: A | null, children: Child[]): Element<A>;
/**
 * Create a new class element.
 * @param constructor Class constructor.
 * @param attributes Class attributes.
 * @param children Class children.
 * @returns Returns the generated class element.
 */
export declare function createClassElement<A extends Attributes>(constructor: Constructor<A>, attributes: A | null, children: Child[]): Element<Parameters<A>>;
/**
 * Create a new element.
 * @param type Element type.
 * @param attributes Element attributes.
 * @param children Element children.
 * @returns Returns the generated element.
 * @throws Throws an error when the element type isn't supported.
 */
export declare function createElement<I extends PlainNames | Constructor<A>, A extends Attributes>(type: InputType<I, A>, attributes: InputAttributes<I, A> | null, ...children: Child[]): Element<Parameters<A>>;
export {};
