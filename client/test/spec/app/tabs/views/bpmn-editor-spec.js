'use strict';

var Actions = require('test/helper/mock/Actions');

var BpmnEditor = require('app/tabs/views/BpmnEditor');

var select = require('test/helper/vdom').select,
    render = require('test/helper/vdom').render,
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
    var tree = render(tab);

    var element = select('[ref=properties-toggle]', tree);

    // then
    expect(element).to.exists;

    var panelOpen = false;

    actions.on('layout:update', function(updated) {
      panelOpen = updated.propertiesPanel.open;
    });

    // but when
    simulateEvent(element, 'click');

    // then
    expect(panelOpen).to.be.true;
  });

});