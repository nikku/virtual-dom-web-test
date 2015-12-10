'use strict';

var h = require('vdom/h');


function MenuBar(options) {

  if (!(this instanceof MenuBar)) {
    return new MenuBar(options);
  }

  this.render = function() {

    var entries = options.entries;

    var html = <div class="menu-bar">
      <ul>
        {
          entries.map(function(e) {
            return <li key={ e.id }>{ h(e) }</li>;
          })
        }
      </ul>
    </div>;

    return html;
  };
}

module.exports = MenuBar;