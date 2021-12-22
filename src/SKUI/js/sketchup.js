/*******************************************************************************
 *
 * module Sketchup
 *
 ******************************************************************************/


var Sketchup = function() {

  // http://jsfiddle.net/thomthom/cN4Rb/3/
  // (?) Extract 'Mac' from OSX' 'Mac; Safari' platform string?
  /*
var user_agent_win_su8    = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0) Google-SketchUp/8.0 (PC)';
var user_agent_win_su2013 = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0) SketchUp/13.0 (PC)';
var user_agent_osx_su2013 = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_3) AppleWebKit/536.28.10 (KHTML, like Gecko) SketchUp/13.0 (Mac; Safari)';
var user_agent_win_su2021 = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; Trident/7.0; rv:11.0) like Gecko SketchUp Pro/21.1 (PC)';

var pattern = /SketchUp(?: Pro)?\/(\d+\.\d+)\s\(([^)]+)\)/;

var match_win_su8    = pattern.exec(user_agent_win_su8 );
var match_win_su2013 = pattern.exec(user_agent_win_su2013);
var match_osx_su2013 = pattern.exec(user_agent_osx_su2013);
var match_osx_su2021 = pattern.exec(user_agent_win_su2021);

document.body.innerHTML =
    '<b>Win SketchUp 8 - Version:</b> ' + match_win_su8[1] + ' - <b>OS:</b> ' + match_win_su8[2] + '<hr>' +
    '<b>Win SketchUp 2013 - Version:</b> ' + match_win_su2013[1] + ' - <b>OS:</b> ' + match_win_su2013[2] + '<hr>' +
    '<b>OSX SketchUp 2013 - Version:</b> ' + match_osx_su2013[1] + ' - <b>OS:</b> ' + match_osx_su2013[2] + '<hr>' +
    '<b>Win SketchUp 2021 - Version:</b> ' + match_osx_su2021[1] + ' - <b>OS:</b> ' + match_osx_su2021[2] + '<hr>'
;
  */
  // var environment_regex = /SketchUp\/(\d+\.\d+)\s\(([^)]+)\)/;
  var environment_regex = /SketchUp(?: Pro)?\/(\d+\.\d+)\s\(([^)]+)\)/;
  var environment = environment_regex.exec( navigator.userAgent );

  return {

    /* Relay events back to the webdialog.
     */
    callback : function( event_name /*, *args*/ ) {
      var args = Array.prototype.slice.call( arguments );
      //var message = args.join( '||' );
      Bridge.queue_message( args );
    },

    /* Relay control events back to the webdialog.
     */
    control_callback : function( ui_id, event_name, event_args ) {
      var args = [
        'SKUI::Control.on_event',
        ui_id,
        event_name
      ].concat( event_args );
      Sketchup.callback.apply( this, args );
      //Sketchup.callback( 'SKUI::Control.on_event', ui_id, event, args );
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


  /* Helper function to simulate the Ruby *splat argument syntax. */
  function get_splat_args( func, args ) {
    return Array.prototype.slice.call( args, func.length );
  }

}(); // Sketchup
