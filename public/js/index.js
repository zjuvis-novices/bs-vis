// UI control
// Resize element to fit the screen width and height
function containerResize(selector) {
    $(selector).css('width', $(window).width());
    $(selector).css('height', $(window).height() - 20);
}

// Resize element to fit the screen width only
function containerResizeWidth(selector) {
    $(selector).css('width', $(window).width());
}

// Document ready function
$(document).ready(function (){
    $('.dropdown-trigger').dropdown();
    $('.collapsible').collapsible();
    $('#preloader').hide();
    containerResize('#container');
});

// Window resize callback
$(window).resize(function (){
    containerResize('#container');
});

// Ajax loading animation
$(document).on({
    ajaxStart: function() { $('#preloader').show(1000); },
    ajaxStop: function()  { $('#preloader').hide(1000); }    
});

// Toggle control
function toggleControl() {
    if(!$('#bottom-panel').is(':visible')) {
        $('#bottom-panel').show(500);
        $('#big-fab').hide(100);
    } else {
        $('#bottom-panel').hide(500);
        $('#big-fab').show(100);
    }
}

// Toggle tab
function toggleTab(tabIndex) {
    for(var i = 1; i <= tabNumber; i++) {
        if(i != tabIndex) $('#panel-content' + i).hide();
        else $('#panel-content' + i).show();
    }
}

var poiData = null;
$.get('api/poi.json', function(data) {
    poiData = data;
    console.log(poiData)
});

var weatherData = null;
$.get('api/traffic/speed/monday/0.json', function (data) {
    weatherData = data;
    console.log(weatherData)
})
