'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WebSocket = void 0;
if (typeof window !== 'undefined') {
  var _window = window;
  WebSocket = _window.WebSocket;
} else {
  WebSocket = require('ws'); // eslint-disable-line global-require
}

var wait = function wait(ws, cb) {
  setTimeout(function () {
    if (ws.readyState === 1) {
      if (cb !== null) cb();
    } else {
      wait(ws, cb);
    }
  }, 5);
};

var WSClient = function () {
  function WSClient(address, reconnect) {
    var _this = this;

    (0, _classCallCheck3.default)(this, WSClient);

    this.address = address;
    this.open = false;
    this.shouldClose = false;
    this.queue = {};
    this.lastTimestamp = Date.now();
    this.lastWakeTimestamp = Date.now();
    this.lastSentTimestamp = null;
    this.notifications = function () {};
    this.onConnectCallback = function () {};
    this.connect = function () {
      var ws = new WebSocket(address);

      ws.addEventListener('message', function (payload) {
        _this.lastTimestamp = Date.now();
        var message = JSON.parse(payload.data);
        if (!message || !Array.isArray(message) || message.length !== 2) return;
        var type = message[0];
        var tag = message[1].tag;
        // handle certain requests and responses

        if (type === 'request' && tag) {
          var command = message[1].command;

          if (command === 'heartbeat') {
            // true if our timers were paused
            // Happens only on android, which suspends timers when the app becomes paused but still keeps network connections
            // Handling 'pause' event would've been more straightforward but with preference KeepRunning=false, the event is delayed till resume
            if (Date.now() - _this.lastWakeTimestamp > _constants.HEARTBEAT_PAUSE_TIMEOUT) {
              // opt out of receiving heartbeats and move the connection into a sleeping state
              _this.respond(command, tag, 'sleep');
              return;
            }
            // response with acknowledge
            _this.respond(command, tag);
            return;
            // eslint-disable-next-line no-else-return
          } else if (command === 'subscribe') {
            _this.error(command, tag, "I'm light, cannot subscribe you to updates");
            return;
          } else if (command.startsWith('light/')) {
            _this.error(command, tag, "I'm light myself, can't serve you");
            return;
          } else if (command.startsWith('hub/')) {
            _this.error(command, tag, "I'm not a hub");
            return;
          }
        } else if (type === 'response' && tag && _this.queue[tag]) {
          if (message[1].command === 'heartbeat') {
            _this.lastSentTimestamp = null;
          }
        }
        // handle everything else
        if (tag && _this.queue[tag]) {
          var error = message[1].response ? message[1].response.error || null : null;
          var result = error ? null : message[1].response || null;
          var callback = _this.queue[tag];
          delete _this.queue[tag]; // cleanup
          callback(error, result);
        } else {
          _this.notifications(null, message);
        }
      });

      ws.addEventListener('open', function () {
        _this.lastTimestamp = Date.now();
        if (_this.shouldClose) {
          _this.ws.close();
          _this.shouldClose = false;
        } else {
          _this.open = true;
          _this.onConnectCallback();
        }
      });

      ws.addEventListener('close', function () {
        _this.open = false;
        if (reconnect) {
          _this.ws = null;
          setTimeout(function () {
            _this.connect();
          }, 1000);
        }
      });

      _this.ws = ws;
    };
    this.connect();
  }

  (0, _createClass3.default)(WSClient, [{
    key: 'onConnect',
    value: function onConnect(cb) {
      this.onConnectCallback = cb;
    }
  }, {
    key: 'subscribe',
    value: function subscribe(cb) {
      this.notifications = cb;
    }
  }, {
    key: 'send',
    value: function send(message) {
      var _this2 = this;

      wait(this.ws, function () {
        _this2.ws.send((0, _stringify2.default)(message));
      });
    }
  }, {
    key: 'close',
    value: function close() {
      if (this.ws.readyState === WebSocket.CONNECTING) {
        this.shouldClose = true;
      } else {
        this.ws.close();
      }
    }
  }, {
    key: 'request',
    value: function request(command, params, cb) {
      if (command === 'heartbeat') {
        var justResumed = Date.now() - this.lastWakeTimestamp > _constants.HEARTBEAT_PAUSE_TIMEOUT;
        this.lastWakeTimestamp = Date.now();
        // don't send heartbeat if connection not open
        if (!this.open) return;
        // don't send heartbeat if received message recently
        if (Date.now() - this.lastTimestamp < _constants.HEARTBEAT_TIMEOUT) return;
        // check if heartbeat is not timed out if not resuming
        // opposite of "if (!this.lastSentTimestamp || justResumed)"
        // same as "if (!(!this.lastSentTimestamp || justResumed))"
        if (this.lastSentTimestamp && !justResumed) {
          // don't send heartbeat if waiting response for heartbeat request
          if (Date.now() - this.lastSentTimestamp < _constants.HEARTBEAT_RESPONSE_TIMEOUT) return;
          // close connection when didn't get heartbeat response
          this.close();
          return;
        }
        this.lastSentTimestamp = Date.now();
      }
      var request = { command: command };
      if (params) request.params = params;
      request.tag = Math.random().toString(36).substring(7);
      this.queue[request.tag] = cb;
      this.send(['request', request]);
    }
  }, {
    key: 'respond',
    value: function respond(command, tag, message) {
      var respond = { command: command, tag: tag };
      if (typeof message !== 'undefined') respond.response = message;
      this.send(['response', respond]);
    }
  }, {
    key: 'error',
    value: function error(command, tag, message) {
      this.respond(command, tag, { error: message });
    }
  }, {
    key: 'justsaying',
    value: function justsaying(subject, body) {
      var justsaying = { subject: subject };
      if (body) justsaying.body = body;
      this.send(['justsaying', justsaying]);
    }
  }]);
  return WSClient;
}();

exports.default = WSClient;
module.exports = exports.default;