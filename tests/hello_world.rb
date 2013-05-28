load 'SKUI/core.rb'

options = {
  :title           => 'Hello World',
  :preferences_key => 'SKUI_Test',
}
w = SKUI::Window.new( options )
b = SKUI::Button.new( 'Hello' ) { puts 'World! :)' }
b.position( 10, 5 )
w.add_control( b )
w.show