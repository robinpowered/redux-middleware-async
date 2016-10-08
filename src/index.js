'use strict';

import Constants from './constants';
import Middleware from './middleware';
import Scripts from './scripts';

export default {
	Status: [Constants.Status],
  callAPI: [Middleware.callAPI],
  shouldCallAPI: [Scripts.shouldCallAPI]
};
