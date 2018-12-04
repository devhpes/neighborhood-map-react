import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';

class App extends Component {

  componentDidMount(){
    window.initMap = this.initMap;
    console.log("Component did mount");
  }
  
  //Loaded the map 
  Map(){
    loadMapUrl();
  }

  initMap(){
    // Constructor creates a new map - only center and zoom are required.
    this.map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 40.730610, lng: -73.935242},
      zoom: 14,
      mapTypeControl: true
    });
  }





  render() {
    return (
      <div className="App">
      <div id="map">

      </div>
      </div>
    );
  }
}


// This function will generate script tag and will insert the google map API URL Dynamically.
function loadMapUrl(){
  const scriptTag = window.document.createElement('script');
  const apiKey = 'AIzaSyASFSGSrxEXyjwZSqMyzRJBbfq_eFutui8';
  scriptTag.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
  scriptTag.async = true;
  scriptTag.defer = true;
  document.body.appendChild(scriptTag);
}

export default App;
