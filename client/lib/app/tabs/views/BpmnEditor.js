'use strict';

var inherits = require('inherits');

var Editor = require('./Editor');

var BpmnJS = require('bpmn-js/lib/Modeler');

var debug = require('debug')('bpmn-editor');


function BpmnEditor(options) {

  Editor.call(this, options);

  var actions = options.actions;

  var $el = document.createElement('div');
  $el.textContent = 'FOOO BAR ' + options.id;

  var modeler = this.modeler = new BpmnJS({ container: $el });

  var opened = false;

  var updateEditorActions = this.updateEditorActions;

  function updateEditState() {
    updateEditorActions({
      undo: false
    });
  }

  this.mount = function(node) {

    var args = arguments;

    debug('append', options.id, args);

    node.appendChild($el);

    if (!opened) {
      modeler.createDiagram(function() {
        opened = true;
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

  this.toggleProperties = function() {

    actions.emit('layout:update', {
      propertiesPanel: {
        open: !options.layout.propertiesPanel.open
      }
    });
  };

  this.render = function() {

    var compose = this.compose;

    return (
      <div className="bpmn-editor" key={ options.id + '#bpmn' }>
        <div class="canvas"
             onAppend={ compose('mount') }
             onRemove={ compose('unmount') }>
        </div>
        {
          options.layout.propertiesPanel.open
            ? <div ref="properties-toggle" onClick={ compose('toggleProperties') }>Close Panel</div>
            : <div ref="properties-toggle" onClick={ compose('toggleProperties') }>Open Panel</div>
        }
      </div>
    );
  };
}

inherits(BpmnEditor, Editor);

module.exports = BpmnEditor;