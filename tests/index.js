'use strict';

import sinon from 'sinon';
import test from 'tape';
import {
  Status,
  callAPI
} from '../build';

// Global mock payload
const payload = {
  foo: 'bar'
};

// Mock api call as promise with external control
function createMockAPICallPromise () {
  var resolve, reject;
  var mockAPICall = new Promise((resolver, rejecter) => {
    resolve = resolver;
    reject = rejecter;
  });

  return {
    resolve,
    reject,
    mockAPICall
  };
};

// Mock action using mock api call
function createMockActionWithPromise (mockAPICall, shouldCallAPI = true) {
  return {
    type: 'MOCK_ACTION',
    shouldCallAPI: () => shouldCallAPI,
    callAPI: () => mockAPICall,
    payload
  };
};

// Mock store containing our disaptch spy
function createMockStore () {
  const mockStoreState = {
    foo: 'fiz',
    bar: 'baz'
  };
  var dispatch = sinon.spy();

  return {
    dispatch,
    getState: () => mockStoreState
  };
};

/*
 * SUCCESSFUL CALL
 */
test('Checking a successful API call', (t) => {
  var mockPromise = createMockAPICallPromise();
  var mockAction = createMockActionWithPromise(mockPromise.mockAPICall);
  var mockStore = createMockStore();
  const mockNext = sinon.spy();

  // Simulate call
  var constructedMiddleware = callAPI(mockStore)(mockNext);
  constructedMiddleware(mockAction);

  var firstCall = mockStore.dispatch.firstCall;
  var firstCallResult = mockStore.dispatch.calledWith({
    type: 'MOCK_ACTION',
    status: Status.REQUEST,
    ...payload
  });

  t.equal(!!firstCall, true, 'Checking for a first call');
  t.equal(firstCallResult, true, 'Checking args of first call');

  // Resolve the promise to simulate api call succeeding
  mockPromise.resolve('foobar');

  process.nextTick(() => {
    var secondCall = mockStore.dispatch.secondCall;
    var secondCallResult = mockStore.dispatch.calledWith({
      type: 'MOCK_ACTION',
      status: Status.SUCCESS,
      ...payload,
      response: 'foobar'
    });
    t.equal(!!secondCall, true, 'Checking for a second call');
    t.equal(secondCallResult, true, 'Checking args of second call');
    t.end();
  });
});

/*
 * FAILURE CALL
 */
test('Checking a failed API call', (t) => {
  var mockPromise = createMockAPICallPromise();
  var mockAction = createMockActionWithPromise(mockPromise.mockAPICall);
  var mockStore = createMockStore();
  const mockNext = sinon.spy();

  // Simulate call
  var constructedMiddleware = callAPI(mockStore)(mockNext);
  constructedMiddleware(mockAction);

  var firstCall = mockStore.dispatch.firstCall;
  var firstCallResult = mockStore.dispatch.calledWith({
    type: 'MOCK_ACTION',
    status: Status.REQUEST,
    ...payload
  });

  t.equal(!!firstCall, true, 'Checking for a first call');
  t.equal(firstCallResult, true, 'Checking args of first call');

  // Resolve the promise to simulate api call failing
  mockPromise.reject('Some error message');

  process.nextTick(() => {
    var secondCall = mockStore.dispatch.secondCall;
    var secondCallResult = mockStore.dispatch.calledWith({
      type: 'MOCK_ACTION',
      status: Status.FAILURE,
      error: 'Some error message',
      ...payload
    });
    t.equal(!!secondCall, true, 'Checking for a second call');
    t.equal(secondCallResult, true, 'Checking args of second call');
    t.end();
  });
});

/*
 * shouldCallAPI FALSE CALL
 */
test('Checking an API call with `shouldCallAPI` set to false', (t) => {
  var mockPromise = createMockAPICallPromise();
  var mockAction = createMockActionWithPromise(mockPromise.mockAPICall, false);
  var mockStore = createMockStore();
  const mockNext = sinon.spy();

  // Simulate call
  var constructedMiddleware = callAPI(mockStore)(mockNext);
  constructedMiddleware(mockAction);

  // shouldCallAPI flag was set to false, no call should have happened.
  var firstCall = mockStore.dispatch.firstCall;
  t.equal(!!firstCall, false, 'Checking for a first call');
  t.end();
});
