$(window).load(function() {
    //Setup test areas
    $('.test h3').live('click', function() {
        $(this).siblings('div').toggle();
    });

    //Test cases
    var container = $('#tests'),
        counter = 0;

    //1- Simple Map
    var simpleMap = getTestTemplate('Simple Map', 'test-map-' + counter++).appendTo(container);
    simpleMap.children('.map').jOVI({}, "_peU-uCkp-j8ovkzFGNU", "gBoUkAMoxoqIWfxWA5DuMQ");

    //2- Simple Marker
    var simpleMarker = getTestTemplate ('Simple Marker', 'test-map-' + counter++).appendTo (container);
    simpleMarker.children('.map').jOVI ({center: [40.716667, -74]})
                                 .jOVI ('dropMarker', [40.716667, -74], {text: '!', textColor: '#fff'});
    //3- Icon Marker
    var iconMarker = getTestTemplate ('Icon Marker', 'test-map-' + counter++).appendTo (container);
    iconMarker.children('.map').jOVI ({center: [40.716667, -74]})
                               .jOVI ('dropMarker', [40.69, -74.045278], {icon: 'images/liberty.png'})
                               .jOVI('setCenter',  [40.69, -74.045278])
                               .jOVI('setZoom', 16);
    //4- Full featured
    var ff = getTestTemplate ('Full Featured', 'test-map-' + counter++).appendTo (container);
    ff.children('.map').jOVI ({
                            center: [38.895111, -77.036667], //Washington D.C.
                            zoom: 12,                        //Zoom level
                            behavior: true,                  //Essentially mouse dragging and scrolling
                            zoomBar: false,                  //Zoom bar
                            scaleBar: true,                 //Scale bar at the bottom
                            overview: true,                  //Little zoomed-out view (bottom-right)
                            traffic: true,                   //Control to show/hide traffic density
                            publicTransport: true,           //Control to show/hide public transport routes
                            viewControl: true,               //Control for panning
                            contextMenu: true,               //Enable context menu on mouse right click or long-press
                            typeSelector: true,              //Controls to choose map, satellite or terrain
                            positioning: true,              //Controls to choose map, satellite or terrain
                            searchManager: true,             //Right click  gives info on the location
                            routingManager: false            //Right click allows to show routes on the map
                        }).jOVI ('setType', 'terrain');      //type can be map, satellite, terrain
    //5- Marker Events
    var em = getTestTemplate ('Marker Events', 'test-map-' + counter++).appendTo (container);
    em.children('.map').jOVI ({center: [40.716667, -74]})
                       .jOVI ('dropMarker', [40.716667, -74], {text: '?',
                                                               textColor: '#222',
                                                               fill: '#00ff7f',
                                                               click: function (event){
                                                               alert ('Clicked on marker! ' + event.target.myOwnParameter);
                                                               },
                                                               myOwnParameter: 'FOO'
                                                               })
                     .jOVI ('setType', 'satellite');
    //6- Info Bubble
    var ib = getTestTemplate ('Info Bubble', 'test-map-' + counter++).appendTo (container);
    ib.children('.map').jOVI ({center: [40.716667, -74]})
                                 .jOVI ('dropMarker', [40.716667, -74], {text: '0',
                                                                         textColor: '#fff',
                                                                         })
                                 .jOVI ('setType', 'satellite')
                                 .jOVI ('showInfoBubble', [40.716667, -74], {content: 'jOVI is pretty cool'});
    //7- jQuery Obj Info Bubble
    var jib = getTestTemplate ('Info Bubble with jQuery content', 'test-map-' + counter++).appendTo (container),
     content = $('<div/>');
    $('<h5/>').text('New York City').appendTo (content);
    $('<p/>').text('New York is the most populous city in the United States and the center of the New York Metropolitan Area, one of the most populous metropolitan areas in the world.').css({width: '200px'}).appendTo (content);
    jib.children('.map').jOVI ({center: [40.716667, -74]})
                                 .jOVI ('dropMarker', [40.716667, -74], {text: '0',
                                                                         textColor: '#fff',
                                                                         })
                                 .jOVI ('setType', 'satellite')
                                 .jOVI ('showInfoBubble', [40.716667, -74], {content: content});
    
    //8- Attempt to invoke methods on a map never initialized (OLD BEHAVIOR, no longer valid)
    // var error = getTestTemplate ('Invoke methods on a map never initialized (jOVI throws exception)', 'test-map-' + counter++).appendTo (container);
    // try {
    //     error.children('.map').jOVI('setCenter',  [40.69, -74.045278]);
    // }
    // catch (e) {
    //     error.children('.map').text(e.toString());
    // }
    
    //9- Map events
    var me = getTestTemplate ('Map Events', 'test-map-' + counter++).appendTo (container);
    me.children('.map').jOVI ({center: [40.716667, -74], mapLoaded: function(e) {console.log ('mapLoaded callback was called')}})
                       .bind('maploaded', function(e){console.log ('Callback attached with bind was called')});

    //10- Map with KML
    var kmlMap = getTestTemplate('KML Map', 'test-map-' + counter++).appendTo(container);

    var kmlAdded = function(resultSet) {
            // This uses direct access to the map object for advanced functionality
            $(this).jOVI('map', function(map) {
                // Retrieve map objects container from KML resultSet
                var container = resultSet.container.objects.get(0);
                var boundingBox = container.getBoundingBox();
                // Here we check whether we have valid bounding box or no. 
                // In case KML document does not contain any supported displayable element, bounding box will be a null, 
                // therefore it will not be possible to zoom to the not existing object. 
                if (boundingBox) {
                    // Switch the viewport of the map to show all KML map objects within the container
                    map.zoomTo(boundingBox);
                }
            });
    };

    kmlMap.children('.map').jOVI({kml: true})
                           .jOVI('addKml', 'schoenefeld.kml', kmlAdded);

    //11- Map with KML, manually added after parsing
    var kmlManualMap = getTestTemplate('KML Map, manually added', 'test-map-' + counter++).appendTo(container);
    var kmlParsed = function(kmlManager) {
        // This uses direct access to the map object for advanced functionality
        $(this).jOVI('map', function(map) {
            resultSet = new nokia.maps.kml.component.KMLResultSet(kmlManager.kmlDocument, map);
            resultSet.addObserver("state", function finishedStateHandler(resultSet) {
                if (resultSet.state == "finished") {
                    // Retrieve map objects container from KML resultSet
                    var container = resultSet.container.objects.get(0);
                    var boundingBox = container.getBoundingBox();
                    // Here we check whether we have valid bounding box or no. 
                    // In case KML document does not contain any supported displayable element, bounding box will be a null, 
                    // therefore it will not be possible to zoom to the not existing object. 
                    if (boundingBox) {
                        // Switch the viewport of the map to show all KML map objects within the container
                        map.zoomTo(boundingBox);
                    }
                }
            });
            // Add the container to the map's object collection so they will be rendered onto the map.
            map.objects.add(resultSet.create());
        });
    };
    kmlManualMap.children('.map').jOVI({kml: true})
                           .jOVI('parseKml', 'schoenefeld.kml', kmlParsed);
});

function getTestTemplate(title, id) {
    var template = $('<div/>', {
        'class': 'test'
    }).attr('id', id);
    template.append('<h3>' + title + '</h3>');
    template.append('<div class="map"/>');
    return template;
}