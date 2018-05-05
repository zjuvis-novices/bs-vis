// UI control
// Resize element to fit the screen width and height
//global date object
var globalDate = new Date()
var currenttemp = null;
var currentPPD = null;
var temperaturedata = null;
var PPDdata = null;
var speeddata = [];
var positivedata = [];
var negativedata = [];
var tirednessdata = [];
var densitydata = null;
var positive_raw = [];
var negative_raw = [];
var tiredness_raw = [];
var pos = null;
var neg = null;
var tir = null;
var show_emotion = {pos: false, neg: false, tir: false}
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
            Poi.count = speeddata[i+parseInt($('#hour').val())*24]
        else if($("#emotion").is(':checked')){
            if($("#positive").is(':checked')){
                Poi.count = 100*positivedata[i+parseInt($('#hour').val())*24]
               // console.log("~")
            }
            else if($("#negative").is(':checked')){
                Poi.count = 100*negativedata[i+parseInt($('#hour').val())*24]
            }
            else if($("#tiredness").is(':checked')){
                Poi.count = 100*tirednessdata[i+parseInt($('#hour').val())*24]
            }
        }
        heatmapdata.push(Poi);
    }
    console.log(heatmapdata)
    heatmap.setDataSet({
        data: heatmapdata,
        max: 100
    });
}
//create emotion object
function create_emotion(loc_list, color){
    var result = [];
    for(var i = 0; i < loc_list.length; i++)
    {
        result[i] = new AMap.Circle(
            {center:new AMap.LngLat(loc_list[i][0],loc_list[i][1]),
                radius:loc_list[i][2],fillOpacity:0.2,strokeOpacity:0.3,
                strokeWeight:1,fillColor:color,strokeColor:color});
    }
    return result;
}
//deal with toggle action of emotion switches
function toggle_emotion(emotion) {
    if(show_emotion[emotion]){
        show_emotion[emotion] = false;
        for(var i=0; i<1856; i++)
        {
            eval(emotion+"[i].hide()")
        }
    }
    else{
        show_emotion[emotion] = true;
        for(var i=0; i<1856; i++)
        {
            eval("console.log("+emotion+")")
            console.log("!!!!")
            eval(emotion+"[i].show()")
        }
    }
}
//refreshBubblemap
function refreshBubblemap(){
    refreshEmotionSet()
    var positive = positive_raw.slice(1856*parseInt($("#hour").val()), 1856*parseInt($("#hour").val())+1856)
   console.log(positive)
    var negative = negative_raw.slice(1856*parseInt($("#hour").val()), 1856*parseInt($("#hour").val())+1856)
    var tiredness = tiredness_raw.slice(1856*parseInt($("#hour").val()), 1856*parseInt($("#hour").val())+1856)
    pos = create_emotion(positive, "#db4d6d")
    neg = create_emotion(negative, "#3316b3")
    tir = create_emotion(tiredness, "#f7d977")
    console.log(pos)
    for(var i = 0; i <1856; i++)
    {
        pos[i].setMap(map);
        pos[i].show();
        neg[i].setMap(map);
        neg[i].show();
        tir[i].setMap(map);
        tir[i].hide();
    }

   // toggle_emotion('pos');
    /*
    toggle_emotion('neg');
    toggle_emotion('tir');*/
}

// Time changing event
function onTimeChange() {

    $('#time-string').text($('#hour').val() + ':00');
    //console.log(positivedata)
    var currentdate = globalDate.getDate();
    var deltahour = null;
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

    if($("#displaytype").val() == 2)
        refreshHeatmap();
    else if($("#displaytype").val() == 1){
        refreshBubblemap();
    }

}

function refreshEmotionSet(){
    positive_raw = [];
    negative_raw = [];
    tiredness_raw = [];
    var tmp1 = [];
    var tmp2 = [];
    var tmp3 = [];
    console.log(positivedata)
    for(var i=0; i<1856*24; i++){
        tmp1 = [];
        tmp2= [];
        tmp3 = [];
        tmp1 = poiData[i%1856]["location"].concat(1000*positivedata[i])
        tmp2 = poiData[i%1856]["location"].concat(1000*negativedata[i])
        tmp3 = poiData[i%1856]["location"].concat(1000*tirednessdata[i])
        positive_raw.push(tmp1)
        negative_raw.push(tmp2)
        tiredness_raw.push(tmp3)
    }
   // console.log(positive_raw)
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
            speeddata =[];
            negativedata = [];
            positivedata = [];
            tirednessdata = [];
            globalDate = this.date;
            console.log(globalDate);
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
            for(var i = 0; i<24; i++)
            {
                //setTimeout(get(i,speeddata, weekday), 500);
                $.get('api/traffic/speed/'+weekday+'/'+i, function (data) {
                    speeddata = speeddata.concat(data);
                })
                $.get('api/emotion/positive/'+globalDate.getFullYear()+'-'+(parseInt(globalDate.getMonth())+1)+'-'+globalDate.getDate()+'/'+i, function (data) {
                    positivedata = positivedata.concat(data);
                })
                $.get('api/emotion/negative/'+globalDate.getFullYear()+'-'+(parseInt(globalDate.getMonth())+1)+'-'+globalDate.getDate()+'/'+i, function (data) {
                    negativedata = negativedata.concat(data);
                })
                $.get('api/emotion/tiredness/'+globalDate.getFullYear()+'-'+(parseInt(globalDate.getMonth())+1)+'-'+globalDate.getDate()+'/'+i, function (data) {
                    tirednessdata = tirednessdata.concat(data);
                })
            }
           // refreshEmotionSet();



        }

    });
    return instances;
}

function initEcharts(){
    myChart = echarts.init(document.getElementById('container'));
    myChart.setOption(option)
}
function get(i, speeddata, weekday){
    $.get('api/traffic/speed/'+weekday+'/'+i, function (data) {
        speeddata = speeddata.concat(data);
    })
}
// Document ready function
$(document).ready(function (){
    M.AutoInit();
    // Initialize date pickers
    var elems = document.querySelector('#date-selection');
    initDatePicker(elems);
    //initEcharts();
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



