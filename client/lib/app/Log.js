'use strict';

var ensureOpts = require('util/ensure-opts');


function Log(options) {

  ensureOpts([ 'entries', 'onToggle' ], options);


  this.render = function() {

    var entries = options.entries;

    return (
      <div className="log">
        <div class="header">
          <h3 onClick={ options.onToggle }>LOG YEA</h3>
        </div>
        {
          options.open
            ? <div class="entries">
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

module.exports = Log;