'use strict';

var Events = require('test/helper/mock/events'),
    Logger = require('test/helper/mock/logger');

var BpmnEditor = require('app/tabs/views/bpmn-editor');

var select = require('test/helper/vdom').select,
    render = require('test/helper/vdom').render,
    simulateEvent = require('test/helper/vdom').simulateEvent;


function findPropertiesToggle(tree) {
  return select('[ref=properties-toggle]', tree);
}


describe('BpmnEditor', function() {

  it('should unit test', function() {

    var events = new Events();

    // given
    var tab = new BpmnEditor({
      events: events,
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

    var events;

    beforeEach(function() {
      events = new Events();
    });


    it('should close', function() {

      // given
      var tab = new BpmnEditor({
        events: events,
        logger: new Logger(),
        layout: {
          propertiesPanel: {
            open: true,
            width: 150
          }
        }
      });

      var tree = render(tab);

      var element = findPropertiesToggle(tree);

      // when close toggle
      simulateEvent(element, 'click');

      // then
      expect(events.recordedEvents).to.eql([
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
        events: events,
        logger: new Logger(),
        layout: {
          propertiesPanel: {
            open: false,
            width: 150
          }
        }
      });

      var tree = render(tab);

      var element = findPropertiesToggle(tree);

      // when close toggle
      simulateEvent(element, 'click');

      // then
      expect(events.recordedEvents).to.eql([
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
        events: events,
        logger: new Logger(),
        layout: {
          propertiesPanel: {
            open: true,
            width: 150
          }
        }
      });

      var tree = render(tab);

      var element = findPropertiesToggle(tree);

      // when dragging
      simulateEvent(element, 'dragstart', { screenX: 0, screenY: 0 });
      simulateEvent(element, 'drag', { screenX: 50, screenY: 0 });

      // then
      expect(events.recordedEvents).to.eql([
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