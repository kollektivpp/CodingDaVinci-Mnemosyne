'use strict';

angular.module('mnemosyneApp').service('WikiParser', function ($q, $http, RequestBuilder) {

	this.getWikiData = function(query) {
		var deferred = $q.defer();

		if (query === undefined) {
			deferred.reject("query is undefined");
		}
		else {
			self = this;
			var pageId = -1;

			$http(
	        	RequestBuilder.searchWikipedia(query)
	    	).
	        success(function(data, status, headers, config) {
	            
	            if (data.query.pageids[0] != -1) {
	                console.log("TRIGGER TOC SEARCH");
	                pageId = data.query.pageids[0];
	                $http(
	                    RequestBuilder.getWikipediaTOC(pageId)
	                ).
	                success(function(data, status, headers, config) {
	                    console.log("LOADED TOC");
	                    console.log(data);
	                    self.parseToc(data, pageId).then(function(result) {
	                    	deferred.resolve(result);
	                	}).
	                	catch(function(result) {
	                		console.log(result);
	                	});
	                }).
	                error(function(data, status, headers, config) {
	                    deferred.reject("Inner error loading toc");
	                    EventSystem.dispatchEvent(self.finishedEvent);
	                });
	            }
	            else {
	                deferred.reject("No Article Found")
	            }
	        }).
	        error(function(data, status, headers, config) {
	            deferred.reject("Error loading TOC");
	        });
	    }

		return deferred.promise;
	}

	this.loadWikiSection = function(sectionId, pageId, resultObject) {
		var deferred = $q.defer();

		$http(
			RequestBuilder.getWikipediaSection(pageId, sectionId)
		).
		success(function(data, status, headers, config) {
			console.log("Data");
			console.log(data);
			resultObject.html = data.parse.text["*"];
			deferred.resolve(resultObject);

		}).
		error(function(data, status, headers, config) {
			deferred.reject("Error in section " + section + " of page " + pageId + " occurred");
		});

		return deferred.promise;
	}

	this.parseToc = function(rawData, pageId) {
		var deferred = $q.defer();

		console.log("raw");
		console.log(rawData);
		var promises = [];
		var sections = rawData.parse.sections;
		var result = { 'content' : [sections[0]] };
		var parentObjects = [];
		var lastObject = sections[0];
		console.log("TOC");
		console.log(rawData.parse.sections);
		console.log(lastObject);

		if (lastObject === undefined) {
			console.log("No Section");
			deferred.reject("No Sections");
		}
		else {

			promises.push(this.loadWikiSection(0, pageId, lastObject));

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
				promises.push(this.loadWikiSection(i, pageId, current));
				lastObject = current;
			}
			$q.all(promises).then(function(data) {
				deferred.resolve(result);
			}).
			catch(function(data) {
				deferred.reject("loading sections error occurred");
			}) 
		}
		return deferred.promise;
	};
});