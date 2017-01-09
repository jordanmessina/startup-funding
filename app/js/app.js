var React = require('react');
var ReactDOM = require('react-dom');
var Founders = require('./founders');
var Investors = require('./investors');
var ConvertibleNotes = require('./convertibleNotes');
var EquityRound = require('./equityRound');
var EquityBreakdown = require('./equityBreakdown');

class StartupFunding extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      founder: [],
      investors: [],
      convertibleNotes: [],
      equityRounds: []
    }
  }

  render() {
    var founders = [
      {
        id: 1,
        name: "Jordan Messina",
        equity: 20
      },
      {
        id: 2,
        name: "Colleen Messina",
        equity: 20
      },
      {
        id: 3,
        name: "Emi Messina",
        equity: 60
      },

    ];

    var investors = [
      {
        id: 1,
        name: "Ludlow Ventures"
      },
      {
        id: 2,
        name: "Upfront Ventures"
      },
      {
        id: 3,
        name: "Jason Calacanis"
      },
      {
        id: 4,
        name: "Andressen Horowitz"
      }
    ];

    var convertibleNotes = [
      {
        id: 1,
        cap: 2000000,
        discount: 20,
        investors: [
          {
            id: 1,
            amount: 25000
          },
          {
            id: 3,
            amount: 150000
          }
        ]
      }
    ];

    var equityRounds = [
      {
        id: 1,
        preMoney: 20000000,
        investors: [
          {
            id: 4,
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
                <Founders founders={founders} />
                <Investors investors={investors}/>
              </div>
              <div className="col-sm-6">
                <ConvertibleNotes convertibleNotes={convertibleNotes} investors={investors}/>
                <EquityRound equityRounds={equityRounds} investors={investors}/>
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
