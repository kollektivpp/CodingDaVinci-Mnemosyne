# MNEMOSYNE

## DDB Search Queries

### facets
API call to get kind of *facets*:
	
	https://api.deutsche-digitale-bibliothek.de/search/facets
	
The *facets* we use to get connected data to the search term:

*	time: 					(time_fct)
*	place:					(place_fct)
*	persons affiliated:		(affiliate_fct)
*	keywords:				(keywords_fct)

The values for the returned facets are sorted by a *count* property. When creating a new search query, we should use the facet values with the highest counts.

### entities (culturegraph)

*entities* deliver **persons** affiliated with the search term, based on the GND.
The JSON data mapped to the ID can be requested via:

	http://hub.culturegraph.org/entityfacts/<id>
		
####properties to display
* person/biographicalOrHistoricalInformation
* person/depiction (image for the person)

####properties to display & create new search queries
* person/variantName
* person/dateOfBirth
* person/dateOfDeath
* person/placeOfActiviy
* person/professionOrOccupation
* person/familialRelationship
* person/
	
	
## Returned objects
####Node####
A node is the name for a single item displayed on the final app (e.g. A result view can display up to 5 nodes).

There are different kinds of nodes:

*	Person
*	Image
*	Tag Cloud
*	Place
*	Opus
*	Time
*	Profession
*	Text
*	Generic
	
	
##Tasks

DNB API (Deutsche National Bibliothek)

* *Entities* für Werke/Orte/etc.
* SRU



	