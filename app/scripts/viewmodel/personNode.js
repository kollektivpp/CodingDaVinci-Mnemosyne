'use strict';

angular.module('mnemosyneApp').factory('PersonNode', function () {

    // TODO: Refactor if hirarchy
    function PersonNode(data) {
        this.type = data.type;

        this.title = data.title;

        this.dateOfBirth = data.dateOfBirth;
        this.dateOfDeath = data.dateOfDeath;

        this.placeOfBirth = data.placeOfBirth;
        this.placeOfDeath = data.placeOfDeath;

        this.professionOrOccupation = data.professionOrOccupation;

        this.variantName = data.variantName.slice(0,3);

        this.wiki = data.wiki;

        if (this.wiki && this.wiki.html) {
            this.wiki.html = this.wiki.html.replace(/<[^>]*>/g, "");
            this.wiki.html = this.wiki.html.replace(/.*\[Bearbeiten\]/g, "");
            this.wiki.html = this.wiki.html.replace(/Einzelnachweisfehler.*/g, "");
            this.wiki.html = this.wiki.html.replace(/Referenzfehler.*/g, "");
            this.wiki.html = this.wiki.html.replace(/Hinweis:.*/g, "");
            
            if (this.wiki.content) {
                this.wiki.content.forEach( function(element) {
                    if (element.html) {
                        element.html = element.html.replace(/<[^>]*>/g, "");
                        element.html = element.html.replace(/.*\[Bearbeiten\]/g, "");
                        element.html = element.html.replace(/Einzelnachweisfehler.*/g, "");
                        element.html = element.html.replace(/Referenzfehler.*/g, "");
                        element.html = element.html.replace(/Hinweis:.*/g, "");

                        if (element.content) {
                            element.content.forEach( function(innerElement) {
                                innerElement.html = innerElement.html.replace(/<[^>]*>/g, "");
                                innerElement.html = innerElement.html.replace(/.*\[Bearbeiten\]/g, "");
                                innerElement.html = innerElement.html.replace(/Einzelnachweisfehler.*/g, "");
                                innerElement.html = innerElement.html.replace(/Referenzfehler.*/g, "");
                                innerElement.html = innerElement.html.replace(/Hinweis:.*/g, "");
                            });
                        }
                    }
                });
            }
        }

        this.thumbnail = data.thumbnail;
    }

    return PersonNode;
});
