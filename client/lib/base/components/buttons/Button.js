'use strict';

var ensureOpts = require('util/ensure-opts');


function Button(options) {

  if (!(this instanceof Button)) {
    return new Button(options);
  }

  ensureOpts([ 'action' ], options);

  this.render = function() {

    var html =
      <button onClick={ options.action }>
        { options.icon ? <span className={ options.icon }></span> : null }
        { options.label || '' }
      </button>;

    return html;
  };
}

module.exports = Button;