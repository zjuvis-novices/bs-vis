// UI control
// This file is all about UI control and view
// Colors
var positiveColor   = '#893412';
var negativeColor   = '#9289A1';
var tirednessColor  = '#CFED45';
var trafficColor =  "#DB8912"

// Global variables for current selected time
const epoch = new Date('2017/7/1');
var currentDate = new Date('2017/7/1');
var currentHour = 8;
function getCurrentIndex() {
    var dTime = Math.abs(currentDate.getTime() - epoch.getTime());
    var dDays = Math.ceil(dTime/(1000*3600*24));
    return dDays * 24 + currentHour;
}

function getCurrentDay(){
    var dTime = Math.abs(currentDate.getTime() - epoch.getTime());
    var dDays = Math.ceil(dTime/(1000*3600*24));
    return dDays
}

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
    M.AutoInit();
    // Initialize date pickers
    var elems = document.querySelectorAll('.date-selection');
    initDatePicker(elems);
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
        $('#big-fab').removeClass('scale-in').addClass('scale-out');
    } else {
        $('#bottom-panel').hide(500);
        $('#big-fab').removeClass('scale-out').addClass('scale-in');
    }
}

// Date picker initialization and call back
function initDatePicker(elems) {
    var instances = M.Datepicker.init(elems, {
        autoClose:      true,
        showMonthAfterYear: true,
        format:         'yyyy/mm/dd',
        defaultDate:    new Date('2017/07/01'),
        minDate:        new Date('2017/07/01'),
        maxDate:        new Date('2017/12/31'),
        setDefaultDate: true,
        container:      '#dialog-container',
        // Localization
        i18n:           {
            cancel:         '取消',
            clear:          '清除',
            done:           '确认',
            months:         ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            monthsShort:    ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            weekdays:       ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            weekdaysShort:  ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            weekdaysAbbrev: ['日', '一', '二', '三', '四', '五', '六'],
        },
        onSelect: onDateSelection,

    });
    return instances;
}

// Refresh the UI element of time display
function refreshTimeString() {
    $('.time-string').text(currentHour + ':00');
}

// On time change event
// Format:
//      functionName: [arguments],
// To add new callbacks for this event,
// use
//      onTimeChangeCallbacks.newFunctionName = [arguments]
// or
//      onTimeChangeCallbacks['newFunctionName'] = [arguments]
var onTimeChangeCallbacks = {
    refreshTimeString: []
};

function dateSlashString(date) {
    var year    = date.getFullYear();
    var month   = date.getMonth() + 1;
    var date    = date.getDate();
    return '' + year + '/' + (month<10?'0'+month:month) + '/'
            + (date<10?'0'+date:date);
}
function onTimeChange(id) {
    currentHour = parseInt($('#' + id).val());
    $('.hour[id!="' + id + '"]').val(currentHour);
    // Call all the associated callbacks
    for(var callback in onTimeChangeCallbacks) {
        // Function call
        window[callback].apply(this, onTimeChangeCallbacks[callback]);
    }
}

// This stuff is similar to the one above
var onDateSelectionCallbacks = {};
function onDateSelection(date) {
    currentDate = date;
    $('.date-selection').val(dateSlashString(date));
    for(var callback in onDateSelectionCallbacks) {
        // Function call
        window[callback].apply(this, onDateSelectionCallbacks[callback]);
    }
}

var currentDisplay = {};

// This stuff is ugly. It should have better design.
function updateDisplayStatus() {
    if($('#display-type').val() === '1') {
        currentDisplay['bubble'] = true;
        delete currentDisplay['heat'];
    } else {
        currentDisplay['heat'] = true;
        delete currentDisplay['bubble'];
    }

    if($('#emotion-display').is(':checked')) {
        currentDisplay['emotion'] = true;
    } else {
        delete currentDisplay['emotion'];
    }

    if($('#traffic-display').is(':checked')) {
        currentDisplay['traffic'] = true;
    } else {
        delete currentDisplay['traffic'];
    }

    if($('#positive').is(':checked')) {
        currentDisplay['positive'] = true;
    } else {
        delete currentDisplay['positive'];
    }

    if($('#negative').is(':checked')) {
        currentDisplay['negative'] = true;
    } else {
        delete currentDisplay['negative'];
    }

    if($('#tiredness').is(':checked')) {
        currentDisplay['tiredness'] = true;
    } else {
        delete currentDisplay['tiredness'];
    }
}

var onToggleEmotionCallbacks = {};
function onToggleEmotion() {
    updateDisplayStatus();
    for(var callback in onToggleEmotionCallbacks) {
        // Function call
        window[callback].apply(this, onToggleEmotionCallbacks[callback]);
    }
}

var onChangeVisualCallbacks = {};
function onChangeVisual() {
    updateDisplayStatus();
    for(var callback in onChangeVisualCallbacks) {
        // Function call
        window[callback].apply(this, onChangeVisualCallbacks[callback]);
    }
}

var onToggleDispalyCallbacks = {};
function onToggleDispaly() {
    updateDisplayStatus();
    for(var callback in onToggleDispalyCallbacks) {
        // Function call
        window[callback].apply(this, onToggleDispalyCallbacks[callback]);
    }
}

function updateLineDisplayStatus(){
    if($('#positiveLine').is(':checked')) {
        currentLineDisplay['positive'] = true;
    } else {
        delete currentLineDisplay['positive'];
    }

    if($('#negativeLine').is(':checked')) {
        currentLineDisplay['negative'] = true;
    } else{
        delete currentLineDisplay['negative'];
    }
    if($('#tirednessLine').is(':checked')) {
        currentLineDisplay['tiredness'] = true;
    } else{
        delete currentLineDisplay['tiredness'];
    }
}

var currentLineDisplay = {positive: true, negative: true, tiredness: true};
var onToggleLineCallbacks = {};
function  onToggleLine() {
    updateLineDisplayStatus();
    for(var callback in onToggleLineCallbacks){
        window[callback].apply(this, onToggleLineCallbacks[callback]);
    }
}

var currentCalendarType = 'positive';
var onToggleCalendarCallbacks = {};
function onToggleCalendar() {
    if($('#positive-calendar').is(':checked')) {
        currentCalendarType = 'positive';
    } else if($('#negative-calendar').is(':checked')) {
        currentCalendarType = 'negative';
    } else {
        currentCalendarType = 'tiredness';
    }
    for(var callback in onToggleCalendarCallbacks) {
        // Function call
        window[callback].apply(this, onToggleCalendarCallbacks[callback]);
    }
}