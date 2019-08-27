import * as Elements from './elements';
import Base = JSX.ElementEvent;
import Details = JSX.ElementEventDetails;
/**
 * Input event details.
 */
export interface InputDetails<V> extends Details {
    /**
     * Input value.
     */
    value: V;
    /**
     * Determines whether the input is checked or not.
     */
    checked: boolean;
    /**
     * Determines whether the input is valid or not.
     */
    valid: boolean;
}
/**
 * Mouse event details.
 */
export interface MouseDetails extends Details {
    /**
     * Screen X coordinate of the mouse pointer.
     */
    screenX: number;
    /**
     * Screen Y coordinate of the mouse pointer.
     */
    screenY: number;
    /**
     * Client X coordinate of the mouse pointer.
     */
    clientX: number;
    /**
     * Client Y coordinate of the mouse pointer.
     */
    clientY: number;
    /**
     * Offset X coordinate of the mouse pointer.
     */
    offsetX: number;
    /**
     * Offset Y coordinate of the mouse pointer.
     */
    offsetY: number;
    /**
     * Page X coordinate of the mouse pointer.
     */
    pageX: number;
    /**
     * Page Y coordinate of the mouse pointer.
     */
    pageY: number;
}
/**
 * Keyboard event details.
 */
export interface KeyboardDetails extends Details {
    /**
     * Character value representing the event key.
     */
    key: string;
    /**
     * Code value representing the event code.
     */
    code: string;
    /**
     * Determines whether the alt key is active.
     */
    altKey: boolean;
    /**
     * Determines whether the ctrl key is active.
     */
    ctrlKey: boolean;
    /**
     * Determines whether the shift key is active.
     */
    shiftKey: boolean;
    /**
     * Determines whether the meta key is active.
     */
    metaKey: boolean;
    /**
     * Determines whether the key still pressed.
     */
    repeat: boolean;
}
/**
 * Event properties.
 */
export declare type Properties<D extends Details> = {
    /**
     * Event type.
     */
    type: string;
    /**
     * Event source.
     */
    source: Elements.Element<any> | null;
    /**
     * Determines whether or not the event was stopped.
     */
    stopped: boolean;
    /**
     * Event details.
     */
    details: Readonly<D>;
};
/**
 * Event.
 */
export declare class Event<D extends Details> implements Base<D> {
    /**
     * Default constructor.
     * @param type Event type.
     * @param source Event source.
     * @param details Event details.
     */
    constructor(type: string, source: Elements.Element<any> | null, details: D);
    /**
     * Get event type.
     */
    readonly type: string;
    /**
     * Get event source.
     */
    readonly source: Elements.Element<any> | null;
    /**
     * Get event details.
     */
    readonly details: Readonly<D>;
    /**
     * Get the stopped state.
     */
    readonly stopped: boolean;
    /**
     * Stop event propagation.
     */
    stop(): void;
}
