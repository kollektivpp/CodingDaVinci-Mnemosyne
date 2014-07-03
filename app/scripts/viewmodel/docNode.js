'use strict';

angular.module('mnemosyneApp').factory('DocNode', function () {

    function DocNode(data) {
        this.type = data.type;
        this.thumbnail = data.thumbnail;
        this.image = data.image;
        this.title = data.title;
        console.log("DOC DATA:");
        console.log(data);
        //var thumbnailLoader = new ThumbnailLoader();
        //this.image = thumbnailLoader.loadThumbnail(this);
    }

    return DocNode;
});