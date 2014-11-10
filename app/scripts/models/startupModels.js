'use strict';

function sortByKey(array, key) {
  //from SO http://stackoverflow.com/questions/8837454/sort-array-of-objects-by-single-key-with-date-value
  return array.sort(function(a, b) {
      var x = a[key]; var y = b[key];
      return ((x > y) ? -1 : ((x < y) ? 1 : 0));
  });
}

function Founder(name, equity) {
  this.name = name;
  this.equity = equity;
}

function Investor(name) {
  this.name = name;
  this.investments = [];
}

Investor.prototype.deleteInvestment = function(investment) {
  var investmentIndex = this.investments.indexOf(investment);
  if(investmentIndex !== -1) {
    //always delete the investment from the CN or the Equity Round object
    var investmentTerms = this.investments[investmentIndex].investmentTerms;
    investmentTerms.deleteInvestment(this.investments[investmentIndex]);
  }
};

Investor.prototype.deleteInvestments = function() {
  while (this.investments.length){
    //always delete the investment from the CN or the Equity Round object
    var investmentTerms = this.investments[0].investmentTerms;
    investmentTerms.deleteInvestment(this.investments[0]);
  }
};

Investor.prototype.totalInvestment = function() {
  var investmentLength = this.investments.length;
  var total = 0;
  for (var investmentIndex = 0; investmentIndex < investmentLength; investmentIndex++){
    total += this.investments[investmentIndex].amount;
  }
  return total;
};

function ConvertibleNote(cap, discount){
  this.cap = cap;
  this.discount = discount;
  this.investments = [];
}

ConvertibleNote.prototype.addInvestor = function(investor, amount){
  //NOTE - this is the only method used to add investors to a CN
  new Investment(investor, this, amount);
};

ConvertibleNote.prototype.deleteInvestment = function(investment) {
  var investmentIndex = this.investments.indexOf(investment);
  if(investmentIndex !== -1) {
    //delete it from the investor first
    var investor = this.investments[investmentIndex].investor; 
    var investorInvestmentIndex = investor.investments.indexOf(investment);
    if (investorInvestmentIndex !== -1) {
      investor.investments.splice(investorInvestmentIndex, 1);
    }
    //delete from the note
    this.investments.splice(investmentIndex, 1); 
  }
};

ConvertibleNote.prototype.deleteInvestments = function() {
  while (this.investments.length){
    this.deleteInvestment(this.investments[0]);
  }
};

ConvertibleNote.prototype.totalInvestment = function() {
  var investmentLength = this.investments.length;
  var total = 0;
  for (var investmentIndex = 0; investmentIndex < investmentLength; investmentIndex++){
    total += this.investments[investmentIndex].amount;
  }
  return total;
};

function EquityRound(preMoneyValuation){
  this.preMoneyValuation = preMoneyValuation;
  this.investments = [];
}

EquityRound.prototype.addInvestor = function(investor, amount){
  //NOTE - this is the only method used to add investors to an equity round
  new Investment(investor, this, amount);
};

EquityRound.prototype.deleteInvestment = function(investment) {
  var investmentIndex = this.investments.indexOf(investment);
  if(investmentIndex !== -1) {
    //delete it from the investor first
    var investor = this.investments[investmentIndex].investor; 
    var investorInvestmentIndex = investor.investments.indexOf(investment);
    if (investorInvestmentIndex !== -1) {
      investor.investments.splice(investorInvestmentIndex, 1); 
    }   
    //delete from the note
    this.investments.splice(investmentIndex, 1); 
  }
};

EquityRound.prototype.deleteInvestments = function() {
  while (this.investments.length){
    this.deleteInvestment(this.investments[0]);
  }
};

EquityRound.prototype.totalInvestment = function() {
  var investmentLength = this.investments.length;
  var total = 0;
  for (var investmentIndex = 0; investmentIndex < investmentLength; investmentIndex++){
    total += this.investments[investmentIndex].amount;
  }
  return total;
};

function Investment(investor, investmentTerms, amount){
  //NOTE - this is the only way that an investment reference should be added to investor.investments / cn.investments / equityRound.investments...
  this.investor = investor;
  this.investmentTerms = investmentTerms;
  this.amount = amount;
  //make sure this investor isn't already in this CN / Equity Round...
  var investmentsLength = investmentTerms.investments.length;
  var alreadyInvested = false;
  for (var investmentIndex = 0; investmentIndex < investmentsLength; investmentIndex++){
    if(investmentTerms.investments[investmentIndex].investor === investor){
      alreadyInvested = true;
    }
  }
  var investment = this;
  if (!alreadyInvested){
    //otherwise there should be no references and it should get garbage collected...
    this.investor.investments.push(investment);
    this.investmentTerms.investments.push(investment);
  }
}

Investment.prototype.deleteInvestment = function() {
  this.investor.deleteInvestment(this);
  this.investmentTerms.deleteInvestment(this);
};

function Startup() {
  this.founders = [];
  this.investors = [];
  this.convertibleNotes = [];
  this.equityRounds = [];
}

Startup.prototype.totalFounderEquity = function() {
  var totalEquity = 0;
  var totalFounders = this.founders.length;
  for (var founderIndex = 0; founderIndex < totalFounders; founderIndex++){
    totalEquity += this.founders[founderIndex].equity;
  }
  return totalEquity;
};

Startup.prototype.addFounder = function(founder){
  if(this.totalFounderEquity() < 100 && founder.equity + this.totalFounderEquity() <= 100){
    this.founders.push(founder);
    this.founders = sortByKey(this.founders, 'equity');
  }
};

Startup.prototype.removeFounder = function(founder){
  var founderIndex = this.founders.indexOf(founder);
  if (founderIndex !== -1){
    this.founders.splice(founderIndex, 1);
  }
};

Startup.prototype.removeFounders = function() {
  while (this.founders.length !== 0) {
    this.removeFounder(this.founders[0]);
  }
};

Startup.prototype.removeInvestor = function(investor) {
  investor.deleteInvestments();
};

Startup.prototype.removeInvestors = function() {
  while (this.investors.length !== 0) {
    this.removeInvestor(this.investors[0]);
  }
};

Startup.prototype.gatherInvestors = function() {
  var investors = [];
  var convertibleNotesLength = this.convertibleNotes.length;
  var equityRoundsLength = this.equityRounds.length;
  //add investors from CN
  for (var cnIndex = 0; cnIndex < convertibleNotesLength; cnIndex++) {
    var investmentsLength = this.convertibleNotes[cnIndex].investments.length;
    for (var investmentIndex = 0; investmentIndex < investmentsLength; investmentIndex++) {
      var tmpInvestor = this.convertibleNotes[cnIndex].investments[investmentIndex].investor;
      if (investors.indexOf(tmpInvestor) === -1){
        investors.push(tmpInvestor);
      }
    }
  }
  //add investors from equity rounds
  for (var equityRoundIndex = 0; equityRoundIndex < equityRoundsLength; equityRoundIndex++) {
    var investmentsLength = this.equityRounds[equityRoundIndex].investments.length;
    for (var investmentIndex = 0; investmentIndex < investmentsLength; investmentIndex++) {
      var tmpInvestor = this.equityRounds[equityRoundIndex].investments[investmentIndex].investor;
      if(investors.indexOf(tmpInvestor) === -1) {
        investors.push(tmpInvestor);
      }
    }
  }
  this.investors = investors;
};

Startup.prototype.addConvertibleNote = function(convertibleNote) {
  if (this.convertibleNotes.indexOf(convertibleNote) === -1){
    this.convertibleNotes.push(convertibleNote);
  }
};

Startup.prototype.removeConvertibleNote = function(convertibleNote) {
  var index = this.convertibleNotes.indexOf(convertibleNote);
  if (index !== -1){
    convertibleNote.deleteInvestments();
    this.convertibleNotes.splice(index, 1);
  }
};

Startup.prototype.removeConvertibleNotes = function() {
  while (this.convertibleNotes.length !== 0) {
    this.removeConvertibleNote(this.convertibleNotes[0]);
  }
};

Startup.prototype.addEquityRound = function(equityRound) {
  if (this.equityRounds.indexOf(equityRound) === -1){
    this.equityRounds.push(equityRound);
  }
};

Startup.prototype.removeEquityRound = function(equityRound) {
  var index = this.equityRounds.indexOf(equityRound);
  if (index !== -1){
    equityRound.deleteInvestments();
    this.equityRounds.splice(index, 1);
  }
};

Startup.prototype.removeEquityRounds = function() {
  while (this.equityRounds.length !== 0) {
    this.removeEquityRound(this.equityRounds[0]);
  }
};

Startup.prototype.capTable = function() {
  this.gatherInvestors();
  var capTable = [];
  // no equity round, convertible notes don't have equity yet.
  if (this.equityRounds.length === 0 || (this.equityRounds.length !== 0 && this.equityRounds[0].investments.length === 0)) {
    var foundersLength = this.founders.length;
    for (var founderIndex = 0; founderIndex < foundersLength; founderIndex++) {
      capTable.push({
        person: this.founders[founderIndex],
        equity: this.founders[founderIndex].equity 
      });
    }
    var investorsLength = this.investors.length;
    for (var investorIndex = 0; investorIndex < investorsLength; investorIndex++) {
      capTable.push(
        {
          person: this.investors[investorIndex],
          equity: 0
        }
      );
    }
    return sortByKey(capTable, 'equity');
  }
  //series A
  var preMoneyValuation = this.equityRounds[0].preMoneyValuation;
  var totalRaisedForSeriesA = this.equityRounds[0].totalInvestment(); 
  var totalEquityGivenUpAtSeriesA = (totalRaisedForSeriesA / (totalRaisedForSeriesA + preMoneyValuation))*100;
  var seriesAInvestorsLength = this.equityRounds[0].investments.length;
  for (var investmentIndex = 0; investmentIndex < seriesAInvestorsLength; investmentIndex++){
    var investment = this.equityRounds[0].investments[investmentIndex];
    capTable.push({
      person: investment.investor,
      equity: (investment.amount / (totalRaisedForSeriesA + preMoneyValuation))*100
    });
  }

  //convertible Notes
  var convertibleNotesLength = this.convertibleNotes.length;
  var totalEquityGivenFromNotes = 0;
  for (var notesIndex = 0; notesIndex < convertibleNotesLength; notesIndex++){
    var cap = this.convertibleNotes[notesIndex].cap;
    var discount = this.convertibleNotes[notesIndex].discount;
    var noteInvestorsLength = this.convertibleNotes[notesIndex].investments.length;
    for (var investmentIndex = 0; investmentIndex < noteInvestorsLength; investmentIndex++) {
      var investment = this.convertibleNotes[notesIndex].investments[investmentIndex];
      var equity = Math.max(
        (investment.amount / (((100-discount)/100)*preMoneyValuation))*100,
        (investment.amount / Math.min(cap, preMoneyValuation))*100
      );
      //dilution from series A
      equity *= (100 - totalEquityGivenUpAtSeriesA)/100;
      //check if investor is already in the cap table
      var capTableLength = capTable.length;
      var capTableIndexOf = -1;
      for(var capTableIndex = 0; capTableIndex < capTableLength; capTableIndex++) {
        if(capTable[capTableIndex].person === investment.investor) {
          capTableIndexOf = capTableIndex;
        }
      }
      if(capTableIndexOf !== -1) { // already in the cap table, just add the equity
        capTable[capTableIndexOf].equity += equity;
      } else { // not currently in the cap table, create new entry
        capTable.push(
          {
            person: investment.investor,
            equity: equity
          }
        );
      }
      totalEquityGivenFromNotes += equity;
    }
  }

  // founders
  var totalEquityGivenFromNotesAndSeriesA = totalEquityGivenUpAtSeriesA + totalEquityGivenFromNotes;
  var foundersLength = this.founders.length;
  for (var foundersIndex = 0; foundersIndex < foundersLength; foundersIndex++){
    var founder = this.founders[foundersIndex];
    var equity = founder.equity * ((100-totalEquityGivenFromNotesAndSeriesA)/100);
    capTable.push(
      {
        person: founder,
        equity: equity
      }
    );
  }

  //any other equity rounds
  var totalEquityRoundsAfterSeriesA = this.equityRounds.length - 1;
  if (totalEquityRoundsAfterSeriesA > 0) {
    for(var equityRoundIndex = 1; equityRoundIndex <= totalEquityRoundsAfterSeriesA; equityRoundIndex++) {
      var preMoneyValuation = this.equityRounds[equityRoundIndex].preMoneyValuation;
      var totalRaisedForSeriesX = this.equityRounds[equityRoundIndex].totalInvestment(); 
      var totalEquityGivenUpAtSeriesX = (totalRaisedForSeriesX / (totalRaisedForSeriesX + preMoneyValuation))*100;
      var seriesXInvestorsLength = this.equityRounds[equityRoundIndex].investments.length;
      //dilute everyone first...
      var capTableLength = capTable.length;
      for (var capTableIndex = 0; capTableIndex < capTableLength; capTableIndex++) {
        capTable[capTableIndex].equity = capTable[capTableIndex].equity*((100-totalEquityGivenUpAtSeriesX)/100);
      }
      for (var investmentIndex = 0; investmentIndex < seriesXInvestorsLength; investmentIndex++){
        var investment = this.equityRounds[equityRoundIndex].investments[investmentIndex];
        var equity = (investment.amount / (totalRaisedForSeriesX + preMoneyValuation))*100;
        var capTableLength = capTable.length;
        var capTableIndexOf = -1;
        for(var capTableIndex = 0; capTableIndex < capTableLength; capTableIndex++) {
          if(capTable[capTableIndex].person === investment.investor) {
            capTableIndexOf = capTableIndex;
          } 
        }
        if(capTableIndexOf !== -1) { // already in the cap table, just add the equity
          capTable[capTableIndexOf].equity += equity;
        } else { // not currently in the cap table, create new entry
          capTable.push(
            {
              person: investment.investor,
              equity: equity
            }
          );
        }
      }
    }
  }

  return sortByKey(capTable, 'equity');
};
