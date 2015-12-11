'use strict';

var inherits = require('inherits');

var Editor = require('./Editor');

var BpmnJS = require('bpmn-js/lib/Modeler');

var debug = require('debug')('bpmn-editor');

var domify = require('domify');

var dragger = require('util/dragger');


function BpmnEditor(options) {

  Editor.call(this, options);

  var actions = options.actions;

  var $el = domify('<div class="diagram-container"></div>');

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

  this.resizeProperties = dragger(function onDrag(event, delta) {

    var newWidth = Math.max(options.layout.propertiesPanel.width + delta.x * -1, 0);

    if (newWidth < 25) {
      newWidth = 0;
    }

    actions.emit('layout:update', {
      propertiesPanel: {
        open: newWidth > 0,
        width: newWidth
      }
    });
  });

  this.toggleProperties = function() {

    var config = options.layout.propertiesPanel;

    actions.emit('layout:update', {
      propertiesPanel: {
        open: !config.open,
        width: !config.open ? (config.width || 250) : config.width
      }
    });
  };

  this.render = function() {

    var propertiesLayout = options.layout.propertiesPanel;

    var propertiesStyle = {
      width: (propertiesLayout.open ? propertiesLayout.width : 0) + 'px'
    };

    return (
      <div className="bpmn-editor" key={ options.id + '#bpmn' }>
        <div className="canvas"
             onAppend={ this.compose('mount') }
             onRemove={ this.compose('unmount') }>
        </div>
        <div className="properties" style={ propertiesStyle }>
          <div className="toggle"
               ref="properties-toggle"
               draggable="true"
               onClick={ this.compose('toggleProperties') }
               onDragstart={ this.compose('resizeProperties') }>
            { (propertiesLayout.open ? 'Close' : 'Open') + ' Panel' }
          </div>
        </div>
      </div>
    );
  };
}

inherits(BpmnEditor, Editor);

module.exports = BpmnEditor;