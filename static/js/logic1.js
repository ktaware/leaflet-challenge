// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function processFeature(feature, layer) {
    layer.bindPopup(`<h3>Where ${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><hr><h2>${feature.properties.mag}</h2>`);
  }
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  function createCircleMarker(feature,latlng){
    let options = {
        radius:markerSize(feature.properties.mag),
        fillColor: chooseColor(feature.properties.mag),
        color: chooseColor(feature.properties.mag),
        weight: 1,
        opacity: .8,
        fillOpacity: 0.35
    }
    return L.circleMarker(latlng, options);
  }
  
  var e = L.geoJSON(earthquakeData, {
    onEachFeature: processFeature,
    pointToLayer: createCircleMarker
  });

  // Send our earthquakes layer to the createMap function/
  createMap(e);
}

// Color circles based on mag
function chooseColor(mag){
  let clr = "#E2FFAE";

  if (1.0 <= mag && mag <= 2.5) {
    clr = "#0071BC";
    }
  else if (2.5 <= mag && mag <= 4.0) {
    clr = "#35BC00";
  }
  else if (4.0 <= mag && mag <= 5.5) {
    clr = "#BCBC00";
    }
  else if (5.5 <= mag && mag <= 8.0) {
      clr = "#BC3500";
    }
  else if (8.0 <= mag && mag <= 20.0) {
        clr = "#BC0000";
    }
  else {
    clr = "#E2FFAE";
  }
  return clr;
}


function markerSize(mag) {
  if( mag === 0 )
    return 1;
  else
    return mag * 5;
}

//legend based on mag
 
let legend = L.control({position: 'bottomright'});

legend.onAdd = function () {
    let div = L.DomUtil.create('div', 'info legend'),
        grades = [1.0, 2.5, 4.0, 5.5, 8.0],
        labels = [];
        div.innerHTML += "<h3>Magnitude</h3>"     
    // loop through density intervals
    for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background-color:' + chooseColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
};


function createMap(layerWithPopUps) {

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});



  var grayscaleMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});


var outdoorsMap =  L.tileLayer('https://{s}.tile.openoutdoormap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="">SRTM</a> | Map style: &copy; <a href="https://openoutdoormap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Gray Map": grayscaleMap,
    "Outdoors": outdoorsMap
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: layerWithPopUps
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, layerWithPopUps]
  });

  
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
  }).addTo(myMap);
      
  // Adding the legend to the map
  legend.addTo(myMap);
}

 


