var React = require('react');

class EquityRound extends React.Component {
  render() {
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
          <div className="table">
            <div className="table-header">
              <div className="table-cell">
                $20,000,000.00 Pre-Money <span className="hidden-xs">Valuation</span>
              </div>
              <button type="button" className="table-row-delete"><span aria-hidden="true">×</span></button>
            </div>
            <div className="table-row">
              <div className="table-cell table-cell-control">
                <form className="form-inline" name="addInvestorToEquityRoundForm">
                  <select className="form-control form-control-large" required="">
                    <option value="" disabled="">Investor</option>
                    <option value="0" className="">Ludlow Ventures</option>
                    <option value="1" className="">WeBad Ventures</option>
                    <option value="2" className="">Jason Calacanis</option>
                  </select>
                  <input className="form-control form-control-small" type="number" placeholder="Amount" min="0" required="" />
                  <input type="submit" className="btn btn-primary" value="Add" />
                </form>
              </div>
            </div>
            <div className="table-row">
              <div className="table-cell table-cell-large">
                Jason Calacanis
              </div>
              <div className="table-cell table-cell-small">
                <input className="ghost-control ghost-control-full" type="text" value="5000000" />
              </div>
              <button type="button" className="table-row-delete"><span aria-hidden="true">×</span></button>
            </div>
            <div className="table-footer">
              <div className="table-cell">
                $25,000,000.00 Post-Money <span className="hidden-xs">Valuation</span>
              </div>
            </div>
          </div>
        </div>
	  </div>
    );
  }
}

module.exports = EquityRound;
