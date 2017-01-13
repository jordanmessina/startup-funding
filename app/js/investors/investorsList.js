var React = require('react');

class InvestorsList extends React.Component {
  constructor(props) {
    super(props);
    this.handleRemoveInvestor = this.handleRemoveInvestor.bind(this);
  }

  handleRemoveInvestor(investorKey) {
    var component = this;
    return function(event) {
      event.preventDefault();
      component.props.removeInvestor(investorKey);
    }
  }

  render() {
    var component = this;
    var investorsJSX = this.props.investors.map( function (investor) {
      return (
        <div key={investor.key} className="table-row">
          <div className="table-cell table-cell-single">
            <input className="ghost-control ghost-control-full" type="text" value={investor.name} />
          </div>
          <button type="button" className="table-row-delete" onClick={component.handleRemoveInvestor(investor.key)} ><span aria-hidden="true">×</span></button>
        </div>
      );
    });
    if (this.props.investors.length > 0) {
      return(
        <div className="table table-bordered">
          {investorsJSX}
        </div>
      );
    } else {
      return <div></div>;
    }
  }
}

module.exports = InvestorsList;
