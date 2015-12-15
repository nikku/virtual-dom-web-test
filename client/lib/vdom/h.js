'use strict';

var h = require('virtual-dom/h');

var createComponent = require('./create-component');

var isArray = require('lodash/lang/isArray'),
    isObject = require('lodash/lang/isObject'),
    isString = require('lodash/lang/isString'),
    isFunction = require('lodash/lang/isFunction'),
    forEach = require('lodash/collection/forEach');

var slice = require('util/slice'),
    bind = require('util/bind');

var RemoveHook = require('./hooks/remove'),
    AppendHook = require('./hooks/append'),
    ScrollToHook = require('./hooks/scroll-to');

var HOOKS = {
  onRemove: RemoveHook,
  onAppend: AppendHook,
  scrollTo: ScrollToHook
};

var ELEMENT_EVENTS = [
  'drag',
  'dragend',
  'dragenter',
  'dragexit',
  'dragleave',
  'dragover',
  'dragstart',
  'drop'
];

/**
 * A jsx compatible implementation of `virtual-dom/h`.
 *
 * @param {String|Function|Object} element
 * @param {Object} options
 * @param {Array...} children
 *
 * @return {VNode|Widget|Thunk}
 */
module.exports = function() {

  var args = slice(arguments),
      element = args.shift(),
      options = args.shift() || {},
      children = args;

  if (isString(element)) {
    // prepare actual hooks on element
    options = prepareHooks(options);

    return h(element, options, children);
  }

  if (isFunction(element)) {
    return createComponent(element, options, children).render();
  }

  if (isObject(element)) {
    // assume element is already a VNode, Widget or Thunk
    if (isFunction(element.render)) {
      return element.render();
    }

    return element;
  }

  throw new Error('element or constructor expected as first argument');
};

function canDelegate(eventName) {
  return ELEMENT_EVENTS.indexOf(eventName) === -1;
}

/**
 * Prepare hooks passed with a vdom element.
 *
 * @param {Object} options
 * @return {Object}
 */
function prepareHooks(options) {

  var newOptions = {};

  // apply well known hooks in
  // specific order
  forEach(HOOKS, function(wrap, key) {
    var value = options[key];

    if (!value) {
      return;
    }

    if (isArray(value)) {
      value = bind(value);
    }

    newOptions[key] = wrap(value);
  });


  // apply event handler hooks
  forEach(options, function(value, key) {

    var eventHandler = /^on[A-Z]+/.test(key),
        eventName;

    // hook already set
    if (newOptions[key]) {
      return;
    }

    if (eventHandler) {

      eventName = key.replace(/on/, '').toLowerCase();

      if (isArray(value)) {
        value = bind(value);
      }

      if (!isFunction(value)) {
        throw new Error(key + ' value must be fn');
      }

      if (canDelegate(eventName)) {
        key = 'ev-' + eventName;
      } else {
        key = 'on' + eventName;
      }
    }

    newOptions[key] = value;
  });

  return newOptions;
}