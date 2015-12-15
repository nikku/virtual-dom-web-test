'use strict';

var h = require('vdom/h');

var CloseHandle = require('./misc/close-handle');


function Tabbed(options) {

  var actions = options.actions;

  this.render = function() {

    var tabs = options.tabs,
        activeTab = options.active;

    var html =
      <div className={ 'tabbed ' + (options.className || '') }>
        <div className="tabs">
          {
            tabs.map(tab => {
              var action = tab.action || actions.compose('tab:select', tab);

              return (
                <div className={ tab === activeTab ? 'active tab' : 'tab'}
                     key={ tab.id }
                     title={ tab.title || tab.label }
                     onClick={ action }
                     tabIndex="0">
                  { tab.label }
                  { tab.closable
                      ? <CloseHandle dirty={ tab.dirty }
                                     onClick={ actions.compose('tab:close', tab) } />
                      : null }
                </div>
              );
            })
          }
        </div>
        <div className="content">
          { activeTab ? h(activeTab) : null }
        </div>
      </div>;

    return html;
  };
}

module.exports = Tabbed;