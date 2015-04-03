//
// http://docs.appcelerator.com/platform/latest/#!/api/Titanium.Cloud.Events
//
exports.definition = {

    config : {
        "columns" : {},
        "defaults" : {},
        "adapter" : {
            "type" : "acs",
        },
        "settings" : {
            "object_name" : "events",
            "object_method" : "Events"
        }
    },

    extendModel : function(Model) {
        // http://momentjs.com/
        var moment = require('alloy/moment');

        _.extend(Model.prototype, {
            /**
             * returns the start_time using plain english relative to current
             * time
             */
            getFromNowStartTime : function() {
                var _model = this;
                return moment(_model.get("start_time")).fromNow();
            },
            /**
             * returns the start_time formatted
             * See moment documentation for more information on formats
             * @param {Object} _format
             */
            getFormattedStartTime : function(_format) {
                var _model = this;
                return moment(_model.get("start_time")).format(_format || 'LLL');
            }
        });
        return Model;
    },

    extendCollection : function(Collection) {
        _.extend(Collection.prototype, {});
        return Collection;
    }
};