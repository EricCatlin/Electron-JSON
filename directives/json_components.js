angular.module('Home').directive('string', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'directives/string.html',
        scope: { value: '=', key: '=', options: '=' },

    }
});

angular.module('Home').directive('bool', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'directives/bool.html',
        scope: { value: '=', key: '=', options: '=' },

    }
});

angular.module('Home').directive('number', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'directives/number.html',
        scope: { value: '=', key: '=', options: '=' },

    }
});

angular.module('Home').directive('array', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'directives/array.html',
        scope: { value: '=', key: '=', options: '=' },

    }
});



angular.module('Home').directive('object', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'directives/object.html',
        scope: { value: '=', key: '=', options: '=' },

    }
});
angular.module('Home').directive('adminControls', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'directives/admin_controls.html',
        scope: true,
    }
});

angular.module('Home').directive('left', function () {
    return {
        restrict: 'A',
        scope: true,
        link: function ($scope) {
            $scope.left = true;
        }
    }
});
angular.module('Home').directive('hoverable', function () {
    return {
        restrict: 'A',
        scope: true,
        link: function ($scope, $element) {
            $scope.hovered = false;
            $element.bind('mouseover', function (e) {
                $scope.hovered = true;
                if (!$scope.$$phase) $scope.$apply();
            });
            $element.bind('mouseout', function (e) {
                $scope.hovered = false;
                if (!$scope.$$phase) $scope.$apply();
            });

        }
    }
});

angular.module('Home').directive("admin", function (AdminService) {
    return {
        restrict: "A",
        scope: false,
        link: function (scope) {
            scope.AdminService = AdminService;
        }
    }
});

angular.module('Home').directive('optionsLogic', function () {
    return {
        restrict: 'A',
        scope: false,
        link: function (scope, $element) {
            if (scope.$parent.AddChild) {
                scope.$parent.AddChild(scope);
            }
            scope.children = [];
            scope.AddChild = function (child) {
                scope.children.push(child);
            }
            scope.toggle_locked = function () {
                scope.options.locked = !scope.options.locked;
                for (var child in scope.children) {
                    child = scope.children[child];
                    (scope.options.locked) ? child.set_locked_by_parent() : child.set_unlocked_by_parent();
                }
            }
            scope.set_locked = function () {
                scope.options.locked = true;
                for (var child in scope.children) {
                    child = scope.children[child];
                    child.set_locked_by_parent();
                }
            }
            scope.set_unlocked = function () {
                scope.options.locked = false;
                for (var child in scope.children) {
                    child = scope.children[child];
                    child.set_unlocked_by_parent();
                }
            }
            scope.set_locked_by_parent = function () {
                scope.options.locked_by_parent = true;
                // if (scope.options.locked_by_parent != scope.options.locked) return;
                for (var child in scope.children) {
                    child = scope.children[child];
                    child.set_locked_by_parent();
                }
            }
            scope.set_unlocked_by_parent = function () {
                scope.options.locked_by_parent = false;
                if (scope.options.locked) return;
                for (var child in scope.children) {
                    child = scope.children[child];
                    child.set_unlocked_by_parent();
                }
            }
            scope.toast = function (message) {
                Materialize.toast(message, 3000, 'rounded');
            }
        }
    }
});