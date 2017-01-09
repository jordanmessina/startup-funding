var React = require('react');

class EquityRound extends React.Component {
  render() {
    var props = this.props;
    var equityRoundsJSX = props.equityRounds.map( function(equityRound) {

      var investorDropdownJSX = props.investors.map( function(investor) {
        return (
          <option value={investor.id} className="">{investor.name}</option>
        );
      });
      var investmentJSX = equityRound.investors.map( function(investorInvestment) {
        var investorName = props.investors.filter( function (investor) {
          return investorInvestment.id == investor.id;
        })[0].name;
        return (
          <div className="table-row">
            <div className="table-cell table-cell-large">
              {investorName}
            </div>
            <div className="table-cell table-cell-small">
              <input className="ghost-control ghost-control-full" type="text" value={investorInvestment.amount} />
            </div>
            <button type="button" className="table-row-delete"><span aria-hidden="true">×</span></button>
          </div>
        );
      });

      var postMoneyValuation = equityRound.preMoney;
      for (var i=0; i < equityRound.investors.length; i++) {
        postMoneyValuation += equityRound.investors[i].amount;
      }

      return (
        <div className="table">
          <div className="table-header">
            <div className="table-cell">
              ${equityRound.preMoney} Pre-Money <span className="hidden-xs">Valuation</span>
            </div>
            <button type="button" className="table-row-delete"><span aria-hidden="true">×</span></button>
          </div>
          <div className="table-row">
            <div className="table-cell table-cell-control">
              <form className="form-inline" name="addInvestorToEquityRoundForm">
                <select className="form-control form-control-large" required="">
                  <option value="" disabled="">Investor</option>
                  {investorDropdownJSX}
                </select>
                <input className="form-control form-control-small" type="number" placeholder="Amount" min="0" required="" />
                <input type="submit" className="btn btn-primary" value="Add" />
              </form>
            </div>
          </div>
          {investmentJSX}
          <div className="table-footer">
            <div className="table-cell">
              ${postMoneyValuation} Post-Money <span className="hidden-xs">Valuation</span>
            </div>
          </div>
        </div>
      );
    });

    return (
      <div>
        <div className="form-section" id="equityTutorial">
          <h4 className="form-section-header">Equity Rounds
            <small><a href="#" data-toggle="modal" data-target="#equityModal"><span className="glyphicon glyphicon-new-window"></span></a></small>
          </h4>
          <form className="form-inline" name="equityRoundForm">
            <input className="form-control form-control-single" type="number" placeholder="Pre-Money Valuation" required="" />
            <input className="btn btn-primary" type="submit" value="Add" />
          </form>
          {equityRoundsJSX}
        </div>
	  </div>
    );
  }
}

module.exports = EquityRound;
