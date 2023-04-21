// Create the charts when the web page loads
window.addEventListener('load', onload);

function onload(event){
  chartG = createGSRChart();
}

// Create Temperature Chart
function createGSRChart() {
  var chart = new Highcharts.Chart({
    chart: { 
      renderTo: 'chart-GSR',
      type: 'spline' 
    },
    series: [
      {
        name: 'GSR',
        data: [], // add your data here
        zoneAxis: 'x',
        zones: [
          {
            value: sensorValue + 60, // set the zone threshold to gsr_average + 60
            color: '#FF0000', // set the zone color
            fillColor: '#FF0000'
          },
          {
            value: sensorValue + 30, // set the zone threshold to gsr_average + 30
            color: '#FFC107', // set the zone color
            fillColor: '#FFC107'
          },
          {
            value: sensorValue, // set the zone threshold
            color: '#00FF00', // set the zone color
            fillColor: '#00FF00'
          }
        ]
      }
    ],

    title: { 
      text: undefined
    },
    plotOptions: {
      line: { 
        animation: false,
        dataLabels: { 
          enabled: true 
        },
        events: {
          point: {
            events: {
              update: function(event) {
                var point = this;
                if (point.y > (sensorValue + 30)) {
                  point.update({ color: '#FFC107', fillColor: '#FFC107' });
                } else if (point.y > (sensorValue + 60)) {
                  point.update({ color: '#FF0000', fillColor: '#FF0000' });
              }
            }
          }
        }
      }
    }
    
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: { second: '%H:%M:%S' }
    },
    yAxis: {
      title: { 
        text: 'GSR Value' 
      },
      plotLines: [{
        value: sensorValue + 30,
        color: '#FF0000',
        dashStyle: 'shortdash',
        width: 2,
        label: {
          text: 'Sensor Value + 30'
        }
      }]
    },
    credits: { 
      enabled: false 
    }
  });
  return chart;
}
