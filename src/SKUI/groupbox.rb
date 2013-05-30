module SKUI

  require File.join( PATH, 'control.rb' )


  # @since 1.0.0
  class Groupbox < Container

    # @since 1.0.0
    prop( :label )

    # @param [String] label
    #
    # @since 1.0.0
    def initialize( label = '' )
      super()
      @properties[ :label ] = label
    end

  end # class
end # module