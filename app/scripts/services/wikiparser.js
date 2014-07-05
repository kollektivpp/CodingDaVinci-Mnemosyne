'use strict';

angular.module('mnemosyneApp').service('WikiParser', function () {

	this.parseToc = function(rawData) {
		
		var sections = rawData.parse.sections;
		var result = { 'content' : [sections[0].line] };
		var parentObjects = [];
		var lastObject = sections[0];
		console.log("TOC");
		console.log(rawData.parse.sections);
		console.log(lastObject);
		for (var i = 1; i < sections.length; i++) {
			var current = sections[i];
			if (current.toclevel === 1) {
				result.content[result.content.length] = current.line;
				parentObjects = [];
			}
			else if (current.toclevel > lastObject.toclevel) {
					console.log("current > last");
			 		parentObjects[parentObjects.length] = lastObject;
			 		parentObjects.content = [current.line]
			 	}
			
			else if (current.tocLevel == lastObject.toclevel) {
				console.log("current == last");
				parentObjects.content[parentObjects.content.length] = current.line;
			}
			else if (current.toclevel < lastObject.toclevel) {
				console.log("current < last");
				parentObjects.pop();
				parentObjects.content[parentObject.content.length] = current.line;

			}
			lastObject = current;
		}
		return result;
	};
});