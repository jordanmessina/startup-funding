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
    $scope.startupService = startupService;
    $scope.tutorial = new Tour({
      steps: [
        {
          content: 'This interactive tutorial walks through a hypothetical company. When first starting a company, you need to decide how to split up equity amongst your co-foudners. There\'s a lot of <a href="https://www.google.com/webhp?q=how+to+split+equity">opinions</a> on how to do this, but I think it\'s best if all founders have the same amount of stock. The work put in by everyone in the years to come will trump any work that has already been done by the company. The important thing about founder stock is that there\'s <a href="">vesting</a> in place to protect everyone. Equity % is a calculation of the total number of shares a founder has divided by the total outstanding shares in the company. Let\'s assume there are 1,000,000 outstanding shares. Grace, Merideth, Danielle, and Elon would each have 250,000 shares a piece (250,000/1,000,000 = 25%).',
          element: '#foundersTutorial',
          onNext: function() {
            $scope.setupInvestorsTutorial();
            $rootScope.$broadcast('TutorialUpdate');
          }
        },
        {
            content: 'This is a list of all your investors. There are different <a href="https://www.rocketlawyer.com/article/types-of-investors-for-startups.rl">types</a> of investors. We\'ll be adding angels (high net worth individuals that invest their own personal funds) and VCs (funds that invest other people\'s money on their behalf).',
          element: '#investorsTutorial',
          onNext: function() {
            $scope.setupConvertibleNotesTutorial();
            $rootScope.$broadcast('TutorialUpdate');
          },
          onPrev: function() {
            $scope.setupFoundersTutorial();
            $rootScope.$broadcast('TutorialUpdate');
          }
        },
        {
            content: 'A Convertible Note is an investment intrument that can be thought of as an <a href="http://en.wikipedia.org/wiki/IOU">IOU</a> for equity in your company. The convertible notes that your company raises money on will not convert into equity until later in the future when you raise money again at a priced round (more on this in the next section). Convertible Notes have two main properties, a Valuation Cap and a Discount Rate. A valuation cap puts a threshold on the conversion price of the debt. A discount rate is the percentage off the per share price.',
          element: '#convertibleNotesTutorial',
          onNext: function() {
            $scope.setupEquityTutorial();
            $rootScope.$broadcast('TutorialUpdate');
          },
          onPrev: function() {
            $scope.setupInvestorsTutorial();
            $rootScope.$broadcast('TutorialUpdate');
          }
        },
        {
            content: 'This is where the magic happens. At an equity round (often times called a Series A for the first one, and increasing a letter each subsequent round. eg - Series B, Series C) some investor will take time to determine what they think your company is currently worth. This is known as a Valuation. They will then buy stock from you at that valuation. For example, if <a href="http://a16z.com/">Andreessen Horowitz</a> decides they want to invest in your company, they may decide that your company is currently worth $4,000,000. This would mean each share in the company is worth $4 ($4,000,000 / 1,000,000 shares total). They would then invest money at this valuation, paying $4 per share. For each share purchased, the company would issue new shares, increasing the amount of total shares issued. If Andreessen Horowitz was to invest $1,000,000 into your company, they would purchase 250,000 shares, which would mean there are now 1,250,000 shares, making Andreessen\s ownership stake 20% (250,000/1,000,000) and TODO ',
          element: '#equityTutorial',
          onNext: function() {
            $scope.setupFinalEquityTutorial();
            $rootScope.$broadcast('TutorialUpdate');
          },
          onPrev: function() {
            $scope.setupConvertibleNotesTutorial();
            $rootScope.$broadcast('TutorialUpdate');
          }
        },
        {
          content: 'This is about the founders',
          element: '#finalEquityTutorial',
          onNext: function() {
          },
          onPrev: function() {
            $scope.setupEquityTutorial();
            $rootScope.$broadcast('TutorialUpdate');
          }
        }
      ]
    });
    $scope.tutorial.init();

    $scope.setupFoundersTutorial = function() {
      //redundant, but if we hit "Back" in the tutorial we need to reset the state
      startupService.startup.removeFounders();
      startupService.startup.removeConvertibleNotes();
      startupService.startup.removeEquityRounds();
      while(startupService.investors.length !== 0) {
        startupService.investors.splice(0,1);
      }
      startupService.updateCapTable(); //this is garbage
      startupService.startup.addFounder(new Founder('Grace', 25));
      startupService.startup.addFounder(new Founder('Merideth', 25));
      startupService.startup.addFounder(new Founder('Danielle', 25));
      startupService.startup.addFounder(new Founder('Elon', 25));
      startupService.updateCapTable();
    };

    $scope.setupInvestorsTutorial = function() {
      //clean up startup
      startupService.startup.removeConvertibleNotes();
      startupService.startup.removeEquityRounds();
      while(startupService.investors.length !== 0) {
        startupService.investors.splice(0,1);
      }
      startupService.investors.push(new Investor('J Cal'));
      startupService.investors.push(new Investor('Naval'));
      startupService.investors.push(new Investor('Marissa'));
      startupService.investors.push(new Investor('K Rose'));
      startupService.investors.push(new Investor('a16z'));
      startupService.updateCapTable(); //this is garbage
    };

    $scope.setupConvertibleNotesTutorial = function() {
      //clean up startup
      startupService.startup.removeConvertibleNotes();
      startupService.startup.removeEquityRounds();
      var cn = new ConvertibleNote(4000000, 20);
      cn.addInvestor(startupService.investors[0], 50000);
      cn.addInvestor(startupService.investors[1], 75000);
      cn.addInvestor(startupService.investors[2], 100000);
      cn.addInvestor(startupService.investors[3], 200000);
      startupService.startup.addConvertibleNote(cn);
      startupService.updateCapTable();
    };

    $scope.setupEquityTutorial = function() {
      startupService.startup.removeEquityRounds();
      var equityRound = new EquityRound(4000000);
      equityRound.addInvestor(startupService.investors[4], 1000000);
      startupService.startup.addEquityRound(equityRound);
      startupService.updateCapTable();
    };

    $scope.setupFinalEquityTutorial = function() {
    };

    $scope.startTutorial = function() {
      $('#gotIt').click();
      //clean up startup
      startupService.startup.removeFounders();
      startupService.startup.removeConvertibleNotes();
      startupService.startup.removeEquityRounds();
      while(startupService.investors.length !== 0) {
        startupService.investors.splice(0,1);
      }
      startupService.updateCapTable(); //this is garbage
      $scope.setupFoundersTutorial();
      $scope.tutorial.start(true).goTo(0);
    };
  }]);

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
    };
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
        if ($scope.investors[investorIndex].name === $scope.newInvestor.name) {
          return false;
        }
      }
      return true;
    };

    $rootScope.$on('TutorialUpdate', function() {
      $scope.$apply();
    });

  }])
  .directive('startupInvestors', function (){
    return {
      templateUrl: 'templates/investors.html'
    };
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
      var cn = $scope.convertibleNotes[cnIndex];
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
    };
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
    };
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
  };
});
