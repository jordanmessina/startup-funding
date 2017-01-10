var React = require('react');

class Founders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      founderName: '',
      founderEquity: ''
    }
    this.handleFounderNameChange = this.handleFounderNameChange.bind(this);
    this.handleFounderEquityChange = this.handleFounderEquityChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleRemoveFounder = this.handleRemoveFounder.bind(this);
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

  handleRemoveFounder(event) {
    event.preventDefault();
    console.log('in handleRemoveFounder');
    console.log(event);
    this.props.removeFounder(Number(event.target.id));
  }

  render() {
    var component = this;
    var founderJSX = this.props.founders.map( function (founder) {
        console.log(founder);
        return (
          <div key={'founder_' + founder.key} className="table-row">
            <div className="table-cell table-cell-large">
              <input className="ghost-control ghost-control-full" type="text" value={founder.name} />
            </div>
            <div className="table-cell table-cell-small">
              <input type="number" className="ghost-control ghost-control-full" value={founder.equity} />
            </div>
            <button id={founder.key} type="button" className="table-row-delete" onClick={component.handleRemoveFounder}><span aria-hidden="true">×</span></button>
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
          <form className="form-inline" name="founderForm" onSubmit={this.handleFormSubmit}>
            <input className="form-control form-control-large" type="text" placeholder="Founder Name" required="" value={this.state.founderName} onChange={this.handleFounderNameChange} />
            <input className="form-control form-control-small" type="number" placeholder="Equity %" max="99.6" min="0" step="any" required="" value={this.state.founderEquity} onChange={this.handleFounderEquityChange} />
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
