'use strict';

var inherits = require('inherits');

var ensureOpts = require('util/ensure-opts');

var BaseComponent = require('base/component');


function Editor(options) {

  BaseComponent.call(this);

  ensureOpts([ 'events' ], options);

  this.updateEditorActions = function(state) {
    options.events.emit('tools:update-edit-state', this, state);
  };
}

inherits(Editor, BaseComponent);

module.exports = Editor;