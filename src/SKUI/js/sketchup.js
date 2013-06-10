/*******************************************************************************
 *
 * module Sketchup
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