"use strict";

angular.module("fairyApp", [
    "ui.router",
    "ngAnimate",
    "menu",
    "sidenav",
    "dashboard",
    "ledger",
    "login",
    "logout",
    "signup",
    "misc.session",
    "misc.login",
    "transitions",
    "autologin"
])

.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    var routeBaseUrl = "routes/";

    function url(path) {
        return routeBaseUrl + path;
    }

    $urlRouterProvider.otherwise("/");
    $urlRouterProvider.when("/signup", "/signup-user");

    $stateProvider
    .state("dashboard", {
        url: "/",
        templateUrl: url("dashboard/dashboard.html"),
        controller: "DashboardController",
        requireAuthenticatedSession: true,
        requireDataLoaded: true
    })
    .state("ledger", {
        url: "/ledger",
        templateUrl: url("ledger/ledger.html"),
        controller: "LedgerController",
        requireAuthenticatedSession: true,
        requireDataLoaded: true
    })
    .state("login", {
        url: "/login?goTo",
        templateUrl: url("login/login.html"),
        controller: "LoginController",
        requireNoAuthenticatedSession: true,
        disableSidenav: true
    })
    .state("logout", {
        url: "/logout",
        controller: "LogoutController",
        disableSidenav: "inherit"
    })
    .state("signup", {
        url: "/signup",
        redirectTo: "/signup-user"
    })
    .state("signup-user", {
        url: "/signup-user",
        templateUrl: url("signup/user/signup-user.html"),
        controller: "SignupUserController",
        requireNoAuthenticatedSession: true,
        disableSidenav: true
    })
    .state("signup-company", {
        url: "/signup-company",
        templateUrl: url("signup/company/signup-company.html"),
        controller: "SignupCompanyController",
        requireAuthenticatedSession: true,
        disableSidenav: true
    })
    .state("autologin", {
        url: "/autologin?goTo",
        templateUrl: url("autologin/autologin.html"),
        controller: "AutologinController",
        disableSidenav: true,
        requireAuthenticatedSession: true
    })
    ;
}])

.run(["$rootScope", "$state", "session", "loginService", "STATE_TRANSITIONS", function($rootScope, $state, session, loginService, STATE_TRANSITIONS) {
    $rootScope.$on("$stateNotFound", function() {
        console.log("not found");
    });

    /* jshint unused: false */
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
        function logRedirect(to) {
            console.log("state redirect: " + fromState.name + " -> " + toState.name + " -> " + to);
        }

        var redirectTo;
        var authenticated = session.isAuthenticated();

        if(toState.requireAuthenticatedSession) {
            if(!authenticated) {
                event.preventDefault();

                redirectTo = "login";
                if(toState.url !== "/") {
                    logRedirect(redirectTo);
                    $state.go(redirectTo, {
                        goTo: toState.name
                    });
                    return;
                }

                logRedirect(redirectTo);
                $state.go(redirectTo);
                return;
            }

            if(toState.requireDataLoaded && !loginService.isDataLoaded()) {
                event.preventDefault();

                redirectTo = "autologin";
                if(toState.url !== "/") {
                    logRedirect(redirectTo);
                    $state.go(redirectTo, {
                        goTo: toState.name
                    });
                    return;
                }

                logRedirect(redirectTo);
                $state.go(redirectTo);
                return;
            }
        }

        if(toState.requireNoAuthenticatedSession) {
            if(authenticated) {
                event.preventDefault();
                redirectTo = "dashboard";
                logRedirect(redirectTo);
                $state.go(redirectTo);
                return;
            }
        }

        if(toState.disableSidenav !== "inherit") {
            $rootScope.sidenav = toState.disableSidenav ? false : true;
        }

        if(STATE_TRANSITIONS[fromState.name]) {
            $rootScope.transition = STATE_TRANSITIONS[fromState.name][toState.name] || "";
        } else {
            $rootScope.transition = "";
        }

        $rootScope.state = toState.name;

        console.log("state transition: " + fromState.name + " -> " + toState.name);
    });
}])

//Workaround for bug #1404.
//This will allow ngModel and ngForm directives to have dynamic name attributes (expression evaluation in name).
//https://github.com/angular/angular.js/issues/1404
//Source: http://plnkr.co/edit/hSMzWC?p=preview
.config(["$provide", function($provide) {
    $provide.decorator("ngModelDirective", ["$delegate", function($delegate) {
        var ngModel = $delegate[0];
        var controller = ngModel.controller;
        ngModel.controller = ["$scope", "$element", "$attrs", "$injector", function(scope, element, attrs, $injector) {
            var $interpolate = $injector.get("$interpolate");
            attrs.$set("name", $interpolate(attrs.name || "")(scope));
            $injector.invoke(controller, this, {
                "$scope": scope,
                "$element": element,
                "$attrs": attrs
            });
        }];
        return $delegate;
    }]);
    $provide.decorator("formDirective", ["$delegate", function($delegate) {
        var form = $delegate[0];
        var controller = form.controller;
        form.controller = ["$scope", "$element", "$attrs", "$injector", function(scope, element, attrs, $injector) {
            var $interpolate = $injector.get("$interpolate");
            attrs.$set("name", $interpolate(attrs.name || attrs.ngForm || "")(scope));
            $injector.invoke(controller, this, {
                "$scope": scope,
                "$element": element,
                "$attrs": attrs
            });
        }];
        return $delegate;
    }]);
}])

;
