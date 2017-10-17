define("js/core-enum", [], function () {
    return {
        FunctionsInvoke: {
            MAP_VIEW_LOADED:'MAP_VIEW_LOADED'
        },
        LayersTypes: {
            Tiled: 'tiled',
            Dynamic: 'dynamic',
            FeatureLayer: 'feature'
        },
        Controllers: {
            SelectFeatures: 'selectFeaturesToolsController',
            MapTOC: 'mapTOCController',
            MeasureTools:'measureController',
            SelectedObjectsList:'selectedObjectsController',
            CreateAsset: 'createAssetController',
            SearchWorkOrders:'searchWorkOrdersController'
        },
        GeometryType: {
            Point: 'point',
            Line: 'polyline',
            Polygon: 'polygon'
        }
    };
});