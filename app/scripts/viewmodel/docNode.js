'use strict';

angular.module('mnemosyneApp').factory('DocNode', function () {

    function DocNode(data) {
        this.type = data.type;
        this.thumbnail = data.thumbnail;
        this.image = data.image;
        this.title = data.title;
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
        
        console.log("DOC DATA:");
        console.log(data);
        //var thumbnailLoader = new ThumbnailLoader();
        //this.image = thumbnailLoader.loadThumbnail(this);
    }

    return DocNode;
});