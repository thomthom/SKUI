/*******************************************************************************
 *
 * class UI.Label
 *
 ******************************************************************************/


Label.prototype = new Control();
Label.prototype.constructor = Label;

function Label( jquery_element ) {
  Control.call( this, jquery_element );
}

UI.Label = Label;

Label.add = function( properties ) {
  // Build DOM objects.
  var $control = $('<label><a/></label>');
  // Initialize wrapper.
  var control = new Label( $control );
  control.update( properties );
  // Attach to document.
  control.attach();
  return control;
}

Label.prototype.set_caption = function( value ) {
  $a = this.control.children('a');
  $a.text( value );
  return value;
};

Label.prototype.set_control = function( value ) {
  this.control.attr( 'for', value );
  return value;
};

Label.prototype.set_url = function( value ) {
  $a = this.control.children('a');
  $a.attr( 'href', value );
  return value;
};
