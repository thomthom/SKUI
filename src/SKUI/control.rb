module SKUI

  require File.join( PATH, 'events.rb' )
  require File.join( PATH, 'json.rb' )
  require File.join( PATH, 'properties.rb' )


  # Base class which all SKUI controls inherit from.
  #
  # @since 1.0.0
  class Control

    include Events
    extend Properties

    prop_reader( :ui_id ) # :id would conflict with Object.id

    prop_bool( :enabled )
    prop_bool( :visible )

    prop( :name )
    prop( :left, :top, :right, :bottom )
    prop( :width, :height )
    prop( :tooltip )

    prop_writer( :font_name, :font_size ) # (!) Needs more work.

    attr_accessor( :properties )
    attr_accessor( :parent, :window )

    # @since 1.0.0
    def initialize
      super()
      # @properties contains all the data that must be shared with the webdialog
      # in order to sync everything on both ends.
      @properties = JSON.new
      @properties[ :ui_id ]   = "UI_#{object_id()}"
      @properties[ :type ] = typename()
    end

    # @return [String]
    # @since 1.0.0
    def inspect
      "<#{self.class}:#{object_id_hex()}>"
    end

    # @param [Numeric] left
    # @param [Numeric] top
    #
    # @since 1.0.0
    def position( left, top )
      @properties[ :left ] = left
      @properties[ :top ]  = top
      update_properties( :left, :top )
      [ left, top ]
    end

    # Release all references to other objects. Setting them to nil. So that
    # the GC can collect them.
    #
    # @return [Nil]
    # @since 1.0.0
    def release!
      release_events()
      @parent = nil
      @window = nil
      nil
    end

    # @param [Numeric] width
    # @param [Numeric] height
    #
    # @since 1.0.0
    def size( width, height )
      @properties[ :width ]  = width
      @properties[ :height ] = height
      update_properties( :width, :height )
      [ width, height ]
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

    # Call this method whenever a control property changes, spesifying which
    # properties changed. This is sent to the WebDialog for syncing.
    #
    # @param [Symbol] *properties
    #
    # @return [Boolean]
    # @since 1.0.0
    def update_properties( *properties )
      if window && window.visible?
        # These properties must always be included unmodified.
        base_properties = {
          :type  => self.typename
        }
        # The given properties will be sent to the WebDialog where it updates
        # the UI to match the state of the Ruby objects.
        control_properties = JSON.new
        for property in properties
          control_properties[ property ] = @properties[ property ]
        end
        control_properties.merge!( base_properties )
        window.bridge.call( 'UI.update_properties', ui_id, control_properties )
        true
      else
        false
      end
    end

  end # class
end # module