module SKUI

  require File.join( PATH, 'control.rb' )


  # @since 1.0.0
  class Listbox < Control

    # @since 1.0.0
    prop_reader( :items, :multiple, :size )

    # @since 1.0.0
    define_event( :change )
    
    # @param [Array<String>] list
    # @param [Proc] on_click
    #
    # @since 1.0.0
    def initialize( list = [] )
      unless list.is_a?( Array )
        raise( ArgumentError, 'Not an array.' )
      end
      # (?) Check for String content? Convert to strings? Accept #to_a objects?
      super()
       # (?) Should the :items list be a Hash instead? To allow key/value pairs.
      @properties[ :items ] = list
      @properties[ :multiple ] = false
    end

    # @overload add_item(string)
    #   @param [String] string
    #
    # @overload add_item(string, ...)
    #   @param [String] string
    #
    # @return [String]
    # @since 1.0.0
    def add_item( *args )
      args = args[0] if args.size == 1 && args[0].is_a?( Array )
      if args.size == 1
        @properties[ :items ] << args[0]
        window.bridge.call( 'UI.add_list_item', ui_id, args[0] )
      else
        @properties[ :items ].concat( args )
        window.bridge.call( 'UI.add_list_item', ui_id, args )
      end
    end

    # @return [String]
    # @since 1.0.0
    def value
      value = window.bridge.get_control_value( ui_id )
    end
    
    # @param [String] string
    #
    # @return [String]
    # @since 1.0.0
    def value=( string )
      unless @properties[ :items ].include?( string )
        raise ArgumentError, "'#{string}' not a valid value in list."
      end
      @properties[ :value ] = string
      update_properties( :value )
      string
    end

  end # class
end # module