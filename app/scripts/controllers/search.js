'use strict';

angular.module('mnemosyneApp')
    .controller('SearchCtrl', function($scope, $http, $compile, $location, SharedResult, MnemosyneRequest, EventSystem, NodeFactory, socket) {
            $scope.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
            $scope.searchTerm = {};
            $scope.requestDepth = (SharedResult.data.length !== 0) ? SharedResult.data[0].requestResults.length : 1;
            $scope.searchTerm.value = (SharedResult.data.length !== 0) ? SharedResult.data[0].startSearchTerm : "";
            $scope.loadingStopped = true;
            $scope.encoderValue = 0;
            $scope.lastValue = 0;

            $scope.shareActivated = false;
            $scope.hasResults = true;
            $scope.scroll = 0;
            $scope.recentScrollData = 0;

            //focus fields
            $scope.ShareToFocus = false;
            $scope.ShareFromFocus = false;
            $scope.ShareAdditionalTextFocus = false;
            $scope.ShareSendFocus = false;

            console.log("initialized searchterm");

            // Sharing functionality
            $scope.share = {
                sendTo: "",
                sendFrom: "",
                shareAdditionalText: ""
            };

            $scope.hasElements = function() {

            }

            $scope.triggerSearch = function(event) {
                $('#loading-animation').show();
                var searchString = angular.element(document.querySelector('.overlay-search-selector input')).val();
                console.log("Searchstring:" + searchString);
                //TODO: Implement random search

                // Starting the Mnemosyne request:
                var request = new MnemosyneRequest(searchString, angular.copy($scope.requestDepth), function(result) {
                    SharedResult.data = result;
                    $scope.displayResult();
                    $('#loading-animation').hide();
                });

                $scope.result1 = {};
                $scope.result2 = {};
                $scope.result3 = {};
                $scope.result4 = {};
                $scope.result5 = {};

                request.startSearch();
                
            };

            $scope.standardButtonClick = function(event) {

                var clickedButton = angular.element(event.srcElement),
                    overlay = clickedButton.next(),
                    allButtons = angular.element(document.querySelectorAll('.standard-button')),
                    allOverlays = angular.element(document.querySelectorAll('.standard-overlay'));

                if (clickedButton.hasClass('active')) {
                    clickedButton.removeClass('active');
                    overlay.addClass('hidden');
                } else {
                    allButtons.removeClass('active');
                    allOverlays.addClass('hidden');

                    clickedButton.addClass('active');
                    overlay.removeClass('hidden');
                }
            };

            $scope.searchButtonClick = function() {
                console.log("Search klicked");
                var searchButton = $('#button-search'),
                    overlay = $('#search-overlay');

                if (searchButton.hasClass('active')) {
                    console.log("search was active");
                    if ($('.searchTerm').val() !== '') {
                        $scope.searchTerm.value = '';
                        $scope.triggerSearch();
                    }

                    searchButton.html("RESTART");
                } else {
                    searchButton.html("GO");
                    $('.random-search-overlay').removeClass('selected');
                    $('.search-search-overlay').addClass('selected');
                    $('.searchTerm').focus();
                }
            };

            $scope.changeSearchOptionVisibity = function() {
                var searchButton = $('#button-search');
                var overlay = $('#search-overlay');
                if (searchButton.hasClass('active')) {
                    console.log('search was active, will be removed');
                    overlay.addClass('hidden');
                    searchButton.removeClass('active');
                    searchButton.html("RESTART");
                }  else {
                    overlay.removeClass('hidden');
                    searchButton.addClass('active');
                    $('.searchTerm').focus();
                    searchButton.html("GO");
                    if ($scope.shareActivated) {
                        $scope.sharePressed();
                    }
                }
            };

            $scope.openMetaView = function() {
                $location.path('/meta');
            };

            $scope.randomSearchString = function() {
                var strings = ["Thomas", "Fussball", "Dinosaurier", "Achim", "USA", "Deutschland", "Merkel", "Jazz", "Schrank", "Zimmer"];
                return strings[Math.floor(Math.random() * strings.length)];
            }

            $scope.selectSearchStyle = function(event) {
                var searchStyleElements = angular.element(document.querySelectorAll('.overlay-search-selector')),
                    clickedElement = (angular.element(event.srcElement).hasClass('.overlay-search-selector')) ? angular.element(event.srcElement) : angular.element(event.srcElement).parent(),
                    searchButton = angular.element(document.querySelector('#button-search'));
                if (clickedElement.hasClass('random-search-overlay')) {
                    $scope.searchTerm.value = $scope.randomSearchString();
                }

                if (clickedElement.hasClass('selected')) {
                    clickedElement.removeClass('selected');
                    searchButton.html("RESTART");
                } else {
                    searchStyleElements.removeClass('selected');
                    clickedElement.addClass('selected');
                    searchButton.html("GO");
                    $('.searchTerm').focus();
                }
            };

            $scope.increaseSearchDepth = function() {
                $scope.requestDepth = Math.min(5, $scope.requestDepth + 1);
                $scope.displaySearchDepth();
            };

            $scope.decreaseSearchDepth = function() {
                $scope.requestDepth = Math.max(1, $scope.requestDepth - 1);
                $scope.displaySearchDepth();
            };

            $scope.displaySearchDepth = function() {
                var depthIndicatorSteps = angular.element(document.querySelectorAll('.depth-indicator-step')),
                    knobElement = angular.element(document.querySelector('.knob')),
                    knobPositionDegree,
                    singleStep,
                    i,
                    length = 5;

                for (i = 0; i < length; i++) {
                    singleStep = angular.element(depthIndicatorSteps[i]);

                    if (i <= $scope.requestDepth - 1) {
                        singleStep.addClass('active');
                    } else {
                        singleStep.removeClass('active');
                    }
                }

                knobPositionDegree = -60 + (20 * $scope.requestDepth);
                knobElement.css({
                    "-webkit-transform": "rotate(" + knobPositionDegree + "deg)",
                    "transform": "rotate(" + knobPositionDegree + "deg)"
                });
            };


            $scope.$on('$viewContentLoaded', function() {

                if (SharedResult.data.length !== 0) {
                    $scope.displayResult();

                    // Timeout needed for the knob element to be available
                    setTimeout(function() {
                        $scope.displaySearchDepth();
                    }, 10);
                }

                setTimeout(function() {
                    $('.knob').addClass('with-transition');
                }, 100);
            });

        $scope.searchHasResults = function() {
            if ($scope.result1.title || $scope.result2.title || 
                $scope.result3.title || $scope.result4.title || $scope.result5.title) {

                return true; 
            }

            return false;
        }

        $scope.displayResult = function() {
            var requestThreadDepth = SharedResult.data[0].requestResults.length;

            $scope.result1 = NodeFactory.createNodeWithOutcome(SharedResult.data[0].requestResults[requestThreadDepth - 1].outcome);
            $scope.result2 = NodeFactory.createNodeWithOutcome(SharedResult.data[1].requestResults[requestThreadDepth - 1].outcome);
            $scope.result3 = NodeFactory.createNodeWithOutcome(SharedResult.data[2].requestResults[requestThreadDepth - 1].outcome);
            $scope.result4 = NodeFactory.createNodeWithOutcome(SharedResult.data[3].requestResults[requestThreadDepth - 1].outcome);
            $scope.result5 = NodeFactory.createNodeWithOutcome(SharedResult.data[4].requestResults[requestThreadDepth - 1].outcome);

            $scope.hasResults = $scope.searchHasResults();
            console.log("Result: ") 
            console.log($scope.result1);
        };

        $scope.showMore = function(event) {
            var clickedButton = $(event.srcElement),
                relevantMoreElement = clickedButton.parents('.nodeWrapper').children('.moreWiki'),
                relevantNodeElement = clickedButton.closest('.nodeElement');
            if (event.stopPropagation)
                event.stopPropagation();
            $scope.hideMore();

            relevantMoreElement.addClass('moreIsShown');
            relevantNodeElement.addClass('moreIsShown');


            $('body').one('click', $scope.hideMore);
            console.log(relevantMoreElement);
            console.log(relevantNodeElement);

            console.log(event);

            console.log(arguments[0]);
            console.log(arguments[1]);
            console.log(arguments[2]);
            console.log(arguments[3]);
        };

        $scope.hideMore = function(event) {
            var moreElements = $('.moreWiki'),
                nodeElements = $('.nodeElement');

            moreElements.removeClass('moreIsShown');
            nodeElements.removeClass('moreIsShown');
        };

        $scope.sendMail = function() {
            var newLine = "%0A",
                content = "Hi," + newLine + newLine + "check out these search results made with MNEMOSYNE!" + newLine,
                mailToString = "mailto:" + $scope.share.sendTo + "?subject=" + "My Mnemosyne search" + "&body=" + content + $scope.share.additionalText + newLine + newLine + "Regards, " + $scope.share.sendFrom;

            location.href = mailToString;
        }

        $scope.$on('$viewContentLoaded', function() {

            if (SharedResult.data.length !== 0) {
                $scope.displayResult();

                // Timeout needed for the knob element to be available
                setTimeout(function() {
                    $scope.displaySearchDepth();
                }, 10);
            }

            setTimeout(function() {
                $('.knob').addClass('with-transition');
            }, 100);
        });

        $scope.toggleMore = function(id) {
            if ($scope.lastMore !== id) {
                $scope.lastMore = id;
                $scope.hideMore();
                return $scope.showMore({
                    srcElement: document.querySelectorAll('.more-button')[id - 1]
                });
            }
            else {
                $scope.lastMore = -1;
                return $scope.hideMore();
            }
        }

        $scope.transforToGermanKey = function(key) {
            switch (key) {
                case 'z' :
                    key = 'y'
                    break;
                case 'y' :
                    key = 'z'
                    break;
                case '-' :
                    key = 'ß'
                    break;
                case '\'' :
                    key = 'ä'
                    break;
                case '"' :
                    key = 'Ä'
                    break;
                case ';' :
                    key = 'ö'
                    break;
                case ':' :
                    key = 'Ö'
                    break;
                case '[' :
                    key = 'ü'
                    break;
                case '{' :
                    key = 'Ü'
                    break;
            }
            return key;
        }

        $scope.toggleSwitch = function(direction) {
            if ($('#search-overlay:visible').length !== 0) {
                if (direction > 0) {
                    $('.searchTerm').focus();
                    $('.search-search-overlay').addClass('selected');
                    $('.random-search-overlay').removeClass('selected');
                } else {
                    $('.search-search-overlay').removeClass('selected');
                    $('.random-search-overlay').addClass('selected');
                    $('.searchTerm').blur();
                }

            }
        };

        //pargma mark hardware buttons
        $scope.keyboardPressed = function(key) {
            console.log("detected key");
            var currentText = angular.element(document.querySelector('.overlay-search-selector input')).val();
            
            if (key === 127) {
                currentText = currentText.substring(0, currentText.length - 1);
            } 
            else {
                currentText += $scope.transforToGermanKey(String.fromCharCode(key));
            }
            angular.element(document.querySelector('.overlay-search-selector input')).val(currentText);
        };

        $scope.enterPressed = function() {
            $scope.searchButtonClick();
        }

        $scope.sharePressed = function() {
            $scope.shareActivated = !$scope.shareActivated;
            console.log("Activated: " + $scope.shareActivated);
            $scope.standardButtonClick({
                        srcElement: document.querySelector('.share')
                });
        }

        $scope.metaPressed = function() {
            if ($('.meta-view').length === 0) {
                $scope.openMetaView();
            } 
            else {
               $location.path('/search'); 
            }            
        }

        $scope.restartPressed = function() {
            $scope.changeSearchOptionVisibity();
        }

        $scope.potiPressed = function(data) {
            console.log("poti pressed");
            var searchStyleElements = angular.element(document.querySelectorAll('.overlay-search-selector'));
            var clickedElement = (angular.element(event.srcElement).hasClass('.overlay-search-selector')) ? angular.element(event.srcElement) : angular.element(event.srcElement).parent();
            
            if ($('.random-search-overlay').hasClass('selected')) {
                $scope.potiPressedRandomSearchAction();
                return;
            }

            if ($('.search-search-overlay').hasClass('selected')) {
                $scope.triggerSearch();
                return
            }
                
        }

        $scope.potiChanged = function(data) {
            var searchButton = angular.element(document.querySelector('#button-search'));
            var moreElements = $('.moreIsShown');
            if (searchButton.hasClass('active')) {
                $scope.potiChangedSearchAction(data);
                return;
            } 
            if (moreElements.length > 0) {
                $scope.potiChangedScrollMoreAction(moreElements[0], data);
                return;
            }
            if ($scope.shareActivated) {
                $scope.potiChangedShareActivatedAction(data);
                return;
            }
            
            $scope.potiChangedDisplaySearchAction(data);  
            
        }

        $scope.potiChangedSearchAction = function(data) {
            if (data <= -120) {
                    $('.search-search-overlay').removeClass('selected');
                    $('.random-search-overlay').addClass('selected');
                }
                else {
                    $('.search-search-overlay').addClass('selected');
                    $('.random-search-overlay').removeClass('selected');
                }
        }

        $scope.potiChangedDisplaySearchAction = function(data) {
            console.log("potiChangedDisplaySearchAction");
            if (data >= -210 && data <= -150) {
                $scope.requestDepth = 1;
            } else if (data >= -149 && data <= -100) {
                $scope.requestDepth = 2;
            } else if (data >= -99 && data <= -50) {
                $scope.requestDepth = 3;
            } else if (data >= -49 && data <= 0) {
                $scope.requestDepth = 4;
            } else if (data > 0 && data <= 50) {
                $scope.requestDepth = 5;
            }

            $scope.displaySearchDepth();
        }

        $scope.potiChangedScrollMoreAction = function(element, data) {
            console.log("recentScrollData");
            console.log($scope.scroll);
            data = data > 50 ? 50 : data;
            data = data < -200 ? -200 : data;
            
            if ($scope.recentScrollData <= data)
                $scope.scroll += 50;
            if ($scope.recentScrollData >= data)
                ($scope.scroll -= 50);
            $('.moreIsShown.moreWiki').animate({scrollTop: $scope.scroll}, 0);
            $scope.recentScrollData = data;
        }

        $scope.potiPressedRandomSearchAction = function() {
            console.log("PotiPressedRandomSearchAction");
            angular.element(document.querySelector('.overlay-search-selector input')).val($scope.randomSearchString());

        }

        $scope.potiChangedShareActivatedAction = function(data) {
            var inputs = document.getElementById("share-overlay").children;
            //console.log(inputs);
            $('#share-overlay').children()[0].focus();
             if (data >= -210 && data <= -150) {
                 console.log("first focus");
                 //console.log(inputs[0]);
                 $scope.ShareToFocus = true;
                 //inputs[0].focus();
             } else if (data >= -149 && data <= -100) {
                 console.log("second focus");
                 $scope.ShareFromFocus = true;
                 //inputs[1].focus();
             } else if (data >= -99 && data <= -50) {
                 console.log("third focus");
                 $scope.ShareAdditionalTextFocus = true;
                 inputs[2].focus();
             } else if (data >= -49) {
                 console.log("fourth focus");
                 $scope.ShareSendFocus = true;
                 inputs[3].focus();

            }
        }

        if(socket.on) {
            socket.on('controlstation', function(data) {
                switch(true) {
                    case (data >= 100 && data <= 227) :
                        $scope.keyboardPressed(data - 100);
                        break;
                    case (data === 230) :
                        $scope.enterPressed();
                        break;
                    case (data === 1000) :
                        $scope.toggleMore(1);
                        break;
                    case (data === 2000) :
                        $scope.toggleMore(2);
                        break;
                    case (data === 3000) :
                        $scope.toggleMore(3);
                        break;
                    case (data === 4000) :
                        $scope.toggleMore(4);
                        break;
                    case (data === 5000) :
                        $scope.toggleMore(5);
                        break;
                    case (data === 6000) :
                        $scope.sharePressed();
                        break;
                    case (data === 7000) :
                        $scope.metaPressed();
                        break;
                    case (data === 8000) :
                        $scope.restartPressed(); 
                        break;   
                    case (data === 9000) :
                        $scope.potiPressed(data);
                        break;
                    default:
                        $scope.potiChanged(data);
                        break;
                
                }
 
            });
        }
});

/**
                 * if search and random overlays are open dont modify encode
                 */
                // if ($('#search-overlay:visible').hasClass('hidden') === false) {
                //     if ($scope.lastValue > data) {
                //         $scope.encoderValue--;
                //     } else {
                //         $scope.encoderValue++;
                //     }

                //     if (Math.abs($scope.encoderValue) >= 50) {
                //         if ($scope.encoderValue < 0) {
                //             $scope.toggleSwitch(-1);
                //             $scope.encoderValue = -50;
                //         } else {
                //             $scope.toggleSwitch(1);
                //             $scope.encoderValue = 50;
                //         }
                //     }
                // }


                /**
                 * when encoder click was fired
                 */

                    // $scope.searchButtonClick({
                    //     srcElement: document.querySelector('.restart')
                    // });
                    // $scope.standardButtonClick({
                    //     srcElement: document.querySelector('.restart')
                    // });
                    

