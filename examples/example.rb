load 'SKUI/core.rb'

options = {
  :title           => 'SKUI Control Examples',
  :preferences_key => 'SKUI_Example',
  :width           => 300,
  :height          => 200
}
window = SKUI::Window.new( options )

group = SKUI::Groupbox.new( 'Groupbox' )
group.position( 5, 5 )
group.right = 5
group.height = 100
window.add_control( group )

txt_input = SKUI::Textbox.new( 'SketchUp' )
txt_input.name = :txt_name
txt_input.position( 60, 20 )
txt_input.width = 190
txt_input.right = 10 # (!) Currently ignored by browser.
group.add_control( txt_input )

lbl_input = SKUI::Label.new( 'Name:', txt_input )
lbl_input.position( 10, 23 )
lbl_input.width = 50
group.add_control( lbl_input )

list = %w{ Hello World Lorem Ipsum }
lst_dropdown = SKUI::Listbox.new( list )
lst_dropdown.value = lst_dropdown.items.first
lst_dropdown.left = 10
lst_dropdown.bottom = 10
lst_dropdown.width = 170
lst_dropdown.on( :change ) { |control, value| # (?) Second argument needed?
  puts "Dropbox value: #{control.value}"
}
group.add_control( lst_dropdown )

btn_hello = SKUI::Button.new( 'Hello' ) { |control|
  name = control.window[:txt_name].value
  puts "Hello #{name}"
  UI.messagebox( "Hello #{name}" )
}
btn_hello.right = 10
btn_hello.bottom = 10
group.add_control( btn_hello )

btn_test = SKUI::Button.new( 'Test' ) { |control|
  puts 'Testing...'
}
btn_test.left = 5
btn_test.bottom = 5
window.add_control( btn_test )

btn_close = SKUI::Button.new( 'Close' ) { |control|
  control.window.close
}
btn_close.right = 5
btn_close.bottom = 5
window.add_control( btn_close )

window.show