'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _wif = require('wif');

var _wif2 = _interopRequireDefault(_wif);

var _internal = require('./internal');

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getChash160(obj) {
  var sourceString = Array.isArray(obj) && obj.length === 2 && obj[0] === 'autonomous agent' ? (0, _internal.getJsonSourceString)(obj) : (0, _internal.getSourceString)(obj);
  return (0, _internal.chashGetChash160)(sourceString);
}

function toWif(privateKey, testnet) {
  var version = testnet ? 239 : 128;
  return _wif2.default.encode(version, privateKey, false);
}

function fromWif(string, testnet) {
  var version = testnet ? 239 : 128;
  return _wif2.default.decode(string, version);
}

function isValidAddress(address) {
  return typeof address === 'string' && address === address.toUpperCase() && address.length === 32 && (0, _internal.isChashValid)(address);
}

function signMessage(message) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var conf = (typeof options === 'undefined' ? 'undefined' : (0, _typeof3.default)(options)) === 'object' ? options : { wif: options };
  var privKeyBuf = conf.privateKey || fromWif(conf.wif, conf.testnet).privateKey;
  var pubkey = (0, _internal.toPublicKey)(privKeyBuf);
  var definition = conf.definition || ['sig', { pubkey: pubkey }];
  var address = conf.address || getChash160(definition);
  var path = conf.path || 'r';
  var version = conf.testnet ? _constants.VERSION_TESTNET : _constants.VERSION;

  var objUnit = {
    version: version,
    signed_message: message,
    authors: [{
      address: address,
      definition: definition
    }]
  };
  var textToSign = (0, _internal.getUnitHashToSign)(objUnit);
  objUnit.authors[0].authentifiers = {};
  objUnit.authors[0].authentifiers[path] = (0, _internal.sign)(textToSign, privKeyBuf);

  return objUnit;
}

exports.default = {
  getChash160: getChash160,
  toWif: toWif,
  fromWif: fromWif,
  isValidAddress: isValidAddress,
  signMessage: signMessage
};
module.exports = exports.default;