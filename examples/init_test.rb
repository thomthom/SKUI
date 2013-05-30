load 'SKUI/core.rb'
Events.included
SKUI::Control
Events.included
SKUI::Window
true

w = SKUI::Window.new
Window.initialize
<SKUI::Window:0xb640018>

b = SKUI::Button.new( 'Hello' ) { puts 'World! :)' }
Button.initialize
Control.initialize
Events.initialize
<SKUI::Button:0xb632abc>

SKUI::Button.ancestors
[SKUI::Button, SKUI::Control, SKUI::Events, Object, Kernel]

SKUI::Window.ancestors
[SKUI::Window, SKUI::ContainerControl, SKUI::Events, Object, Kernel]