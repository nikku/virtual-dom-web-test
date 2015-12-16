'use strict';

var debug = require('debug')('bpmn-tab');

var inherits = require('inherits');

var h = require('vdom/h');

var ensureOpts = require('util/ensure-opts');

var Tab = require('base/components/tab');

var BpmnEditor = require('./views/bpmn-editor'),
    XMLEditor = require('./views/xml-editor');


function BpmnTab(options) {

  if (!(this instanceof BpmnTab)) {
    return new BpmnTab(options);
  }

  Tab.call(this, options);

  ensureOpts([ 'events' ], options);

  var views = {
    diagram: new BpmnEditor(options),
    xml: new XMLEditor(options)
  };

  var activeView = views['diagram'];

  var events = options.events;

  this.showView = function(type) {

    if (!views[type]) {
      throw new Error('no view ' + type);
    }

    activeView = views[type];

    debug('show view %s', type);

    events.emit('changed');
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
               tabIndex="0"
               onClick={ compose('showView', 'diagram') }>
            Diagram
          </div>
          <div className={ 'tab ' + (activeView === views['xml'] ? 'active' : '') }
               tabIndex="0"
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