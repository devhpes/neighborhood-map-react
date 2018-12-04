import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import axios from 'axios';


class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      venues: [],
      markers: [],
      map: [],
    }

    //this.initMap = this.initMap.bind(this);
  }

  componentDidMount(){
    this.getVenues();
    window.initMap = this.initMap;
    console.log("Component did mount");
  }
  
  //Load the map script
  Map = () => {
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

  initMap = () => {
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

    //Mapping all the venues using map function to add content to all markers
    //on the map
    this.state.venues.map(myVenue => {
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

      marker.addListener('click', () => {
        if(marker.getAnimation() !== null){marker.setAnimation(null);}
        else{marker.setAnimation(window.google.maps.Animation.BOUNCE);}
        setTimeout(function(){ marker.setAnimation(null) }, 1000)
      });

      window.google.maps.event.addListener(marker, 'click', () => {
        // Putting all the content on the map
        this.InfoWindow.setContent(contentString)
        //Centering the position of the map according to the marker
        this.map.setCenter(marker.position);

        this.InfoWindow.open(this.map, marker);
      });

      //Pushing markers to marker variable and pushing venues in the 
      //venuesInfo variable 
      this.state.markers.push(marker);
      this.venuesInfo.push({id: myVenue.venue.id, name:myVenue.venue.name, contents: contentString})

      bounds.extend(marker.getPosition());
      //Adding listener to the marker
      this.map.fitBounds(bounds);
      //Setting state of map, InfoWindow and Venues, So that can be used later
      this.setState ({
        map: this.map,
        InfoWindow: this.InfoWindow,
        venues: this.venuesInfo,
        allVenues: this.venuesInfo,// create venues copy to restore it after when user clear the input search
        });

    return myVenue.marker;
    });

  }





  render() {
    return (
      <main id="App">
      <div id="sideBar">
      <div className="heading">
      <div className="search">
      <input type="text" placeholder="Search.."></input>
      </div>
      </div>
      </div>
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
