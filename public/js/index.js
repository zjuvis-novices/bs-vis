// UI control
// This file is all about UI control and view

// Global variables for current selected time
const epoch = new Date('2017/7/1');
var currentDate = new Date('2017/7/1');
var currentHour = 8;
function getCurrentIndex() {
    var dTime = Math.abs(currentDate.getTime() - epoch.getTime());
    var dDays = Math.ceil(dTime/(1000*3600*24));
    return dDays * 24 + currentHour;
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
    $('#time-string').text(currentHour + ':00');
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
function onTimeChange() {
    currentHour = parseInt($('#hour').val());
    var callback;
    // Call all the associated callbacks
    for(callback in onTimeChangeCallbacks) {
        // Function call
        window[callback].apply(this, onTimeChangeCallbacks[callback]);
    }
}

// This stuff is similar to the one above
var onDateSelectionCallbacks = {

};
function onDateSelection(date) {
    currentDate = date;
    var callback;
    for(callback in onDateSelectionCallbacks) {
        // Function call
        window[callback].apply(this, onDateSelectionCallbacks[callback]);
    }
}

var currentDisplay = {
    overlayType: {'emotion': true},
    visualStyle: 'bubble',
    emotionType: {'positive': true}
};

// This stuff is ugly. It should have better design.
function updateDisplayStatus() {
    if($('#display-type').val() === '1') {
        currentDisplay.visualStyle = 'bubble';
    } else {
        currentDisplay.visualStyle = 'thermo';
    }
    if(currentDisplay.visualStyle === 'bubble') {
        if($('#emotion-display').is(':checked')) {
            currentDisplay.overlayType['emotion'] = true;
        } else {
            delete currentDisplay.overlayType['emotion'];
        }
        if($('#traffic-display').is(':checked')) {
            currentDisplay.overlayType['traffic'] = true;
        } else {
            delete currentDisplay.overlayType['traffic'];
        }
    } else {
        if($('#emotion-display').is(':checked')) {
            currentDisplay.overlayType = {'emotion': true};
        } else if($('#traffic-display').is(':checked')) {
            currentDisplay.overlayType = {'traffic': true};
        } else { currentDisplay.overlayType = {}; }
    }
    if(currentDisplay.visualStyle === 'bubble') {
        // currentDisplay.emotionType
        if($('#positive').is(':checked')) {
            currentDisplay.emotionType['positive'] = true;
        } else {
            delete currentDisplay.emotionType['positive'];
        }
        if($('#negative').is(':checked')) {
            currentDisplay.emotionType['negative'] = true;
        } else {
            delete currentDisplay.emotionType['negative'];
        }
        if($('#tiredness').is(':checked')) {
            currentDisplay.emotionType['tiredness'] = true;
        } else {
            delete currentDisplay.emotionType['tiredness'];
        }
    } else {
        currentDisplay.emotionType = {};
        var toastStr = '热力图只支持显示一类数据，当前为';
        if(!$.isEmptyObject(currentDisplay.overlayType)) {
            if(currentDisplay.overlayType['traffic']) {
                M.toast({html: toastStr + '交通'});
            } else if($('#positive').is(':checked')) {
                currentDisplay.emotionType['positive'] = true;
                M.toast({html: toastStr + '正向情感'});
            } else if($('#negative').is(':checked')) {
                currentDisplay.emotionType['negative'] = true;
                M.toast({html: toastStr + '负向情感'});
            } else if($('#tiredness').is(':checked')) {
                currentDisplay.emotionType['tiredness'] = true;
                M.toast({html: toastStr + '疲倦'});
            }
        }
    }
}


var onToggleEmotionCallbacks = {};
function onToggleEmotion() {
    updateDisplayStatus();
    for(callback in onToggleEmotionCallbacks) {
        // Function call
        window[callback].apply(this, onToggleEmotionCallbacks[callback]);
    }
}

var onChangeVisualCallbacks = {};
function onChangeVisual() {
    updateDisplayStatus();
    for(callback in onChangeVisualCallbacks) {
        // Function call
        window[callback].apply(this, onChangeVisualCallbacks[callback]);
    }
}

var onToggleDispalyCallbacks = {};
function onToggleDispaly() {
    updateDisplayStatus();
    for(callback in onToggleDispalyCallbacks) {
        // Function call
        window[callback].apply(this, onToggleDispalyCallbacks[callback]);
    }
}