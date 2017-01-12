var React = require('react');

class FoundersList extends React.Component {
  constructor(props) {
    super(props);
    this.handleRemoveFounder = this.handleRemoveFounder.bind(this);
  }

  handleRemoveFounder(founderKey) {
    var component = this;
    return function(event) {
      event.preventDefault();
      component.props.removeFounder(founderKey);
    }
  }

  render() {
    var component = this;
    var founderJSX = this.props.founders.map( function (founder) {
      return (
        <div className="table-row">
          <div className="table-cell table-cell-large">
            <input className="ghost-control ghost-control-full" type="text" value={founder.name} />
          </div>
          <div className="table-cell table-cell-small">
            <input type="number" className="ghost-control ghost-control-full" value={founder.equity} />
          </div>
          <button type="button" className="table-row-delete" onClick={component.handleRemoveFounder(founder.key)}><span aria-hidden="true">×</span></button>
        </div>
      );
    });

    var totalFounderEquity = 0;
    for (var i = 0; i < this.props.founders.length; i++){
      totalFounderEquity += this.props.founders[i].equity;
    }

    if(this.props.founders.length > 0) {
      return(
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
      );
    } else {
      return <div></div>
    }
  }
}

module.exports = FoundersList;
