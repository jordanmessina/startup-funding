angular.module('fundingApp')
  .factory('Startup', function() {

    function Startup() {
      this.initialSharesCount = 0;
      this.investmentRounds = [];
    };

    Startup.prototype.addInvestmentRound = function(round) {

    };

    return Startup;

  })
