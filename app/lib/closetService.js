var ClothingCollection = new AlloyObjectFactory('clothing', "Objects").Collection;
var ClothingModel = new AlloyObjectFactory('clothing', "Objects").Model;

var ClosetCollection = new AlloyObjectFactory('closet', "Objects").Collection;
var ClosetModel = new AlloyObjectFactory('closet', "Objects").Model;

/**
 *
 */
function _createCloset(_params) {
	var closet = new ClosetModel();
	return closet.save(_params);
}

/**
 *
 * @param {Object} _closetId
 * @param {Object} _clothesInformation
 */
function _addClothes(_closetId, _clothesInformation) {
	var clothing = new ClothingModel();
	var closet = new ClosetModel();

	// 1) get the closet
	debugger;
	return closet.fetch({
		id : _closetId,
		data : {
			response_json_depth : 2,
			sel : JSON.stringify({
				"all" : ["[CUSTOM_clothing]clothing_ids", "id"]
			})
		}
	}).then(function(_closetObject) {
		return clothing.save(_clothesInformation);
	}).then(function(_newClothing) {
		var clothesArray = closet.get('[CUSTOM_clothing]clothing_ids') || [];

		if (clothesArray.length) {
			clothesArray = clothesArray.map(function(_item) {
				return _item.id;
			});
		}
		clothesArray.push(_newClothing.id);

		// just set the fields we need to update
		closet.clear().set({
			'[CUSTOM_clothing]clothing_ids' : clothesArray,
			id : _closetId
		});
		return closet.save();
	}, function(_error) {
		console.log(_error);
	});

	// 2) create the clothing item

	// 3) add clothing item to closet

	// 4) save closet

}

/**
 *
 * @param {Object} _id
 */
function _getClothing(_id) {
	//551b0d8d54add893d5ccb6f9
	//var clothing = Alloy.createCollection('clothing');

	var clothing = new ClothingCollection();

	return clothing.fetch({
		id : _id,
		data : {
			response_json_depth : 2
		}
	});
}

function _getAllClosets() {
	var closetCollection = new ClosetCollection();
	return closetCollection.fetch({
		data : {
			response_json_depth : 4
		}
	});
}

function _getAllClothing() {
	var clothing = new ClothingCollection();
	return clothing.fetch({
		data : {
			response_json_depth : 2
		}
	});
}

function _getAllClothingByClosetId(_closetId) {

	//var clothing = new ClothingCollection();
	var clothing = Alloy.createCollection('clothing');

	var queryObject = {
		'[CUSTOM_closet]closet_id' : _closetId
	};

	return clothing.fetch({
		data : {
			where : JSON.stringify(queryObject)
		}
	});
}

function _queryCloset() {

}

function AlloyObjectFactory(_name, _Object) {
	var model,
	    definition = {
		config : {
			adapter : {
				type : "acs"
			},
			settings : {
				object_name : _name/*"book"*/,
				object_method : _Object/*"Objects"*/
			}
		},
		extendModel : function(Model) {
			_.extend(Model.prototype, {});
			return Model;
		},
		extendCollection : function(Collection) {
			_.extend(Collection.prototype, {});
			return Collection;
		}
	};

	model = Alloy.M(_name, definition, []);

	return {
		Model : model,
		Collection : Alloy.C(_name, definition, model)
	};
}

module.exports = {
	createCloset : _createCloset,
	getAllClosets : _getAllClosets,
	getEverythingInCloset : _getAllClothingByClosetId,
	getClothingById : _getClothing,
	addClothesToCloset : _addClothes,
	findInCloset : _queryCloset
};
