
// convert epochtime to JavaScripte Date object
function epochToJsDate(epochTime){
  return new Date(epochTime*1000);
}

// convert time to human-readable format YYYY/MM/DD HH:MM:SS
function epochToDateTime(epochTime){
  var epochDate = new Date(epochToJsDate(epochTime));
  var dateTime = epochDate.getFullYear() + "/" +
    ("00" + (epochDate.getMonth() + 1)).slice(-2) + "/" +
    ("00" + epochDate.getDate()).slice(-2) + " " +
    ("00" + epochDate.getHours()).slice(-2) + ":" +
    ("00" + epochDate.getMinutes()).slice(-2) + ":" +
    ("00" + epochDate.getSeconds()).slice(-2);

  return dateTime;
}

// function to plot values on charts 
function plotValues(chart, timestamp, value, gsrAverage){
  var x = epochToJsDate(timestamp).getTime();
  var y = Number (value);

  if(chart.series[0].data.length > 40) {
    chart.series[0].addPoint([x, y], true, true, true);
  } else {
    chart.series[0].addPoint([x, y], true, false, true);
  }

 // DOM elements
const loginElement = document.querySelector('#login-form');
const contentElement = document.querySelector("#content-sign-in");
const userDetailsElement = document.querySelector('#user-details');
const authBarElement = document.querySelector("#authentication-bar");
const chartsRangeInputElement = document.getElementById('charts-range');

let uid;

// Elements for sensor readings
const sensorElement = document.getElementById("sensor");
const updateElement = document.getElementById("lastUpdate");
//const humElement = document.getElementById("hum");
//const presElement = document.getElementById("pres");

// MANAGE LOGIN/LOGOUT UI
const setupUI = (user) => {
  if (user) {
    //toggle UI elements
    loginElement.style.display = 'none';
    contentElement.style.display = 'block';
    authBarElement.style.display ='block';
    userDetailsElement.style.display ='block';
    userDetailsElement.innerHTML = user.email;

    // get user UID to get data from database
    var uid = user.uid;
    console.log(uid);

    // Database paths (with user UID)
    var dbPath = 'UsersData/' + uid.toString() + '/readings';
    var chartPath = 'UsersData/' + uid.toString() + '/charts/range';
   // var dbPathHum = 'UsersData/' + uid.toString() + '/humidity';
    //var dbPathPres = 'UsersData/' + uid.toString() + '/pressure';

    var dbRef = firebase.database().ref(dbPath);
    var chartRef = firebase.database().ref(chartPath);
   // var dbRefHum = firebase.database().ref().child(dbPathHum);
    //var dbRefPres = firebase.database().ref().child(dbPathPres);

    // CHARTS
    // Number of readings to plot on charts
    var chartRange = 0;
    // Get number of readings to plot saved on database (runs when the page first loads and whenever there's a change in the database)
    chartRef.on('value', snapshot =>{
      chartRange = Number(snapshot.val());
      console.log(chartRange);
      // Delete all data from charts to update with new values when a new range is selected
      chartG.destroy();

      // Render new charts to display new range of data
      chartG = createGSRChart();

      // Update the charts with the new range
      // Get the latest readings and plot them on charts (the number of plotted readings corresponds to the chartRange value)
      dbRef.orderByKey().limitToLast(chartRange).on('child_added', snapshot =>{
        var jsonData = snapshot.toJSON(); // example: {temperature: 25.02, humidity: 50.20, pressure: 1008.48, timestamp:1641317355}
        // Save values on variables
        var sensorvalue = jsonData.sensorValue;
        var timestamp = jsonData.timestamp;

        // Plot the values on the charts
        plotValues(chartG, timestamp, sensorvalue);

      });
    });

        // Update database with new range (input field)
        chartsRangeInputElement.onchange = () =>{
          chartRef.set(chartsRangeInputElement.value);
        };


    // Update page with new readings
    dbRef.orderByKey().limitToLast(1).on('child_added', snapshot =>{
      var jsonData = snapshot.toJSON(); // example: {temperature: 25.02, humidity: 50.20, pressure: 1008.48, timestamp:1641317355}
      var sensorvalue = jsonData.sensorValue;
      var timestamp = jsonData.timestamp;

       // Update DOM elements
       sensorElement.innerHTML = sensorvalue;
       updateElement.innerHTML = epochToDateTime(timestamp);
    });

   // dbRefHum.on('value', snap => {
     // humElement.innerText = snap.val().toFixed(2);
   // });

    //dbRefPres.on('value', snap => {
      //presElement.innerText = snap.val().toFixed(2);
    //});

  // if user is logged out
  } else{
    // toggle UI elements
    loginElement.style.display = 'block';
    authBarElement.style.display ='none';
    userDetailsElement.style.display ='none';
    contentElement.style.display = 'none';
  }
}
