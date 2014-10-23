'use strict';

/**
 * @ngdoc function
 * @name fundingApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the fundingApp
 */

//from SO http://stackoverflow.com/questions/8837454/sort-array-of-objects-by-single-key-with-date-value
function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
}

angular.module('fundingApp')
  .factory('startupService', ['$log', function($log) {
    var startup = { 
      founders: [], 
      convertibleNotes: [], 
      equityRounds: []  
    };

    //founders
    startup.addFounder = function (founder) {
      startup.founders.push(founder);
      startup.founders = sortByKey(startup.founders, 'equity');
    };
    startup.removeFounder = function (index) {
      startup.founders.splice(index, 1); 
    };  
    startup.foundersLength = function () {
      return startup.founders.length;
    };  
    startup.totalFounderEquity = function() {
      var totalEquity = 0;
      var totalFounders = startup.founders.length;
      if (!totalFounders) {
        return 0;
      }   
      for (var i=0; i < totalFounders; i++){
        totalEquity += startup.founders[i].equity; 
      }   
      return totalEquity;
    };

    //convertible notes
    startup.addConvertibleNote = function (convertibleNote) {
      convertibleNote.investors = [];
      startup.convertibleNotes.push(convertibleNote);
    };
    startup.removeConvertibleNote = function (index) {
      startup.convertibleNotes.splice(index, 1);
    };
    startup.addInvestorToConvertibleNote = function (index, investmentInfo) {
      startup.convertibleNotes[index].investors.push(investmentInfo);
    };
    startup.removeInvestorFromConvertibleNote = function (cnIndex, investorIndex) {
      startup.convertibleNotes[cnIndex].investors.splice(investorIndex, 1);
    };
    startup.totalSeedInvestmentRaised = function () {
      var totalRaised = 0;
      var totalConvertibleNotes = startup.convertibleNotes.length;
      for (var notesIndex=0; notesIndex < totalConvertibleNotes; notesIndex++) {
        var totalInvestors = startup.convertibleNotes[notesIndex].investors.length;
        for (var investorsIndex=0; investorsIndex < totalInvestors; investorsIndex++) {
          totalRaised += startup.convertibleNotes[notesIndex].investors[investorsIndex].amount;
        }
      }
      return totalRaised;
    };

    //equity rounds
    startup.addEquityRound = function (equityRound) {
      equityRound.investors = [];
      startup.equityRounds.push(equityRound);
    };
    startup.removeEquityRound = function (index) {
      startup.equityRounds.splice(index, 1);
    };
    startup.addInvestorToEquityRound = function (index, investmentInfo) {
      startup.equityRounds[index].investors.push(investmentInfo);
    };
    startup.removeInvestorFromEquityRound = function (cnIndex, investorIndex) {
      startup.equityRounds[cnIndex].investors.splice(investorIndex, 1);
    };
    startup.totalRaised = function () {
      var totalRaised = startup.totalSeedInvestmentRaised();
      var totalEquityRounds = startup.equityRounds.length;
      for (var equityRoundsIndex=0; equityRoundsIndex < totalEquityRounds; equityRoundsIndex++) {
        var totalInvestors = startup.equityRounds[equityRoundsIndex].investors.length;
        for (var investorsIndex=0; investorsIndex < totalInvestors; investorsIndex++) {
          totalRaised += startup.equityRounds[equityRoundsIndex].investors[investorsIndex].amount;
        }
      }
      return totalRaised;
    };
    startup.totalRaisedForRound = function (index) {
      var equityRound = startup.equityRounds[index];
      var totalInvestors = equityRound.investors.length;
      var totalRaised = 0;
      for (var investorIndex = 0; investorIndex < totalInvestors; investorIndex++){
        totalRaised += equityRound.investors[investorIndex].amount; 
      }
      return totalRaised;
    };

    startup.calculateEquity = function(){
      var equityForEachParty = [];
      var founders = startup.founders;
      var convertibleNotes = startup.convertibleNotes;
      var equityRounds = startup.equityRounds;

      if (equityRounds.length === 0){
        return equityForEachParty;
      } else if (equityRounds[0].investors.length === 0){
        return equityForEachParty;
      }

      //series A
      var preMoneyValuation = equityRounds[0].preMoneyValuation;
      var totalRaisedForSeriesA = startup.totalRaisedForRound(0);
      var totalEquityForSeriesAInvestors = (totalRaisedForSeriesA / (totalRaisedForSeriesA + preMoneyValuation))*100;
      var totalInvestorsInSeriesA = equityRounds[0].investors.length;

      for (var investorIndex = 0; investorIndex < totalInvestorsInSeriesA; investorIndex++){
        var investor = equityRounds[0].investors[investorIndex];
        equityForEachParty.push({
          name: investor.name + ' - Series A',
          equity: (investor.amount / (totalRaisedForSeriesA + preMoneyValuation))*100
        });
      }
      
      //convertible note investors
      var totalEquityFromConvertibleNotes = 0;
      var totalNotes = convertibleNotes.length;
      for (var notesIndex = 0; notesIndex < totalNotes; notesIndex++) {
        var cap = convertibleNotes[notesIndex].cap;
        var discount = convertibleNotes[notesIndex].discount;
        var totalInvestors = convertibleNotes[notesIndex].investors.length;
        for (var investorIndex = 0; investorIndex < totalInvestors; investorIndex++){
          var investor = convertibleNotes[notesIndex].investors[investorIndex];
          //determine we should use the cap or discount for this investor for series A Pre Money
          var equity = Math.max(
              (investor.amount * ((100-discount)/100) / preMoneyValuation),
              (investor.amount / Math.min(cap, preMoneyValuation))
          );
          //dilute the cn investor for series A
          equity = (equity * ((100-totalEquityForSeriesAInvestors)/100))*100
          totalEquityFromConvertibleNotes += equity;
          equityForEachParty.push({
            name: investor.name,
            equity: equity
          });
        }
      }

      //founders
      var totalFounders = founders.length; 
      for (var founderIndex = 0; founderIndex < totalFounders; founderIndex++) {
        var founder = founders[founderIndex];
        //dilution from convertible notes
        var equity = founder.equity * ((100-totalEquityFromConvertibleNotes)/100);
        //dilution from series a
        equity = equity * ((100-totalEquityForSeriesAInvestors)/100)
        equityForEachParty.push({
          name: founder.name,
          equity: equity
        });
      }

      //other equity rounds
      if (equityRounds.length > 1){
        var totalEquityRounds = equityRounds.length;
        for (var equityRoundIndex = 1; equityRoundIndex < totalEquityRounds; equityRoundIndex++) {
          var totalInvestors = equityRounds[equityRoundIndex].investors.length;
          for (var investorIndex = 0; investorIndex < totalInvestors; investorIndex++){
            equityForEachParty.push({
              name: equityRounds[equityRoundIndex].investors[investorIndex].name,
              equity: '0'
            });
          }
        }
      }

      equityForEachParty = sortByKey(equityForEachParty, 'equity');
      //return the equity for everyone after the SeriesA
      return equityForEachParty;
    };

    return startup;
  }]);
