class ChooseFileModal extends React.Component{
    /**
     * @argument title the modal's title
     * @argument fileType   
     */
    render(){
        return(
            <div className="modal fade" id="chooseFileModalInner" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <ModalHeader title={this.props.title}></ModalHeader>
                        <FileModalBody fileType={this.props.fileType}></FileModalBody>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" id="confirmLoadBtn">Ok</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

class ModalHeader extends React.Component{
    render(){
        return(
            <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">{this.props.title}</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
        );
    }
}

class TripsModalBody extends React.Component{
    render(){
        return(
            <div className="modal-body">
                <div className="custom-file">
                <input type="file" id="fileInput"/>
                </div>
            </div>
        );
    }
}

class LinksModalBody extends React.Component{
    render(){
        return(
            <div className="modal-body">
                <div className="custom-file">
                <input type="file" id="fileInput"/>
                </div>
            </div>
        );
    }
}

class GeoJsonModalBody extends React.Component{
    render(){
        return(
            <div className="modal-body">
                <div className="custom-file">
                <input type="file" id="fileInput"/>
                </div>
            </div>
        );
    }
}

class OsmModalBody extends React.Component{
    render(){
        return(
            <div className="modal-body">
                <div className="custom-file">
                <input type="file" id="fileInput"/>
                </div>
            </div>
        );
    }
}

class FileModalBody extends React.Component{
    render(){
        switch(this.props.fileType){
            case "links":
                return <LinksModalBody/>;
            case "trips":
                return <TripsModalBody/>;
            case "geojson":
                return <GeoJsonModalBody/>;
            case "osm":
                return <OsmModalBody/>;
        }
    }
}

var modal = document.getElementById("chooseFileModal");
$(".modal-trigger").on("click",function(e){
    switch(e.target.id){
        case "tripsBtn":
            ReactDOM.render(<ChooseFileModal title="Choose a csv" fileType="trips"></ChooseFileModal>,modal);
            $("#chooseFileModalInner").modal("toggle");
            $("#confirmLoadBtn").on("click",function(e){
                $("#chooseFileModal").modal("toggle");
                var file = document.getElementById("fileInput").files[0];
                MapUtil.readAndDisplayTrips(file);
            });
            break;
        case "linksBtn":
            ReactDOM.render(<ChooseFileModal title="Choose a csv" fileType="links"></ChooseFileModal>,modal);
            $("#chooseFileModalInner").modal("toggle");
            $("#confirmLoadBtn").on("click",function(e){
                $("#chooseFileModalInner").modal("toggle");
                var file = document.getElementById("fileInput").files[0];
                MapUtil.readAndDisplayLinks(file);
            });
            break;
        case "geoJsonBtn":
            ReactDOM.render(<ChooseFileModal title="Choose a GeoJSON file" fileType="geojson"></ChooseFileModal>,modal);
            $("#chooseFileModalInner").modal("toggle");
            $("#confirmLoadBtn").on("click",function(e){
                $("#chooseFileModalInner").modal("toggle");
                var file = document.getElementById("fileInput").files[0];
                MapUtil.readAndDisplayGeoJson(file);
            });
            break;
        case "osmBtn":
            ReactDOM.render(<ChooseFileModal title="Choose a OSM file" fileType="osm"></ChooseFileModal>,modal);
            $("#chooseFileModalInner").modal("toggle");
            $("#confirmLoadBtn").on("click",function(e){
                $("#chooseFileModalInner").modal("toggle");
                var file = document.getElementById("fileInput").files[0];
                MapUtil.readAndDisplayOsm(file);
                
            });
            break;
    }
});

