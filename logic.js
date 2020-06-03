var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
function markerSize(i){
  return i*4
}
d3.json(queryUrl, function(data) {  

    createFeatures(data.features);
});

function createFeatures(earthquakeData) {

    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
          "</h3><hr><p>" + (feature.properties.mag) + "</p>");
      }

  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,

    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: getColor(feature.properties.mag),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8});
    }
 });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {
    
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });
    var baseMaps = {
        "Light Map": lightmap,
    };

    var overlayMaps = {
        Earthquakes: earthquakes
    };

      var myMap = L.map("map", {
        center: [
          40.73, -74.0059
        ],
        zoom: 5,
        layers: [lightmap, earthquakes]
    });
    
      L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);
    }

    function getColor(i) {
      return i > 5 ? '#F30' :
      i > 4  ? '#F60' :
      i > 3  ? '#F90' :
      i > 2  ? '#FC0' :
      i > 1   ? '#FF0' :
                '#9F3';
    }