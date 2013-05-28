module SKUI
  # Mix-in module for the Control class. Simplifies the definition of properties
  # with getter and setter methods that access the +@properties+ stack.
  #
  # @since 1.0.0
  module Properties

    # @since 1.0.0
    def prop( *symbols )
      self.class_eval {
        prop_reader( *symbols )
        prop_writer( *symbols )
      }
    end
    alias :prop_accessor :prop

    # @since 1.0.0
    def prop_bool( *symbols )
      prop_reader_bool( *symbols )
      prop_writer( *symbols )
    end

    # @since 1.0.0
    def prop_reader( *symbols )
      self.class_eval {
        # (i) Must use `#each` instead of `for in` because otherwise the symbol
        #     variable would not be locale to each method definition and
        #     @properties[ symbol ] would point to the last `symbol` in the
        #     `symbols` array.
        symbols.each { |symbol|
          define_method( symbol ) {
            @properties[ symbol ]
          }
        }
      }
    end

    # @since 1.0.0
    def prop_reader_bool( *symbols )
      self.class_eval {
        symbols.each { |symbol|
          symbol_bool = "#{symbol}?".intern
          define_method( symbol_bool ) {
            @properties[ symbol ]
          }
        }
      }
    end

    # @since 1.0.0
    def prop_writer( *symbols )
      self.class_eval {
        symbols.each { |symbol|
          symbol_set = "#{symbol}=".intern
          define_method( symbol_set ) { |value|
            @properties[ symbol ] = value
            update_properties( symbol )
            value
          }
        }
      }
    end

  end # module
end # module