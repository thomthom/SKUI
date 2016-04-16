/*******************************************************************************
 *
 * class UI.ImageButton
 *
 ******************************************************************************/


ImageButton.prototype = new Control();
ImageButton.prototype.constructor = ImageButton;

function ImageButton( jquery_element ) {
    Control.call( this, jquery_element );
}

UI.ImageButton = ImageButton;

ImageButton.add = function( properties ) {
    // Build DOM objects.
    var $control = $('<img/>');
    $control.addClass('control control-imagebutton');
    // Initialize wrapper.
    var control = new ImageButton( $control );
    control.update( properties );
    // Set up events.
    UI.add_event( 'click', $control );
    // Attach to document.
    control.attach();
    return control;
};
ImageButton.prototype.set_file = function( value ) {
    this.control.attr( 'src', value );
    return value;
};

ImageButton.prototype.set_activestatefile = function( value ) {

    if ( value != ''){
        var original_src = this.control.attr( 'src');

        this.control.off('mousedown');
        this.control.off('mouseup');
        this.control.off('mouseleave');
        this.control.off('mouseover');

        this.control.on('mousedown', function() {
            original_src = $(this).attr( 'src');
            $(this).attr( 'src', value );
            $(this).addClass("activestate");
            return false;
        });

        this.control.on('mouseup', function() {
            $(this).attr( 'src', original_src );
            $(this).removeClass("activestate");
            return false;
        });

        this.control.on('mouseleave', function() {
            if ($(this).attr( 'src') == value){
                $(this).attr( 'src', original_src );
            }
            return false;
        });

        this.control.on('mouseover', function() {
            if ($(this).hasClass("activestate")){
                $(this).attr( 'src', value );
            }
            return false;
        });

        $(document).on('mouseup', function() {
           $(".activestate").removeClass("activestate");
            return false;
        });
    }
    return value;
};

