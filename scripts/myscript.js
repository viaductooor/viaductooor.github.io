var MapUtil = {
    defaultCircleMarkerOptions: {
        radius: 8,
        fillColor: "cyan",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    },

    defaultWayFilterOptions:{
        filter: function(feature){
            if(feature.geometry.type=="LineString")
                return true;
            else
                return false;
        }
    },

    //Default trip marker function. It provides a reactive way 
    //to show detailed information when you click on a marker.
    defaultTripFilterOptions:{
        pointToLayer: function(feature,latlng){
            var points = feature.geometry.coordinates;
            var marker = L.circleMarker(latlng, MapUtil.defaultCircleMarkerOptions);
            var popup1 = L.popup({autoClose:false})
                .setLatLng([points[0][1],points[0][0]])
                .setContent("["+points[0][1]+", "+points[0][0]+"]<br>Location");
            var popup2 = L.popup({autoClose:false})
                .setLatLng([points[1][1],points[1][0]])
                .setContent("["+points[1][1]+", "+points[1][0]+"]<br>Destination");
            marker.on("click",function(event){
                popup1.openOn(mymap);
                popup2.openOn(mymap);
            });
            return marker;
        }
    },

    //Get a color of green-yellow-red, depending on the value of grad.
    //Grad is a float between 0 and 1, where 0 is green and 1 is red.
    getGradientColorString: function(grad){
        var hslToRgb = function(hue, saturation, lightness){
            // based on algorithm from http://en.wikipedia.org/wiki/HSL_and_HSV#Converting_to_RGB
            if( hue == undefined ){
              return [0, 0, 0];
            }
          
            var chroma = (1 - Math.abs((2 * lightness) - 1)) * saturation;
            var huePrime = hue / 60;
            var secondComponent = chroma * (1 - Math.abs((huePrime % 2) - 1));
          
            huePrime = Math.floor(huePrime);
            var red;
            var green;
            var blue;
          
            if( huePrime === 0 ){
              red = chroma;
              green = secondComponent;
              blue = 0;
            }else if( huePrime === 1 ){
              red = secondComponent;
              green = chroma;
              blue = 0;
            }else if( huePrime === 2 ){
              red = 0;
              green = chroma;
              blue = secondComponent;
            }else if( huePrime === 3 ){
              red = 0;
              green = secondComponent;
              blue = chroma;
            }else if( huePrime === 4 ){
              red = secondComponent;
              green = 0;
              blue = chroma;
            }else if( huePrime === 5 ){
              red = chroma;
              green = 0;
              blue = secondComponent;
            }
          
            var lightnessAdjustment = lightness - (chroma / 2);
            red += lightnessAdjustment;
            green += lightnessAdjustment;
            blue += lightnessAdjustment;
          
            return [Math.round(red * 255), Math.round(green * 255), Math.round(blue * 255)];
          
          };    
        
        rgb = hslToRgb(Math.round(130-grad*130),0.91,0.39);

        var decimal2hex = function(d){
            hexString = d.toString(16);
            if (hexString.length % 2) {
                hexString = '0' + hexString;
            }
            return hexString;
        };
    
        r = Math.round(rgb[0] * 255);
        g = Math.round(rgb[1] * 255);
        b = Math.round(rgb[2] * 255);
        console.log(r+","+g+","+b);
        return "#"+decimal2hex(r)+decimal2hex(g)+decimal2hex(b);
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



    //Add a GeoJSON layer to the map. 
    displayGeoJson: function(geojson,options,name){
        try{
            var l = L.geoJSON(geojson,options);
            l.addTo(mymap);
            layerGroup.addOverlay(l,name);
        }catch(ex){
            alert(ex.message+"\nWrong GeoJSON document.");
        }
    },

    //Transform the osm data to a GeoJSON object and add it to the map.
    displayOsm: function(osm, options){
        try{
            var geojson = osmtogeojson(osm);
            L.geoJSON(geojson,options).addTo(mymap);
        }catch(ex){
            alert(ex.message+"\nError occurred when trying to transform OSM to GEOJSON.");
        }
        
    },

    csv2linkGeoJson: function(file){
        /**
         * Read map of <node_id, coordinate>. 
         * The code below was executed once to create the map file,
         *  thus is useless now.
         */
        // var reader = new FileReader();
        // var links = {};
        // reader.onload = function(progressEvent){
        //     var lines = reader.result.split("\n");
        //     lines = lines.slice(1);
        //     var i;
        //     for(var i=0;i<lines.length;i++){
        //         var items = lines[i].split(',');
        //         if(items[0]&items[1]&items[2]){
        //             links[items[0]] = [items[2],items[1]];
        //         }
        //     }
        //     console.log(JSON.stringify(links));
        // }
        // reader.readAsText(file);
        var reader = new FileReader();
        reader.onload = function(progressEvent){
            var lines = reader.result.split("\n");
            lines = lines.slice(1);
            var i;
            var gjson = {
                "type":"FeatureCollection",
                "features":[]
            };
            for(i = 0;i <lines.length;i++){
                var items = lines[i].split(',');
                if(items[0]&items[1]&items[2]){
                    var start = nodes[items[0]];
                    var end = nodes[items[1]];
                    
                    if(start&&end){
                        //console.log(start+","+end);
                        var start_lat = Number(start[0]);
                        var start_lon = Number(start[1]);
                        var end_lat = Number(end[0]);
                        var end_lon = Number(end[1]);
                        var value = items[2];
                        gjson.features.push({
                            "type":"Feature",
                            "geometry":{
                                "type":"LineString",
                                "coordinates":[[start_lon,start_lat],[end_lon,end_lat]],
                            },
                            "properties":{
                                "value":Number(value)
                            }
                        });
                    }

                }
            }
            console.log(JSON.stringify(gjson));
            return gjson;
        };
        reader.readAsText(file);
    },

    readAndDisplayLinks: function(file){
        var gjson = MapUtil.csv2linkGeoJson(file);
        var options = {

        };
        try{
            var l = L.geoJSON(gjson);
            l.addTo(mymap);
            layerGroup.addOverlay(l,"Links");
        }catch(ex){
            alert(ex.message+"\nWrong GeoJSON document.");
        }
    },
    
    //Transform a csv file of trips to a GeoJSON object, and add it to the map.
    readAndDisplayTrips: function(file){
        var reader = new FileReader();
        var trips = [];

        reader.onload = function(progressEvent){
            var lines = reader.result.split("\n");
            lines = lines.slice(1);
            var i;
            for(i=0; i<lines.length; i++){
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
            MapUtil.displayGeoJson(gjson,MapUtil.defaultTripFilterOptions,"Trips");
        };
        reader.readAsText(file);
    },
    
    //tile layer
    greyScaleTileUrl : "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
    streetTileUrl : "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",

};

window.onload=function(){
    //initiate tile layers
    var greyscale = L.tileLayer(MapUtil.greyScaleTileUrl,{
        id : "mapbox.light",
        maxZoom : 18
    });
    var streets = L.tileLayer(MapUtil.streetTileUrl,{
        id : "mapbox.streets",
        maxZoom : 18
    });
    
    //initiate map
    MapUtil.resizeMapDiv();
    mymap = L.map('mapid',{zoomControl:false}).setView([ 40.7379, -73.9919 ], 13);
    streets.addTo(mymap);
    var baseLayers = {
        "Streets":streets,
        "Grey Scale":greyscale
    };
    var extraLayers = new Object();
    layerGroup = L.control.layers(baseLayers,extraLayers).addTo(mymap);
    
    //file input
    var input = document.getElementById("fileinput"),
        modal = document.getElementById("pickfilemodal"),
        exampleTrips = document.getElementById("exampleTrips"),
        osminput = document.getElementById("osminput"),
        osmmodal = document.getElementById("pickosmmodal"),
        geojsoninput = document.getElementById("geojsoninput"),
        geojsonmodal = document.getElementById("geojsonmodal");
        linksinput = document.getElementById("linksinput");
        linksmodal = document.getElementById("linksmodal");
    
    EventUtil.addHandler(exampleTrips,"click",function(e){
        $("#pickfilemodal").modal('toggle');
        MapUtil.displayGeoJson(getTrips(),MapUtil.defaultTripFilterOptions,"Example Trips");
    });
    
    EventUtil.addHandler(input,"change",function(e){
        var files = EventUtil.getTarget(e).files;
        $("#pickfilemodal").modal('toggle');
        MapUtil.readAndDisplayTrips(files[0]);
    });

    EventUtil.addHandler(osminput,"change",function(e){
        var files = EventUtil.getTarget(e).files;
        $("#pickosmmodal").modal('toggle');
        var reader = new FileReader();
        reader.onload = function(progressEvent){
            var osmData = $.parseXML(reader.result);
            var geoJsonData = osmtogeojson(osmData);
            MapUtil.displayGeoJson(geoJsonData,MapUtil.defaultWayFilterOptions,"OSM Layer");
        }
        reader.readAsText(files[0]);
    });

    EventUtil.addHandler(geojsoninput,"change",function(e){
        var files = EventUtil.getTarget(e).files;
        $("#geojsonmodal").modal('toggle');
        var reader = new FileReader();
        reader.onload = function(progressEvent){
            var data = reader.result;
            var geoJsonData = JSON.parse(data);
            MapUtil.displayGeoJson(geoJsonData,MapUtil.defaultWayFilterOptions,"GeoJSON Layer");
        }
        reader.readAsText(files[0]);
    });

    EventUtil.addHandler(linksinput,"change",function(e){
        var files = EventUtil.getTarget(e).files;
        $("#linksmodal").modal('toggle');
        MapUtil.readAndDisplayLinks(files[0]);
        //MapUtil.csv2linkGeoJson(files[0]);
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