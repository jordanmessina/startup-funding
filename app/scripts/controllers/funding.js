'use strict';

/**
 * @ngdoc function
 * @name fundingApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the fundingApp
 */

angular.module('fundingApp')
  .controller('TutorialCtrl', ['$scope', '$log', 'startupService', function ($scope, $log, startupService) {
    $scope.startupService = startupService
    $scope.tutorial = introJs();
    $scope.tutorial.setOptions({
      steps: [
        {
          intro: "This is an interactive tutorial"
        },
        {
          intro: "This is about the founders",
          element: "#foundersTutorial",
          position: 'right'
        },
        {
          intro: "This is about the founders",
          element: "#investorsTutorial",
          position: 'right'
        },
        {
          intro: "This is about the founders",
          element: "#convertibleNotesTutorial",
          position: 'left'
        },
        {
          intro: "This is about the founders",
          element: "#equityTutorial",
          position: 'left'
        },
        {
          intro: "This is about the founders",
          element: "#finalEquityTutorial",
          nextLabel: false
        }
      ],
      showStepNumbers: false,
      tooltipClass: 'fundingTutorial'
    });

    $scope.setupFoundersTutorial = function() {
      //clean up startup
      while($scope.startupService.startup.founders.length != 0) {
        $scope.startupService.startup.removeFounder($scope.startupService.startup.founders[0]);
      }   
      while($scope.startupService.startup.convertibleNotes.length != 0) {
        $scope.startupService.startup.removeConvertibleNote($scope.startupService.startup.convertibleNotes[0]);
      }   
      while($scope.startupService.startup.equityRounds.length != 0) {
        $scope.startupService.startup.removeEquityRound($scope.startupService.startup.equityRounds[0]);
      }
      while($scope.startupService.investors.length != 0) {
        $scope.startupService.investors.splice(0,1);
      }
      startupService.updateCapTable(); //this is garbage
    }

    $scope.setupInvestorsTutorial = function() {
      console.log('investors setup');
    }

    $scope.setupConvertibleNotesTutorial = function() {
      console.log('cns setup');
    }

    $scope.setupEquityTutorial = function() {
      console.log('equityRound setup');
    }

    $scope.setupFinalEquityTutorial = function() {
      console.log('final equity setup');
    }

    $scope.startTutorial = function() {
      //clean up startup
      while($scope.startupService.startup.founders.length != 0) {
        $scope.startupService.startup.removeFounder($scope.startupService.startup.founders[0]);
      }
      while($scope.startupService.startup.convertibleNotes.length != 0) {
        $scope.startupService.startup.removeConvertibleNote($scope.startupService.startup.convertibleNotes[0]);
      }
      while($scope.startupService.startup.equityRounds.length != 0) {
        $scope.startupService.startup.removeEquityRound($scope.startupService.startup.equityRounds[0]);
      }
      while($scope.startupService.investors.length != 0) {
        $scope.startupService.investors.splice(0,1);
      }


      $scope.tutorial.start().onbeforechange(function(targetElem){
        switch($(targetElem).attr('id')){
          case "foundersTutorial": $scope.setupFoundersTutorial(); break;
          case "investorsTutorial": $scope.setupInvestorsTutorial(); break;
          case "convertibleNotesTutorial": $scope.setupConvertibleNotesTutorial(); break;
          case "equityTutorial": $scope.setupEquityTutorial(); break;
          case "finalEquityTutorial": $scope.setupFinalEquityTutorial(); break;
        }
      });
    }
  }])

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
      startupService.updateCapTable(); //this is garbage
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
      startupService.updateCapTable(); //this is garbage
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
      startupService.updateCapTable(); //this is garbage
    };

    //investors using the note
    $scope.addInvestorToConvertibleNote = function (index){
      startupService.startup.convertibleNotes[index].addInvestor(
        $scope.investors[$scope.investorToAddToConvertibleNote.investor],
        $scope.investorToAddToConvertibleNote.amount
      );
      $scope.investorToAddToConvertibleNote = {};
      startupService.updateCapTable(); //this is garbage
    };

    $scope.removeInvestorFromConvertibleNote = function(cnIndex, investmentIndex){
      var cn = $scope.convertibleNotes[cnIndex]
      cn.deleteInvestment(cn.investments[investmentIndex]);
      startupService.updateCapTable(); //this is garbage
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
      startupService.updateCapTable(); //this is garbage
    };

    //investors using the note
    $scope.addInvestorToEquityRound = function (index){
      startupService.startup.equityRounds[index].addInvestor(
        $scope.investors[$scope.investorToAddToEquityRound.investor],
        $scope.investorToAddToEquityRound.amount
      );
      $scope.investorToAddToEquityRound = {};
      startupService.updateCapTable(); //this is garbage
    };

    $scope.removeInvestorFromEquityRound = function(equityRoundIndex, investmentIndex){
      var equityRound = $scope.equityRounds[equityRoundIndex]
      equityRound.deleteInvestment(equityRound.investments[investmentIndex]);
      startupService.updateCapTable(); //this is garbage
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
    $scope.startupService = startupService; //strange binding issue with angular where it wouldn't do 2 way data binding on startupService.capTable. This is my workaround.
 }])
 .directive('finalEquity', function () {
  return {
    templateUrl: 'templates/finalequity.html'
  }
 });
