//
// GLOBAL COLLECTION INSTANCE
//
infoCollection = Alloy.Collections.instance('event');


// check if there is a user session saved already
var aUser = Alloy.createModel('User');
if (aUser.authenticated()) {
	// rehydrate the user
	aUser.showMe().then(function(_user) {
		userLoggedIn(_user);
	}, function(_error) {
		alert("Application Error\n " + _response.error.message);
		Ti.API.error(JSON.stringify(_response.error, null, 2));
		// go ahead and do the login
		userNotLoggedIn();
	});
} else {
	userNotLoggedIn();
}

/**
 *
 */
function userLoggedIn(_user) {

	if (!$.alreadyOpenedIndex) {
		// start the application
		$.mainWindow.open();

		$.alreadyOpenedIndex = true;
	}

	Alloy.Globals.CURRENT_USER = _user;

	// set button title with name to show we are logged in
	$.logoutBtn.title = "Logout: " + _user.get("username");

	doClosetLibraryTest();

	// added support for getting location from the user
	// object since it seems like a helpful feature
	//
	// set to true to get location
	false && _user.getCurrentLocation().then(function(_results) {
		Ti.API.debug('_results ' + JSON.stringify(_results, null, 2));
	}, function(_error) {
		Ti.API.error('_error ' + JSON.stringify(_error));
	});

}

/**
 *
 */
function userNotLoggedIn() {
	// display login information
	var ctrl = Alloy.createController('User', {
		callback : function(_user) {

			userLoggedIn(_user);

			// close the old window
			ctrl.getView().close();
			ctrl = nil;
		}
	});

	ctrl.getView().open();
}

/**
 *
 */
function doLogout() {
	if (Alloy.Globals.CURRENT_USER) {
		Alloy.Globals.CURRENT_USER.logout().then(function(_model) {
			Alloy.Globals.CURRENT_USER = null;
			console.log("logged out!");

			// display login window
			userNotLoggedIn();

		}, function(_error) {
			alert(_error.message);
		});
	}
}

//doShowEvents
function doShowEvents() {
	var controller = Alloy.createController("ListInformation");
	controller.navWindow.open();
}


$.mainWindow.addEventListener('androidback', function(e) {
	$.mainWindow.close();

	// get activity and cleanup
	$.mainWindow.activity.finish();
});

// ================================================================================
//     EVENT TEST FUNCTIONS
// ================================================================================
function doCreateEvent() {
	var anEvent = Alloy.createModel('Event');
	anEvent.set({
		name : 'Celebration',
		start_time : new Date(),
		duration : 3600,
		recurring : 'monthly',
		recurring_count : 5
	});

	anEvent.save().then(function(_model) {
		console.log("anEvent.save " + JSON.stringify(_model, null, 2));

		var moment = require('alloy/moment');
		console.log("start time-relative: " + _model.getFromNowStartTime());
		console.log("start time-formatted: " + _model.getFormattedStartTime());

		return doFetchEvents();

	}, function(_error) {
		alert(_error.message);
	});
}


