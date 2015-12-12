'use strict';

var inherits = require('inherits');

var Editor = require('./Editor');

var BpmnJS = require('bpmn-js/lib/Modeler');

var debug = require('debug')('bpmn-editor');

var domify = require('domify');

var dragger = require('util/dragger');

var copy = require('util/copy');


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

  this.resizeProperties = dragger(function onDrag(panelLayout, event, delta) {

    var oldWidth = panelLayout.open ? panelLayout.width : 0;

    var newWidth = Math.max(oldWidth + delta.x * -1, 0);

    actions.emit('layout:update', {
      propertiesPanel: {
        open: newWidth > 25,
        width: newWidth
      }
    });
  });

  this.toggleProperties = function() {

    var config = options.layout.propertiesPanel;

    actions.emit('layout:update', {
      propertiesPanel: {
        open: !config.open,
        width: !config.open ? (config.width > 25 ? config.width : 250) : config.width
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
               onDragstart={ this.compose('resizeProperties', copy(propertiesLayout)) }>
            Properties Panel
          </div>
        </div>
      </div>
    );
  };
}

inherits(BpmnEditor, Editor);

module.exports = BpmnEditor;