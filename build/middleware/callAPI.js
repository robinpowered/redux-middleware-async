'use strict';

/**
 * Middleware that looks for a 'callAPI' property on the action.
 *
 * callAPI should be a function with parameters: (state, optimizedParams).
 * Dispatches the action twice: once with an appended status of 'request', then
 * again with an appended status based on the result of running the `callAPI` function.
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
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
      var optimizeParams = action.optimizeParams;


      if (typeof callAPI !== 'function') {
        // Normal action: pass it on
        return next(action);
      }

      var optimizedParams;
      if (typeof optimizeParams === 'function') {
        optimizedParams = optimizeParams(getState());
      }

      if (!shouldCallAPI(getState(), optimizedParams)) {
        return Promise.reject(new Error('Not calling API: shouldCallAPI flag was set as false.'));
      }

      dispatch(Object.assign({}, payload, {
        type: type,
        status: Status.REQUEST
      }));

      var dispatchError = function dispatchError(error) {
        return dispatch(Object.assign({}, payload, {
          error: error,
          type: type,
          status: Status.FAILURE
        }));
      };

      var dispatchSuccess = function dispatchSuccess(response) {
        return dispatch(Object.assign({}, payload, {
          response: response,
          type: type,
          status: Status.SUCCESS
        }));
      };

      return callAPI(getState(), optimizedParams).then(dispatchSuccess, dispatchError);
    };
  };
}

exports.default = callAPI;