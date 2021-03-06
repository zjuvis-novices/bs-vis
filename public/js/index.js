// UI control
// This file is all about UI control and view
// Colors
var adColor         = '#0089A7';
var illegalColor    = '#E98B2A';
var scamColor       = '#B5495B';
var otherColor      = '#23A286';

// Global variables for current selected time
const epoch = new Date('2017/2/23');
var currentDate = new Date('2017/2/23');
var currentHour = 8;
function getCurrentIndex() {
    var dTime = Math.abs(currentDate.getTime() - epoch.getTime());
    var dDays = Math.ceil(dTime/(1000*3600*24));
    return dDays * 24 + currentHour;
}
function getCurrentDay(){
    var dTime = Math.abs(currentDate.getTime() - epoch.getTime());
    var dDays = Math.ceil(dTime/(1000*3600*24));
    return dDays;
}

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
        defaultDate:    new Date('2017/02/23'),
        minDate:        new Date('2017/02/23'),
        maxDate:        new Date('2017/04/26'),
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

function dateSlashString(date) {
    var year    = date.getFullYear();
    var month   = date.getMonth() + 1;
    var date    = date.getDate();
    return '' + year + '/' + (month<10?'0'+month:month) + '/'
            + (date<10?'0'+date:date);
}

// This stuff is similar to the one above
function onDateSelection(date) {
    currentDate = date;
    $('.date-selection').val(dateSlashString(date));
    // Update daily data
    getDailyData().done(updateDataByTime);
    // Update display data
    updateVisualData();
    document.dispatchEvent(new CustomEvent('datechanged'));
}

// On time change function
function onTimeChange(id) {
    currentHour = parseInt($('#' + id).val());
    // Sync all time selector
    $('.hour[id!="' + id + '"]').val(currentHour);
    // Refresh UI element for time display
    $('.time-string').text(currentHour + ':00');
    // Update display data
    updateVisualData();
    // Update data binding
    updateVisualDataBinding();
    // Update display data
    updateDataByTime();
    // Dispatch event
    document.dispatchEvent(new CustomEvent('timechanged'));
}

// Display flags
var currentDisplay = {};
// This stuff is ugly. It should have better design.
function updateDisplayStatus() {
    if($('#display-type').val() === '1') {
        currentDisplay['heat'] = true;
        delete currentDisplay['bubble'];
    } else {
        currentDisplay['bubble'] = true;
        delete currentDisplay['heat'];
    }

    if($('#ad').is(':checked')) {
        currentDisplay['ad'] = true;
    } else {
        delete currentDisplay['ad'];
    }

    if($('#illegal').is(':checked')) {
        currentDisplay['illegal'] = true;
    } else {
        delete currentDisplay['illegal'];
    }

    if($('#scam').is(':checked')) {
        currentDisplay['scam'] = true;
    } else {
        delete currentDisplay['scam'];
    }
}

function onToggleType() {
    updateDisplayStatus();
    updateLayerVisibility();
    updateDataByTime();
}

$('#display-type').on('change', function() {
    updateDisplayStatus();
    updateLayerVisibility();
    updateDataByTime();
});


var onToggleDispalyCallbacks = {};
function onToggleDispaly() {
    updateDisplayStatus();
    for(var callback in onToggleDispalyCallbacks) {
        // Function call
        window[callback].apply(this, onToggleDispalyCallbacks[callback]);
    }
}

// Ajax loading animation
$(document).on({
    ajaxStart: function() { $('#preloader').show(1000); },
    ajaxStop: function()  { $('#preloader').hide(1000); }    
});

// Window resize callback
$(window).resize(function (){
    $('#container').css('width', $(window).width());
    $('#container').css('height', $(window).height() - 20);
});

// Initialization
$(document).ready(function() {
    // Initialize materialize.css
    M.AutoInit();
    // Initialize date pickers
    var elems = document.querySelectorAll('.date-selection');
    initDatePicker(elems);
    $('#preloader').hide();
    // Container size
    $('#container').css('width', $(window).width());
    $('#container').css('height', $(window).height() - 20);
    updateDisplayStatus();
    getDailyData().then(function () {
        updateLayerVisibility();
        updateDataByTime();
    });
});
