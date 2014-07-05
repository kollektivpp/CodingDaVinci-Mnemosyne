'use strict';

angular.module('mnemosyneApp').service('WikiParser', function () {

	this.parseToc = function(rawData) {
		
		var sections = rawData.parse.sections;
		var result = { 'content' : [sections[0]] };
		var parentObjects = [];
		var lastObject = sections[0];
		console.log("TOC");
		console.log(rawData.parse.sections);
		console.log(lastObject);
		for (var i = 1; i < sections.length; i++) {
			var current = sections[i];
			if (current.toclevel === 1) {
				result.content[result.content.length] = current;
				parentObjects = [];
			}
			else if (current.toclevel > lastObject.toclevel) {
				console.log("current > last");
		 		parentObjects[parentObjects.length] = lastObject;
		 		lastObject.content = [current];
		 		console.log("last object:");
		 		console.log(lastObject);
		 	}
			
			else {
				var parent = parentObjects[parentObjects.length - 1]
				parent.content[parent.content.length] = current;
				if (current.toclevel < lastObject.toclevel) {
					console.log("current < last");
					parentObjects.pop();
				}

			} 
			lastObject = current;
		}
		return result;
	};
});