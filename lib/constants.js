'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var DEFAULT_NODE = exports.DEFAULT_NODE = 'wss://obyte.org/bb';
var VERSION = exports.VERSION = '3.0';
var VERSION_TESTNET = exports.VERSION_TESTNET = '3.0t';
var VERSION_WITHOUT_KEY_SIZES = exports.VERSION_WITHOUT_KEY_SIZES = '2.0';
var ALT = exports.ALT = '1';
var ALT_TESTNET = exports.ALT_TESTNET = '2';
var KEY_SIZE_UPGRADE_MCI = exports.KEY_SIZE_UPGRADE_MCI = 5530000;
var HEARTBEAT_TIMEOUT = exports.HEARTBEAT_TIMEOUT = 10 * 1000;
var HEARTBEAT_RESPONSE_TIMEOUT = exports.HEARTBEAT_RESPONSE_TIMEOUT = 60 * 1000;
var HEARTBEAT_PAUSE_TIMEOUT = exports.HEARTBEAT_PAUSE_TIMEOUT = 2 * HEARTBEAT_TIMEOUT;