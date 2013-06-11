/*******************************************************************************
 *
 * class UI.Textbox
 *
 ******************************************************************************/


Textbox.prototype = new Control();
Textbox.prototype.constructor = Textbox;

function Textbox( jquery_element ){ 
  Control.call( this, jquery_element );
}

UI.Textbox = Textbox;

Textbox.add = function( properties ) {
  // Build DOM objects.
  if ( properties.multiline ) {
    var $control = $('<textarea>');
  } else {
    var $control = $('<input type="text" />');
  }
  // Initialize wrapper.
  var control = new Textbox( $control );
  control.update( properties );
  // Set up events.
  UI.add_event( 'change', $control );
  UI.add_event( 'keydown', $control );
  UI.add_event( 'keypress', $control );
  UI.add_event( 'keyup', $control );
  UI.add_event( 'focus', $control );
  UI.add_event( 'blur', $control );
  UI.add_event( 'copy', $control );
  UI.add_event( 'cut', $control );
  UI.add_event( 'paste', $control );
  UI.add_event( 'textchange', $control );
  // Attach to document.
  control.attach();
  return control;
}

Textbox.prototype.set_value = function( value ) { 
  this.control.val( value );
  return value;
};
