'use strict';

var domReady = require('domready');
var raf = require('raf');

var Delegator = require('dom-delegator');


var diff = require('virtual-dom/diff'),
    patch = require('virtual-dom/patch'),
    createElement = require('virtual-dom/create-element');

// setImmediate shim for WebKit and Firefox
require('setimmediate');

// provide vdom utility
global.h = require('vdom/h');

var App = require('./app');

// init dom-delegator
Delegator();

var EmptyTab = require('app/tabs/EmptyTab');


domReady(function() {

  var app = new App();

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
  });

  var tree = app.render();

  var rootNode = createElement(tree);

  document.body.appendChild(rootNode);

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