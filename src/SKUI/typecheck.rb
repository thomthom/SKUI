module SKUI

  require File.join( PATH, 'enum_system_color.rb' )


  # Module collection of `Proc`s that can be used to check types when defining
  # properties. The Proc should return the value given. Return unmodified to
  # preserve the value as it was given, or made modifications, such as for
  # a boolean type check you want to convert the value, that might be any value,
  # to a true boolean.
  #
  # @example Make a property ensure the set value is a valid colour value.
  #   class Container < Control
  #     include ControlManager
  #     prop( :background_color, &TypeCheck::COLOR )
  #     prop( :enabled,          &TypeCheck::BOOLEAN )
  #    end
  #
  # @since 1.0.0
  module TypeCheck

    # @since 1.0.0
    COLOR = Proc.new { |value|
      unless value.is_a?( Sketchup::Color ) || SystemColor.valid?( value )
        raise( ArgumentError, 'Not a valid color.' )
      end
      value
    }

    # @since 1.0.0
    BOOLEAN = Proc.new { |value|
      # Cast the value into true boolean values.
      value ? true : false
    }

  end # module
end # module
