/*
 * Common methods for webdialogs.
 *
 * Requires jQuery
 *
 * Javascript Namespace: http://www.dustindiaz.com/namespace-your-javascript/
 * http://www.crockford.com/javascript/private.html
 */


/*******************************************************************************
 *
 * $OBJECTS
 *
 ******************************************************************************/


function Point3d( x, y, z ) {
  this.x = x;
  this.y = y;
  this.z = z;
}
Point3d.prototype.toString = function()
{
  // (!) Format numbers
  return 'Point3d(' + this.x + ', ' + this.y + ', ' + this.z + ')';
}


function Vector3d( x, y, z ) {
  this.x = x;
  this.y = y;
  this.z = z;
}
Vector3d.prototype.toString = function()
{
  // (!) Format numbers
  return 'Vector3d(' + this.x + ', ' + this.y + ', ' + this.z + ')';
}


function Color( r, g, b, a ) {
  a = typeof a !== 'undefined' ? a : 255;
  this.r = r;
  this.g = g;
  this.b = b;
  this.a = a;
}
Color.prototype.toString = function()
{
  return 'Color(' + this.r + ', ' + this.g + ', ' + this.b + ', ' + this.a + ')';
}
Color.prototype.to_css = function()
{
  if ( this.a < 255 ) {
    css_alpha = this.a / 255.0;
    return 'rgba('+this.r+', '+this.g+', '+this.b+', '+css_alpha+')';
  } else {
    return 'rgb('+this.r+', '+this.g+', '+this.b+')';
  }
}


//String.prototype.to_css = String.prototype.toString; // Doesn't work.
String.prototype.to_css = function() { return this; }


/*******************************************************************************
 *
 * $SKETCHUP
 *
 ******************************************************************************/


var Sketchup = function() {

  // http://jsfiddle.net/thomthom/cN4Rb/3/
  // (?) Extract 'Mac' from OSX' 'Mac; Safari' platform string?
  var environment_regex = /SketchUp\/(\d+\.\d+)\s\(([^)]+)\)/;
  var environment = environment_regex.exec( navigator.userAgent );

  return {

    /* Relay events back to the webdialog.
     */
    callback : function( controlID, event, args ) {
      if ( args === undefined ) {
        params = controlID+'||'+event;
      }
      else {
        params = controlID+'||'+event+'||'+args.join(',');
      }
      Bridge.queue_message( params )
    },

    /* Returns the hosting SketchUp version from the user agent string.
     * (i) Supported SketchUp versions:
     *     Windows: SketchUp 8 (?)
     *         OSX: SketchUp 2013
     */
    version : function() {
      if ( environment == null ) {
        return null;
      } else {
        return environment[1];
      }
    },

    /* Returns the host platform from the user agent string.
     * (i) Supported SketchUp versions:
     *     Windows: SketchUp 8 (?)
     *         OSX: SketchUp 2013
     */
    platform : function() {
      if ( environment == null ) {
        return 'OSX'; // (!) Might incorrect to assume this.
      } else {
        return environment[2]; // 'WIN'
      }
    },

    /* Return true if SketchUp is the host for the WebDialog.
     * (i) Supported SketchUp versions:
     *     Windows: SketchUp 8 (?)
     *         OSX: SketchUp 2013
     */
    is_host : function() {
      return environment != null;
    }


  };

}(); // Sketchup


/*******************************************************************************
 *
 * $SYSTEM
 *
 ******************************************************************************/


var System = function() {

  return {

    font_names : function() {
      var rgFonts = new Array();
      if ( Sketchup.platform() == 'PC' ) {
        var $body = $('body');
        var $object = $('<object>');
        $object.attr('CLASSID', 'clsid:3050f819-98b5-11cf-bb82-00aa00bdce0b');
        $object.attr('width',  '0px');
        $object.attr('height', '0px');
        $body.append( $object );
        var dlgHelper = $object.get(0);
        // Extract list of font names.
        var nFontLen = dlgHelper.fonts.count;
        for ( var i = 1; i < nFontLen + 1; i++ ) {
          rgFonts.push( dlgHelper.fonts(i) );
        }
        rgFonts.sort();
        // Clean up
        $object.remove();
      }
      return rgFonts;
    }


  };

}(); // System


/*******************************************************************************
 *
 * $CONSOLE
 *
 ******************************************************************************/

if ( true ) {
  /* Console namespace */
  var Console = function() {
    return {


      /* Relay events back to the webdialog.
       */
      log : function( string ) {
        Sketchup.callback( 'Console', 'log', [string] );
      }


    };

  }(); // Console
}


/*******************************************************************************
 *
 * $WEBDIALOG
 *
 ******************************************************************************/


var WebDialog = function() {
  return {


    /* Returns an array of the viewports' size.
     */
    get_client_size : function() {
      return [ $(window).width(), $(window).height() ];
    },


    /* Returns the IE document mode.
     */
    documentMode : function() {
      return document.documentMode;
    },


    /* Returns the quirks mode for the document.
     */
    compatMode : function() {
      // CSS1Compat = Standard
      return document.compatMode;
    },


    userAgent : function() {
      return navigator.userAgent;
    }


  };

}(); // WebDialog


/*******************************************************************************
 *
 * $BRIDGE
 *
 ******************************************************************************/


var Bridge = function() {

  /* Due to OSX' async callback nature the messages needs to be queued up and
   * carefully sent in sequence. The next message cannot be sent until a message
   * from Ruby confirms the last message was received.
   */
  var messages = [];
  var busy = false;

  return {


    /* Escapes backslashes and single quotes.
     * (private ?)
     */
    escape_string : function( value ) {
      return value.replace('\\', '\\\\').replace("'", "\\'");
    },


    /* Executes a Javascript command and returns the return value to the
     * Ruby bridge.
     */
    execute : function( code_string ) {
      // Clean up <SCRIPT></SCRIPT> elements which Ruby
      // UI::WebDialog.execute_script leaves behind.
      $('body script').detach();
      // Execute the JavaScript code and put the return value back into the
      // bridge.
      try {
        Bridge.return_ruby( eval(code_string) );
      }
      catch( error ) {
        // (?) Maybe catch window.onerror instead for IE support.
        //     http://stackoverflow.com/a/10711392/486990
        msg =  "Name: " + error.name + "\n"
        msg += "Number: " + error.number + "\n"
        msg += "Error description: " + error.description + "\n\n"
        msg += code_string
        Console.log( msg );
        throw error;
      }
    },


    /* Returns the checked state for the Checkbox control given by UI ID.
     */
    get_checkbox_state : function( ui_id ) {
      return $('#'+ui_id+' input').prop('checked');
    },


    /* Returns the checked state for the given jQuery selector.
     */
    get_checked_state : function( selector ) {
      return $(selector).prop('checked');
    },


    /* Returns the HTML for the given jQuery selector.
     */
    get_html : function( selector ) {
      return $(selector).html();
    },


    /* Returns the Rect for the Checkbox control given by UI ID.
     */
    get_control_rect : function( ui_id ) {
      $control = $('#'+ui_id);
      position = $control.position();
      width  = $control.outerWidth();
      height = $control.outerHeight();
      rect = {
        'left'   : position.left,
        'top'    : position.top,
        'right'  : position.left + width,
        'bottom' : position.top + height,
        'width'  : width,
        'height' : height
      }
      return rect;
    },


    /* Returns the text for the given jQuery selector.
     */
    get_text : function( selector ) {
      return $(selector).text();
    },


    /* Returns the value for the given jQuery selector.
     */
    get_value : function( selector ) {
      return $(selector).val();
    },


    /* Process the next message in the queue to Ruby.
     */
    push_message : function() {
      if ( busy ) {
        return false;
      } else {
        message = messages.shift();
        if ( message ) {
          busy = true;
          window.location = 'skp:SKUI_Event_Callback@' + message;
          return true;
        } else {
          return false;
        }
      }
    },


    /* Ruby calls this when a message has been received which means the next
     * message can be sent.
     */
    pump_message : function() {
      busy = false;
      Bridge.push_message();
      return busy;
    },


    /* Send the next message in the queue to Ruby.
     */
    queue_message : function( message ) {
      messages.push( message );
      return Bridge.push_message();
    },


    /* Resets the Ruby bridge.
     */
    reset : function() {
      $('#SKUI_RUBY_BRIDGE').val( '' );
    },


    /* Returns a Javascript object to the Ruby bridge element so that SketchUp
     * Ruby script can fetch the value.
     */
    return_ruby : function( value ) {
      $('#SKUI_RUBY_BRIDGE').val( Bridge.value_to_ruby(value) );
    },


    /* Sets the ID for the <BODY> element so that the Window class' properties
     * can control the appearance of the window background.
     */
    set_window_id : function( ui_id ) {
      $('body').attr( 'id', ui_id );
    },


    /* Converts Javascript objects into Ruby objects.
     *
     * TODO:
     * * JSON
     * * ...
     *
     * (private ?)
     */
    value_to_ruby : function( value ) {
      var ruby_string = '';
      switch ( $.type( value ) ) {
        case 'boolean':
          ruby_string = value.toString();
          break;
        case 'number':
          if ( isNaN( value ) ) {
            ruby_string = '0.0/0.0';
          } else if ( isFinite( value ) ) {
            ruby_string = value.toString();
          } else {
            // Infinite
            ruby_string = ( value > 0 ) ? '1.0/0.0' : '-1.0/0.0';
          }
          break;
        case 'string':
          ruby_string = "'" + Bridge.escape_string( value ) + "'";
          break;
        case 'null':
        case 'undefined':
          ruby_string = 'nil';
          break;
        case 'array':
          ruby_values = $.map(value, function(value, index) {
            return Bridge.value_to_ruby( value );
          });
          ruby_string = '[' + ruby_values.join(',') + ']';
          break;
        case 'date':
          ruby_string = 'Time.at(' + value.getTime() + ')';
          break;
        case 'regexp':
          // http://www.w3schools.com/jsref/jsref_obj_regexp.asp
          i = value.ignoreCase ? 'i' : '';
          g = value.global     ? 'g' : ''; // Not supported in Ruby.
          m = value.multiline  ? 'm' : '';
          regex = '/'+value.source+'/'+i+m;
          ruby_string = Bridge.value_to_ruby( regex );
          break;
        case 'function':
          ruby_string = "'<FUNCTION>'";
          break;
        case 'object':
          // Assume JSON.
          ruby_hash = new Array();
          $.each(value, function(k, v) {
            ruby_key   = Bridge.value_to_ruby( k );
            ruby_value = Bridge.value_to_ruby( v );
            ruby_hash.push( ruby_key + " => " + ruby_value );
          });
          ruby_string = '{' + ruby_hash.join(',') + '}';
          break;
      }
      return ruby_string;
    }


  };

}(); // Bridge


/*******************************************************************************
 *
 * $UI
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
        case 'visible':
          if ( properties.visible ) {
            $control.css( 'visibility', 'visible' );
          } else {
            $control.css( 'visibility', 'hidden' );
          }
          break;
        case 'disabled':
          $control.toggleClass( 'disabled', value );
          $control.prop( 'readonly', value );
          // Disable form controls.
          $form_elements = $control.find( 'input, select, textarea, button' );
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


/*******************************************************************************
 *
 * $INITIALIZER
 *
 ******************************************************************************/


$(document).ready( UI.init );


/*******************************************************************************
 *
 * $HELPERS
 *
 ******************************************************************************/


// (!) Move to namespaced module.

/*
 * Natural Sort algorithm for Javascript - Version 0.4 - Released under MIT license
 * Author: Jim Palmer (based on chunking idea from Dave Koelle)
 * Contributors: Mike Grier (mgrier.com), Clint Priest, Kyle Adams
 */
function naturalSort(a, b) {
  // setup temp-scope variables for comparison evauluation
  var re = /(^[0-9]+\.?[0-9]*[df]?e?[0-9]?$|^0x[0-9a-f]+$|[0-9]+)/gi,
    sre = /(^[ ]*|[ ]*$)/g,
    hre = /^0x[0-9a-f]+$/i,
    ore = /^0/,
    // convert all to strings and trim()
    x = a.toString().replace(sre, '') || '',
    y = b.toString().replace(sre, '') || '',
    // chunk/tokenize
    xN = x.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
    yN = y.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
    // hex or date detection
    xD = parseInt(x.match(hre)) || (new Date(x)).getTime(),
    yD = parseInt(y.match(hre)) || xD && (new Date(y)).getTime() || null;
  // natural sorting of hex or dates - prevent '1.2.3' valid date
  if ( y.indexOf('.') < 0 && yD )
    if ( xD < yD ) return -1;
    else if ( xD > yD ) return 1;
  // natural sorting through split numeric strings and default strings
  for(var cLoc=0, numS=Math.max(xN.length, yN.length); cLoc < numS; cLoc++) {
    // find floats not starting with '0', string or 0 if not defined (Clint Priest)
    oFxNcL = !(xN[cLoc] || '').match(ore) && parseFloat(xN[cLoc]) || xN[cLoc] || 0;
    oFyNcL = !(yN[cLoc] || '').match(ore) && parseFloat(yN[cLoc]) || yN[cLoc] || 0;
    // handle numeric vs string comparison - number < string - (Kyle Adams)
    if (isNaN(oFxNcL) !== isNaN(oFyNcL)) return (isNaN(oFxNcL)) ? 1 : -1;
    // rely on string comparison if different types - i.e. '02' < 2 != '02' < '2'
    else if (typeof oFxNcL !== typeof oFyNcL) {
      oFxNcL += '';
      oFyNcL += '';
    }
    if (oFxNcL < oFyNcL) return -1;
    if (oFxNcL > oFyNcL) return 1;
  }
  return 0;
}