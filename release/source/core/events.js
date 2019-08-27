"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*!
 * Copyright (C) 2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
const Memory = require("../helper/memory");
/**
 * All properties.
 */
const allProperties = new WeakMap();
/**
 * Event.
 */
class Event {
    /**
     * Default constructor.
     * @param type Event type.
     * @param source Event source.
     * @param details Event details.
     */
    constructor(type, source, details) {
        Memory.setObject(allProperties, this, {
            type: type,
            source: source,
            details: Object.freeze(details),
            stopped: false
        });
    }
    /**
     * Get event type.
     */
    get type() {
        return Memory.getObject(allProperties, this).type;
    }
    /**
     * Get event source.
     */
    get source() {
        return Memory.getObject(allProperties, this).source;
    }
    /**
     * Get event details.
     */
    get details() {
        return Memory.getObject(allProperties, this).details;
    }
    /**
     * Get the stopped state.
     */
    get stopped() {
        return Memory.getObject(allProperties, this).stopped;
    }
    /**
     * Stop event propagation.
     */
    stop() {
        Memory.getObject(allProperties, this).stopped = true;
    }
}
exports.Event = Event;
//# sourceMappingURL=events.js.map