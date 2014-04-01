'use strict';

describe('Directive: newExpense', function () {
  var element, scope;

  // load the directive's module
  beforeEach(module('fairyApp'));

  beforeEach(module('views/new-expense.html'));

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();

    scope.partners = [{
      fullname: 'Lucas Wiener'
    },
    {
      fullname: 'Nadan Gergeo'
    }];

    element = angular.element('<new-expense></new-expense>');
    $compile(element)(scope);
    scope.$digest();
  }));

  it('should make hidden element visible', inject(function ($compile) {

  }));
});