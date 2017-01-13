var React = require('react');

class AddInvestorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      investorName: ''
    };

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

  render() {
    return(
      <div>
        <form className="form-inline" onSubmit={this.handleFormSubmit} >
          <input className="form-control form-control-single" type="text" placeholder="Investor Name" required="" value={this.state.investorName} onChange={this.handleInvestorNameChange} />
          <input className="btn btn-primary" type="submit" value="Add" />
        </form>
      </div>
    );
  }

}

module.exports = AddInvestorForm;
