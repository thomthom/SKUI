/*******************************************************************************
 *
 * class UI.Listbox
 *
 ******************************************************************************/


Listbox.prototype = new Control();
Listbox.prototype.constructor = Listbox;

function Listbox( jquery_element ){ 
  Control.call( this, jquery_element );
}

UI.Listbox = Listbox;

Listbox.add = function( properties ) {
  // Build DOM objects.
  var $control = $('<select/>')
  // Initialize wrapper.
  var control = new Listbox( $control );
  control.update( properties );
  // Set up events.
  $control.change( function(){
    var $this = $(this);
    var args = [ $this.val() ];
    Sketchup.callback( $control.attr( 'id' ), 'change', args );
  } );
  // Attach to document.
  control.attach();
  return control;
}

Listbox.prototype.set_items = function( value ) {
  this.control.empty();
  for ( i in value ) {
    $item = $('<option/>');
    $item.text( value[i] );
    $item.val( value[i] );
    $item.appendTo( this.control );
  }
  return value;
};

Listbox.prototype.set_multiple = function( value ) { 
  this.control.prop( 'multiple', value );
  return value;
};

Listbox.prototype.set_size = function( value ) { 
  this.control.attr( 'size', value )
  return value;
};

Listbox.prototype.set_value = function( value ) { 
  this.control.val( value );
  return value;
};
