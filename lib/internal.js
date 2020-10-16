'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toPublicKey = exports.sign = exports.mapAPI = exports.createPaymentMessage = exports.camelCase = undefined;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var createPaymentMessage = exports.createPaymentMessage = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(client, asset, outputs, address, payloadLength, lastBallMci) {
    var amount, targetAmount, coinsForAmount, inputs, payload;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            amount = outputs.reduce(function (a, b) {
              return a + b.amount;
            }, 0);
            targetAmount = asset ? amount : 700 + payloadLength + amount;
            _context.next = 4;
            return client.api.pickDivisibleCoinsForAmount({
              addresses: [address],
              last_ball_mci: lastBallMci,
              amount: targetAmount,
              spend_unconfirmed: 'own',
              asset: asset
            });

          case 4:
            coinsForAmount = _context.sent;
            inputs = coinsForAmount.inputs_with_proofs.map(function (input) {
              return input.input;
            });
            payload = {
              inputs: inputs,
              outputs: [{ address: address, amount: coinsForAmount.total_amount - amount }].concat((0, _toConsumableArray3.default)(outputs))
            };


            if (asset) {
              payload.asset = asset;
              if (payload.outputs[0].amount === 0)
                // amount 0 output is not valid
                payload.outputs = payload.outputs.slice(1);
            }

            return _context.abrupt('return', {
              app: 'payment',
              payload_hash: '--------------------------------------------',
              payload_location: 'inline',
              payload: payload
            });

          case 9:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function createPaymentMessage(_x, _x2, _x3, _x4, _x5, _x6) {
    return _ref.apply(this, arguments);
  };
}();

exports.sortOutputs = sortOutputs;
exports.getSourceString = getSourceString;
exports.getJsonSourceString = getJsonSourceString;
exports.isChashValid = isChashValid;
exports.chashGetChash160 = chashGetChash160;
exports.getLength = getLength;
exports.getHeadersSize = getHeadersSize;
exports.getTotalPayloadSize = getTotalPayloadSize;
exports.getBase64Hash = getBase64Hash;
exports.getUnitHashToSign = getUnitHashToSign;
exports.getUnitHash = getUnitHash;

var _secp256k = require('secp256k1');

var _secp256k2 = _interopRequireDefault(_secp256k);

var _createHash = require('create-hash');

var _createHash2 = _interopRequireDefault(_createHash);

var _thirtyTwo = require('thirty-two');

var _thirtyTwo2 = _interopRequireDefault(_thirtyTwo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PARENT_UNITS_SIZE = 2 * 44;
var PARENT_UNITS_KEY_SIZE = 'parent_units'.length;
var SIGNATURE_SIZE = 88;
var PI = '14159265358979323846264338327950288419716939937510';
var STRING_JOIN_CHAR = '\x00';
var ZERO_STRING = '00000000';
var ARR_RELATIVE_OFFSETS = PI.split('');

var camelCase = exports.camelCase = function camelCase(input) {
  return input.split('/').pop().split('_').map(function (p) {
    return p.charAt(0).toUpperCase() + p.slice(1);
  }).join('').replace(/^\w/, function (c) {
    return c.toLowerCase();
  });
};

function sortOutputs(a, b) {
  var localeCompare = a.address.localeCompare(b.address);
  return localeCompare || a.amount - b.amount;
}

var mapAPI = exports.mapAPI = function mapAPI(api, impl) {
  return (0, _keys2.default)(api).reduce(function (prev, name) {
    return (0, _extends4.default)({}, prev, (0, _defineProperty3.default)({}, camelCase(name), function () {
      for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
        params[_key] = arguments[_key];
      }

      var cb = params.length !== 0 ? params[params.length - 1] : null;

      if (typeof cb === 'function') {
        params = params.slice(0, -1); // eslint-disable-line no-param-reassign
      } else {
        cb = null;
      }

      var promise = impl.apply(undefined, [name].concat((0, _toConsumableArray3.default)(params)));

      if (!cb) return promise;
      return promise.then(function (result) {
        return cb(null, result);
      }).catch(function (err) {
        return cb(err, null);
      });
    }));
  }, {});
};

var sign = exports.sign = function sign(hash, privKey) {
  var res = _secp256k2.default.sign(hash, privKey);
  return res.signature.toString('base64');
};

function buffer2bin(buf) {
  var bytes = [];
  for (var i = 0; i < buf.length; i += 1) {
    var bin = buf[i].toString(2);
    if (bin.length < 8)
      // pad with zeros
      bin = ZERO_STRING.substring(bin.length, 8) + bin;
    bytes.push(bin);
  }
  return bytes.join('');
}

function bin2buffer(bin) {
  var len = bin.length / 8;
  var buf = Buffer.alloc(len);
  for (var i = 0; i < len; i += 1) {
    buf[i] = parseInt(bin.substr(i * 8, 8), 2);
  }return buf;
}

function checkLength(chashLength) {
  if (chashLength !== 160 && chashLength !== 288) throw Error('unsupported c-hash length: ' + chashLength);
}

function getChecksum(cleanData) {
  var fullChecksum = (0, _createHash2.default)('sha256').update(cleanData).digest();
  return Buffer.from([fullChecksum[5], fullChecksum[13], fullChecksum[21], fullChecksum[29]]);
}

function getNakedUnit(objUnit) {
  var objNakedUnit = JSON.parse((0, _stringify2.default)(objUnit));
  delete objNakedUnit.unit;
  delete objNakedUnit.headers_commission;
  delete objNakedUnit.payload_commission;
  delete objNakedUnit.main_chain_index;

  if (objNakedUnit.messages) {
    for (var i = 0; i < objNakedUnit.messages.length; i += 1) {
      delete objNakedUnit.messages[i].payload;
      delete objNakedUnit.messages[i].payload_uri;
    }
  }
  return objNakedUnit;
}

/**
 * Converts the argument into a string by mapping data types to a prefixed string and concatenating all fields together.
 * @param obj the value to be converted into a string
 * @returns {string} the string version of the value
 */
function getSourceString(obj) {
  var arrComponents = [];
  function extractComponents(variable) {
    if (variable === null) throw Error('null value in ' + (0, _stringify2.default)(obj));
    switch (typeof variable === 'undefined' ? 'undefined' : (0, _typeof3.default)(variable)) {
      case 'string':
        arrComponents.push('s', variable);
        break;
      case 'number':
        arrComponents.push('n', variable.toString());
        break;
      case 'boolean':
        arrComponents.push('b', variable.toString());
        break;
      case 'object':
        if (Array.isArray(variable)) {
          if (variable.length === 0) throw Error('empty array in ' + (0, _stringify2.default)(obj));
          arrComponents.push('[');
          for (var i = 0; i < variable.length; i += 1) {
            extractComponents(variable[i]);
          }arrComponents.push(']');
        } else {
          var keys = (0, _keys2.default)(variable).sort();
          if (keys.length === 0) throw Error('empty object in ' + (0, _stringify2.default)(obj));
          keys.forEach(function (key) {
            if (typeof variable[key] === 'undefined') throw Error('undefined at ' + key + ' of ' + (0, _stringify2.default)(obj));
            arrComponents.push(key);
            extractComponents(variable[key]);
          });
        }
        break;
      default:
        throw Error('hash: unknown type=' + (typeof variable === 'undefined' ? 'undefined' : (0, _typeof3.default)(variable)) + ' of ' + variable + ', object: ' + (0, _stringify2.default)(obj));
    }
  }

  extractComponents(obj);
  return arrComponents.join(STRING_JOIN_CHAR);
}

function getJsonSourceString(obj) {
  function stringify(variable) {
    if (variable === null) throw Error('null value in ' + (0, _stringify2.default)(obj));
    switch (typeof variable === 'undefined' ? 'undefined' : (0, _typeof3.default)(variable)) {
      case 'string':
        return (0, _stringify2.default)(variable);
      case 'number':
      case 'boolean':
        return variable.toString();
      case 'object':
        if (Array.isArray(variable)) {
          if (variable.length === 0) throw Error('empty array in ' + (0, _stringify2.default)(obj));
          return '[' + variable.map(stringify).join(',') + ']';
        }
        var keys = (0, _keys2.default)(variable).sort(); // eslint-disable-line no-case-declarations
        if (keys.length === 0) throw Error('empty object in ' + (0, _stringify2.default)(obj));
        return '{' + keys.map(function (key) {
          return (0, _stringify2.default)(key) + ':' + stringify(variable[key]);
        }).join(',') + '}';
      default:
        throw Error('hash: unknown type=' + (typeof variable === 'undefined' ? 'undefined' : (0, _typeof3.default)(variable)) + ' of ' + variable + ', object: ' + (0, _stringify2.default)(obj));
    }
  }
  return stringify(obj);
}

function calcOffsets(chashLength) {
  checkLength(chashLength);
  var arrOffsets = [];
  var offset = 0;
  var index = 0;

  for (var i = 0; offset < chashLength; i += 1) {
    var relativeOffset = parseInt(ARR_RELATIVE_OFFSETS[i], 10);
    if (relativeOffset !== 0) {
      offset += relativeOffset;
      if (chashLength === 288) offset += 4;
      if (offset >= chashLength) break;
      arrOffsets.push(offset);
      index += 1;
    }
  }

  if (index !== 32) {
    throw Error('wrong number of checksum bits');
  }

  return arrOffsets;
}

var arrOffsets160 = calcOffsets(160);
var arrOffsets288 = calcOffsets(288);

function separateIntoCleanDataAndChecksum(bin) {
  var len = bin.length;
  var arrOffsets = void 0;
  if (len === 160) arrOffsets = arrOffsets160;else if (len === 288) arrOffsets = arrOffsets288;else throw Error('bad length=' + len + ', bin = ' + bin);
  var arrFrags = [];
  var arrChecksumBits = [];
  var start = 0;
  for (var i = 0; i < arrOffsets.length; i += 1) {
    arrFrags.push(bin.substring(start, arrOffsets[i]));
    arrChecksumBits.push(bin.substr(arrOffsets[i], 1));
    start = arrOffsets[i] + 1;
  }
  // add last frag
  if (start < bin.length) arrFrags.push(bin.substring(start));
  var binCleanData = arrFrags.join('');
  var binChecksum = arrChecksumBits.join('');
  return { cleanData: binCleanData, checksum: binChecksum };
}

function mixChecksumIntoCleanData(binCleanData, binChecksum) {
  if (binChecksum.length !== 32) throw Error('bad checksum length');
  var len = binCleanData.length + binChecksum.length;
  var arrOffsets = void 0;
  if (len === 160) arrOffsets = arrOffsets160;else if (len === 288) arrOffsets = arrOffsets288;else throw Error('bad length=' + len + ', clean data = ' + binCleanData + ', checksum = ' + binChecksum);
  var arrFrags = [];
  var arrChecksumBits = binChecksum.split('');
  var start = 0;
  for (var i = 0; i < arrOffsets.length; i += 1) {
    var end = arrOffsets[i] - i;
    arrFrags.push(binCleanData.substring(start, end));
    arrFrags.push(arrChecksumBits[i]);
    start = end;
  }
  // add last frag
  if (start < binCleanData.length) arrFrags.push(binCleanData.substring(start));
  return arrFrags.join('');
}

function getChash(data, chashLength) {
  checkLength(chashLength);
  var hash = (0, _createHash2.default)(chashLength === 160 ? 'ripemd160' : 'sha256').update(data, 'utf8').digest();
  var truncatedHash = chashLength === 160 ? hash.slice(4) : hash; // drop first 4 bytes if 160
  var checksum = getChecksum(truncatedHash);

  var binCleanData = buffer2bin(truncatedHash);
  var binChecksum = buffer2bin(checksum);
  var binChash = mixChecksumIntoCleanData(binCleanData, binChecksum);
  var chash = bin2buffer(binChash);
  return chashLength === 160 ? _thirtyTwo2.default.encode(chash).toString() : chash.toString('base64');
}

function isChashValid(encoded) {
  var encodedLength = encoded.length;
  var chash = void 0;
  if (encodedLength !== 32 && encodedLength !== 48)
    // 160/5 = 32, 288/6 = 48
    throw Error('wrong encoded length: ' + encodedLength);
  try {
    chash = encodedLength === 32 ? _thirtyTwo2.default.decode(encoded) : Buffer.from(encoded, 'base64');
  } catch (e) {
    console.log(e);
    return false;
  }
  var binChash = buffer2bin(chash);
  var separated = separateIntoCleanDataAndChecksum(binChash);
  var cleanData = bin2buffer(separated.cleanData);
  var checksum = bin2buffer(separated.checksum);
  return checksum.equals(getChecksum(cleanData));
}

function chashGetChash160(data) {
  return getChash(data, 160);
}

var toPublicKey = exports.toPublicKey = function toPublicKey(privKey) {
  return _secp256k2.default.publicKeyCreate(privKey).toString('base64');
};

function getLength(value, bWithKeys) {
  if (value === null) return 0;
  switch (typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value)) {
    case 'string':
      return value.length;
    case 'number':
      return 8;
    case 'object':
      {
        var len = 0;
        if (Array.isArray(value)) {
          value.forEach(function (element) {
            len += getLength(element, bWithKeys);
          });
        } else {
          (0, _keys2.default)(value).forEach(function (key) {
            if (typeof value[key] === 'undefined') throw Error('undefined at ' + key + ' of ' + (0, _stringify2.default)(value));
            if (bWithKeys) len += key.length;
            len += getLength(value[key], bWithKeys);
          });
        }
        return len;
      }
    case 'boolean':
      return 1;
    default:
      throw Error('unknown type=' + (typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value)) + ' of ' + value);
  }
}

function getHeadersSize(objUnit, bWithKeys) {
  if (objUnit.content_hash) throw Error('trying to get headers size of stripped unit');
  var objHeader = JSON.parse((0, _stringify2.default)(objUnit));
  delete objHeader.unit;
  delete objHeader.headers_commission;
  delete objHeader.payload_commission;
  delete objHeader.main_chain_index;
  delete objHeader.messages;
  delete objHeader.parent_units; // replaced with PARENT_UNITS_SIZE
  return getLength(objHeader, bWithKeys) + PARENT_UNITS_SIZE + (bWithKeys ? PARENT_UNITS_KEY_SIZE : 0) + SIGNATURE_SIZE; // unit is always single authored thus only has 1 signature in authentifiers
}

function getTotalPayloadSize(objUnit, bWithKeys) {
  if (objUnit.content_hash) throw Error('trying to get payload size of stripped unit');
  return getLength({ messages: objUnit.messages }, bWithKeys);
}

function getBase64Hash(obj, bJsonBased) {
  var sourceString = bJsonBased ? getJsonSourceString(obj) : getSourceString(obj);
  return (0, _createHash2.default)('sha256').update(sourceString, 'utf8').digest('base64');
}

function getUnitHashToSign(objUnit) {
  var objNakedUnit = getNakedUnit(objUnit);
  for (var i = 0; i < objNakedUnit.authors.length; i += 1) {
    delete objNakedUnit.authors[i].authentifiers;
  }var sourceString = getJsonSourceString(objNakedUnit);
  return (0, _createHash2.default)('sha256').update(sourceString, 'utf8').digest();
}

function getUnitContentHash(objUnit) {
  return getBase64Hash(getNakedUnit(objUnit), true);
}

function getUnitHash(objUnit) {
  if (objUnit.content_hash)
    // already stripped
    return getBase64Hash(getNakedUnit(objUnit), true);
  var objStrippedUnit = {
    content_hash: getUnitContentHash(objUnit),
    version: objUnit.version,
    alt: objUnit.alt,
    authors: objUnit.authors.map(function (author) {
      return { address: author.address };
    }) // already sorted
  };
  if (objUnit.witness_list_unit) objStrippedUnit.witness_list_unit = objUnit.witness_list_unit;else objStrippedUnit.witnesses = objUnit.witnesses;
  if (objUnit.parent_units) {
    objStrippedUnit.parent_units = objUnit.parent_units;
    objStrippedUnit.last_ball = objUnit.last_ball;
    objStrippedUnit.last_ball_unit = objUnit.last_ball_unit;
  }
  objStrippedUnit.timestamp = objUnit.timestamp;
  return getBase64Hash(objStrippedUnit, true);
}