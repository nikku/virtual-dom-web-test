'use strict';

var h = require('vdom/h');

var CloseHandle = require('./misc/CloseHandle');


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
                <div className={ tab === activeTab ? 'active tab' : 'tab'} key={ tab.id }>
                  <a title={ tab.title || tab.label } onClick={ action }>{ tab.label }</a>
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