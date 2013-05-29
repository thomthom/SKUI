module SKUI

  require File.join( PATH, 'control.rb' )


  # @since 1.0.0
  class Label < Control

    # @since 1.0.0
    prop( :caption )
    prop( :control )
    prop( :url )

    # @since 1.0.0
    define_event( :open_url )
    
    # @param [String] caption
    # @param [Control] control Control which focus of forwarded to.
    #
    # @since 1.0.0
    def initialize( caption, control = nil )
      super()

      @properties[ :caption ] = caption
      @properties[ :control ] = control

      add_event_handler( :open_url ) { |param|
        UI.openURL( param )
      }
    end

  end # class
end # module