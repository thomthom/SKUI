/*******************************************************************************
 *
 * module UI
 *
 ******************************************************************************/


var UI = function() {
  return {


    init : function() {
      // Ruby Bridge
      Bridge.init();
      // Focus property
      UI.add_focus_property(); // (?) Needed? Gives IE7 support, but...
      // URL Links
      UI.redirect_links();
      // Initialize controls. Some need some global events to function properly.
      // (?) Automate these call?
      Button.init();
      RadioButton.init();
      // Disable native browser functions to make the dialog appear more native.
      UI.disable_select();
      UI.disable_context_menu();
      // Ready Event
      window.location = 'skp:SKUI_Window_Ready';
    },


    // Ensure links are opened in the default browser.
    redirect_links : function() {
      $(document).on('click', 'a', function()
      {
        window.location = 'skp:SKUI_Open_URL@' + this.href;
        return false;
      } );
    },


    // Ensure links are opened in the default browser.
    disable_select : function() {
      $(document).on('mousedown selectstart', function(e) {
        return $(e.target).is('input, textarea, select, option');
      });
    },


    // Ensure links are opened in the default browser.
    disable_context_menu : function() {
      $(document).on('contextmenu', function(e) {
        return $(e.target).is('input[type=text], textarea');
      });
    },


    /* Loops over all input elements and ensure that they get an .focus class
     * added upon focus and remove it when it loses focus. This is a workaround
     * for IE7's lack of :hover support.
     */
    add_focus_property : function() {
      $(document).on('focusin', 'input', function () {
        $(this).addClass('focus');
      });
      $(document).on('focusout', 'input', function () {
        $(this).removeClass('focus');
      });
    },


    /* Adds a control to the window.
     */
    add_control : function(properties) {
      if ( properties.type in UI ) {
        control_class = UI[properties.type];
        control_class.add( properties )
        return true;
      } else {
        alert( 'Invalid Control Type: ' + properties.type );
        return false;
      }
    },


    add_event : function( eventname, $control, $child ) {
      control = $child || $control
      control.on( eventname, function( event ) {
        var args = new Array();
        var $c = $(this);
        // Prevent events if control is disabled
        // (?) Find parent of any sub-control?
        if ( $c.hasClass('disabled') ) {
          event.stopPropagation();
          event.preventDefault();
          return false;
        }
        /*
        // http://api.jquery.com/category/events/event-object/
        switch ( eventname )
        {
        case 'click':
          args[0] = event.pageX;
          args[1] = event.pageY;
          break;
        }
        */
        // Defer some events to allow content to update.
        var defer_events = [ 'copy', 'cut', 'paste' ];
        if ( $.inArray( eventname, defer_events ) ) {
          setTimeout( function() {
            Sketchup.callback( $control.attr( 'id' ), eventname, args );
          }, 0 );
        } else {
          Sketchup.callback( $control.attr( 'id' ), eventname, args );
        }
        return true;
      } );
    },


    /* Removes a control from the window.
     */
    remove_control : function( control ) {
      var $control = get_object(control);
      $control.remove();
      return true;
    },


    /* Adds a control to the window.
     */
    update_properties : function( control_or_ui_id, properties ) {
      var $control = get_object( control_or_ui_id );
      if ( properties.type in UI ) {
        control_class = UI[properties.type];
        var control = new control_class( $control );
        control.update( properties );
        return true;
      } else {
        alert( 'Invalid Control Type: ' + properties.type );
        return false;
      }
    }


  };

  /* PRIVATE */

  function get_object( id_or_object ) {
    if ( $.type( id_or_object ) == 'string' ) {
      return $( '#' + id_or_object );
    }
    else {
      return id_or_object;
    }
  }

}(); // UI