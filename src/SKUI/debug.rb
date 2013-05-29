module SKUI
  # @since 1.0.0
  module Debug

    @enabled = true

    # @since 1.0.0
    def self.enabled?
      @enabled == true
    end

    # @since 1.0.0
    def self.enabled=( value )
      @enabled = ( value ) ? true : false
    end

    # @since 1.0.0
    def self.puts( *args )
      p *args if @enabled
    end

  end # class
end # module