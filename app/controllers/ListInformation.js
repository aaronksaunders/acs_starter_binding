var args = arguments[0] || {};

function closeWindow() {
	$.navWindow.close();
}

/**
 * Called by Alloy for each model before rendering to transform it
 * into something that is better for display
 */
function transformData(_model) {

	return {
		name : _model.get("name"),
		startTime : _model.getFormattedStartTime(),
		_data : _model.attributes // < -- SAVE ALL OF THE MODEL DATA
	};
}

/**
 * called when user clicks on listView. The _event will provide
 * the index of the item clicked in the listView
 *
 * @param {Object} _event
 */
function listItemClicked(_event) {

	// get data using index provided, the items are in the section
	// so we use the index against the section, not the listView
	var currentItem = $.listSection.getItemAt(_event.itemIndex);
	Ti.API.info("currentItem " + JSON.stringify(currentItem, null, 2));

	// now display the data
	var data = currentItem.properties.model;
	alert("clicked on\nid: " + data.id + "\nEvent: " + data.name + "\nWhen: " + data.start_time + "\nDuration:" + data.duration);

	// - NOTE -
	// can also get the item from the collection directly
	//
	var _collection = infoCollection;
	console.log(_collection.models[_event.itemIndex].getFormattedStartTime());

}

/**
 * Event Listener called when the window is closed
 */
$.navWindow.addEventListener("close", function() {
	$.destroy();
});

// -- FETCH ALL OF THE DATA FOR THE INITIAL DISPLAY --
infoCollection.fetch();

