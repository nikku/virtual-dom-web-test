'use strict';

var Actions = require('test/helper/mock/Actions');

var BpmnEditor = require('app/tabs/views/BpmnEditor');

var select = require('test/helper/vdom').select,
    simulateEvent = require('test/helper/vdom').simulateEvent;


describe('BpmnEditor', function() {

  it('should unit test', function() {

    var actions = new Actions();

    // given
    var tab = new BpmnEditor({ actions: actions });

    var $el = document.createElement('div');

    // when
    tab.mount($el);

    // then
    // modeler got mounted...
    expect($el.childNodes.length).to.eql(1);
  });


  it('should click test', function() {

    var actions = new Actions();

    // given
    var tab = new BpmnEditor({
      actions: actions,
      layout: {
        propertiesPanel: {
          open: true
        }
      }
    });

    // when
    var tree = tab.render();

    var element = select('[ref=properties-toggle]', tree);

    // then
    expect(element).to.exists;

    var layoutUpdate = false;

    actions.on('layout:update', function() {
      layoutUpdate = true;
    });

    // but when
    simulateEvent(element, 'click');

    // then
    expect(layoutUpdate).to.be.true;
  });

});