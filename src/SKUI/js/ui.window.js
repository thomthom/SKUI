/*******************************************************************************
 *
 * class UI.Window
 *
 ******************************************************************************/


Window.prototype = new Control();
Window.prototype.constructor = Window;

function Window( jquery_element ) {
  Control.call( this, jquery_element );
  this.cancel_button = null;
  this.default_button = null;
}

UI.Window = Window;

Window.init = function( properties ) {
  // Capture Return and ESC for default button actions.
  $(document).on('keydown', function( event ) {
    switch ( event.keyCode ) {
    case UI.KEYCODE_ENTER:
      // Don't trigger if multiline textbox is active.
      if ( $(document.activeElement).prop('nodeName') != 'TEXTAREA' ) {
        $(Window.default_button).trigger('click');
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
      break;
    case UI.KEYCODE_ESC:
      $(Window.cancel_button).trigger('click');
      event.preventDefault();
      event.stopPropagation();
      return false;
      break;
    }
  });
  return;
}

Window.add = function( properties ) {
  return $('body');
}

Window.prototype.set_cancel_button = function( value ) {
  Window.cancel_button = '#'+value;
  return value;
};

Window.prototype.set_default_button = function( value ) {
  Window.default_button = '#'+value;
  return value;
};
