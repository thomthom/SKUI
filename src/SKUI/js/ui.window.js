/*******************************************************************************
 *
 * class UI.Window
 *
 ******************************************************************************/


Window.prototype = new Control();
Window.prototype.constructor = Window;

function Window( jquery_element ) {
  Control.call( this, jquery_element );
}

UI.Window = Window;

Window.add = function( properties ) {
  return $('body');
}
