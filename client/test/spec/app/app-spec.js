'use strict';

var Events = require('test/helper/mock/events'),
    Logger = require('test/helper/mock/logger');

var App = require('app');

var select = require('test/helper/vdom').select,
    render = require('test/helper/vdom').render;


describe('App', function() {

  var events, logger;

  beforeEach(function() {
    events = new Events();
    logger = new Logger();
  });


  it('should render', function() {

    // given
    var app = new App({
      events: events,
      logger: logger
    });

    // when
    var tree = render(app);

    // then
    expect(select('.footer', tree)).to.exist;
    expect(select('.tabbed.main', tree)).to.exist;
    expect(select('.menu-bar', tree)).to.exist;
  });


  it('should create new BPMN tab', function() {

    // given
    var app = new App({
      events: events,
      logger: logger
    });

    // when
    app.emit('create-diagram', 'BPMN');

    var tree = render(app);

    // then
    // expect BPMN tab with editor to be shown
    expect(select('.bpmn-tab', tree)).to.exist;
    expect(select('.bpmn-editor', tree)).to.exist;
  });

});