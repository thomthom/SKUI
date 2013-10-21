##### Configure Yard Task ######################################################

# Run by typing: rake yard

PATH = File.dirname(__FILE__)

require 'yard'
require File.join( PATH, 'yard_extensions')
require File.join( PATH, 'src', 'SKUI', 'version' )

# https://github.com/lsegal/yard
YARD::Rake::YardocTask.new do |task|
  task.files    = [ 'src/SKUI/*.rb' ]
  task.options += ['--title', "SKUI #{SKUI::VERSION} Documentation"]
end