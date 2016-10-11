'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _constants = require('../constants');

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Status = _constants2.default.Status;

/**
 * Middleware that looks for a 'callAPI' property on the action.
 *
 * callAPI should be a function with parameters: (state, optimizedParams).
 * Dispatches the action twice: once with an appended status of 'request', then
 * again with an appended status based on the result of running the `callAPI` function.
 */
function callAPI(_ref) {
  var dispatch = _ref.dispatch;
  var getState = _ref.getState;

  return function (next) {
    return function (action) {
      var type = action.type;
      var callAPI = action.callAPI;
      var _action$shouldCallAPI = action.shouldCallAPI;
      var shouldCallAPI = _action$shouldCallAPI === undefined ? function () {
        return true;
      } : _action$shouldCallAPI;
      var _action$payload = action.payload;
      var payload = _action$payload === undefined ? {} : _action$payload;

      // if (typeof shouldCallAPI !== 'function') {
      //   // throw error or ignore
      // }

      if (typeof callAPI !== 'function') {
        // Normal action: pass it on
        return next(action);
      }

      if (!shouldCallAPI(getState())) {
        return Promise.reject(new Error('Not calling API: shouldCallAPI flag was set as false.'));
      }

      dispatch(_extends({}, payload, {
        type: type,
        status: Status.REQUEST
      }));

      var dispatchError = function dispatchError(error) {
        return dispatch(_extends({}, payload, {
          error: error,
          type: type,
          status: Status.FAILURE
        }));
      };

      var dispatchSuccess = function dispatchSuccess(response) {
        return dispatch(_extends({}, payload, {
          response: response,
          type: type,
          status: Status.SUCCESS
        }));
      };

      return callAPI(getState()).then(dispatchSuccess, dispatchError);
    };
  };
}

exports.default = callAPI;