module SKUI

  require File.join( PATH, 'control.rb' )


  # @since 1.0.0
  class ImageButton < Control

    # @return [String]
    # @since 1.0.0
    prop( :caption, &TypeCheck::STRING )
    prop( :file, &TypeCheck::STRING )
    prop( :activestatefile, &TypeCheck::STRING )

    # @since 1.0.0
    define_event( :click )
    
    # @param [String] caption
    # @param [Proc] on_click
    #
    # @since 1.0.0
    def initialize( filename, activestatefile, &on_click)
      super()

      @properties[ :file ] = filename
      @properties[ :activestatefile ] = activestatefile

      if block_given?
        add_event_handler( :click, &on_click )
      end
    end

  end # class
end # module