// UI control
// Resize element to fit the screen width and height
//global date object
var globalDate = new Date()
var currenttemp = null;
var currentPPD = null;
var temperaturedata = null;
var PPDdata = null;
var speeddata = null;
var densitydata = null;
$.get('api/weather/temperature.json', function(data){
    temperaturedata = data;
    });
$.get('api/weather/ppd.json', function(data){
    PPDdata = data;
});

function containerResize(selector) {
    $(selector).css('width', $(window).width());
    $(selector).css('height', $(window).height() - 20);
}

// Resize element to fit the screen width only
function containerResizeWidth(selector) {
    $(selector).css('width', $(window).width());
}

//refreshHeatmap
function refreshHeatmap(){
    var heatmapdata = []
    for(var i=0; i<1856; i++){
        Poi = new Object();
        //console.log(poiData[i]['location'][0])
        Poi.lng = poiData[i]['location'][0];
        Poi.lat = poiData[i]['location'][1];
        if($("#traffic").is(':checked'))
            Poi.count = speeddata[i]
        else{
            //TODO
        }
        heatmapdata.push(Poi);
    }
    console.log(heatmapdata)
    heatmap.setDataSet({
        data: heatmapdata,
        max: 100
    });
}

//refreshBubblemap
function refreshBubblemap(){

}

// Time changing event
function onTimeChange() {
    $('#time-string').text($('#hour').val() + ':00');
    var currentdate = globalDate.getDate();
    switch (globalDate.getMonth())
    {
        case 6:
            deltahour = (currentdate-1)*24;
            break;
        case 7:
            deltahour = (currentdate+30)*24;
            break;
        case 8:
            deltahour = (currentdate+61)*24;
            break;
        case 9:
            deltahour = (currentdate+91)*24;
            break;
        case 10:
            deltahour = (currentdate+122)*24;
            break;
        case 11:
            deltahour = (currentdate+152)*24;
            break;
    }
    var hour = parseInt($('#hour').val());
    deltahour = deltahour+hour;
    currenttemp = temperaturedata[deltahour];
    currentPPD = parseInt(PPDdata[deltahour]);
    $('#temperature-value').text(currenttemp);
    $('#ppd-value').text(currentPPD);
    //get traffic data
    var weekday = null;
    switch (globalDate.getDay())
    {
        case 0: weekday = "sunday"; break;
        case 1: weekday = "monday"; break;
        case 2: weekday = "tuesday"; break;
        case 3: weekday = "wednesday"; break;
        case 4: weekday = "thursday"; break;
        case 5: weekday = "friday"; break;
        case 6: weekday = "saturday"; break;
    }
    $.get('api/traffic/speed/'+weekday+'/'+$('#hour').val(), function (data) {
        speeddata = data;
    })
    if($("#displaytype").val() == 2)
        refreshHeatmap();
    else{
        refreshBubblemap();
    }

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
        onSelect:  function () {
            globalDate = this.date;
            console.log(globalDate);

        }

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
    console.log(poiData)
});



