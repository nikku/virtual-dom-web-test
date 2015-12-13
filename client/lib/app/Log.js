'use strict';

var BaseComponent = require('base/BaseComponent');

var inherits = require('inherits');

var ensureOpts = require('util/ensure-opts');


function Log(options) {

  BaseComponent.call(this);


  ensureOpts([ 'entries', 'onToggle' ], options);


  this.render = function() {

    var entries = options.entries;

    return (
      <div className="log">
        <div className="header" onClick={ options.onToggle }>LOG YEA</div>
        {
          options.open
            ? <div className="entries">
                <div className="resize-handle"></div>
                {
                  entries.map(function(e) {

                    var action = e.action;

                    var element =
                      <div className="entry">
                        {
                          action
                            ? <a href="#" onClick={action}>{ e.message }</a>
                            : <span>{ e.message }</span>
                        }
                      </div>;

                    return element;
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