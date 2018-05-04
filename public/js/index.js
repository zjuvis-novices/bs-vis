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

// Time changing event
function onTimeChange() {
    $('#time-string').text($('#hour').val() + ':00');
    // TODO...
}

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
        onSelect:           function () { console.log(this.date); /* TODO */ }

    });
    return instances;
}

// Document ready function
$(document).ready(function (){
    M.AutoInit();
    // Initialize date pickers
    var elems = document.querySelector('#date-selection');
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

var poiData = null;
$.get('api/poi.json', function(data) {
    poiData = data;
});



