app.service('mappingService', function ($rootScope) {

    var _self = this;
    require([
        "esri/request"
    ],
        function (esriRequest) {

            _self.getInfo = function (url, id) {
                var deffered = $.Deferred();


                esriRequest(url, {
                    responseType: "json",
                    "content": {
                        "f": "json"
                    }
                }).then(function (response) {

                    var geoJson = response.data;
                    deffered.resolve(geoJson, id);
                }, function (e) {

                    deffered.reject(e);

                });

                return deffered;
            };







        });

});