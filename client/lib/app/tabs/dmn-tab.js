'use strict';

var debug = require('debug')('bpmn-tab');

var inherits = require('inherits');

var Tab = require('base/components/Tab');

var DmnJS = require('bpmn-js/lib/Modeler');


function DmnTab(options) {

  if (!(this instanceof DmnTab)) {
    return new DmnTab(options);
  }

  Tab.call(this, options);

  var actions = options.actions;

  var $el = document.createElement('div');
  $el.textContent = 'FOOO BAR ' + options.id;

  var modeler = this.modeler = new DmnJS({ container: $el });

  var opened = false;

  function updateEditState() {

    actions.emit('tools:update-edit-state', this, {
      undo: true
    });
  }


  this.mount = function(node) {

    var args = arguments;

    debug('append', options.id, args);

    node.appendChild($el);

    if (!opened) {
      modeler.createDiagram(function() {
        updateEditState();
      });
    } else {
      updateEditState();
    }
  };

  this.unmount = function(node) {
    debug('remove', options.id, arguments);

    node.removeChild($el);
  };

  this.closeTab = function() {
    debug('closeTab');

    actions.emit('tab:close', this);
  };

  this.toggleProperties = function() {

    actions.emit('layout:update', {
      propertiesPanel: {
        open: !options.layout.propertiesPanel.open
      }
    });
  };

  this.render = function() {

    var compose = this.compose;

    var html =
      <div className="FOOO" key={ options.id }>
        <h1>I am BPMN --- the { options.id } TAB!</h1>
        <div class="canvas"
             onAppend={ compose('mount') }
             onRemove={ compose('unmount') }>
        </div>
        {
          options.layout.propertiesPanel.open
            ? <div onClick={ compose('toggleProperties') }>Close Panel</div>
            : <div onClick={ compose('toggleProperties') }>Open Panel</div>
        }
        <button onClick={ compose('closeTab') }>Close me!</button>
      </div>;

    return html;
  };

  this.updateEditState = updateEditState;
}

inherits(DmnTab, Tab);

module.exports = DmnTab;