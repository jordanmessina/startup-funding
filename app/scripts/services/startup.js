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

    startup.calculateEquity = function(equityForEachPartyAfterSeriesA){
      //this is so we don't return a brand new object on each call
      //https://docs.angularjs.org/error/$rootScope/infdig
      equityForEachPartyAfterSeriesA.splice();

      var founders = startup.founders;
      var convertibleNotes = startup.convertibleNotes;
      var equityRounds = startup.equityRounds;

      if (equityRounds.length == 0){
          return equityForEachPartyAfterSeriesA;
      }
      
      //convertible note investors
      var totalNotes = convertibleNotes.length;
      for (var notesIndex = 0; notesIndex < totalNotes; notesIndex++) {
        var totalInvestors = convertibleNotes[notesIndex].investors.length;
        for (var investorIndex = 0; investorIndex < totalInvestors; investorIndex++){
          equityForEachPartyAfterSeriesA.push({
            name: convertibleNotes[notesIndex].investors[investorIndex].name,
            equity: '0'
          });
        }
      }

      //founders
      var totalFounders = founders.length; 
      for (var founderIndex = 0; founderIndex < totalFounders; founderIndex++) {
        equityForEachPartyAfterSeriesA.push({
          name: founders[founderIndex].name,
          equity: '0'
        });
      }

      //equity rounds
      var totalEquityRounds = equityRounds.length;
      for (var equityRoundIndex = 0; equityRoundIndex < totalEquityRounds; equityRoundIndex++) {
        var totalInvestors = equityRounds[equityRoundIndex].investors.length;
        for (var investorIndex = 0; investorIndex < totalInvestors; investorIndex++){
          equityForEachPartyAfterSeriesA.push({
            name: equityRounds[equityRoundIndex].investors[investorIndex].name,
            equity: '0'
          });
        }
      }

      //figure out what the CNs convert to
      //var preMoneyValuation = equityRounds[0].preMoneyValuation;
      //var totalConvertibleNotes = convertibleNotes.length;
      //var equityGivenAwayByConvertibleNotes = 0;
      //for(var noteIndex = 0; noteIndex < totalConvertibleNotes; noteIndex++){
      //    var cap = convertibleNotes[noteIndex].cap;
      //    var discount = convertibleNotes[noteIndex].discount;
      //    var totalInvestors = convertibleNotes[noteIndex].investors.length;
      //    for(var investorIndex = 0; investorIndex < totalInvestors; investorIndex++){
      //        $log.log('Convertible Note Investor ' + noteIndex  + ' ' + investorIndex);
      //        var investorName = convertibleNotes[noteIndex].investors[investorIndex].name;
      //        var amount = convertibleNotes[noteIndex].investors[investorIndex].amount;
      //        //determine we should use the cap or discount for this investor
      //        var equity = Math.max(
      //            (amount * ((100-discount)/100) / preMoneyValuation),
      //            (amount / Math.min(cap, preMoneyValuation))
      //        );
      //        equityForEachPartyAfterSeriesA.push({
      //            name: convertibleNotes[noteIndex].investors[investorIndex].name + ' - CN @ $' + convertibleNotes[noteIndex].cap + ' cap',
      //            equity: equity*100
      //        });
      //        equityGivenAwayByConvertibleNotes += equity;
      //    }
      //};
      //var dilutionBeforeSeriesA = (1 - equityGivenAwayByConvertibleNotes);
      ////dilute founders for CNs
      //var totalFounders = founders.length;
      //for(var founderIndex = 0; founderIndex < totalFounders; founderIndex++){
      //    $log.log('founder ' + founderIndex);
      //    equityForEachPartyAfterSeriesA.push({
      //        name: founders[founderIndex].name + ' - Founder',
      //        equity: founders[founderIndex].equity * dilutionBeforeSeriesA
      //    });
      //}
      //
      ////start figuring out the equity rounds
      //var totalEquityRounds = equityRounds.length;
      //for(var equityRoundIndex = 0; equityRoundIndex < totalEquityRounds; equityRoundIndex++){
      //    //determine dilution for this round and dilute everyone
      //    var dilution = equityRounds[equityRoundIndex].preMoneyValuation / (equityRounds[equityRoundIndex].preMoneyValuation + startup.totalRaisedForRound(equityRoundIndex));
      //    var totalParties = equityForEachPartyAfterSeriesA.length;
      //    for(var partiesIndex = 0; partiesIndex < totalParties; partiesIndex++){
      //        equityForEachPartyAfterSeriesA[partiesIndex].equity = dilution * equityForEachPartyAfterSeriesA[partiesIndex].equity;
      //    }
      //    //add each investor from this equity round into the array
      //    var totalEquityRoundInvestors = equityRounds[equityRoundIndex].investors.length;
      //    for(var equityRoundInvestorIndex = 0; equityRoundInvestorIndex < totalEquityRoundInvestors; equityRoundInvestorIndex++){
      //        $log.log('equity investor ' + equityRoundIndex + ' ' + equityRoundInvestorIndex);
      //        equityForEachPartyAfterSeriesA.push({
      //            name: equityRounds[equityRoundIndex].investors[equityRoundInvestorIndex].name, 
      //            equity: 100 * (equityRounds[equityRoundIndex].investors[equityRoundInvestorIndex].amount / (equityRounds[equityRoundIndex].preMoneyValuation + equityRounds[equityRoundIndex].amount))
      //        });
      //    }
      //}
      //equityForEachPartyAfterSeriesA = sortByKey(equityForEachPartyAfterSeriesA, 'equity');
      //return the equity for everyone after the SeriesA
      return equityForEachPartyAfterSeriesA;
    };

    return startup;
  }]);
