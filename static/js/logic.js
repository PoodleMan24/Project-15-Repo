// Creating the map object, choose the centre matches with preceding map.
let myMap = L.map("map", {
    center: [10.0, 90.0],
    zoom: 3
});


// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


// Choose one sets of data from the inital web link https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
// Data set choose from Feeds section- Past 7 Days- 2.5 Earthquakes
// Define the URL for above data selection
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";


// Get the data with d3
// The color reference get from the link https://colorbrewer2.org/#type=sequential&scheme=YlOrBr&n=6
d3.json(url).then(function(data) {

    // Determines the marker color based on the depth
    // The depth of the earth can be found as the third coordinate for each earthquake
    function mapColor(depth) {
        return depth > 90 ? "#54278f" : // dark Purple
           depth > 70 ? "#756bb1" : // purple
           depth > 50 ? "#c51b8a" : // dark pink
           depth > 30 ? "#f768a1" : // Pink
           depth > 10 ? "#fec44f" :// dark yellow
                        "#fee391" ;// light yellow
                            
    }

    // Determines the marker radius based on magnitude
    // The magnitude is in the nest list of features-properties
    function mapRadius(mag) {
        if (mag === 0) {
        return 1;}
        return Math.sqrt(mag)*8;
    }

    // Function to style each feature
    function mapStyle(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: mapColor(feature.geometry.coordinates[2]),
            color: "#252525",  // black
            radius: mapRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }

    // Add earthquake data to the map
    L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: mapStyle,
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br>Depth: " + feature.geometry.coordinates[2]);
        }
    }).addTo(myMap);


    // Creating the legend with colors to correlate with depth
    let legend = L.control({ position: "bottomright" });

    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");
        let depth = [-10, 10, 30, 50, 70, 90];
        let colors = ["#fee391",
                      "#fec44f",
                      "#f768a1",
                      "#c51b8a",
                      "#756bb1",
                      "#54278f"
        ];
        for (let i = 0; i < depth.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colors[i] + '"></i> ' +
                depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(myMap);
});