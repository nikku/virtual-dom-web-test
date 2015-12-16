'use strict';

var slice = require('util/slice');

var Actions = require('base/actions');


function MockActions() {

  var actions = new Actions();

  this.registeredListeners = [];

  this.recordedEvents = [];

  this.on = function() {

    var args = slice(arguments);

    this.registeredListeners.push(args);

    actions.on.apply(actions, args);
  };

  this.emit = function() {

    var args = slice(arguments);

    this.recordedEvents.push(args);

    actions.emit.apply(actions, args);
  };

  this.clear = function() {
    this.recordedEvents.length = 0;
    this.registeredListeners.length = 0;
  };
}

module.exports = MockActions;