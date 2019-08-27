"use strict";
/*!
 * Copyright (C) 2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Active engine.
 */
exports.Engine = typeof window === typeof void 0 ? require('./console') : require('./browser');
//# sourceMappingURL=index.js.map