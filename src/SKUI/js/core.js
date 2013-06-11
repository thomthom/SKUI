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

// UI Controls
head.js( path + 'ui.base.js' );
head.js( path + 'ui.control.js' );
head.js( path + 'ui.button.js' );
head.js( path + 'ui.checkbox.js' );
head.js( path + 'ui.container.js' );
head.js( path + 'ui.groupbox.js' );
head.js( path + 'ui.label.js' );
head.js( path + 'ui.listbox.js' );
head.js( path + 'ui.radiobutton.js' );
head.js( path + 'ui.textbox.js' );
head.js( path + 'ui.window.js' );

head.ready(function() {
  UI.init();
});
