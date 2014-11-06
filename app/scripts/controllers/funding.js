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
    $scope.founders = startupService.startup.founders;
    $scope.addFounder = function () {
      startupService.startup.addFounder($scope.newFounder);
      $scope.newFounder = {};
      startupService.updateCapTable();
    };
    $scope.removeFounder = function (index){
      startupService.startup.removeFounder($scope.founders[index]);
      startupService.updateCapTable();
    };
    $scope.totalFounderEquity = startupService.startup.totalFounderEquity;
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
      startupService.investors.push(new Investor($scope.newInvestor.name));
      $scope.newInvestor = {};
    };
    $scope.removeInvestor = function (index){
      startupService.startup.removeInvestor($scope.investors[index]);
      startupService.investors.splice(index, 1);
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
    $scope.founders = startupService.startup.founders;
    $scope.investors = startupService.investors;
    $scope.convertibleNotes = startupService.startup.convertibleNotes;
    
    $scope.addConvertibleNote = function () {
      startupService.startup.addConvertibleNote(
        new ConvertibleNote($scope.newConvertibleNote.cap, $scope.newConvertibleNote.discount)
      );
      $scope.newConvertibleNote = {};
    };

    $scope.removeConvertibleNote = function (index){
      startupService.startup.removeConvertibleNote($scope.convertibleNotes[index]);
      startupService.updateCapTable();
    };

    //investors using the note
    $scope.addInvestorToConvertibleNote = function (index){
      startupService.startup.convertibleNotes[index].addInvestor(
        $scope.investors[$scope.investorToAddToConvertibleNote.investor],
        $scope.investorToAddToConvertibleNote.amount
      );
      $scope.investorToAddToConvertibleNote = {};
      startupService.updateCapTable();
    };

    $scope.removeInvestorFromConvertibleNote = function(cnIndex, investmentIndex){
      var cn = $scope.convertibleNotes[cnIndex]
      cn.deleteInvestment(cn.investments[investmentIndex]);
      startupService.updateCapTable();
    };

  }])
  .directive('convertibleNotes', function (){
    return {
      templateUrl: 'templates/convertiblenotes.html'
    }    
  });

angular.module('fundingApp')
  .controller('EquityRoundsCtrl', ['$scope', '$log', 'startupService', function ($scope, $log, startupService) {
    $scope.founders = startupService.startup.founders;
    $scope.investors = startupService.investors;
    $scope.equityRounds = startupService.startup.equityRounds;
    
    $scope.addEquityRound = function () {
      startupService.startup.addEquityRound(new EquityRound($scope.newEquityRound.preMoneyValuation));
      $scope.newEquityRound = {};
    };

    $scope.removeEquityRound = function (index){
      startupService.startup.removeEquityRound($scope.equityRounds[index]);
      startupService.updateCapTable();
    };

    //investors using the note
    $scope.addInvestorToEquityRound = function (index){
      startupService.startup.equityRounds[index].addInvestor(
        $scope.investors[$scope.investorToAddToEquityRound.investor],
        $scope.investorToAddToEquityRound.amount
      );
      $scope.investorToAddToEquityRound = {};
      startupService.updateCapTable();
    };

    $scope.removeInvestorFromEquityRound = function(equityRoundIndex, investmentIndex){
      var equityRound = $scope.equityRounds[equityRoundIndex]
      equityRound.deleteInvestment(equityRound.investments[investmentIndex]);
      startupService.updateCapTable();
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
    $scope.founders = startupService.startup.founders;
    $scope.startupService = startupService;
 }])
 .directive('finalEquity', function () {
  return {
    templateUrl: 'templates/finalequity.html'
  }
 });
