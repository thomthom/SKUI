var path = '../js/';

// Libraries
head.js( path + 'lib/jquery.js' );
head.js( path + 'lib/jquery.textchange.min.js' );

// Classes
head.js( path + 'color.js' );
head.js( path + 'point3d.js' );
head.js( path + 'string.js' );
head.js( path + 'vector3d.js' );

// Modules
head.js( path + 'bridge.js' );
head.js( path + 'common.js' );
head.js( path + 'console.js' );
head.js( path + 'sketchup.js' );
head.js( path + 'system.js' );
head.js( path + 'ui.js' );
head.js( path + 'webdialog.js' );

head.ready(function() {
  UI.init();
});
