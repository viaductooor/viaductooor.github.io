var MapUtil = {
    include: function(file){

        var script  = document.createElement('script');
        script.src  = file;
        script.type = 'text/javascript';
        script.defer = true;

        document.getElementsByTagName('head').item(0).appendChild(script);

    },
    
    resizeMapDiv : function(){
        var height = 0;
        var body = window.document.body;
        var mapdiv = document.getElementById("mapid");
        if (window.innerHeight) {
            height = window.innerHeight;
        } else if (body.parentElement.clientHeight) {
            height = body.parentElement.clientHeight;
        } else if (body && body.clientHeight) {
            height = body.clientHeight;
        }
        mapdiv.style.height = ((height - mapdiv.offsetTop) + "px");
    },
    readAndDisplayTrips: function(file){
        var reader = new FileReader();
        var trips = [];
        // $("#pickfilemodal").modal('toggle');
        reader.onload = function(progressEvent){
            var lines = reader.result.split("\n");
            lines = lines.slice(1);
            var i;
            
            for(var i=0;i<lines.length;i++){
                var items = lines[i].split(',');
                if(items.length==7){
                    if(items[2]&items[3]&items[4]&items[5]){
                        trips.push({
                            "location_lat":Number(items[2]),
                            "location_lon":Number(items[3]),
                            "destination_lat":Number(items[4]),
                            "destination_lon":Number(items[5])
                        });
                    }
                }
            }
            
            var gjson = {
                "type":"FeatureCollection",
                "features":[]
            };
            
            for(i = 0;i<500;i++){
                gjson.features.push({
                    "type":"Feature",
                    "geometry":{
                        "type":"MultiPoint",
                        "coordinates":[[trips[i].location_lon,trips[i].location_lat],[trips[i].destination_lon,trips[i].destination_lat]]
                    },
                    "properties":{
                        "type":"trips"
                    }
                });
            }

            console.log(JSON.stringify(gjson));
            
            var geojsonMarkerOptions1 = {
                radius: 8,
                fillColor: "#ff7800",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };
            
            var geojsonMarkerOptions2 = {
                radius: 8,
                fillColor: "cyan",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };
            
            L.geoJSON(gjson,{
                pointToLayer: function (feature, latlng) {
                    var points = feature.geometry.coordinates;
                    var marker = L.circleMarker(latlng, geojsonMarkerOptions1);
                    var popup1 = L.popup({autoClose:false})
                        .setLatLng([points[0][1],points[0][0]])
                        .setContent("Location");
                    var popup2 = L.popup({autoClose:false})
                        .setLatLng([points[1][1],points[1][0]])
                        .setContent("Destination");
                    marker.on("click",function(event){
                        popup1.openOn(mymap);
                        popup2.openOn(mymap);
                    });
                    // marker.on("mouseout",function(event){
                    //     popup1.removeFrom(mymap);
                    //     popup2.removeFrom(mymap);
                    // });
                    return marker;
                }
            }).addTo(mymap);
        };
        reader.readAsText(file);
    },
    //tile layer
    greyScaleTileUrl : "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
    streetTileUrl : "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
};

window.onload=function(){
    //initiate tile layers
    greyscale = L.tileLayer(MapUtil.greyScaleTileUrl,{
        id : "mapbox.light",
        maxZoom : 18
    });
    streets = L.tileLayer(MapUtil.streetTileUrl,{
        id : "mapbox.streets",
        maxZoom : 18
    });
    
    //initiate map
    MapUtil.resizeMapDiv();
    mymap = L.map('mapid',{zoomControl:false}).setView([ 40.7379, -73.9919 ], 13);
    
    streets.addTo(mymap);
    
    //file input
    var input = document.getElementById("fileinput"),
        modal = document.getElementById("pickfilemodal"),
        exampleTrips = document.getElementById("exampleTrips");
    
    EventUtil.addHandler(exampleTrips,"click",function(e){
        $("#pickfilemodal").modal('toggle');
        var geojsonMarkerOptions = {
            radius: 8,
            fillColor: "#ff7800",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };
        L.geoJSON(getTrips(),{
            pointToLayer: function (feature, latlng) {
                var points = feature.geometry.coordinates;
                var marker = L.circleMarker(latlng, geojsonMarkerOptions);
                var popup1 = L.popup({autoClose:false})
                    .setLatLng([points[0][1],points[0][0]])
                    .setContent("Location");
                var popup2 = L.popup({autoClose:false})
                    .setLatLng([points[1][1],points[1][0]])
                    .setContent("Destination");
                marker.on("click",function(event){
                    popup1.openOn(mymap);
                    popup2.openOn(mymap);
                });
                // marker.on("mouseout",function(event){
                //     popup1.removeFrom(mymap);
                //     popup2.removeFrom(mymap);
                // });
                return marker;
            }
        }).addTo(mymap);
        
    });
    EventUtil.addHandler(input,"change",function(e){
        var files = EventUtil.getTarget(e).files;
        $("#pickfilemodal").modal('toggle');
        MapUtil.readAndDisplayTrips(files[0]);
    });
    
    //tile switcher
	$("#streets")
		.attr("disabled","")
		.attr("class","btn btn-secondary");
	$("#greyscale")
		.removeAttr("disabled")
		.attr("class","btn btn-outline-secondary");
	$("#greyscale").click(function(){
		$("#greyscale")
			.attr("disabled","")
			.attr("class","btn btn-secondary");
		$("#streets")
			.removeAttr("disabled")
			.attr("class","btn btn-outline-secondary");
		streets.removeFrom(mymap);
        greyscale.addTo(mymap);
    });
    $("#streets").click(function(){
		$("#streets")
			.attr("disabled","")
			.attr("class","btn btn-secondary");
		$("#greyscale")
			.removeAttr("disabled")
			.attr("class","btn btn-outline-secondary");
		greyscale.removeFrom(mymap);
        streets.addTo(mymap);
    });
};