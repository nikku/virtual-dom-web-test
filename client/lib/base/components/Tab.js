'use strict';

var assign = require('lodash/object/assign');

var inherits = require('inherits');

var BaseComponent = require('../BaseComponent');


function Tab(options) {
  BaseComponent.call(this);

  assign(this, options);
}

inherits(Tab, BaseComponent);

module.exports = Tab;


/**
 * Trigger action on the tab.
 *
 * @param {String} action
 * @param {Object} options
 */
Tab.prototype.triggerAction = function() {};
