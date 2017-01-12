var React = require('react');

class AddFounderForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      founderName: '',
      founderEquity: ''
    }
    this.handleFounderNameChange = this.handleFounderNameChange.bind(this);
    this.handleFounderEquityChange = this.handleFounderEquityChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleFounderNameChange(event) {
    this.setState({founderName: event.target.value});
  }

  handleFounderEquityChange(event) {
    this.setState({founderEquity: event.target.value});
  }

  handleFormSubmit(event) {
    event.preventDefault();
    this.props.addFounder(this.state.founderName, Number(this.state.founderEquity));
    this.setState({
      founderName: '',
      founderEquity: ''
    });
  }

  render() {
    return ( 
      <div>
        <form className="form-inline" name="founderForm" onSubmit={this.handleFormSubmit}>
          <input className="form-control form-control-large" type="text" placeholder="Founder Name" required="" value={this.state.founderName} onChange={this.handleFounderNameChange} />
          <input className="form-control form-control-small" type="number" placeholder="Equity %" max="99.6" min="0" step="any" required="" value={this.state.founderEquity} onChange={this.handleFounderEquityChange} />
          <input className="btn btn-primary" type="submit" value="Add" />
        </form>
      </div>
    );
  }
}

module.exports = AddFounderForm;
