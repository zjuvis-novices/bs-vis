
function containerResize(selector) {
    $(selector).css('width', $(window).width());
    $(selector).css('height', $(window).height() - 20);
}

function containerResizeWidth(selector) {
    $(selector).css('width', $(window).width());
}

// Document ready function
$(document).ready(function (){
    $('.dropdown-trigger').dropdown();
    containerResize('#container');
});

$(window).resize(function (){
    containerResize('#container');
});