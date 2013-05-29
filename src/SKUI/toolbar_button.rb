module SKUI

  require File.join( PATH, 'control.rb' )


  # @since 1.0.0
  class ToolbarButton < Button

    # @since 1.0.0
    prop( :icon )
    
    # @param [String] caption
    # @param [Proc] on_click
    #
    # @since 1.0.0
    def initialize( caption, &on_click )
      super
      # (!) Implement better handling of toolbar size.
      @properties[ :width ]  = 28
      @properties[ :height ] = 28
    end

  end # class
end # module