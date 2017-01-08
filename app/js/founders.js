var React = require('react');

class Founders extends React.Component {
  render() {
    var founderJSX = this.props.founders.map( function (founder, index) {
        return (
          <div className="table-row">
            <div className="table-cell table-cell-large">
              <input className="ghost-control ghost-control-full" type="text" value={founder.name} />
            </div>
            <div className="table-cell table-cell-small">
              <input type="number" className="ghost-control ghost-control-full" value={founder.equity} />
            </div>
            <button type="button" className="table-row-delete"><span aria-hidden="true">×</span></button>
          </div>
        );
    });

    var totalFounderEquity = 0;
    for (var i = 0; i < this.props.founders.length; i++){
      totalFounderEquity += this.props.founders[i].equity;    
    }

    return (
      <div>
        <div className="form-section" id="foundersTutorial">
          <h4 className="form-section-header">Founders / Common Stock Holders
            <small><a href="#" data-toggle="modal"><span className="glyphicon glyphicon-new-window"></span></a></small>
          </h4>
          <form className="form-inline" name="founderForm">
            <input className="form-control form-control-large" type="text" placeholder="Founder Name" required="" />
            <input className="form-control form-control-small" type="number" placeholder="Equity %" max="99.6" min="0" step="any" required="" />
            <input className="btn btn-primary" type="submit" value="Add" />
          </form>
          <div className="table table-bordered">
            {founderJSX}
            <div className="table-footer">
              <div className="table-cell table-cell-large">
                TOTAL
              </div>
              <div className="table-cell table-cell-small">
              {totalFounderEquity}%
              </div>
            </div>
          </div>
        </div>
	  </div>
    );
  }
}

module.exports = Founders;
