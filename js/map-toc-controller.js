app.controller('mapTOCController', function ($scope, $rootScope, eventsDispatcherService, mappingService) {
    $scope.src = 'partials/map-layers.html';


    $scope.tree = [];
    $scope.scaleDependentLayer = {};
    $scope.layers = [];
    $rootScope.enumsLoaded.promise.then(function (data) {
        eventsDispatcherService.addFunctionCall($rootScope.appEnums.FunctionsInvoke.MAP_VIEW_LOADED, $scope.mapViewLoaded);
    });


    $scope.mapViewLoaded = function () {
        $rootScope.rootESRIMapView.on("layerview-create", function (event) {
            console.log(event.layerView);

            var data = {};
            data.layer = event.layer;
            data.name = event.layer.title;
            data.hasCheckbox = true;
            data.visible = event.layer.visible;
            data.layerIsVisible = isVisibleAtCurrentScale(event.layer, data);
            $scope.layers[event.layer.id] = data;
            $scope.tree.push(data);
            if (!event.layer.tileInfo)
                buildSubLayers(data);
            eventsDispatcherService.safeApply($scope);
        });


        $rootScope.rootESRIMapView.watch("viewpoint.scale", function (event) {
            angular.forEach($scope.scaleDependentLayer, function (node_data, key) {

                node_data.layerIsVisible = isVisibleAtCurrentScale(node_data.layerInfos ? node_data.layerInfos : node_data.layer);
                if (node_data.nodes) {
                    updateChildNodesVisibility(node_data.nodes, node_data.visible);
                }

            });

            eventsDispatcherService.safeApply($scope);
        });
    };

    function updateChildNodesVisibility(nodes, parentLayerIsVisible) {
        var count = nodes.length;

        for (var i = 0; i < count; i++) {
            if (nodes[i].hasOwnProperty('layerIsVisible')) {
                nodes[i].layerIsVisible = parentLayerIsVisible && isVisibleAtCurrentScale(nodes[i].layerInfos);
            }

            if (nodes[i].hasOwnProperty('nodes')) {
                updateChildNodesVisibility(nodes[i].nodes, nodes[i].layerIsVisible && nodes[i].visible);
            }
        }
    };

    function buildSubLayers(layerData) {
        mappingService.getInfo(layerData.layer.url + '/legend?f=json', layerData.layer.id).then(
            function (result, layerID) {

                var subLayers = getSubLayers(result.layers, layerData.layer.sublayers, layerData.layer, true, -1, layerData.visible);
                layerData.nodes = subLayers;
                eventsDispatcherService.safeApply($scope);
            },
            function (e) {
                console.warn('mapping service.getLayerInfo: ' + e);
            });
    };

    function getSubLayers(layers, layerInfos, layer, hasCheckbox, parentLayerID, parentLayerVisible) {
        var nodes = [];
        var node;
        var count = layerInfos.length;
        var asset;
        var layerLegend;
        var parentNode;
        for (var i = 0; i < count; i++) {
            node = {};
            node.hasCheckbox = hasCheckbox;
            layerLegend = getLayerLegend(layerInfos.items[i].id, layers);
            if (!layerLegend) {
                layerLegend = {};
            }
            node.name = layerInfos.items[i].title;
            node.visible = layerInfos.items[i].visible;
            node.layerIsVisible = isVisibleAtCurrentScale(layerInfos.items[i], node) && parentLayerVisible;
            node.mapLayer = layer;
            node.layerIndex = layerInfos.items[i].id;
            node.layerInfos = layerInfos.items[i];


            if (layerLegend.legend) {
                if (layerLegend.legend.length > 1) {
                    node.nodes = getLegend(layerLegend.legend);
                }
                else {
                    node.legendImgSrc = "data:" + layerLegend.legend[0].contentType + ";base64," + layerLegend.legend[0].imageData;
                }
            }


            nodes.push(node);
            if (layerInfos.items[i].sublayers) {
                node.nodes = getSubLayers(layers, layerInfos.items[i].sublayers, node.mapLayer, hasCheckbox, node.layerIndex, node.visible);
            }
        }


        return nodes;
    };

    function getLegend(legendLayers) {
        var nodes = [];
        var node;
        angular.forEach(legendLayers, function (legendLayer) {
            node = {};
            node.name = legendLayer.label;
            node.legendImgSrc = "data:image/" + legendLayer.contentType + ";base64," + legendLayer.imageData;

            nodes.push(node);
        });

        return nodes;
    };


    function getLayerLegend(layerId, layers) {
        var legendLayer;
        angular.forEach(layers, function (value) {
            if (value.layerId == layerId) {
                legendLayer = value;
                return;
            }

        });

        return legendLayer;
    };



    function isVisibleAtCurrentScale(layerInfo, node_data) {
        if (layerInfo.minScale == layerInfo.maxScale && layerInfo.maxScale == 0)
            return true;
        var currentScale = $rootScope.rootESRIMapView.scale;
        if (node_data && !$scope.scaleDependentLayer[layerInfo.title])
            $scope.scaleDependentLayer[layerInfo.title] = node_data;
        return ((currentScale <= layerInfo.minScale) && (currentScale >= layerInfo.maxScale)) ? true : false;
    };




    $scope.checkboxChangeHandler = function (data) {
        if (data.layer) {
            data.layer.visible = data.visible;


        }
        else if (data.mapLayer) {
            data.layerInfos.visible = data.visible;
        }

        if (data.nodes) {
            updateChildNodesVisibility(data.nodes, data.visible);
        }
    };

});