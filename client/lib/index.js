'use strict';

var domReady = require('domready');
var raf = require('raf');

var Delegator = require('dom-delegator');


var diff = require('virtual-dom/diff'),
    patch = require('virtual-dom/patch'),
    createElement = require('virtual-dom/create-element');

// provide vdom utility
global.h = require('vdom/h');


var Logger = require('base/logger'),
    Events = require('base/events');

var App = require('./app');

var EmptyTab = require('app/tabs/empty-tab');

// init dom-delegator
Delegator();


domReady(function() {

  var app = new App({
    logger: new Logger(),
    events: new Events()
  });

  app.on('app:run', function() {

    var debuggerTab = new EmptyTab({
      id: 'debugger',
      label: 'DO DEBUG',
      title: 'Create new Diagram',
      render: function() {
        console.log('RENDER ME ?!?!');

        return <h1> DEBUG YEA </h1>;
      }
    });

    app.emit('tab:add', debuggerTab, { select: true });
    app.emit('create-diagram', 'BPMN');
  });

  var tree = app.render();

  var rootNode = createElement(tree);

  document.body.appendChild(rootNode);

  // main loop
  app.on('changed', function() {

    raf(function() {
      var newTree = app.render();
      var patches = diff(tree, newTree);
      rootNode = patch(rootNode, patches);
      tree = newTree;
    });

  });

  app.run();
});


require('debug').enable('*');