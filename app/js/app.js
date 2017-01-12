var React = require('react');
var ReactDOM = require('react-dom');
var Founders = require('./founders/founders');
var Investors = require('./investors/investors');
var ConvertibleNotes = require('./convertibleNotes/convertibleNotes');
var EquityRound = require('./equityRound/equityRound');
var EquityBreakdown = require('./equityBreakdown/equityBreakdown');

class StartupFunding extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      founders: [],
      investors: [],
      convertibleNotes: [],
      equityRounds: []
    }
    this.addFounder = this.addFounder.bind(this);
    this.removeFounder = this.removeFounder.bind(this);
    this.addInvestor = this.addInvestor.bind(this);
    this.removeInvestor = this.removeInvestor.bind(this);
    this.addConvertibleNote = this.addConvertibleNote.bind(this);
  }

  addFounder(name, equity) {
    //add first founder
    if(this.state.founders.length == 0) {
      this.setState({
        founders: [{
          key: 1,
          name: name,
          equity: equity
        }]
      });
    } else {
      // get next id
      var founderKeys = this.state.founders.map( function (founder) {
        return founder.key
      });
      var nextFounderKey = Math.max.apply(null, founderKeys) + 1;
      var founders = this.state.founders;
     founders.push({
       key: nextFounderKey,
       name: name,
       equity: equity
     });
     this.setState({
       founders: founders
     }); 
    }
  }

  removeFounder(founderKey) {
    var founders = this.state.founders.filter( function(founder) {
        return founderKey != founder.key;
    });
    this.setState({ founders: founders });
  }

  addInvestor(name) {
    //add first investor
    if(this.state.investors.length == 0) {
      this.setState({
        investors: [{
          key: 1,
          name: name,
        }]
      });
    } else {
      // get next id
      var investorKeys = this.state.investors.map( function (investor) {
        return investor.key
      });
      var nextInvestorKey = Math.max.apply(null, investorKeys) + 1;
      var investors = this.state.investors;
      investors.push({
       key: nextInvestorKey,
       name: name,
      });
      this.setState({
          investors: investors
      }); 
    }
  }

  removeInvestor(investorKey) {
    var investors = this.state.investors.filter( function(investor) {
        return investorKey != investor.key;
    });
    this.setState({ investors: investors });
  }

  addConvertibleNote(cap, discount) {

  }

  removeConvertibleNote(convertibleNoteKey) {

  }

  render() {
    var convertibleNotes = [
      {
        key: 1,
        cap: 2000000,
        discount: 20,
        investors: [
          {
            key: 1,
            amount: 25000
          },
          {
            key: 3,
            amount: 150000
          }
        ]
      }
    ];

    var equityRounds = [
      {
        key: 1,
        preMoney: 20000000,
        investors: [
          {
            key: 4,
            amount: 5000000
          } 
        ]
      }
    ];

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12 col-md-8 input-panel">
            <h1 className="app-title">
              <a data-toggle="collapse" href="#intro" aria-expanded="true" aria-controls="intro" id="gotIt"> <img src="images/coin.png" /> Startup Funding </a> 
            </h1>
            <div className="row panel-collapse" id="intro" role="intro" aria-labelledby="intro">
              <div className="col-sm-6">
                <p>This is a simple tool that demonstrates the mechanics of Convertible Notes and Equity Rounds, and shows how they affect each other.</p>
                <p>If you're here to learn about Convertible Notes and Equity Rounds, a great first step is using the <a href="#">interactive tutorial.</a> </p>
                <p>Admittedly, funding is more complicated than this, but this is a great way to understand the basics. <a data-toggle="collapse" href="#intro" aria-expanded="true" aria-controls="intro" id="gotIt">Got It.</a></p>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6">
                <Founders founders={this.state.founders} addFounder={this.addFounder} removeFounder={this.removeFounder} />
                <Investors investors={this.state.investors} addInvestor={this.addInvestor} removeInvestor={this.removeInvestor} />
              </div>
              <div className="col-sm-6">
                <ConvertibleNotes convertibleNotes={this.state.convertibleNotes} investors={this.state.investors}/>
                <EquityRound equityRounds={this.state.equityRounds} investors={this.state.investors}/>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-4 equity-breakdown-panel">
            <EquityBreakdown />
          </div>
        </div>
      </div>
	);
  }
}

ReactDOM.render(<StartupFunding />, document.getElementById('app'));
