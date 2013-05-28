module SKUI
  # @since 1.0.0
  module Debug

    @enabled = true

    def self.enabled?
      @enabled == true
    end

    def self.enabled=( value )
      @enabled = ( value ) ? true : false
    end

    def self.puts( *args )
      p *args if @enabled
    end

  end # class
end # module