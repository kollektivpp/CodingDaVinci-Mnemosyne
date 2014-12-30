'use strict';

angular.module('mnemosyneApp').factory('NodeFactory', function (PersonNode, FacetNode, DocNode) {

    return {
        createNodeWithOutcome: function(outcomeData) {

            if (outcomeData.type === "PERSON") {
                return new PersonNode(outcomeData);
            } else if (outcomeData.type === "FACET") {
                return new FacetNode(outcomeData);
            }
            else if (outcomeData.type === "DOC") {
                return new DocNode(outcomeData);
            } else {
                return {
                    title: "There is no node type available for type: " + outcomeData.type
                }
            }
        }
    };
});
