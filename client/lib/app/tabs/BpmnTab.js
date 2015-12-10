'use strict';

var debug = require('debug')('bpmn-tab');

var inherits = require('inherits');

var h = require('vdom/h');

var Tab = require('base/components/Tab');

var BpmnEditor = require('./views/BpmnEditor'),
    XMLEditor = require('./views/XMLEditor');


function BpmnTab(options) {

  if (!(this instanceof BpmnTab)) {
    return new BpmnTab(options);
  }

  Tab.call(this, options);

  var views = {
    diagram: new BpmnEditor(options),
    xml: new XMLEditor(options)
  };

  var activeView = views['diagram'];

  /**
   * Called from the editor to execute an action
   * if this tab is the active one.
   *
   * @param {String} action
   * @param {Object} options
   */
  this.triggerAction = function(action) {

  };

  var actions = options.actions;

  this.closeTab = function() {
    debug('closeTab');

    actions.emit('tab:close', this);
  };

  this.showView = function(type) {
    activeView = views[type];

    actions.emit('changed');
  };

  this.render = function() {

    var compose = this.compose;

    var html =
      <div className="FOOO">
        <h1>I am BPMN --- the { options.id } TAB!</h1>

        { h(activeView) }

        <button onClick={ compose('showView', 'xml') }>XML</button>
        <button onClick={ compose('showView', 'diagram') }>Diagram</button>

        <button onClick={ compose('closeTab') }>Close me!</button>

      </div>;

    return html;
  };

}

inherits(BpmnTab, Tab);

module.exports = BpmnTab;