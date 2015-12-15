'use strict';

var ensureOpts = require('util/ensure-opts');

var Log = require('./log');


function Footer(options) {

  ensureOpts([ 'log', 'layout', 'actions' ], options);

  this.render = function() {

    var log = options.log,
        layout = options.layout,
        actions = options.actions;

    var html =
      <div className="footer">
        <Log log={ log } layout={ layout } actions={ actions } />
      </div>;

    return html;
  };
}

module.exports = Footer;