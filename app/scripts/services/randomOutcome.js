'use strict';

angular.module('mnemosyneApp').factory('RandomOutcome', function (ResultParser) {
    return {
        getRandomOutcome: function(data) {
            var resultParser = new ResultParser(data),
                resultOutcome = resultParser.createOutcome();

            // Truncating random outcomes to prevent the real outcome to be off screen
            if (resultOutcome.title.length > 50) {
                resultOutcome.title = resultOutcome.title.substring(0,50) + "...";
            }

            return resultOutcome;
        },

        getRandomBoolHigh: function() {
            return Math.random() > 0.5;
        },

        getRandomBoolLow: function() {
            return Math.random() > 0.8;
        }
    }
});
