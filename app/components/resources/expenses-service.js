'use strict';

angular.module('resources.expenses', [])

.factory('expenses', function() {
  var expenses = [
    {"price":23000,"priceIncludesVat":true,"vatRate":0.25,"vat":4600,"owners":["Lucas Wiener"],"description":"MBP 2014 :(","payer":"Lucas Wiener"},
    {"price":100,"priceIncludesVat":true,"vatRate":0.25,"vat":20,"owners":["Lucas Wiener","Nadan Gergeo"],"description":"Notebook","payer":"Lucas Wiener"} ,
    {"price":83,"priceIncludesVat":true,"vatRate":0.25,"vat":16.599999999999994,"owners":["Lucas Wiener","Nadan Gergeo"],"description":"Pie","payer":"Backslashforward HB"}
  ];



  return {
    add: function(expense) {
      expenses.push(expense);
      console.log(JSON.stringify(expense));
      return 1;
    },
    get: function() {
      return expenses;
    }
  };
});