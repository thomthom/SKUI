module SKUI

  require File.join( PATH, 'control.rb' )


  # @since 1.0.0
  class Textbox < Control

    # @since 1.0.0
    prop_reader_bool( :value )
    prop_bool( :multiline )

    # @since 1.0.0
    define_event( :change )
    define_event( :textchange )
    define_event( :keydown, :keypress, :keyup )
    define_event( :focus, :blur )
    define_event( :copy, :cut, :paste )
    
    # @param [String] value
    #
    # @since 1.0.0
    def initialize( value = '' )
      super()
      @properties[ :value ] = value
    end

    # @return [String]
    # @since 1.0.0
    def value
      value = window.bridge.get_control_value( ui_id )
    end

  end # class
end # module