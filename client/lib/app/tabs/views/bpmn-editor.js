'use strict';

var inherits = require('inherits');

var Editor = require('./editor');

var BpmnJS = require('bpmn-js/lib/Modeler');

var debug = require('debug')('bpmn-editor');

var domify = require('domify');

var dragger = require('util/dragger');

var ensureOpts = require('util/ensure-opts');

var copy = require('util/copy');


function BpmnEditor(options) {

  Editor.call(this, options);

  ensureOpts([ 'logger', 'actions', 'layout' ], options);


  var actions = options.actions,
      logger = options.logger;

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
      logger.info('ref:' + options.id, 'diagram <%s> opening', options.id);

      modeler.createDiagram(function(err, warnings) {
        opened = true;
        updateEditState();

        logger.info('diagram <%s> opened', options.id);

        if (err) {
          logger.info('ERROR: %s', err.message);
        }

        if (warnings.length) {
          logger.info('WARNINGS: \n%s', warnings.join('\n'));
        }
      });
    } else {
      updateEditState();
    }
  };

  this.unmount = function(node) {
    debug('remove', options.id, arguments);

    node.removeChild($el);
  };

  this.resizeProperties = function onDrag(panelLayout, event, delta) {

    var oldWidth = panelLayout.open ? panelLayout.width : 0;

    var newWidth = Math.max(oldWidth + delta.x * -1, 0);

    actions.emit('layout:update', {
      propertiesPanel: {
        open: newWidth > 25,
        width: newWidth
      }
    });
  };

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

    var compose = this.compose;

    var propertiesLayout = options.layout.propertiesPanel;

    var propertiesStyle = {
      width: (propertiesLayout.open ? propertiesLayout.width : 0) + 'px'
    };

    return (
      <div className="bpmn-editor" key={ options.id + '#bpmn' }>
        <div className="canvas"
             tabIndex="0"
             onAppend={ compose('mount') }
             onRemove={ compose('unmount') }>
        </div>
        <div className="properties" style={ propertiesStyle } tabIndex="0">
          <div className="toggle"
               ref="properties-toggle"
               draggable="true"
               onClick={ compose('toggleProperties') }
               onDragstart={ dragger(compose('resizeProperties', copy(propertiesLayout))) }>
            Properties Panel
          </div>
        </div>
      </div>
    );
  };
}

inherits(BpmnEditor, Editor);

module.exports = BpmnEditor;