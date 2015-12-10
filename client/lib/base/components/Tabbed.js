'use strict';

var h = require('vdom/h');

var CloseHandle = require('./misc/CloseHandle');


function Tabbed(options) {

  var actions = options.actions;

  this.render = function() {

    var tabs = options.tabs,
        activeTab = options.active;

    var html =
      <div className="tabbed">
        <div className="tabbar">
          <ul>
            { tabs.map(function(tab) {
              var action = tab.action || actions.compose('tab:select', tab);

              return <li className={ tab === activeTab ? 'active' : ''} key={ tab.id }>
                <a title={ tab.title || tab.label } onClick={ action }>{ tab.label }</a>
                { tab.closable
                    ? <CloseHandle dirty={ tab.dirty }
                                   onClick={ actions.compose('tab:close', tab) } />
                    : null }
              </li>;
            }) }
          </ul>
        </div>
        <div className="contents">
          { activeTab ? h(activeTab) : null }
        </div>
      </div>;

    return html;
  };
}

module.exports = Tabbed;