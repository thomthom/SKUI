/*******************************************************************************
 *
 * module UI
 *
 ******************************************************************************/


var UI = function() {
  return {


    init : function() {
      // Ruby Bridge
      bridge = $('<input id="SKUI_RUBY_BRIDGE" name="SKUI_RUBY_BRIDGE" type="hidden" />');
      $('body').append( bridge );
      // Focus property
      UI.add_focus_property(); // (?) Needed? Gives IE7 support, but...
      // URL Links
      UI.redirect_links();
      // Buttons
      $(document).on('mousedown', 'button', control_left_button_down ); // (?) Needed?
      $(document).on('mouseup', 'button', control_left_button_up ); // (?)
      // RadioButtons
      UI.init_radiobuttons_toggle();
      // Disable native browser functions to make the dialog appear more native.
      UI.disable_select();
      UI.disable_context_menu();
      // Ready Event
      window.location = 'skp:SKUI_Window_Ready';
    },


    // Ensure links are opened in the default browser.
    redirect_links : function() {
      $(document).on('click', 'a.url', function()
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


    /* When a radiobutton is toggled the other radiobuttons should be unchecked.
     */
    init_radiobuttons_toggle : function() {
      $(document).on('change', 'input[type=radio]', function () {
        if ( $(this).prop('checked') == true ) {
          $control = $(this).parent();
          $radiobuttons = $control.siblings('.radiobutton').children('input');
          $radiobuttons.prop('checked', false);
        }
      });
    },


    /* Adds a control to the window.
     */
    add_control : function(properties) {
      switch ( properties.type )
      {
      case 'Button':
        UI.add_button( properties );
        return true;
      case 'Checkbox':
        UI.add_checkbox( properties );
        return true;
      case 'Container':
        UI.add_container( properties );
        return true;
      case 'Groupbox':
        UI.add_groupbox( properties );
        return true;
      case 'Label':
        UI.add_label( properties );
        return true;
      case 'Listbox':
        UI.add_list( properties );
        return true;
      case 'RadioButton':
        UI.add_radiobutton( properties );
        return true;
      case 'Textbox':
        UI.add_textbox( properties );
        return true;
      default:
        alert( 'Invalid Control Type: ' + properties.type );
        return false;
      }
    },


    /* Adds a button.
     */
    add_button : function( properties ) {
      var $parent = get_parent( properties );
      var $control = $('<button></button>');
      UI.update_properties( $control, properties );
      $control.text( properties.caption );
      UI.add_event( 'click', $control );
      $control.appendTo( $parent );
    },


    /* Adds a checkbox.
     */
    add_checkbox : function( properties ) {
      var $parent = get_parent( properties );
      var $control = $('<label class="checkbox" />');
      var $label = $('<span/>');
      var $checkbox = $('<input type="checkbox" />');
      $checkbox.appendTo( $control );
      $label.appendTo( $control );
      // Set properties
      UI.update_properties( $control, properties );
      $checkbox.prop( 'checked', properties.checked );
      $label.text( properties.value );
      //UI.add_event( 'click', $control ); // (!) Block 'change' event on OSX.
      UI.add_event( 'change', $control, $checkbox );
      // Add to document
      $control.appendTo( $parent );
    },


    /* Adds a container.
     */
    add_container : function( properties ) {
      var $parent = get_parent( properties );
      var $control = $('<div class="container" />');
      UI.update_properties( $control, properties );
      $control.appendTo( $parent );
    },


    /* Adds a container.
     */
    add_groupbox : function( properties ) {
      var $parent = get_parent( properties );
      var $control = $('<fieldset class="container" />');
      var $label = $('<legend/>');
      $label.appendTo( $control );
      UI.update_properties( $control, properties );
      $label.text( properties.label );
      $control.appendTo( $parent );
    },


    /* Adds a button.
     */
    add_textbox : function( properties ) {
      var $parent = get_parent( properties );
      if ( properties.multiline ) {
        var $control = $('<textarea>');
      } else {
        var $control = $('<input type="text" />');
      }
      UI.update_properties( $control, properties );
      $control.val( properties.value );
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
      $control.appendTo( $parent );
    },


    /* Adds a label.
     */
    add_label : function(properties) {
      var $parent = get_parent( properties );
      var $control = $('<label/>');
      UI.update_properties( $control, properties );
      $control.text( properties.caption );
      if ( 'control' in properties ) {
        $control.attr( 'for', properties.control );
      }
      $control.appendTo( $parent );
    },


    /* Adds a list.
     */
    add_list : function(properties) {
      var $parent = get_parent( properties );
      var $list = $('<select/>')
      UI.update_properties( $list, properties );
      if ( 'size' in properties ) {
        $list.attr( 'size', properties.size )
      }
      if ( 'multiple' in properties && properties.multiple ) {
        $list.attr( 'multiple', 'multiple' );
      }
      if ( 'items' in properties ) {
        var items = properties.items;
        for ( i in items ) {
          $item = $('<option/>');
          $item.text( items[i] );
          $item.val( items[i] );
          $item.appendTo( $list );
        }
      }
      $list.change( function(){
        var $this = $(this);
        var args = [ $this.val() ];
        Sketchup.callback( $list.attr( 'id' ), 'change', args );
      } );
      $list.appendTo( $parent );
    },


    /* Adds a list.
     */
    add_list_item : function(ui_id, items) {
      var $list = $('#' + ui_id);
      if ( $.isArray(items) ) {
        for ( i in items ) {
          $item = $('<option/>');
          $item.text( items[i] );
          $item.val( items[i] );
          $item.appendTo( $list );
        }
      } else {
        $item = $('<option/>');
        $item.text( items );
        $item.val( items );
        $item.appendTo( $list );
      }
      return true;
    },


    /* Adds a radio button.
     */
    add_radiobutton : function( properties ) {
      var $parent = get_parent( properties );
      var $control = $('<label class="radiobutton" />');
      var $label = $('<span/>');
      var $radio = $('<input type="radio" />');
      $radio.appendTo( $control );
      $label.appendTo( $control );
      // Set properties
      UI.update_properties( $control, properties );
      $radio.prop( 'checked', properties.checked );
      $label.text( properties.value );
      //UI.add_event( 'click', $control ); // (!) Block 'change' event on OSX.
      UI.add_event( 'change', $control, $radio );
      // (!) Only one radio button active per container.
      // Add to document
      $control.appendTo( $parent );
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
    update_properties : function( control, properties ) {
      var $control = get_object( control );

      // Common properties
      for ( property in properties ) {
        //alert(property);
        value = properties[property];
        value = ( value === null ) ? '' : value
        //alert(value);
        switch ( property )
        {
        case 'ui_id':
          $control.attr( 'id', value );
          break;
        case 'top':
          $control.css( 'position', 'absolute' );
          $control.css( 'top', value );
          break;
        case 'left':
          $control.css( 'position', 'absolute' );
          $control.css( 'left', value );
          break;
        case 'bottom':
          $control.css( 'position', 'absolute' );
          $control.css( 'bottom', value );
          break;
        case 'right':
          $control.css( 'position', 'absolute' );
          $control.css( 'right', value );
          break;
        case 'width':
          $control.outerWidth( value );
          break;
        case 'height':
          $control.outerHeight( value );
          break;
        case 'font_name':
          $control.css( 'font-family', value );
          break;
        case 'font_size':
          $control.css( 'font-size', value );
          break;
        case 'foreground_color':
          $control.css( 'color', value.to_css() );
          break;
        case 'background_color':
          $control.css( 'background-color', value.to_css() );
          break;
        case 'tooltip':
          $control.prop( 'title', value );
          break;
        case 'visible':
          if ( properties.visible ) {
            $control.css( 'visibility', 'visible' );
          } else {
            $control.css( 'visibility', 'hidden' );
          }
          break;
        case 'enabled':
          $control.toggleClass( 'disabled', !value );
          $control.prop( 'disabled', !value );
          $control.prop( 'readonly', !value );
          // Disable form controls.
          $form_elements = $control.find( 'input, select, textarea, button' );
          $form_elements.prop( 'readonly', !value );
          break;
        case 'disabled':
          $control.toggleClass( 'disabled', value );
          $control.prop( 'disabled', value );
          $control.prop( 'readonly', value );
          // Disable form controls.
          $form_elements = $control.find( 'input, select, textarea, button' );
          $form_elements.prop( 'disabled', value );
          $form_elements.prop( 'readonly', value );
          break;
        default:
          /*alert('Invalid Control Property.')*/
          break;
        }
      }

      switch ( properties.type )
      {
      case 'Button':
        update_button_properties( $control, properties );
        break;
      case 'Checkbox':
        update_checkbox_properties( $control, properties );
        break;
      case 'Groupbox':
        update_groupbox_properties( $control, properties );
        break;
      case 'Label':
        update_label_properties( $control, properties );
        break;
      case 'Listbox':
        update_listbox_properties( $control, properties );
        break;
      case 'RadioButton':
        update_radiobutton_properties( $control, properties );
        break;
      case 'Textbox':
        update_textbox_properties( $control, properties );
        break;
      }

      return true;
    }


  };

  /* PRIVATE */

  function control_left_button_down() {
    $(this).addClass('pressed');
    return false;
  }

  function control_left_button_up() {
    $(this).removeClass('pressed');
    return false;
  }

  /* Returns the parent object.
   */
  function get_parent(properties) {
    if ( 'parent' in properties ) {
      if ( properties.parent == 'Window' ) {
        return $( 'body' );
      }
      else {
        return $( '#' + properties.parent );
      }
    }
    else {
    }
  }

  function get_object( id_or_object ) {
    if ( $.type( id_or_object ) == 'string' ) {
      return $( '#' + id_or_object );
    }
    else {
      return id_or_object;
    }
  }

  function update_button_properties( $control, properties ) {
    for ( property in properties ) {
      value = properties[property];
      switch ( property )
      {
      case 'height':
        /* Set line-height to match so the text centers vertically.
         * Subtract border and padding size.
         * (!) Does not work until control is added to document.
         */
        var offset = $control.outerHeight() - $control.height();
        $control.css( 'line-height', (properties.height-offset) + 'px' );
        break;
      }
    }
    return true;
  }

  function update_checkbox_properties( $control, properties ) {
    $label = $control.children('span');
    $checkbox = $control.children('input');
    for ( property in properties ) {
      value = properties[property];
      switch ( property )
      {
      case 'checked':
        $checkbox.prop( 'checked', value );
        break;
      case 'label':
        $label.text( value );
        break;
      }
    }
    return true;
  }

  function update_groupbox_properties( $control, properties ) {
    $label = $control.children('legend');
    for ( property in properties ) {
      value = properties[property];
      switch ( property )
      {
      case 'label':
        $label.text( value );
        break;
      }
    }
    return true;
  }

  function update_label_properties( $control, properties ) {
    for ( property in properties ) {
      value = properties[property];
      switch ( property )
      {
      case 'caption':
        update_label_text( $control, properties );
        break;
      case 'url':
        update_label_text( $control, properties );
        break;
      }
    }
    return true;
  }

  function update_label_text( $control, properties ) {
    var caption = properties['caption'];
    if ( 'url' in properties ) {
      $control.empty();
      var $url = $( '<a/>' );
      $url.text( caption );
      $url.attr( 'href', properties['url'] );
      $url.addClass( 'url' );
      $url.appendTo( $control );
    } else {
      $control.text( caption );
    }
    return true;
  }

  function update_listbox_properties( $control, properties ) {
    for ( property in properties ) {
      value = properties[property];
      switch ( property )
      {
      case 'value':
        $control.val( value );
        break;
      }
    }
    return true;
  }

  function update_radiobutton_properties( $control, properties ) {
    $label = $control.children('span');
    $radio = $control.children('input');
    for ( property in properties ) {
      value = properties[property];
      switch ( property )
      {
      case 'checked':
        $radio.prop( 'checked', value );
        break;
      case 'label':
        $label.text( value );
        break;
      }
    }
    return true;
  }

  function update_textbox_properties( $control, properties ) {
    for ( property in properties ) {
      value = properties[property];
      switch ( property )
      {
      case 'value':
        $control.val( value );
        break;
      }
    }
    return true;
  }

}(); // UI