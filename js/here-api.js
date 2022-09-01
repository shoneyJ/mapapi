import generateToken from "./here-authentication.js";
import { here_apiKey } from '../config.js'
var Mymap = (() => {

    var map = null;
    // Define a variable holding SVG mark-up that defines an icon image:
    var svgMarkup = '<svg width="24" height="24" ' +
        'xmlns="http://www.w3.org/2000/svg">' +
        '<rect stroke="white" fill="#1b468d" x="1" y="1" width="22" ' +
        'height="22" /><text x="12" y="18" font-size="12pt" ' +
        'font-family="Arial" font-weight="bold" text-anchor="middle" ' +
        'fill="white">H</text></svg>';
    // Create an icon, an object holding the latitude and longitude, and a marker:
    var icon = new H.map.Icon(svgMarkup);

    var init = (coordinates) => {
        const platform = new H.service.Platform({
            'apikey': here_apiKey
        });




        // Obtain the default map types from the platform object:
        const defaultLayers = platform.createDefaultLayers();

        // Instantiate (and display) a map:
        map = new H.Map(
            document.getElementById("map"),
            defaultLayers.raster.normal.transit, {
            zoom: 15,
            center: coordinates
        });

        // MapEvents enables the event system
        // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
        const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

    }

    var addMarker = (coords) => {
        var marker = new H.map.Marker(coords, { icon: icon });

        // Add the marker to the map and center the map at the location of the marker:
        map.addObject(marker);
    }

    return {
        Init: init,
        addMarker: addMarker
    }

})()

var here = (() => {

    let token = "";

    var init = async () => {
        token = document.cookie;
        if (token != "") {
            token = JSON.parse(document.cookie)
        } else {
            await generateToken();
            token = JSON.parse(document.cookie)
        }
    }

    var getStations = (coords) => {

        init();

        fetch('https://transit.hereapi.com/v8/stations?in=' + coords + '&mode=subway&r=230136', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + token.access_token
            }
        }).then(function (resp) {

            // Return the response as JSON
            return resp.json();

        }).then(function (data) {
            // Log the API data
            console.log('data', data);

            let { stations } = data;

            stations.forEach((station) => {

                Mymap.addMarker(station.place.location);


            })



        }).catch(function (err) {
            // Log any errors
            console.log('something went wrong', err);

        });
    }

    return {
        getStations: getStations
    }



})()

Mymap.Init({ lat: 34.052235, lng: -118.243683 });



here.getStations('34.056197,-118.234249');

