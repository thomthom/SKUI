/*******************************************************************************
 *
 * class UI.Listbox
 *
 ******************************************************************************/


Listbox.prototype = new Control();
Listbox.prototype.constructor = Listbox;

function Listbox( jquery_element ) {
  Control.call( this, jquery_element );
}

UI.Listbox = Listbox;

Listbox.add = function( properties ) {
  // Build DOM objects.
  // (i) <SELECT> element needs to be wrapped to ensure consistent sizing.
  var $control = $('<div/>')
  $control.addClass('control control-listbox');
  var $select = $('<select/>')
  $select.appendTo( $control );
  // Initialize wrapper.
  var control = new Listbox( $control );
  control.update( properties );
  // Set up events.
  $select.change( function(){
    var $this = $(this);
    var args = [ $this.val() ];
    Sketchup.callback( $control.attr( 'id' ), 'change', args );
  } );
  // Attach to document.
  control.attach();
  return control;
}

Listbox.prototype.set_items = function( value ) {
  $select = this.control.children('select');
  $select.empty();
  for ( i in value ) {
    $item = $('<option/>');
    $item.text( value[i] );
    $item.val( value[i] );
    $item.appendTo( $select );
  }
  return value;
};

Listbox.prototype.set_multiple = function( value ) {
  $select = this.control.children('select');
  $select.prop( 'multiple', value );
  return value;
};

Listbox.prototype.set_size = function( value ) {
  $select = this.control.children('select');
  $select.attr( 'size', value )
  return value;
};

Listbox.prototype.set_value = function( value ) {
  $select = this.control.children('select');
  $select.val( value );
  return value;
};
