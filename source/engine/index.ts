/*!
 * Copyright (C) 2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */

/**
 * Active engine.
 */
export const Engine = typeof window === typeof void 0 ? require('./console') : require('./browser');
