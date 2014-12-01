'use strict';

function sortByKey(array, key) {
  //from SO http://stackoverflow.com/questions/8837454/sort-array-of-objects-by-single-key-with-date-value
  return array.sort(function(a, b) {
      var x = a[key]; var y = b[key];
      return ((x > y) ? -1 : ((x < y) ? 1 : 0));
  });
}

function Founder(name, shares) {
  this.name = name;
  this.shares = shares;
}

Founder.prototype.equity = function(totalShares) {
  return this.shares / totalShares;
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
  this.totalShares = 10000000; //10,000,000 shares issued by default
  this.founders = [];
  this.investors = [];
  this.convertibleNotes = [];
  this.equityRounds = [];
}

Startup.prototype.totalIssuedShares = function() {
  var totalShares = 0;
  var totalFounders = this.founders.length;
  for (var founderIndex = 0; founderIndex < totalFounders; founderIndex++){
    totalShares += this.founders[founderIndex].shares;
  }
  return totalShares;
}

Startup.prototype.totalFounderEquity = function() {
  return this.totalIssuedShares() / this.totalShares;
};

Startup.prototype.addFounder = function(founder){
  if(founder.shares + this.totalIssuedShares() <= this.totalShares){
    this.founders.push(founder);
    this.founders = sortByKey(this.founders, 'shares');
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
  var capTable = {
    totalShares: this.totalShares,
    totalIssuedShares: 0,
    shareholders: []
  }
  // no equity round, convertible notes don't have equity yet.
  var foundersLength = this.founders.length;
  for (var founderIndex = 0; founderIndex < foundersLength; founderIndex++) {
    capTable.shareholders.push({
      person: this.founders[founderIndex],
      shares: this.founders[founderIndex].shares
    });
    capTable.totalIssuedShares += this.founders[founderIndex].shares;
  }

  if (this.equityRounds.length === 0 || (this.equityRounds.length !== 0 && this.equityRounds[0].investments.length === 0)) {
    var investorsLength = this.investors.length;
    for (var investorIndex = 0; investorIndex < investorsLength; investorIndex++) {
      capTable.shareholders.push(
        {
          person: this.investors[investorIndex],
          shares: 0
        }
      );
    }
    capTable.sharehodlers = sortByKey(capTable.shareholders, 'shares');
    return capTable;
  }

  //pre-money valuation, used to determine everyone's shares
  var preMoneyValuation = this.equityRounds[0].preMoneyValuation;

  //convertible Notes
  var convertibleNotesLength = this.convertibleNotes.length;
  for (var notesIndex = 0; notesIndex < convertibleNotesLength; notesIndex++){
    //protect against divide by 0
    var cap = this.convertibleNotes[notesIndex].cap === 0 ? preMoneyValuation : this.convertibleNotes[notesIndex].cap;
    var discount = this.convertibleNotes[notesIndex].discount === 0 ? 0 : this.convertibleNotes[notesIndex].discount / 100;

    var noteInvestorsLength = this.convertibleNotes[notesIndex].investments.length;
    for (var investmentIndex = 0; investmentIndex < noteInvestorsLength; investmentIndex++) {
      var investment = this.convertibleNotes[notesIndex].investments[investmentIndex];
      var shares = Math.max(
        (investment.amount / ((preMoneyValuation / this.totalShares) * (1 - discount))),
        (investment.amount / (Math.min(cap, preMoneyValuation) / this.totalShares))
      );
      //check if investor is already in the cap table
      var capTableLength = capTable.shareholders.length;
      var capTableIndexOf = -1;
      for(var capTableIndex = 0; capTableIndex < capTableLength; capTableIndex++) {
        if(capTable.shareholders[capTableIndex].person === investment.investor) {
          capTableIndexOf = capTableIndex;
        }
      }
      if(capTableIndexOf !== -1) { // already in the cap table, just add the equity
        capTable.shareholders[capTableIndexOf].shares += shares;
        capTable.totalShares += shares;
      } else { // not currently in the cap table, create new entry
        capTable.shareholders.push(
          {
            person: investment.investor,
            shares: shares
          }
        );
        capTable.totalShares += shares;
        capTable.totalIssuedShares += shares;
      }
    }
  }


  //series A
  var totalRaisedForSeriesA = this.equityRounds[0].totalInvestment(); 
  var totalEquityGivenUpAtSeriesA = (totalRaisedForSeriesA / (totalRaisedForSeriesA + preMoneyValuation))*100;
  var seriesAInvestorsLength = this.equityRounds[0].investments.length;
  for (var investmentIndex = 0; investmentIndex < seriesAInvestorsLength; investmentIndex++){
    var investment = this.equityRounds[0].investments[investmentIndex];
    var shares = (investment.amount / ((preMoneyValuation / this.totalShares)));
    //check if investor is already in the cap table
    var capTableLength = capTable.shareholders.length;
    var capTableIndexOf = -1;
    for(var capTableIndex = 0; capTableIndex < capTableLength; capTableIndex++) {
      if(capTable.shareholders[capTableIndex].person === investment.investor) {
        capTableIndexOf = capTableIndex;
      }
    }
    if(capTableIndexOf !== -1) { // already in the cap table, just add the equity
      capTable.shareholders[capTableIndexOf].shares += shares;
      capTable.totalShares += shares;
    } else { // not currently in the cap table, create new entry
      capTable.shareholders.push(
        {
          person: investment.investor,
          shares: shares
        }
      );
      capTable.totalShares += shares;
      capTable.totalIssuedShares += shares;
    }
  }


  ////any other equity rounds
  //var totalEquityRoundsAfterSeriesA = this.equityRounds.length - 1;
  //if (totalEquityRoundsAfterSeriesA > 0) {
  //  for(var equityRoundIndex = 1; equityRoundIndex <= totalEquityRoundsAfterSeriesA; equityRoundIndex++) {
  //    var preMoneyValuation = this.equityRounds[equityRoundIndex].preMoneyValuation;
  //    var totalRaisedForSeriesX = this.equityRounds[equityRoundIndex].totalInvestment(); 
  //    var totalEquityGivenUpAtSeriesX = (totalRaisedForSeriesX / (totalRaisedForSeriesX + preMoneyValuation))*100;
  //    var seriesXInvestorsLength = this.equityRounds[equityRoundIndex].investments.length;
  //    //dilute everyone first...
  //    var capTableLength = capTable.length;
  //    for (var capTableIndex = 0; capTableIndex < capTableLength; capTableIndex++) {
  //      capTable[capTableIndex].equity = capTable[capTableIndex].equity*((100-totalEquityGivenUpAtSeriesX)/100);
  //    }
  //    for (var investmentIndex = 0; investmentIndex < seriesXInvestorsLength; investmentIndex++){
  //      var investment = this.equityRounds[equityRoundIndex].investments[investmentIndex];
  //      var equity = (investment.amount / (totalRaisedForSeriesX + preMoneyValuation))*100;
  //      var capTableLength = capTable.length;
  //      var capTableIndexOf = -1;
  //      for(var capTableIndex = 0; capTableIndex < capTableLength; capTableIndex++) {
  //        if(capTable[capTableIndex].person === investment.investor) {
  //          capTableIndexOf = capTableIndex;
  //        } 
  //      }
  //      if(capTableIndexOf !== -1) { // already in the cap table, just add the equity
  //        capTable[capTableIndexOf].equity += equity;
  //      } else { // not currently in the cap table, create new entry
  //        capTable.push(
  //          {
  //            person: investment.investor,
  //            equity: equity
  //          }
  //        );
  //      }
  //    }
  //  }
  //}

  capTable.shareholders = sortByKey(capTable.shareholders, 'shares');
  return capTable;
};
