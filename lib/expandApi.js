'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var getSymbolByAsset = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(tokenRegistryAddress, asset) {
    var aaStateVars;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(asset === null || asset === 'base')) {
              _context.next = 2;
              break;
            }

            return _context.abrupt('return', 'GBYTE');

          case 2:
            if (!(typeof asset !== 'string')) {
              _context.next = 4;
              break;
            }

            return _context.abrupt('return', null);

          case 4:
            if (_utils2.default.isValidAddress(tokenRegistryAddress)) {
              _context.next = 6;
              break;
            }

            return _context.abrupt('return', null);

          case 6:
            _context.next = 8;
            return this.getAaStateVars({
              address: tokenRegistryAddress,
              var_prefix: 'a2s_' + asset
            });

          case 8:
            aaStateVars = _context.sent;

            if (!('a2s_' + asset in aaStateVars)) {
              _context.next = 11;
              break;
            }

            return _context.abrupt('return', aaStateVars['a2s_' + asset]);

          case 11:
            return _context.abrupt('return', asset.replace(/[+=]/, '').substr(0, 6));

          case 12:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function getSymbolByAsset(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var getAssetBySymbol = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(tokenRegistryAddress, symbol) {
    var aaStateVars;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!(typeof symbol !== 'string')) {
              _context2.next = 2;
              break;
            }

            return _context2.abrupt('return', null);

          case 2:
            if (!(symbol === 'GBYTE' || symbol === 'MBYTE' || symbol === 'KBYTE' || symbol === 'BYTE')) {
              _context2.next = 4;
              break;
            }

            return _context2.abrupt('return', 'base');

          case 4:
            if (_utils2.default.isValidAddress(tokenRegistryAddress)) {
              _context2.next = 6;
              break;
            }

            return _context2.abrupt('return', null);

          case 6:
            _context2.next = 8;
            return this.getAaStateVars({
              address: tokenRegistryAddress,
              var_prefix: 's2a_' + symbol
            });

          case 8:
            aaStateVars = _context2.sent;

            if (!('s2a_' + symbol in aaStateVars)) {
              _context2.next = 11;
              break;
            }

            return _context2.abrupt('return', aaStateVars['s2a_' + symbol]);

          case 11:
            return _context2.abrupt('return', null);

          case 12:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function getAssetBySymbol(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = { getSymbolByAsset: getSymbolByAsset, getAssetBySymbol: getAssetBySymbol };
module.exports = exports.default;