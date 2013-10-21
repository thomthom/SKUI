class ControlPropertyHandler < YARD::Handlers::Ruby::AttributeHandler

  handles method_call( :prop )
  handles method_call( :prop_accessor )
  handles method_call( :prop_bool )
  handles method_call( :prop_reader )
  handles method_call( :prop_reader_bool )
  handles method_call( :prop_writer )

  namespace_only

  def process
    push_state( :scope => :class ) { super }
  end

end # class
