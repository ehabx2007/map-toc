app.controller('mapController', function ($scope, $rootScope, eventsDispatcherService, $q) {
    $rootScope.enumsLoaded = $q.defer();
    require([
        "esri/Map",
        "esri/views/MapView",
        'js/core-enum',
        "esri/layers/MapImageLayer",
        "dojo/domReady!"
    ],
        function (Map, MapView, CoreEnum, MapImageLayer) {
            $rootScope.appEnums = CoreEnum;
            $rootScope.enumsLoaded.resolve();
            var map = new Map({
                basemap: "streets",
                id:"basemap_streets"
            });

            var layer = new MapImageLayer({
                url: "http://10.5.1.119:6080/arcgis/rest/services/sagrn/MapServer",
                id:"sagrn"
            });
            map.add(layer);

            var view = new MapView({
                container: "viewDiv",  // Reference to the scene div created in step 5
                map: map,  // Reference to the map object created before the scene
                zoom: 11,  // Sets zoom level based on level of detail (LOD)
                center: [138.6825233, -34.929131]  // Sets center point of view using longitude,latitude
            });

            $rootScope.rootESRIMapView = view;
            window.mapview = view;
            view.then(function (load_event) {
                
                eventsDispatcherService.invokeFunctionCall($rootScope.appEnums.FunctionsInvoke.MAP_VIEW_LOADED);

            })
            .otherwise(function (error) {
                console.debug(load_event);
            });

            

        });


    
});