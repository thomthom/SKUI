load 'SKUI/core.rb'

module SKUI::Examples
def self.show

options = {
  :title           => 'SKUI Control Examples',
  :preferences_key => 'SKUI_Example',
  :width           => 400,
  :height          => 400
}
window = SKUI::Window.new( options )

# These events doesn't trigger correctly when Firebug Lite
# is active because it introduces frames that interfere with
# the focus notifications.
window.on( :focus ) { puts 'Window Focus' }
window.on( :blur ) { puts 'Window Blur' }

group = SKUI::Groupbox.new( 'Groupbox' )
group.position( 5, 5 )
group.right = 5
group.height = 100
group.foreground_color = Sketchup::Color.new( 192, 0, 0 )
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
lst_dropdown.position( 10, -10 )
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
btn_hello.position( -10, -10 )
btn_hello.tooltip = 'Click me!'
group.add_control( btn_hello )

group2 = SKUI::Groupbox.new( 'Multiline Text and List' )
group2.position( 5, 110 )
group2.right = 5
group2.height = 130
window.add_control( group2 )

txt_area = SKUI::Textbox.new( 'Lorem Ipsum' )
txt_area.multiline = true
txt_area.position( 10, 20 )
txt_area.width = 130
txt_area.height = 90
group2.add_control( txt_area )

list = %w{ Hello World Lorem Ipsum }
lst_list = SKUI::Listbox.new( list )
lst_list.size = 4
lst_list.multiple = true
lst_list.value = lst_list.items.first
lst_list.position( 145, 20 )
lst_list.width = 130
lst_list.height = 90
lst_list.on( :change ) { |control, value|
  puts "Listbox value: #{control.value}"
}
group2.add_control( lst_list )

path = File.join( SKUI::PATH, '..', '..', 'examples' )
file = File.join( path, 'cookie.png' )

img_cookie = SKUI::Image.new( file )
img_cookie.position( 280, 20 )
img_cookie.width = 32
group2.add_control( img_cookie )

group3 = SKUI::Groupbox.new( 'Option Groups' )
group3.position( 5, 245 )
group3.right = 5
group3.height = 100
window.add_control( group3 )

r1 = SKUI::RadioButton.new( 'Foo' )
r1.position( 10, 20 )
r1.on( :change ) { |control|
  puts "RadioButton.change - #{control}"
  puts "> Siblings: #{control.siblings.inspect}"
  puts "> Selected: #{control.checked_sibling.inspect}"
}
group3.add_control( r1 )

r2 = SKUI::RadioButton.new( 'Bar' )
r2.position( 10, 40 )
group3.add_control( r2 )

r3 = SKUI::RadioButton.new( 'Biz' )
r3.position( 10, 60 )
group3.add_control( r3 )

container = SKUI::Container.new
container.foreground_color = SKUI::SystemColor::HIGHLIGHT
container.background_color = Sketchup::Color.new( 192, 92, 64, 64 )
container.stretch( 100, 20, 10, 5 )
group3.add_control( container )

r4 = SKUI::RadioButton.new( 'Lorem', true )
r4.position( 10, 0 )
container.add_control( r4 )

r5 = SKUI::RadioButton.new( 'Ipsum' )
r5.position( 10, 20 )
container.add_control( r5 )

r6 = SKUI::RadioButton.new( 'Dolor' )
r6.position( 10, 40 )
container.add_control( r6 )

btn_test = SKUI::Button.new( 'Test' ) { |control|
  puts 'Testing...'
}
btn_test.position( 5, -5 )
btn_test.font = SKUI::Font.new( 'Comic Sans MS', 14, true )
window.add_control( btn_test )

chk_hide = SKUI::Checkbox.new( 'Hide' )
chk_hide.left = btn_test.left + btn_test.width + 5
chk_hide.bottom = 8
chk_hide.on( :change ) { |control|
  puts "Checkbox: #{control.checked?}"
  btn_test.visible = !control.checked?
}
window.add_control( chk_hide )

lbl_url = SKUI::Label.new( 'SKUI on GitHub' )
lbl_url.position( -85, -10 )
lbl_url.url = 'https://github.com/thomthom/SKUI'
window.add_control( lbl_url )

btn_close = SKUI::Button.new( 'Close' ) { |control|
  control.window.close
}
btn_close.position( -5, -5 )
window.add_control( btn_close )

window.default_button = btn_test
window.cancel_button = btn_close

window.show

window
end # def
end # module
window = SKUI::Examples.show