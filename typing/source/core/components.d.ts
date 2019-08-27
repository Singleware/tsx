import * as Elements from './elements';
import Base = JSX.ElementClass;
import State = JSX.ElementClassState;
import Child = JSX.ElementClassChild;
import Attributes = JSX.ElementClassAttributes;
import Parameters = JSX.ElementParameters;
import Callback = JSX.ElementEventCallback;
import Details = JSX.ElementEventDetails;
/**
 * Map of event set.
 */
declare type EventSetMap = {
    [type: string]: Set<Callback<any>>;
};
/**
 * Component properties.
 */
export declare type Properties<A extends Attributes, S extends State> = {
    /**
     * Component state.
     */
    state: Readonly<S> | null;
    /**
     * Component events.
     */
    events: EventSetMap;
    /**
     * Component attributes.
     */
    attributes: Readonly<A>;
};
/**
 * Component.
 */
export declare abstract class Component<A extends Attributes, S extends State> implements Base {
    /**
     * Default constructor.
     * @param attributes Component attributes.
     */
    constructor(attributes: A);
    /**
     * Get component state.
     */
    readonly state: Readonly<S>;
    /**
     * Get component attributes.
     */
    readonly attributes: Readonly<A>;
    /**
     * Get component children.
     */
    readonly children: Readonly<Child[]>;
    /**
     * Get default component state.
     */
    abstract readonly defaultState: S;
    /**
     * Start receiving the specified event type in the given callback.
     * @param type Event type.
     * @param callback Event callback.
     */
    attach<D extends Details>(type: string, callback: Callback<D>): void;
    /**
     * Stop receiving the specified event type in the given callback.
     * @param type Event type.
     * @param callback Event callback.
     */
    detach<D extends Details>(type: string, callback: Callback<D>): void;
    /**
     * Notify a new event to all child components.
     * @param type Event type.
     * @param details Event details.
     * @returns Returns true when all children were notified, false otherwise.
     */
    notify<D extends Details>(type: string, details: D): boolean;
    /**
     * Update component state.
     * @param state New component state.
     * @param recycle Determines whether the new state will set the component to recycle. (Default is true)
     */
    update(state: Partial<S>, recycle?: boolean): void;
    /**
     * Determines whether or not the component will be recycled.
     * @param oldState Old state.
     * @returns Returns true if the component should recycle, false otherwise.
     */
    canRecycle(oldState: S): boolean;
    /**
     * Render all component elements.
     * @returns Returns the rendering results.
     */
    abstract render(): JSX.Element | JSX.Element[];
}
/**
 * Assign the specified element in the given component.
 * @param element Element instance.
 * @param component Component instance.
 */
export declare function assignElement<A extends Attributes, S extends State>(element: Elements.Element<Parameters<A>>, component: Component<A, S>): void;
export {};
