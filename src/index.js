'use strict';

import Constants from './constants';
import Middleware from './middleware';
import Scripts from './scripts';

const Status = Constants.Status;
const callAPI = Middleware.callAPI;
const shouldCallAPI = Scripts.shouldCallAPI;

export {
  Status as Status,
  callAPI as callAPI,
  shouldCallAPI as shouldCallAPI
};

export default {
  Status,
  callAPI,
  shouldCallAPI
};
