var map = L.map('map', {
    center: [0, 0],
    zoom: 2
});

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: "pk.eyJ1IjoiZ3J3YXQzMyIsImEiOiJja2lzMmV4cGUxc3M2MndvODR6YWs2cnl4In0.MrGype25gR61KiJcqHVyvw"
}).addTo(map);

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

d3.json(url, function (json) {
    var alldata = json.features;
    console.log(alldata);

    var geometry = alldata.map(object => object.geometry);
    var id = alldata.map(object => object.id);
    var properties = alldata.map(object => object.properties);
    var type = alldata.map(object => object.type);
    var mag = properties.map(object => object.mag);
    var place = properties.map(object => object.place);
    var coordinates = geometry.map(object => object.coordinates);
    console.log(mag);

    function getColor(d) {
        return d > 7 ? '#FF0000' :
               d > 6  ? '#FF3300' :
               d > 5  ? '#FF6600' :
               d > 4  ? '#FFCC00' :
               d > 3   ? '#FFFF00' :
               d > 2   ? '#99FF00' :
               d > 1   ? '#33FF00' :
                          '#00FF00';
    }

    // Loop through data
    for (var i = 0; i < alldata.length; i++) {

    // Set the data location property to a variable
    var location = alldata[i].geometry;
    L.circle([location.coordinates[1], location.coordinates[0]], {color: getColor(mag[i]), radius: mag[i]*50000}).addTo(map).bindPopup("Magnitude: " + mag[i] + " <br> Place: " + place[i] + " <br> ID: " + id[i]);

  }

  function getLegendColor(d) {
    return d === '(7,10)' ? '#FF0000' :
           d === '(6,7]'  ? '#FF3300' :
           d === '(5,6]'  ? '#FF6600' :
           d === '(4,5]'  ? '#FFCC00' :
           d === '(3,4]'   ? '#FFFF00' :
           d === '(2,3]'   ? '#99FF00' :
           d === '(1,2]'   ? '#33FF00' :
                      '#00FF00';
}

  var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');
    labels = ['<strong>Categories</strong>'],
    categories = ['(7,10)','(6,7]','(5,6]','(4,5]','(3,4]','(2,3]','(1,2]', '[0,1]'];

    for (var i = 0; i < categories.length; i++) {

            div.innerHTML += 
            labels.push(
                '<i class="circle" style="background:' + getLegendColor(categories[i]) + '"></i> ' +
            (categories[i] ? categories[i] : '+'));

        }
        div.innerHTML = labels.join('<br>');
    return div;
    };
    legend.addTo(map);
});