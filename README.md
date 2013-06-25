# Work in Progress

This project is at it's early stages. Many changes will happen. Please do not make use of it as of yet. It's available here in order to be able to discuss the project.

## To-do

* Work out an easy way of implement and distribute. #39
* Address [Milestone 1 Issues](https://github.com/thomthom/SKUI/issues?milestone=1&state=open)

# Overview

The goal of this framework is to provide Ruby wrapper classes to manipulate GUI control elements in SketchUp's `UI::WebDialog` API.

It is forked from the [`TT::GUI` module](http://www.thomthom.net/software/sketchup/tt_lib2/doc/TT/GUI.html ) from the [TT_Lib² library](https://bitbucket.org/thomthom/tt-library-2).

## Hello World

```ruby
w = SKUI::Window.new
b = SKUI::Button.new( 'Hello' ) { puts 'World! :)' }
b.position( 10, 5 )
w.add_control( b )
w.show
```

## Version compatibility

Once version 1 is release, updates should preserve backwards compatibility within their major version. Breaking changes will be scheduled for next major version release.

# Requirements

* SketchUp 6+
* Windows: Internet Explorer 8+ *
* OSX: ?

_* RGBa colour values will display as opaque RGB in IE8_

## Recommended

* SketchUp 7+
* Windows: Internet Explorer 9+
* OSX: ?
