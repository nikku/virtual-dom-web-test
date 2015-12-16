'use strict';

var Actions = require('test/helper/mock/actions'),
    Logger = require('test/helper/mock/logger');

var BpmnEditor = require('app/tabs/views/bpmn-editor');

var select = require('test/helper/vdom').select,
    render = require('test/helper/vdom').render,
    simulateEvent = require('test/helper/vdom').simulateEvent;


describe('BpmnEditor', function() {

  it('should unit test', function() {

    var actions = new Actions();

    // given
    var tab = new BpmnEditor({
      actions: actions,
      logger: new Logger(),
      layout: {
        propertiesPanel: {}
      }
    });

    var $el = document.createElement('div');

    // when
    tab.mount($el);

    // then
    // modeler got mounted...
    expect($el.childNodes.length).to.eql(1);
  });


  describe('properties panel', function() {

    var actions;

    beforeEach(function() {
      actions = new Actions();
    });


    it('should close', function() {

      // given
      var tab = new BpmnEditor({
        actions: actions,
        logger: new Logger(),
        layout: {
          propertiesPanel: {
            open: true,
            width: 150
          }
        }
      });

      var tree = render(tab);

      var element = select('[ref=properties-toggle]', tree);

      // when close toggle
      simulateEvent(element, 'click');

      // then
      expect(actions.recordedEvents).to.eql([
        [
          'layout:update',
          {
            propertiesPanel: {
              open: false,
              width: 150
            }
          }
        ]
      ]);
    });


    it('should open', function() {

      // given
      var tab = new BpmnEditor({
        actions: actions,
        logger: new Logger(),
        layout: {
          propertiesPanel: {
            open: false,
            width: 150
          }
        }
      });

      var tree = render(tab);

      var element = select('[ref=properties-toggle]', tree);

      // when close toggle
      simulateEvent(element, 'click');

      // then
      expect(actions.recordedEvents).to.eql([
        [
          'layout:update',
          {
            propertiesPanel: {
              open: true,
              width: 150
            }
          }
        ]
      ]);
    });


    it('should resize', function() {

      // given
      var tab = new BpmnEditor({
        actions: actions,
        logger: new Logger(),
        layout: {
          propertiesPanel: {
            open: true,
            width: 150
          }
        }
      });

      var tree = render(tab);

      var element = select('[ref=properties-toggle]', tree);

      // when dragging
      simulateEvent(element, 'dragstart', { screenX: 0, screenY: 0 });
      simulateEvent(element, 'drag', { screenX: 50, screenY: 0 });

      // then
      expect(actions.recordedEvents).to.eql([
        [
          'layout:update',
          {
            propertiesPanel: {
              open: true,
              width: 100
            }
          }
        ]
      ]);

    });

  });

});