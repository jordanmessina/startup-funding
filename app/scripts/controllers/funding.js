'use strict';

/**
 * @ngdoc function
 * @name fundingApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the fundingApp
 */
angular.module('fundingApp')
  .controller('FoundersCtrl', ['$scope', '$log', 'startupService', function ($scope, $log, startupService) {
    $scope.founders = startupService.founders;
    $scope.addFounder = function () {
      startupService.addFounder($scope.newFounder);
      $scope.newFounder = {};
    };
    $scope.removeFounder = function (index){
      startupService.removeFounder(index);
    };
    $scope.totalFounderEquity = startupService.totalFounderEquity;
  }])
  .directive('startupFounders', function (){
    return {
      templateUrl: 'templates/founders.html'
    }    
  });


angular.module('fundingApp')
  .controller('InvestorsCtrl', ['$scope', '$log', 'startupService', function ($scope, $log, startupService) {
    $scope.investors = startupService.investors;
    $scope.addInvestor = function () {
      startupService.addInvestor($scope.newInvestor);
      $scope.newInvestor = {};
    };
    $scope.removeInvestor = function (index){
      startupService.removeInvestor(index);
    };
    $scope.noDuplicateInvestors = function() {
      var investorsLength = $scope.investors.length;
      for (var investorIndex = 0; investorIndex < investorsLength; investorIndex++) {
        if ($scope.investors[investorIndex].name == $scope.newInvestor.name) {
          return false;
        }
      }
      return true;
    }
  }])
  .directive('startupInvestors', function (){
    return {
      templateUrl: 'templates/investors.html'
    }    
  });



angular.module('fundingApp')
  .controller('ConvertibleNotesCtrl', ['$scope', '$log', 'startupService', function ($scope, $log, startupService) {
    $scope.founders = startupService.founders;
    $scope.investors = startupService.investors;
    $scope.convertibleNotes = startupService.convertibleNotes;
    $scope.getInvestorNameByIndex = startupService.getInvestorNameByIndex;
    $scope.addConvertibleNote = function () {
      startupService.addConvertibleNote($scope.newConvertibleNote);
      $scope.newConvertibleNote = {};
    };
    $scope.removeConvertibleNote = function (index){
      startupService.removeConvertibleNote(index);
    };

    //investors using the note
    $scope.showInvestorList = null;
    $scope.toggleShowInvestorList = function (index) {
      $scope.showInvestorList = index;
    };
    $scope.addInvestorToConvertibleNote = function (index){
      startupService.addInvestorToConvertibleNote(index, $scope.investorToAddToConvertibleNote);
      $scope.investorToAddToConvertibleNote = {};
      $scope.toggleShowInvestorList(null);
    };
    $scope.removeInvestorFromConvertibleNote = function(cnIndex, investorIndex){
      startupService.removeInvestorFromConvertibleNote(cnIndex, investorIndex);
    };
    $scope.totalSeedInvestmentRaised = startupService.totalSeedInvestmentRaised;
  }])
  .directive('convertibleNotes', function (){
    return {
      templateUrl: 'templates/convertiblenotes.html'
    }    
  });

angular.module('fundingApp')
  .controller('EquityRoundsCtrl', ['$scope', '$log', 'startupService', function ($scope, $log, startupService) {
    $scope.founders = startupService.founders;
    $scope.investors = startupService.investors;
    $scope.equityRounds = startupService.equityRounds;
    $scope.addEquityRound = function () {
      startupService.addEquityRound($scope.newEquityRound);
      $scope.newEquityRound = {}; 
    };  
    $scope.removeEquityRound = function (index){
      startupService.removeEquityRound(index);
    };  

    //investors using the note
    $scope.showInvestorList = null;
    $scope.toggleShowInvestorList = function (index) {
      $scope.showInvestorList = index;
    };  
    $scope.addInvestorToEquityRound = function (index){
      startupService.addInvestorToEquityRound(index, $scope.investorToAddToEquityRound);
      $scope.investorToAddToEquityRound = {}; 
      $scope.toggleShowInvestorList(null);
    };  
    $scope.removeInvestorFromEquityRound = function(cnIndex, investorIndex){
      startupService.removeInvestorFromEquityRound(cnIndex, investorIndex);
    };  
    $scope.totalRaised = startupService.totalRaised;
  }]) 
  .directive('equityRounds', function (){ 
    return {
      templateUrl: 'templates/equityrounds.html'
    }    
  });

angular.module('fundingApp')
 .controller('FinalEquityCtrl', ['$scope', '$log', 'startupService', function ($scope, $log, startupService) {
     $scope.equityHolders = [];
     $scope.equityRounds = startupService.equityRounds;

     $scope.$watch(function(){
      return startupService
     }, function(){
      $scope.equityHolders = startupService.calculateEquity()
     }, true);
 }])
 .directive('finalEquity', function () {
  return {
    templateUrl: 'templates/finalequity.html'
  }
 });
