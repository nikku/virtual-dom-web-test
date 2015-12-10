'use strict';

global.h = require('vdom/h');

var isString = require('lodash/lang/isString');

var treeSelect = require('vtree-select');


function selectAll(selector, element) {
  return treeSelect(selector)(element);
}

module.exports.selectAll = selectAll;


function select(selector, element) {
  return selectAll(selector, element)[0];
}

module.exports.select = select;


function simulateEvent(element, event) {

  var eventName;

  if (isString(event)) {
    eventName = event;
    event = { type: eventName };
  } else {
    eventName = event.type;
  }

  var eventHook = element.hooks['ev-' + eventName];

  if (!eventHook) {
    throw new Error('no ' + eventName + ' handler registered');
  }

  var fn = eventHook.value;

  fn(event);
}

module.exports.simulateEvent = simulateEvent;