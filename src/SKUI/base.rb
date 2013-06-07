module SKUI
  # @since 1.0.0
  class Base

    require File.join( PATH, 'events.rb' )
    require File.join( PATH, 'json.rb' )
    require File.join( PATH, 'properties.rb' )
    require File.join( PATH, 'typecheck.rb' )

    include Events
    extend Properties

    # @return [ControlManager, Nil]
    # @since 1.0.0
    prop( :parent, &TypeCheck::CONTAINER )

    # @return [JSON]
    # @since 1.0.0
    attr_accessor( :properties )

    # @return [Window, Nil]
    # @since 1.0.0
    attr_accessor( :window )

    # @since 1.0.0
    def initialize
      super()
      # @properties contains all the data that must be shared with the webdialog
      # in order to sync everything on both ends.
      @properties = JSON.new
    end

    # @return [String]
    # @since 1.0.0
    def inspect
      "<#{self.class}:#{object_id_hex}>"
    end

    # @return [String]
    # @since 1.0.0
    def typename
      self.class.to_s.split( '::' ).last
    end

    private

    # @return [String]
    # @since 1.0.0
    def object_id_hex
      "0x%x" % ( self.object_id << 1 )
    end

  end # class
end # module