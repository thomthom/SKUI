module SKUI

  require File.join( PATH, 'control.rb' )
  require File.join( PATH, 'control_manager.rb' )
  require File.join( PATH, 'enum_system_color.rb' )


  # Container control grouping child controls.
  #
  # @since 1.0.0
  class Container < Control

    include ControlManager

    prop( :foreground_color, &TypeCheck::COLOR )
    prop( :background_color, &TypeCheck::COLOR )

  end # class
end # module