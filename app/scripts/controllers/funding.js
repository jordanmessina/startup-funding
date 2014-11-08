'use strict';

/**
 * @ngdoc function
 * @name fundingApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the fundingApp
 */

angular.module('fundingApp')
  .controller('TutorialCtrl', ['$scope', '$rootScope', '$log', 'startupService', function ($scope, $rootScope, $log, startupService) {
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
      highlightClass: 'funding-tutorial-highlight',
      tooltipClass: 'funding-tutorial-tooltip'
    });

    $scope.setupFoundersTutorial = function() {
      //redundant, but if we hit "Back" in the tutorial we need to reset the state
      startupService.startup.removeFounders();
      startupService.startup.removeConvertibleNotes();
      startupService.startup.removeEquityRounds();
      while(startupService.investors.length != 0) {
        startupService.investors.splice(0,1);
      }   
      startupService.updateCapTable(); //this is garbage
      startupService.startup.addFounder(new Founder('Grace', 31));
      startupService.startup.addFounder(new Founder('Merideth', 31));
      startupService.startup.addFounder(new Founder('Danielle', 31));
      startupService.startup.addFounder(new Founder('YC', 7));
      startupService.updateCapTable();
      $rootScope.$broadcast('TutorialUpdate');
    }

    $scope.setupInvestorsTutorial = function() {
      //clean up startup
      startupService.startup.removeConvertibleNotes();
      startupService.startup.removeEquityRounds();
      while(startupService.investors.length != 0) {
        startupService.investors.splice(0,1);
      }
      startupService.investors.push(new Investor('J Cal'));
      startupService.investors.push(new Investor('Naval'));
      startupService.investors.push(new Investor('Marissa'));
      startupService.investors.push(new Investor('K Rose'));
      startupService.investors.push(new Investor('YC VC'));
      startupService.investors.push(new Investor('a16z'));
      startupService.updateCapTable(); //this is garbage
      $rootScope.$broadcast('TutorialUpdate');
    }

    $scope.setupConvertibleNotesTutorial = function() {
      //clean up startup
      startupService.startup.removeConvertibleNotes();
      startupService.startup.removeEquityRounds();
      var cn = new ConvertibleNote(5000000, 20);
      cn.addInvestor(startupService.investors[0], 50000);
      cn.addInvestor(startupService.investors[1], 75000);
      cn.addInvestor(startupService.investors[2], 100000);
      cn.addInvestor(startupService.investors[3], 200000);
      startupService.startup.addConvertibleNote(cn);
      cn = new ConvertibleNote(10000000, 10);
      cn.addInvestor(startupService.investors[4], 100000);
      startupService.startup.addConvertibleNote(cn);
      startupService.updateCapTable();
      $rootScope.$broadcast('TutorialUpdate');
    }

    $scope.setupEquityTutorial = function() {
      startupService.startup.removeEquityRounds();
      var equityRound = new EquityRound(4000000);
      equityRound.addInvestor(startupService.investors[5], 1000000);
      startupService.startup.addEquityRound(equityRound);
      startupService.updateCapTable();
      $rootScope.$broadcast('TutorialUpdate');
    }

    $scope.setupFinalEquityTutorial = function() {
    }

    $scope.startTutorial = function() {
      $('#gotIt').click();
      //clean up startup
      startupService.startup.removeFounders();
      startupService.startup.removeConvertibleNotes();
      startupService.startup.removeEquityRounds();
      while(startupService.investors.length != 0) {
        startupService.investors.splice(0,1);
      }
      startupService.updateCapTable(); //this is garbage

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
  .controller('FoundersCtrl', ['$scope', '$rootScope', '$log', 'startupService', function ($scope, $rootScope, $log, startupService) {
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

    $rootScope.$on('TutorialUpdate', function() {
      $scope.$apply();
    });
  }])
  .directive('startupFounders', function (){
    return {
      templateUrl: 'templates/founders.html'
    }    
  });


angular.module('fundingApp')
  .controller('InvestorsCtrl', ['$scope', '$rootScope', '$log', 'startupService', function ($scope, $rootScope, $log, startupService) {
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

    $rootScope.$on('TutorialUpdate', function() {
      $scope.$apply();
    });

  }])
  .directive('startupInvestors', function (){
    return {
      templateUrl: 'templates/investors.html'
    }
  });



angular.module('fundingApp')
  .controller('ConvertibleNotesCtrl', ['$scope', '$rootScope', '$log', 'startupService', function ($scope, $rootScope, $log, startupService) {
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

    $rootScope.$on('TutorialUpdate', function() {
      $scope.$apply();
    });

  }])
  .directive('convertibleNotes', function (){
    return {
      templateUrl: 'templates/convertiblenotes.html'
    }    
  });

angular.module('fundingApp')
  .controller('EquityRoundsCtrl', ['$scope', '$rootScope', '$log', 'startupService', function ($scope, $rootScope, $log, startupService) {
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

    $rootScope.$on('TutorialUpdate', function() {
      $scope.$apply();
    });

  }]) 
  .directive('equityRounds', function (){ 
    return {
      templateUrl: 'templates/equityrounds.html'
    }    
  });

angular.module('fundingApp')
 .controller('FinalEquityCtrl', ['$scope', '$rootScope', '$log', 'startupService', function ($scope, $rootScope, $log, startupService) {
    $scope.founders = startupService.startup.founders;
    $scope.startupService = startupService; //strange binding issue with angular where it wouldn't do 2 way data binding on startupService.capTable. This is my workaround.

    $rootScope.$on('TutorialUpdate', function() {
      $scope.$apply();
    });

 }])
 .directive('finalEquity', function () {
  return {
    templateUrl: 'templates/finalequity.html'
  }
 });
