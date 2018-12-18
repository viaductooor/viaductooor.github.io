$("#loadlinks").click(function() {
        // creating input on-the-fly
        var input = $(document.createElement("input"));
        input.attr("type", "file");
        // add onchange handler if you wish to get the file :)
        input.trigger("click"); // opening dialog
        return false; // avoiding navigation
    });

$("#loadtrips").click(function() {
    // creating input on-the-fly
    var input = $(document.createElement("input"));
    input.attr("type", "file");
    // add onchange handler if you wish to get the file :)
    input.trigger("click"); // opening dialog
    return false; // avoiding navigation
});