var React = require('react');
var AddFounderForm = require('./addFounderForm');
var FoundersList = require('./foundersList');

class Founders extends React.Component {
  constructor(props) {
    super(props);
  }

  handleRemoveFounder(founderKey) {
    var component = this;
    return function (event){
      event.preventDefault();
      component.props.removeFounder(founderKey);
    }
  }

  render() {
    return (
      <div>
        <div className="form-section" id="foundersTutorial">
          <h4 className="form-section-header">Founders / Common Stock Holders
            <small><a href="#" data-toggle="modal"><span className="glyphicon glyphicon-new-window"></span></a></small>
          </h4>
          <AddFounderForm addFounder={this.props.addFounder} />
          <FoundersList founders={this.props.founders} removeFounder={this.props.removeFounder} />
        </div>
	  </div>
    );
  }
}

module.exports = Founders;
