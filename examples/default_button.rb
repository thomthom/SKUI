load 'SKUI/core.rb'

w = SKUI::Window.new

t1 = SKUI::Textbox.new
t1.position(5,5)
w.add_control t1

t2 = SKUI::Textbox.new
t2.position(5,30)
w.add_control t2

t3 = SKUI::Textbox.new
t3.position(5,55)
w.add_control t3

b1 = SKUI::Button.new('Hello') { puts 'hello' }
b1.position 160, 5
w.add_control b1

b2 = SKUI::Button.new('World') { puts 'world' }
b2.position 160, 30
w.add_control b2

b3 = SKUI::Button.new('Foo') { puts 'foo' }
b3.position 160, 60
w.add_control b3
b3.tab_index = 1

w.default_button = b3

w.show