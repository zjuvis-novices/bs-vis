// Visualization
function trafficDisplay(){
    //1 for speed and 2 for density
    var type = $('#traffictype').val()
    var week = $('#week').val()
    var hour = $('#hour').val()
    var trafficData = null;
    console.log(type)
    if(type == 1) {
        $.get('api/traffic/speed/'+week+'/'+hour+'.json', function (data) {
            trafficData = data;
            console.log(trafficData)
        })
    }
    else if (type == 2){
        $.get('api/traffic/density/'+week+'/'+hour+'.json', function(data) {
            trafficData = data;
        })
    }
    var heatmap;
    map.plugin(["AMap.Heatmap"], function() {
        //初始化heatmap对象
        heatmap = new AMap.Heatmap(map, {
            radius: 25, //给定半径
            opacity: [0, 0.8]
            /*,gradient:{
             0.5: 'blue',
             0.65: 'rgb(117,211,248)',
             0.7: 'rgb(0, 255, 0)',
             0.9: '#ffea00',
             1.0: 'red'
             }*/
        });
    });


}


