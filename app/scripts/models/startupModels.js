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
  if(investmentIndex != -1) {
    this.investments.splice(investmentIndex, 1); 
  }
}

Investor.prototype.deleteInvestments = function() {
  while (this.investments.length){
    this.investments[0].deleteInvestment()
  }
}

Investor.prototype.totalInvestment = function() {
  var investmentLength = this.investments.length;
  var total = 0;
  for (var investmentIndex = 0; investmentIndex < investmentLength; investmentIndex++){
    total += this.investments[investmentIndex].amount;
  }
  return total;
}

function ConvertibleNote(cap, discount){
  this.cap = cap;
  this.discount = discount;
  this.investments = [];
}

ConvertibleNote.prototype.addInvestor = function(investor, amount){
  //NOTE - this is the only method used to add investors to a CN
  new Investment(investor, this, amount);
}

ConvertibleNote.prototype.deleteInvestment = function(investment) {
  var investmentIndex = this.investments.indexOf(investment);
  if(investmentIndex != -1) {
    this.investments.splice(investmentIndex, 1); 
  }
}

ConvertibleNote.prototype.deleteInvestments = function() {
  while (this.investments.length){
    this.investments[0].deleteInvestment()
  }
}

ConvertibleNote.prototype.totalInvestment = function() {
  var investmentLength = this.investments.length;
  var total = 0;
  for (var investmentIndex = 0; investmentIndex < investmentLength; investmentIndex++){
    total += this.investments[investmentIndex].amount;
  }
  return total;
}

function EquityRound(preMoneyValuation){
  this.preMoneyValuation = preMoneyValuation;
  this.investments = [];
}

EquityRound.prototype.addInvestor = function(investor, amount){
  //NOTE - this is the only method used to add investors to an equity round
  new Investment(investor, this, amount);
}

EquityRound.prototype.deleteInvestment = function(investment) {
  var investmentIndex = this.investments.indexOf(investment);
  if(investmentIndex != -1) {
    this.investments.splice(investmentIndex, 1); 
  }
}

EquityRound.prototype.deleteInvestments = function() {
  while (this.investments.length){
    this.investments[0].deleteInvestment()
  }
}

EquityRound.prototype.totalInvestment = function() {
  var investmentLength = this.investments.length;
  var total = 0;
  for (var investmentIndex = 0; investmentIndex < investmentLength; investmentIndex++){
    total += this.investments[investmentIndex].amount;
  }
  return total;
}

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
  if (!alreadyInvested){
    //otherwise there should be no references and it should get garbage collected...
    this.investor.investments.push(this);
    this.investmentTerms.investments.push(this);
  }
}

Investment.prototype.deleteInvestment = function() {
  this.investor.deleteInvestment(this);
  this.investmentTerms.deleteInvestment(this);
}

function Startup(){
  this.founders = [];
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
}

Startup.prototype.addFounder = function(founder){
  if(this.totalFounderEquity() < 100 && founder.equity + this.totalFounderEquity() <= 100){
    this.founders.push(founder);
  }
}

Startup.prototype.removeFounder = function(founder){
  var founderIndex = this.founders.indexOf(founder);
  if (founderIndex != -1){
    this.founders.splice(founderIndex, 1);
  }
}

Startup.prototype.addConvertibleNote = function(convertibleNote) {
  if (this.convertibleNotes.indexOf(convertibleNote) == -1){
    this.convertibleNotes.push(convertibleNote);
  }
}

Startup.prototype.removeConvertibleNote = function(equityRound) {
  var index = this.equityRounds.indexOf(equityRound);
  if (index != -1){
    this.equityRound.splice(index, 1);
  }
}

Startup.prototype.addEquityRound = function(equityRound) {
  if (this.equityRounds.indexOf(equityRound) == -1){
    this.equityRounds.push(equityRound);
  }
}

Startup.prototype.removeEquityRound = function(equityRound) {
  var index = this.equityRounds.indexOf(equityRound);
  if (index != -1){
    this.equityRounds.splice(index, 1);
  }
}
