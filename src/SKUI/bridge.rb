module SKUI

  require File.join( PATH, 'container_control.rb' )
  require File.join( PATH, 'control.rb' )
  require File.join( PATH, 'json.rb' )

  
  # Handles the communication between Ruby and the WebDialog.
  #
  # @since 1.0.0
  class Bridge

    # @since 1.0.0
    class CommunicationError < StandardError; end

    # @since 1.0.0
    def initialize( window, webdialog )
      @window = window
      @webdialog = webdialog
    end

    # Wrapper to build a script string and return the return value of the called
    # Javascript function.
    #
    # This method also ensures a that the +<SCRIPT>+ elements which
    # +UI::WebDialog.execute_script+ leaves behind is cleaned up.
    #
    #  return_value = window.bridge.call('alert', 'Hello World')
    #
    # @param [String] function Name of JavaScript function to call.
    #
    # @return [Mixed]
    # @since 1.0.0
    def call( function, *args )
      # A JavaScript command is prepared and sent to the JS bridge which then
      # evaluates it and puts the return value into a hidden <input> element
      # which is then pulled back from Ruby and evaluated as Ruby objects.

      # Ensure that we don't pull old data back from the WebDialog in case there
      # is stale data due to some previous error.
      @webdialog.execute_script( 'Bridge.reset()' )
      # (!) SU-0415
      # Reports of .execute_script might have a hard limit - possibly under OSX
      # only. Windows does seem unaffected. 
      # Test case:
      #  w.execute_script("alert('#{'x'*10000000}'.length);")
      arguments = args.map { |arg| JSON.object_to_js( arg ) }.join(',')
      javascript = "#{function}(#{arguments});".inspect
      # If WebDialog is not visible, or no HTML is populated (lacking DOM) then
      # .execute_script returns false.
      #
      # (i) OSX - SU6
      # http://forums.sketchucation.com/viewtopic.php?f=180&t=8316#p49259
      # Indicates that ; might cause the call to fail. Seems to work without,
      # so keeping it like that to be on the safe size.
      # puts "Bridge.execute(#{javascript})" #DEBUG
      unless @webdialog.execute_script( "Bridge.execute(#{javascript})" )
        if @webdialog.visible?
          raise( CommunicationError, 'Window not visible.' )
        else
          raise( CommunicationError, 'Unknown error. Ensure DOM is ready.' )
        end
      end
      # (?) Catch JavaScript errors? Or just let the WebDialog display the error?
      raw_data = @webdialog.get_element_value( 'SKUI_RUBY_BRIDGE' );
      # The JS Bridge converts the JS values into Ruby code strings.
      # (?) Catch exceptions? Re-raise with custom exception?
      eval( raw_data ) # (?) Bind to top level scope?
    end

    # Internal method.
    # 
    # @private
    #
    # @param [Control] control
    #
    # @return [Nil]
    # @since 1.0.0
    def add_control( control )
      call( 'UI.add_control', control.properties )
      nil
    end

    # @return [Nil]
    # @since 1.0.0
    def add_container( container )
      # (?) Compile into one large function call, might it be faster to execute?
      for control in container.controls
        add_control( control )
        if control.is_a?( ContainerControl )
          add_container( control )
        end
      end
      nil
    end

  end # class
end # module