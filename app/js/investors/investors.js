var React = require('react');
var AddInvestorForm = require('./addInvestorForm');
var InvestorsList = require('./investorsList');

class Investors extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="form-section" id="investorsTutorial">
          <h4 className="form-section-header">Investor List
            <small><a href="#" data-toggle="modal" data-target="#investorModal"><span className="glyphicon glyphicon-new-window"></span></a></small>
          </h4>
          <AddInvestorForm addInvestor={this.props.addInvestor} />
          <InvestorsList investors={this.props.investors} removeInvestor={this.props.removeInvestor}/>
        </div>
      </div>
    );
  }
}

module.exports = Investors;
