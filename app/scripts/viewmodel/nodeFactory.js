'use strict';

angular.module('mnemosyneApp').factory('NodeFactory', function (PersonNode) {

    return {
        createNodeWithOutcome: function(outcomeData) {

            console.log("outcome data");
            console.log(outcomeData);

            if (outcomeData.type === "PERSON") {
                return new PersonNode(outcomeData);
            } else if (outcomeData.type === "FACET") {
                return {}; //TODO!
            } else {
                return {
                    title: "There is no node type available for type: " + outcomeData.type
                }
            }
        }
    };
});
