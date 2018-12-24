var MapUtil = {
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
    var input = document.getElementById("fileinput");
    var label = document.getElementById("filelabel");
    var confirm = document.getElementById("confirmFileBtn");
    EventUtil.addHandler(input,"change",function(e){
        files = EventUtil.getTarget(e).files;
        label.innerHTML = files[0].name;
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