import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import axios from 'axios';


class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      venues : [],
    }
  }

  componentDidMount(){
    this.getVenues();
    window.initMap = this.initMap;
    console.log("Component did mount");
  }
  
  //Loaded the map 
  Map(){
    loadMapUrl();
  }

  //Fetching places inforamtion using Foursquare API
  getVenues = () => {
    const endPoint = "https://api.foursquare.com/v2/venues/explore?"
    const credentials = {
      client_id: "ZAM2ZVYH1W4E5KRSTWM140LP5UWX20J5XHK4NAUJLO5CJUNH",
      client_secret: "CZTDHFFXI4SXYOXAN41MCUG2PPDEDIAATTCVRC1FUMGOSI1C",
      query: "Food",
      near: "New York", 
      v: "20181107",
      limit:10,
    }
    
    //Promise based HTTP client for the browser
    axios.get(endPoint + new URLSearchParams(credentials))
    .then(response => {
      this.setState({
        venues: response.data.response.groups[0].items
      }, this.Map() )//callback function
    })
    .catch(error =>{
      alert('Error Occured While Fetching Foursquare API' + error);
    });
  }  

  initMap(){
    // Constructor creates a new map - only center and zoom are required.
    this.map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 40.730610, lng: -73.935242},
      zoom: 14,
      mapTypeControl: true
    });

    //Creating InfoWindow and Latitude and Longitudes Bounds
    const bounds = new window.google.maps.LatLngBounds();
    this.InfoWindow = new window.google.maps.InfoWindow();

    //Plotting marker and content on the map
    this.markers = [];
    this.venuesInfo = [];

    //Content String Reference https://developers.google.com/maps/documentation/javascript/infowindows
    const contentString = `<div><h3>${myVenue.venue.name.toUpperCase()}</h3>
    <h5>Address: ${myVenue.venue.location.address}</h5>
    <h5>Location: ${myVenue.venue.location.city}, ${myVenue.venue.location.state} </h5>
    <h5>Pincode: ${myVenue.venue.location.postalCode}</h5>
    <p><strong> ${'<a href="https://foursquare.com/v/' + myVenue.venue.id + '" target="_blank">Click Here For More Info</a>'} </strong> </p></div>`

    const marker = new window.google.maps.Marker({
      map: this.map,
      position: {lat: myVenue.venue.location.lat, lng: myVenue.venue.location.lng},
      animation: window.google.maps.Animation.DROP,
      name: myVenue.venue.name,
      id: myVenue.venue.id,
      });

  }





  render() {
    return (
      <main id="App">
      <div id="map" aria-label="Map" role="application" tabIndex="-1">
      </div>
      </main>
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
