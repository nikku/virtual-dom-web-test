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

    console.log('show view', type);

    actions.emit('changed');
  };

  this.render = function() {

    var compose = this.compose;

    var html =
      <div className="bpmn-tab tabbed">
        <div className="content">
          { h(activeView) }
        </div>

        <div className="tabs">
          <div className={ 'tab ' + (activeView === views['diagram'] ? 'active' : '') }
               onClick={ compose('showView', 'diagram') }>
            Diagram
          </div>
          <div className={ 'tab ' + (activeView === views['xml'] ? 'active' : '') }
               onClick={ compose('showView', 'xml') }>
           XML
         </div>
        </div>
      </div>;

    return html;
  };

}

inherits(BpmnTab, Tab);

module.exports = BpmnTab;