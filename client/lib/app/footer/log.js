'use strict';

var BaseComponent = require('base/component');

var inherits = require('inherits');

var ensureOpts = require('util/ensure-opts');

var dragger = require('util/dragger');

var copy = require('util/copy');

var isEscape = require('util/event/is-escape');


function Log(options) {

  BaseComponent.call(this);

  ensureOpts([ 'actions', 'layout', 'log' ], options);

  var actions = options.actions;


  this.resizeLog = dragger(function onDrag(logLayout, event, delta) {

    var oldHeight = logLayout.open ? logLayout.height : 0;

    var newHeight = Math.max(oldHeight + delta.y * -1, 0);

    actions.emit('layout:update', {
      log: {
        open: newHeight > 25,
        height: newHeight
      }
    });
  });

  this.closeOnEscape = function(event) {
    if (isEscape(event)) {
      this.toggleLog();
    }
  };

  this.toggleLog = function() {
    actions.emit('layout:update', {
      log: {
        open: !options.layout.log.open
      }
    });
  };

  this.render = function() {

    var entries = options.log.entries;

    var focusedEntry = entries[entries.length - 1];

    var logLayout = options.layout.log;

    var logStyle = {
      height: (logLayout.open ? logLayout.height : 0) + 'px'
    };

    return (
      <div className="log">
        <div className="header" onClick={ this.compose('toggleLog') }>LOG YEA</div>
        <div className="resize-handle"
             draggable="true"
             onDragStart={ this.compose('resizeLog', copy(logLayout)) }></div>
        {
          logLayout.open
            ? <div className="entries"
                   style={ logStyle }
                   tabIndex="0"
                   onKeydown={ this.compose('closeOnEscape') }>
                {
                  entries.map(function(e) {

                    var action = e.action;

                    var html =
                      <div className="entry" scrollTo={ e === focusedEntry }>
                        {
                          action
                            ? <a href="#" onClick={ action }>{ e.message }</a>
                            : <span>{ e.message }</span>
                        }
                      </div>;

                    return html;
                  })
                }
              </div>
            : null
        }
      </div>
    );
  };
}

inherits(Log, BaseComponent);

module.exports = Log;