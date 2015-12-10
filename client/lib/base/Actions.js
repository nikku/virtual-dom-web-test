'use strict';

var debug = require('debug')('actions');

var inherits = require('inherits');

var Events = require('events');

var isArray = require('lodash/lang/isArray');

var slice = require('util/slice');


/**
 * The main hub for stuff happening inside an editor
 */
function Actions() {
  Events.call(this);


  /**
   * Compose an editor action callback method.
   *
   * @param {String|Array<String, args...>} action
   * @param {Object...} additialArguments
   *
   * @return {Function}
   */
  this.compose = function(action) {

    var self = this,
        args;

    // using varargs
    if (arguments.length > 1) {
      args = slice(arguments);
    } else
    if (!isArray(action)) {
      args = [ action ];
    } else {
      args = action;
    }

    return function actionHandler() {
      var realArgs = args.concat(slice(arguments));

      debug('invoke', realArgs);

      self.emit.apply(self, realArgs);
    };
  };
}

inherits(Actions, Events);


module.exports = Actions;