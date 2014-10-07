'use strict';

angular.module('mnemosyneApp').service('WikiParser', function ($q, $http, RequestBuilder) {
	
	function normalizeQuery(query) {
		var normalizedQuery = query.replace(/\;(.*)/g, "").replace(/[,:;.]/g, "").replace(/\([^)]*\)/g, "");
		console.log("Normalized Query: " + normalizedQuery);
		return normalizedQuery.split(' ');
	}

	function hasNextQuery(query, round) {
		if (round < 2) {
			return true;
		}
		return false;
	}

	this.getToc = function(pageId) {
		var deferred = $q.defer();
		self = this;
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
        		deferred.reject("No Results in TOC");
        	});
        }).
        error(function(data, status, headers, config) {
            deferred.reject("Inner error loading toc");
            EventSystem.dispatchEvent(self.finishedEvent);
        });
        return deferred.promise;
	}

	this.getWikiData = function(query) {
		var deferred = $q.defer();
		
		if (query === undefined) {
			deferred.reject("query is undefined");
		}
		else {
			var queries = normalizeQuery(query);
			self = this;
			var pageId = -1;

			$http(
	        	RequestBuilder.searchWikipedia(queries.join('%20'))
	    	).
	        success(function(data, status, headers, config) {
	        	console.log("pageids:" + data.query.pageids[0] + "for " + queries);
	            if (data.query.pageids[0] != -1) {
	                console.log("TRIGGER TOC SEARCH");
	                pageId = data.query.pageids[0];
	                var tocPromise = self.getToc(pageId);
	                tocPromise.then(function(data) {
	                	console.log("resolve deferred for toc");
	                	deferred.resolve(data);
	                }).catch(function(data) {
	                	console.log("ERROR!!!!");
	                	deferred.resolve(data);
	                });
	            }
	            else {
	            		var buffer = queries[0];
	            		console.log("Query length: " + queries.length);
	            		queries[0] = queries[queries.length - 1];
	            		queries[queries.length - 1] = buffer;
	            		$http(
	        				RequestBuilder.searchWikipedia(queries.join('%20'))
	    				).
	        			success(function(data, status, headers, config) {
	        				console.log("inner pageids:" + data.query.pageids[0] + "for " + queries);
	            			if (data.query.pageids[0] != -1) {
	                			console.log("TRIGGER TOC SEARCH");
	                			pageId = data.query.pageids[0];
	                			var tocPromise = self.getToc(pageId);
	                			tocPromise.then(function(data) {
	                				console.log("resolve deferred for toc");
	                				deferred.resolve(data);
	                			}).catch(function(data) {
	                				console.log("ERROR!!!!");
	                				deferred.reject("Error loading toc");
	                			});
	                		}
	                		else
	                			deferred.reject("No Article Found")
	                	}).
	                	error(function(data, status, headers, config) {
	        				console.log("error");
	            			deferred.reject("Error requesting TOC inner");
	        			});
	            }   
	        }).
	        error(function(data, status, headers, config) {
	        	console.log("error");
	            deferred.reject("Error requesting TOC");
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
			
			resultObject.html = data.parse.text["*"];
			resultObject.html.replace(/<.*>.*<\/.*>/g, "");
			deferred.resolve(resultObject);

		}).
		error(function(data, status, headers, config) {
			deferred.reject("Error in section " + section + " of page " + pageId + " occurred");
		});

		return deferred.promise;
	}

	this.parseToc = function(rawData, pageId) {
		var deferred = $q.defer();

		var promises = [];
		var sections = rawData.parse.sections;
		var result = { 'content' : [sections[0]] };
		var parentObjects = [];
		var lastObject = sections[0];

		result.title = rawData.parse.title;

		if (lastObject === undefined) {
			console.log("No Section");
			deferred.reject("No Sections");
		}
		else {

			promises.push(this.loadWikiSection(0, pageId, result));

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
			 	}
				
				else {
					var parent = parentObjects[parentObjects.length - 1]
					parent.content[parent.content.length] = current;
					if (current.toclevel < lastObject.toclevel) {
						console.log("current < last");
						parentObjects.pop();
					}

				} 
				promises.push(this.loadWikiSection(i + 1, pageId, current));
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