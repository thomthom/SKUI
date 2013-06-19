# Work in Progress

This project is at it's early stages. Many changes will happen. Please do not make use of it as of yet. It's availible here in order to be able to discuss the project.

It is forked from the `TT::GUI` module from the TT_Lib² library.
http://www.thomthom.net/software/sketchup/tt_lib2/doc/TT/GUI.html

It's goal is to provide wrapper classes to manipulate GUI control elements in SketchUp's `UI::WebDialog` API.

```ruby
w = SKUI::Window.new
b = SKUI::Button.new( 'Hello' ) { puts 'World! :)' }
b.position( 10, 5 )
w.add_control( b )
w.show
```

# Requirements

* SketchUp 6+
* Windows: Internet Explorer 8+ *
* OSX: ?

_* RGBa colour values will display as opaque RGB in IE8_

## Recommended

* SketchUp 7+
* Windows: Internet Explorer 9+
* OSX: ?