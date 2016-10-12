'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function shouldCallAPI(state, expiresInSeconds) {
  if (!state) {
    return true;
  } else if (state._isFetching) {
    return false;
  } else if (state._didInvalidate) {
    return true;
  } else if (!expiresInSeconds) {
    return false;
  } else if (state._lastUpdated) {
    return state._lastUpdated + expiresInSeconds * 1000 < Date.now();
  } else {
    return true;
  }
}

exports.default = shouldCallAPI;