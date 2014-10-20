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
    startup.removeInvestorFromEquityRounds = function (cnIndex, investorIndex) {
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

    //equity calculator...
    startup.equity = function () {
        var stockHolders = [];

    };

    return startup;
  }]);
