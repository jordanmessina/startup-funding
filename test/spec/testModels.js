describe("A Founder", function() {
  it("should take args (name, equity)", function() {
    var founder = new Founder('Jordan', 50);
    expect(founder.name).toBe('Jordan');
  });
});

describe("An Investor and an investment", function() {
  it("should take args(name)", function() {
    var investor = new Investor('JT');
    expect(investor.name).toBe('JT');
  });

  it("should take args(cap, discount)", function(){
    var convertibleNote = new ConvertibleNote(4000000, 20);
    expect(convertibleNote.cap).toBe(4000000);
    expect(convertibleNote.discount).toBe(20);
  });

  it("should be able to create an investment", function(){
    var investor = new Investor('JCal');
    var convertibleNote = new ConvertibleNote(4000000, 20);
    convertibleNote.addInvestor(investor, 20000);
    expect(investor.investments.length).toEqual(1);
    expect(convertibleNote.investments.length).toEqual(1);
    expect(convertibleNote.investments[0]).toEqual(investor.investments[0]);
  });

  it("should be able to delete one/all investment/s", function(){
    var investor1 = new Investor('P Judge');
    var investor2 = new Investor('Nas');
    var investor3 = new Investor('B Horo');
    var convertibleNote1 = new ConvertibleNote(4000000, 20);
    var convertibleNote2 = new ConvertibleNote(5000000, 10);
    var convertibleNote3 = new ConvertibleNote(3000000, 0);
    var convertibleNote4 = new ConvertibleNote(2000000, 40);
    var convertibleNote5 = new ConvertibleNote(1000000, 30);
    convertibleNote1.addInvestor(investor1, 20000);
    convertibleNote1.addInvestor(investor2, 25000);
    convertibleNote2.addInvestor(investor1, 40000);
    convertibleNote2.addInvestor(investor2, 10000);
    convertibleNote3.addInvestor(investor3, 100000);
    convertibleNote4.addInvestor(investor3, 50000);
    convertibleNote5.addInvestor(investor3, 25000);
    //test convertible notes first
    expect(investor1.investments.length).toEqual(2);
    expect(convertibleNote1.investments.length).toEqual(2);
    var investment1 = convertibleNote1.investments[0];
    var investment2 = convertibleNote1.investments[1];
    convertibleNote1.deleteInvestment(investment1);
    expect(convertibleNote1.investments.length).toEqual(1);
    expect(convertibleNote1.investments[0]).toBe(investment2);
    convertibleNote2.deleteInvestments();
    expect(convertibleNote2.investments.length).toEqual(0);
    //test investors
    expect(investor3.investments.length).toEqual(3);
    investment1 = investor3.investments[1];
    investment2 = investor3.investments[0];
    var investment3 = investor3.investments[2];
    investor3.deleteInvestment(investment1);
    expect(investor3.investments.length).toEqual(2);
    expect(investor3.investments).toContain(investment2);
    expect(investor3.investments).toContain(investment3);
    investor3.deleteInvestments();
    expect(investor3.investments.length).toEqual(0);
  });

  it("(equity round) should work similar to CNs", function() {
    var equityRound = new EquityRound(15000000);
    var investor1 = new Investor('Gary V');
    var investor2 = new Investor('Kevin R');
    var investor3 = new Investor('Timmy F');
    equityRound.addInvestor(investor1, 50000);
    equityRound.addInvestor(investor2, 100000);
    equityRound.addInvestor(investor3, 30000);
    expect(equityRound.investments.length).toEqual(3);
  });

  it("(convertible note) should be able to tell you show much has been raised", function() {
    var convertibleNote = new ConvertibleNote();
    expect(convertibleNote.totalInvestment()).toEqual(0);
    var investor1 = new Investor('Gary V');
    var investor2 = new Investor('Kevin R');
    var investor3 = new Investor('Timmy F');
    convertibleNote.addInvestor(investor1, 100000);
    expect(convertibleNote.totalInvestment()).toEqual(100000);
    convertibleNote.addInvestor(investor2, 200000);
    expect(convertibleNote.totalInvestment()).toEqual(300000);
    convertibleNote.addInvestor(investor3, 50000);
    expect(convertibleNote.totalInvestment()).toEqual(350000);
  });

  it("(investor) should be able to tell you how much it's invested", function() {
    var investor = new Investor('Naval');
    var convertibleNote = new ConvertibleNote();
    var equityRound1 = new EquityRound();
    var equityRound2 = new EquityRound();
    convertibleNote.addInvestor(investor, 50000);
    expect(investor.totalInvestment()).toEqual(50000);
    equityRound1.addInvestor(investor, 50000);
    expect(investor.totalInvestment()).toEqual(100000);
    equityRound2.addInvestor(investor, 50000);
    expect(investor.totalInvestment()).toEqual(150000);
  });

  it("(convertible note and equity round) shouldn't let an investor invest multiple times", function() {
    var investor = new Investor('Carmelo Anthony');
    var convertibleNote = new ConvertibleNote();
    var equityRound = new EquityRound();
    convertibleNote.addInvestor(investor, 20000);
    convertibleNote.addInvestor(investor, 50000);
    expect(convertibleNote.investments.length).toEqual(1);
    expect(convertibleNote.investments[0].amount).toEqual(20000);
    equityRound.addInvestor(investor, 100000);
    equityRound.addInvestor(investor, 200000);
    expect(equityRound.investments.length).toEqual(1);
    expect(equityRound.investments[0].amount).toEqual(100000);
  });

});

describe("A Startup", function() {
  it("should be able to add founders, up to 100% equity", function() {
    var startup = new Startup();
    var founder1 = new Founder('Jordan', 50);
    var founder2 = new Founder('Jimmy', 25);
    var founder3 = new Founder('Jane', 35);
    var founder4 = new Founder('Jannet', 25);
    startup.addFounder(founder1);
    expect(startup.totalFounderEquity()).toEqual(50);
    startup.addFounder(founder2);
    expect(startup.totalFounderEquity()).toEqual(75);
    startup.addFounder(founder3);
    expect(startup.totalFounderEquity()).toEqual(75);
    startup.addFounder(founder4);
    expect(startup.totalFounderEquity()).toEqual(100);
  });

  it("should be able to add convertible notes and equity rounds (but not duplicates)", function() {
    var startup = new Startup();
    var investor = new Investor('Ron Conroy');
    var convertibleNote = new ConvertibleNote(5000000, 20);
    var equityRound = new EquityRound(15000000);
    startup.addConvertibleNote(convertibleNote);
    convertibleNote.addInvestor(investor, 200000);
    expect(startup.convertibleNotes[0].totalInvestment()).toEqual(200000);
    startup.addConvertibleNote(convertibleNote);
    expect(startup.convertibleNotes.length).toEqual(1);
    startup.addEquityRound(equityRound);
    equityRound.addInvestor(investor, 50000);
    expect(startup.equityRounds.length).toEqual(1);
    startup.addEquityRound(equityRound);
    expect(startup.equityRounds.length).toEqual(1);
  });

  it("should be able to gather all investors", function() {
    var startup = new Startup();
    var investor1 = new Investor('Sama');
    var investor2 = new Investor('PG');
    var investor3 = new Investor('PaulToo');
    var convertibleNote = new ConvertibleNote(5000000, 20);
    var equityRound = new EquityRound(15000000);
    startup.addConvertibleNote(convertibleNote);
    startup.addEquityRound(equityRound);
    convertibleNote.addInvestor(investor1, 20000);
    startup.gatherInvestors();
    expect(startup.investors.length).toEqual(1);
    convertibleNote.addInvestor(investor2, 20000);
    startup.gatherInvestors();
    expect(startup.investors.length).toEqual(2);
    equityRound.addInvestor(investor3, 200000);
    equityRound.addInvestor(investor2, 200000);
    startup.gatherInvestors();
    expect(startup.investors.length).toEqual(3);
  });

  it("should be able to determine equity after rounds of funding", function() {
    var startup = new Startup();
    var founder1 = new Founder('Jomessin', 25);
    var founder2 = new Founder('Tommy', 25);
    var founder3 = new Founder('Janice', 25);
    var founder4 = new Founder('Lindsey', 25);
    startup.addFounder(founder1);
    startup.addFounder(founder2);
    startup.addFounder(founder3);
    startup.addFounder(founder4);
    var investor1 = new Investor('JCal');
    var investor2 = new Investor('JTriest');
    var investor3 = new Investor('BrettD');
    var investor4 = new Investor('Timmy F');
    var investor5 = new Investor('Bobby Graz');
    var investor6 = new Investor('Sean Ammir');
    var convertibleNote1 = new ConvertibleNote(4000000, 20);
    var convertibleNote2 = new ConvertibleNote(10000000, 10);
    var equityRound = new EquityRound(15000000);
    startup.addConvertibleNote(convertibleNote1);
    startup.addConvertibleNote(convertibleNote2);
    startup.addEquityRound(equityRound);
    convertibleNote1.addInvestor(investor1, 500000);
    convertibleNote1.addInvestor(investor2, 500000);
    convertibleNote2.addInvestor(investor1, 250000);
    convertibleNote2.addInvestor(investor2, 250000);
    convertibleNote2.addInvestor(investor3, 250000);
    convertibleNote2.addInvestor(investor4, 250000)
    var capTable = startup.capTable();
    expect(capTable.length).toEqual(8);
    expect(capTable[0].equity).toEqual(25);
    expect(capTable[1].equity).toEqual(25);
    expect(capTable[2].equity).toEqual(25);
    expect(capTable[3].equity).toEqual(25);
    expect(capTable[4].equity).toEqual(0);
    expect(capTable[5].equity).toEqual(0);
    expect(capTable[6].equity).toEqual(0);
    expect(capTable[7].equity).toEqual(0);
    equityRound.addInvestor(investor5, 5000000);
    capTable = startup.capTable();
    expect(capTable.length).toEqual(9);
    expect(capTable[0].equity).toEqual(25);
  });
});
