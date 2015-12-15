'use strict';

var merge = require('lodash/object/merge');

var MenuBar = require('base/components/menu-bar'),
    Tabbed = require('base/components/tabbed');

var MultiButton = require('base/components/buttons/multi-button'),
    Button = require('base/components/buttons/button'),
    Separator = require('base/components/buttons/separator');

var BpmnTab = require('./tabs/bpmn-tab');

var EmptyTab = require('./tabs/empty-tab');

var Footer = require('./footer');

var Actions = require('base/actions'),
    Logger = require('base/logger');

var debug = require('debug')('app');


function App() {

  var actions = new Actions();

  var logger = new Logger();

  var layout = {
    propertiesPanel: {
      open: false,
      width: 250
    },
    log: {
      open: false,
      height: 150
    }
  };

  var menuEntries = [
    MultiButton({
      id: 'create',
      choices: [
          {
            id: 'create-bpmn-diagram',
            action: actions.compose('create-diagram', 'BPMN'),
            label: 'Create new BPMN diagram',
            icon: 'icon-new',
            primary: true
          },
          {
            id: 'create-dmn-diagram',
            action: actions.compose('create-diagram', 'DMN'),
            label: 'Create new DMN diagram'
          }
      ]
    }),
    Button({
      id: 'open',
      icon: 'icon-open',
      action: actions.compose('open-diagram')
    }),
    Separator(),
    Button({
      id: 'save-current',
      icon: 'icon-save',
      action: actions.compose('current:save')
    }),
    Button({
      id: 'current-save-as',
      icon: 'icon-save-as',
      action: actions.compose('current:save-as')
    }),
    Separator(),
    Button({
      id: 'undo',
      icon: 'icon-undo',
      action: actions.compose('current:undo')
    }),
    Button({
      id: 'redo',
      icon: 'icon-redo',
      action: actions.compose('current:redo')
    })
  ];

  var tabs = [
    EmptyTab({
      id: 'create-diagram',
      label: '+',
      title: 'Create new Diagram',
      action: actions.compose('create-diagram', 'BPMN')
    })
  ];

  var activeTab = tabs[0];


  actions.on('tools:update-edit-state', function(tab, newState) {

    if (tab === activeTab) {
      debug('update-edit-state', newState);

      actions.emit('changed');
    }
  });

  actions.on('log:toggle', function() {
    actions.emit('layout:update', {
      log: {
        open: !(layout.log && layout.log.open)
      }
    });
  });

  logger.on('changed', actions.compose('changed'));

  actions.on('layout:update', function(newLayout) {
    layout = merge(layout, newLayout);

    actions.emit('changed');
  });

  actions.on('tab:select', function(tab) {

    var exists = contains(tabs, tab);

    if (!exists) {
      throw new Error('non existing tab');
    }

    activeTab = tab;

    logger.info('switch to <%s> tab', tab.id);

    actions.emit('changed');
  });


  actions.on('tab:close', function(tab) {
    debug('close tab', tab);

    var exists = contains(tabs, tab);

    if (!exists) {
      return;
    }

    var idx = tabs.indexOf(tab);

    // remove tab from selection
    tabs.splice(idx, 1);

    // if tab was active, select previous (if exists) or next tab
    if (tab === activeTab) {
      actions.emit('tab:select', tabs[idx - 1] || tabs[idx]);
    }

    actions.emit('changed');
  });


  var newDiagramCount = 0;

  actions.on('create-diagram', function(type) {

    var diagramName, tab;

    if (type === 'BPMN') {
      debug('create BPMN tab');

      diagramName = 'diagram_' + (++newDiagramCount) + '.bpmn';

      tab = new BpmnTab({
        id: diagramName,
        label: diagramName,
        closable: true,
        dirty: newDiagramCount % 2 === 0,
        actions: actions,
        logger: logger,
        layout: layout
      });
    }

    if (tab) {
      actions.emit('tab:add', tab, { select: true });
    }
  });

  actions.on('tab:add', function(tab, config) {

    tabs.splice(tabs.length - 1, 0, tab);

    if (config && config.select) {
      actions.emit('tab:select', tab);
    }

    actions.emit('changed');
  });


  ///////// public API yea! //////////////////////////////////////

  this.render = function() {
    var html =
      <div className="app">
        <MenuBar entries={ menuEntries } />
        <Tabbed
          className="main"
          tabs={ tabs }
          active={ activeTab }
          actions={ actions } />
        <Footer
          layout={ layout }
          log={ logger }
          actions={ actions } />
      </div>;

    return html;
  };

  this.run = function() {
    actions.emit('app:run');
  };

  this.on = actions.on.bind(actions);
  this.emit = actions.emit.bind(actions);
}

module.exports = App;



function contains(collection, element) {
  return collection.some(function(e) {
    return e === element;
  });
}