app.service('eventsDispatcherService', function ($rootScope) {
    var calls = [];
    this.addFunctionCall = function (key, handler) {
        if (!calls[key]) {
            calls[key] = [];
        }
        calls[key].push(handler);
    };

    this.invokeFunctionCall = function (key) {
        if (calls[key]) {
            var count = calls[key].length;
            var newArgs = [].shift.apply(arguments);
            for (var i = 0; i < count; i++) {
                calls[newArgs][i].apply(this,  arguments);
            }
        }
            
    };

    this.safeApply = function (scope) {
        var phase = scope.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            
        } else {
            scope.$apply();
        }
    };
        
});