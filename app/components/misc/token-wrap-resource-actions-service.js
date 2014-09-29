"use strict";

angular.module("misc.token-wrap-resource-actions", [
    "misc.user-session"
])

.service("tokenWrapResourceActions", ["userSession", function(userSession) {
    return {
        wrap: function(resource, actions) {
            _.forEach(actions, function(action) {
                wrapAction(resource, action);
            });
        }
    };

    function wrapAction(resource, action) {
        //Save original action with _ prefix.
        resource["_" + action] = resource[action];

        resource[action] = function(data, success, error) {
            data = angular.extend({}, data || {}, {
                access_token: userSession.token
            });

            return resource["_" + action](data, success, error);
        };
    }
}]);
