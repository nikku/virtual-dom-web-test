'use strict';

var ensureOpts = require('util/ensure-opts');


function MultiButton(options) {

  if (!(this instanceof MultiButton)) {
    return new MultiButton(options);
  }

  ensureOpts([ 'choices' ], options);

  var choices = options.choices;

  var primaryChoice = getPrimaryAction(choices);


  this.render = function() {

    var html =
      <button onClick={ primaryChoice.action }>
        { primaryChoice.icon ? <span className={ primaryChoice.icon }></span> : null }
        { primaryChoice.label || '' }
      </button>;

    return html;
  };
}

module.exports = MultiButton;




function getPrimaryAction(choices) {
  var primaryChoices = choices.filter(function(c) {
    return c.primary;
  });

  if (primaryChoices.length !== 1) {
    throw new Error('must define exactly one primary=true choice');
  }

  return primaryChoices[0];
}