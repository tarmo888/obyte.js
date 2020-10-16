'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _wsclient = require('./wsclient');

var _wsclient2 = _interopRequireDefault(_wsclient);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _constants = require('./constants');

var _internal = require('./internal');

var _api = require('./api.json');

var _api2 = _interopRequireDefault(_api);

var _apps = require('./apps.json');

var _apps2 = _interopRequireDefault(_apps);

var _expandApi = require('./expandApi');

var _expandApi2 = _interopRequireDefault(_expandApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Client = function () {
  function Client() {
    var _this = this;

    var nodeAddress = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _constants.DEFAULT_NODE;
    var clientOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck3.default)(this, Client);

    var self = this;

    this.options = (typeof clientOptions === 'undefined' ? 'undefined' : (0, _typeof3.default)(clientOptions)) === 'object' ? clientOptions : { testnet: clientOptions };
    this.client = new _wsclient2.default(nodeAddress, this.options.reconnect || false);
    this.cachedWitnesses = null;

    var requestAsync = function requestAsync(name, params) {
      return new _promise2.default(function (resolve, reject) {
        _this.client.request(name, params, function (err, result) {
          if (err) return reject(err);
          return resolve(result);
        });
      });
    };

    this.api = {};

    this.compose = {
      message: function () {
        var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(app, payload) {
          // 78 for payload_location and payload_hash

          var createUnitMessage = function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(message) {
              var assetPayment;
              return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      if (!(message.app === 'payment')) {
                        _context.next = 7;
                        break;
                      }

                      _context.next = 3;
                      return (0, _internal.createPaymentMessage)(self, message.payload.asset, message.payload.outputs, address, payloadsLength, lightProps.last_stable_mc_ball_mci);

                    case 3:
                      assetPayment = _context.sent;

                      assetPayment.payload.outputs.sort(_internal.sortOutputs);
                      assetPayment.payload_hash = (0, _internal.getBase64Hash)(assetPayment.payload, bJsonBased);
                      return _context.abrupt('return', assetPayment);

                    case 7:
                      return _context.abrupt('return', {
                        app: message.app,
                        payload_hash: (0, _internal.getBase64Hash)(message.payload, bJsonBased),
                        payload_location: 'inline',
                        payload: message.payload
                      });

                    case 8:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, _callee, this);
            }));

            return function createUnitMessage(_x6) {
              return _ref4.apply(this, arguments);
            };
          }();

          var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

          var messages, isDefinitionRequired, conf, privKeyBuf, pubkey, definition, address, path, witnesses, _ref2, _ref3, lightProps, objDefinition, bWithKeys, version, bJsonBased, payloadsLength, unitMessages, unit, author, headersCommission, payloadCommission, i, textToSign;

          return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  messages = app === 'multi' ? payload : [{ app: app, payload: payload }];


                  messages.sort(function (a) {
                    return a.app === 'payment' && !a.payload.asset ? -1 : 1; // we place byte payment message first
                  });
                  if (messages[0].app !== 'payment' || messages[0].payload.asset)
                    // if no byte payment, we add one
                    messages.unshift({ app: 'payment', payload: { outputs: [] } });

                  isDefinitionRequired = false;
                  conf = (typeof options === 'undefined' ? 'undefined' : (0, _typeof3.default)(options)) === 'object' ? (0, _extends3.default)({}, self.options, options) : (0, _extends3.default)({}, self.options, { wif: options });
                  privKeyBuf = conf.privateKey || _utils2.default.fromWif(conf.wif, conf.testnet).privateKey;
                  pubkey = (0, _internal.toPublicKey)(privKeyBuf);
                  definition = conf.definition || ['sig', { pubkey: pubkey }];
                  address = conf.address || _utils2.default.getChash160(definition);
                  path = conf.path || 'r';
                  _context2.next = 12;
                  return self.getCachedWitnesses();

                case 12:
                  witnesses = _context2.sent;
                  _context2.next = 15;
                  return _promise2.default.all([self.api.getParentsAndLastBallAndWitnessListUnit({ witnesses: witnesses }), self.api.getDefinitionForAddress({ address: address })]);

                case 15:
                  _ref2 = _context2.sent;
                  _ref3 = (0, _slicedToArray3.default)(_ref2, 2);
                  lightProps = _ref3[0];
                  objDefinition = _ref3[1];
                  bWithKeys = conf.testnet || lightProps.last_stable_mc_ball_mci >= _constants.KEY_SIZE_UPGRADE_MCI;
                  version = void 0;

                  if (conf.testnet) version = _constants.VERSION_TESTNET;else if (bWithKeys) version = _constants.VERSION;else version = _constants.VERSION_WITHOUT_KEY_SIZES;
                  bJsonBased = true;

                  if (!(!objDefinition.definition && objDefinition.is_stable)) {
                    _context2.next = 27;
                    break;
                  }

                  isDefinitionRequired = true;
                  _context2.next = 29;
                  break;

                case 27:
                  if (objDefinition.is_stable) {
                    _context2.next = 29;
                    break;
                  }

                  throw new Error('Definition or definition change for address ' + address + ' is not stable yet');

                case 29:
                  if (!(objDefinition.definition_chash !== _utils2.default.getChash160(definition))) {
                    _context2.next = 31;
                    break;
                  }

                  throw new Error('Definition chash of address doesn\'t match the definition chash provided');

                case 31:
                  payloadsLength = messages.reduce(function (a, b) {
                    return a + 78 + (0, _internal.getLength)(b.app, bWithKeys) + (0, _internal.getLength)(b.payload, bWithKeys);
                  }, 0);
                  _context2.next = 34;
                  return _promise2.default.all(messages.map(createUnitMessage));

                case 34:
                  unitMessages = _context2.sent;
                  unit = {
                    version: version,
                    alt: conf.testnet ? _constants.ALT_TESTNET : _constants.ALT,
                    messages: [].concat((0, _toConsumableArray3.default)(unitMessages)),
                    authors: [],
                    parent_units: lightProps.parent_units,
                    last_ball: lightProps.last_stable_mc_ball,
                    last_ball_unit: lightProps.last_stable_mc_ball_unit,
                    witness_list_unit: lightProps.witness_list_unit,
                    timestamp: Math.round(Date.now() / 1000)
                  };
                  author = { address: address, authentifiers: bWithKeys ? path : {} }; // we temporarily place the path there to have its length counted

                  if (isDefinitionRequired) {
                    author.definition = definition;
                  }
                  unit.authors.push(author);

                  headersCommission = (0, _internal.getHeadersSize)(unit, bWithKeys);
                  payloadCommission = (0, _internal.getTotalPayloadSize)(unit, bWithKeys);
                  i = 0;

                case 42:
                  if (!(i < unitMessages[0].payload.outputs.length)) {
                    _context2.next = 49;
                    break;
                  }

                  if (!(unitMessages[0].payload.outputs[i].address === address)) {
                    _context2.next = 46;
                    break;
                  }

                  // it's change output
                  unitMessages[0].payload.outputs[i].amount -= headersCommission + payloadCommission;
                  return _context2.abrupt('break', 49);

                case 46:
                  i += 1;
                  _context2.next = 42;
                  break;

                case 49:

                  unitMessages[0].payload.outputs.sort(_internal.sortOutputs);
                  unitMessages[0].payload_hash = (0, _internal.getBase64Hash)(unitMessages[0].payload, bJsonBased);

                  unit.headers_commission = headersCommission;
                  unit.payload_commission = payloadCommission;

                  textToSign = (0, _internal.getUnitHashToSign)(unit);

                  unit.authors[0].authentifiers = {};
                  unit.authors[0].authentifiers[path] = (0, _internal.sign)(textToSign, privKeyBuf);

                  unit.messages = [].concat((0, _toConsumableArray3.default)(unitMessages));
                  unit.unit = (0, _internal.getUnitHash)(unit);

                  return _context2.abrupt('return', unit);

                case 59:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function message(_x4, _x5) {
          return _ref.apply(this, arguments);
        }

        return message;
      }()
    };

    this.post = {
      message: function () {
        var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(app, payload, options) {
          var unit;
          return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  _context3.next = 2;
                  return self.compose.message(app, payload, options);

                case 2:
                  unit = _context3.sent;
                  return _context3.abrupt('return', self.broadcast(unit));

                case 4:
                case 'end':
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        }));

        function message(_x7, _x8, _x9) {
          return _ref5.apply(this, arguments);
        }

        return message;
      }()
    };

    (0, _keys2.default)(_expandApi2.default).forEach(function (funcName) {
      _expandApi2.default[funcName].bind(_this.api);
    });

    (0, _assign2.default)(this.api, (0, _internal.mapAPI)(_api2.default, requestAsync), _expandApi2.default);
    (0, _assign2.default)(this.compose, (0, _internal.mapAPI)(_apps2.default, this.compose.message));
    (0, _assign2.default)(this.post, (0, _internal.mapAPI)(_apps2.default, this.post.message));
  }

  (0, _createClass3.default)(Client, [{
    key: 'broadcast',
    value: function () {
      var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(unit) {
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.api.postJoint({ unit: unit });

              case 2:
                return _context4.abrupt('return', unit.unit);

              case 3:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function broadcast(_x10) {
        return _ref6.apply(this, arguments);
      }

      return broadcast;
    }()
  }, {
    key: 'getCachedWitnesses',
    value: function () {
      var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (!this.cachedWitnesses) {
                  _context5.next = 2;
                  break;
                }

                return _context5.abrupt('return', this.cachedWitnesses);

              case 2:
                _context5.next = 4;
                return this.api.getWitnesses();

              case 4:
                this.cachedWitnesses = _context5.sent;
                return _context5.abrupt('return', this.cachedWitnesses);

              case 6:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function getCachedWitnesses() {
        return _ref7.apply(this, arguments);
      }

      return getCachedWitnesses;
    }()
  }, {
    key: 'onConnect',
    value: function onConnect(cb) {
      this.client.onConnect(cb);
    }
  }, {
    key: 'subscribe',
    value: function subscribe(cb) {
      this.client.subscribe(cb);
    }
  }, {
    key: 'justsaying',
    value: function justsaying(subject, body) {
      this.client.justsaying(subject, body);
    }
  }, {
    key: 'close',
    value: function close() {
      this.client.close();
    }
  }]);
  return Client;
}();

exports.default = Client;
module.exports = exports.default;