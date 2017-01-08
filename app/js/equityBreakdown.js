var React = require('react');

class EquityBreakdown extends React.Component {
  render() {
    return (
      <div>
        <div id="finalEquityTutorial" className="">
          <h4 className="form-section-header">Equity Breakdown
            <small><a href="#" data-toggle="modal" data-target="#finalEquity"><span className="glyphicon glyphicon-new-window"></span></a></small>
          </h4>
          <div className="table equity-breakdown-table">
            <div className="table-row">
              <div className="table-cell table-cell-large">
                Jason Calacanis
              </div>
              <div className="table-cell table-cell-small">
                19.80%
              </div>
            </div>
            <div className="table-row">
              <div className="table-cell table-cell-large">
                Bla
              </div>
              <div className="table-cell table-cell-small">
                15.84%
              </div>
            </div>
            <div className="table-row">
              <div className="table-cell table-cell-large">
                Blee
              </div>
              <div className="table-cell table-cell-small">
                15.84%
              </div>
            </div>
            <div className="table-row">
              <div className="table-cell table-cell-large">
                Ludlow Ventures
              </div>
              <div className="table-cell table-cell-small">
                0.99%
              </div>
            </div>
            <div className="table-footer">
              <div className="table-cell table-cell-large">
                TOTAL
              </div>
              <div className="table-cell table-cell-small">
                52.48%
              </div>
            </div>
          </div>
        </div>
	  </div>
    );
  }
}

module.exports = EquityBreakdown;
