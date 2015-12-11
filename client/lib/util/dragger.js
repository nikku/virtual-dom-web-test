'use strict';

var slice = require('util/slice');

var domify = require('domify');


/**
 * Add a dragger that calls back the passed function with
 * { args..., event, delta } on drag.
 *
 * @param {Function} fn
 *
 * @return {Function} drag start callback function
 */
function dragger(fn) {

  var self;
  var extraArgs;

  function onDrag(event) {

    // suppress drag end event
    if (event.x === 0) {
      return;
    }

    var args = extraArgs.concat([ event, { x: event.offsetX, y: event.offsetY } ]);

    // call provided fn with extraArgs..., event, delta
    return fn.apply(self, args);
  }

  /** drag start */
  return function() {

    // (0) extract extra arguments (extraArgs..., event)
    var args = slice(arguments),
        event = args.pop();

    self = this;
    extraArgs = args;

    // (1) prevent preview image
    event.dataTransfer.setDragImage(emptyCanvas(), 0, 0);

    // (2) setup drag listeners
    var target = event.target;


    // detach on end
    var onEnd = function() {
      target.removeEventListener('drag', onDrag);
      target.removeEventListener('dragend', onEnd);
    };

    // attach drag + cleanup event
    target.addEventListener('drag', onDrag);
    target.addEventListener('dragend', onEnd);
  };
}

module.exports = dragger;


function emptyCanvas() {
  return domify('<canvas width="0" height="0" />');
}