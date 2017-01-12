var React = require('react');

class Investors extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      investorName: ''
    }
    this.handleInvestorNameChange = this.handleInvestorNameChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleInvestorNameChange(event) {
    this.setState({investorName: event.target.value});
  }

  handleFormSubmit(event) {
    event.preventDefault();
    this.props.addInvestor(this.state.investorName);
    this.setState({ investorName: '' });
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
    return (
      <div>
        <div className="form-section" id="investorsTutorial">
          <h4 className="form-section-header">Investor List
            <small><a href="#" data-toggle="modal" data-target="#investorModal"><span className="glyphicon glyphicon-new-window"></span></a></small>
          </h4>
          <form className="form-inline" onSubmit={this.handleFormSubmit} >
            <input className="form-control form-control-single" type="text" placeholder="Investor Name" required="" value={this.state.investorName} onChange={this.handleInvestorNameChange} />
            <input className="btn btn-primary" type="submit" value="Add" />
          </form>
          <div className="table table-bordered">
            {investorsJSX}
          </div>
        </div>
      </div>
    );
  }
}

module.exports = Investors;
