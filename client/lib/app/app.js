'use strict';

var merge = require('lodash/object/merge'),
    bind = require('lodash/function/bind');

var MenuBar = require('base/components/menu-bar'),
    Tabbed = require('base/components/tabbed');

var MultiButton = require('base/components/buttons/multi-button'),
    Button = require('base/components/buttons/button'),
    Separator = require('base/components/buttons/separator');

var BpmnTab = require('./tabs/bpmn-tab');

var EmptyTab = require('./tabs/empty-tab');

var Footer = require('./footer');

var ensureOpts = require('util/ensure-opts');

var debug = require('debug')('app');

/**
 * The main application entry point
 */
function App(options) {

  ensureOpts([ 'logger', 'events' ], options);

  var logger = options.logger,
      events = options.events;

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
            action: events.composeEmitter('create-diagram', 'BPMN', 'foo'),
            label: 'Create new BPMN diagram',
            icon: 'icon-new',
            primary: true
          },
          {
            id: 'create-dmn-diagram',
            action: events.composeEmitter('create-diagram', 'DMN'),
            label: 'Create new DMN diagram'
          }
      ]
    }),
    Button({
      id: 'open',
      icon: 'icon-open',
      action: events.composeEmitter('open-diagram')
    }),
    Separator(),
    Button({
      id: 'save-current',
      icon: 'icon-save',
      action: events.composeEmitter('current:save')
    }),
    Button({
      id: 'current-save-as',
      icon: 'icon-save-as',
      action: events.composeEmitter('current:save-as')
    }),
    Separator(),
    Button({
      id: 'undo',
      icon: 'icon-undo',
      action: events.composeEmitter('current:undo')
    }),
    Button({
      id: 'redo',
      icon: 'icon-redo',
      action: events.composeEmitter('current:redo')
    })
  ];

  var tabs = [
    EmptyTab({
      id: 'create-diagram',
      label: '+',
      title: 'Create new Diagram',
      action: events.composeEmitter('create-diagram', 'BPMN')
    })
  ];

  var activeTab = tabs[0];

  events.on('tools:update-edit-state', (tab, newState) => {

    if (tab === activeTab) {
      debug('update-edit-state', newState);

      events.emit('changed');
    }
  });

  events.on('log:toggle', () => {
    events.emit('layout:update', {
      log: {
        open: !(layout.log && layout.log.open)
      }
    });
  });

  logger.on('changed', events.composeEmitter('changed'));

  events.on('layout:update', newLayout => {
    layout = merge(layout, newLayout);

    events.emit('changed');
  });

  events.on('tab:select', tab => {

    var exists = contains(tabs, tab);

    if (!exists) {
      throw new Error('non existing tab');
    }

    activeTab = tab;

    logger.info('switch to <%s> tab', tab.id);

    events.emit('changed');
  });


  events.on('tab:close', tab => {
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
      events.emit('tab:select', tabs[idx - 1] || tabs[idx]);
    }

    events.emit('changed');
  });


  var newDiagramCount = 0;

  events.on('create-diagram', type => {

    var diagramName, tab;

    if (type === 'BPMN') {
      debug('create BPMN tab');

      diagramName = 'diagram_' + (++newDiagramCount) + '.bpmn';

      tab = new BpmnTab({
        id: diagramName,
        label: diagramName,
        closable: true,
        events: events,
        logger: logger,
        layout: layout
      });
    }

    if (tab) {
      events.emit('tab:add', tab, { select: true });
    }
  });

  events.on('tab:add', (tab, config) => {

    tabs.splice(tabs.length - 1, 0, tab);

    if (config && config.select) {
      events.emit('tab:select', tab);
    }

    events.emit('changed');
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
          events={ events } />
        <Footer
          layout={ layout }
          log={ logger }
          events={ events } />
      </div>;

    return html;
  };

  this.run = function() {
    events.emit('app:run');
  };

  // make #on and #emit available via app
  this.on = bind(events.on, events);
  this.emit = bind(events.emit, events);
}

module.exports = App;



function contains(collection, element) {
  return collection.some(function(e) {
    return e === element;
  });
}