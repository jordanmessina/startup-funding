var React = require('react');

class ConvertibleNotes extends React.Component {
  render() {
    var props = this.props;
    // this has turned into a bit of a clusterfuck...
    var convertibleNotesJSX = props.convertibleNotes.map( function (convertibleNote) {

      var investorDropdownJSX = props.investors.map( function (investor) {
        return (
          <option value={investor.id} className="">{investor.name}</option>
        ); 
      });

      var investmentJSX = convertibleNote.investors.map( function (investorInvestment) {
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

      var totalRaised = 0;
      for (var i = 0; i < convertibleNote.investors.length; i++) {
        totalRaised += convertibleNote.investors[i].amount;
      }

      return (
        <div className="table table-bordered convertable-note">
          <div className="table-header">
            <div className="table-cell table-cell-full">
              $<input className="ghost-control cap-control" type="number" value={convertibleNote.cap} step="250000" /> cap at a <input className="ghost-control discount-control" type="number" value={convertibleNote.discount} />% <span className="hidden-xs">discount</span>
            </div>
            <button type="button" className="table-row-delete"><span aria-hidden="true">×</span></button>
          </div>
          <div className="table-row">
            <div className="table-cell table-cell-control">
              <form className="form-inline" name="addInvestorToConvertibleNoteForm">
                <select className="form-control form-control-large" required="" >
                  <option value="" disabled="" selected="">Investor</option>
                  {investorDropdownJSX}
                </select>
                <input className="form-control form-control-small" type="number" placeholder="Amount" min="0" required="" />
                <input className="btn btn-default" type="submit" value="Add" />
              </form>
            </div>
          </div>
          {investmentJSX}
          <div className="table-footer">
            <div className="table-cell">
              ${totalRaised} Raised in Total
            </div>
          </div>
        </div>
      );
    });

    return (
      <div>
        <div className="form-section" id="convertibleNotesTutorial">
          <h4 className="form-section-header">Convertible Notes
            <small><a href="#" data-toggle="modal" data-target="#noteModal"><span className="glyphicon glyphicon-new-window"></span></a></small>
          </h4>
          <form className="form-inline" name="convertibleNoteForm">
            <input className="form-control form-control-large" type="number" placeholder="Cap" required="" />
            <input className="form-control form-control-small" type="number" placeholder="Discount %" required="" />
            <input className="btn btn-primary" type="submit" value="Add" />
          </form>

          {convertibleNotesJSX}

        </div>
	  </div>
    );
  }
}

module.exports = ConvertibleNotes;
