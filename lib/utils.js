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

function validateSignedMessage(objSignedMessage) {
  var address = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var message = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  // https://github.com/byteball/aa-channels-lib/blob/master/modules/signed_message.js
  if ((typeof objSignedMessage === 'undefined' ? 'undefined' : (0, _typeof3.default)(objSignedMessage)) !== 'object') return false;
  if ((0, _internal.hasFieldsExcept)(objSignedMessage, ['signed_message', 'authors', 'last_ball_unit', 'timestamp', 'version'])) return false;
  if (!('signed_message' in objSignedMessage)) return false;
  if (message && message !== objSignedMessage.signed_message) return false;
  if ('version' in objSignedMessage && !(_constants.VERSION === objSignedMessage.version || _constants.VERSION_TESTNET === objSignedMessage.version)) return false;
  var authors = objSignedMessage.authors;

  if (!(0, _internal.isNonemptyArray)(authors)) return false;
  if (authors.length > 1) return false;
  var objAuthor = authors[0];
  if ((0, _internal.hasFieldsExcept)(objAuthor, ['address', 'definition', 'authentifiers'])) return false;
  if (!isValidAddress(objAuthor.address)) return false;
  if (address && address !== objAuthor.address) return false;
  if (!(0, _internal.isNonemptyObject)(objAuthor.authentifiers)) return false;
  var bHasDefinition = 'definition' in objAuthor;
  if (!bHasDefinition) return false;
  var definition = objAuthor.definition;

  if (!Array.isArray(definition)) return false;
  if (definition[0] !== 'sig') return false;
  if ((0, _typeof3.default)(definition[1]) !== 'object') return false;
  try {
    if (getChash160(definition) !== objAuthor.address) return false;
  } catch (e) {
    return false;
  }
  var unitHashToSign = void 0;
  try {
    unitHashToSign = (0, _internal.getSignedPackageHashToSign)(objSignedMessage);
  } catch (e) {
    return false;
  }
  var signature = objAuthor.authentifiers.r;
  if (!signature) return false;
  return (0, _internal.verify)(unitHashToSign, signature, definition[1].pubkey);
}

exports.default = {
  getChash160: getChash160,
  toWif: toWif,
  fromWif: fromWif,
  isValidAddress: isValidAddress,
  signMessage: signMessage,
  validateSignedMessage: validateSignedMessage
};
module.exports = exports.default;