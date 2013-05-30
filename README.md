# Work in Progress

This project is at it's early stages. Many changes will happen. Please do not make use of it as of yet. It's availible here in order to be able to discuss the project.

It is forked from the `TT::GUI` module from the TT_Lib² library.
http://www.thomthom.net/software/sketchup/tt_lib2/doc/TT/GUI.html

It's goal is to provide wrapper classes to manipulate GUI control elements in SketchUp's `UI::WebDialog` API.

```ruby
options = {
  :title           => 'Hello World',
  :preferences_key => 'SKUI_Test',
}
w = SKUI::Window.new( options )
b = SKUI::Button.new( 'Hello' ) { puts 'World! :)' }
b.position( 10, 5 )
w.add_control( b )
w.show
```

# Data Syncronisation

## Properties

All the Ruby data that needs to be sent to the `UI::WebDialog` should be added to the `@property` stack. The update mechanism will push all required data to the `UI::WebDialog` where the GUI will be synced to match the state of the Ruby controls.
