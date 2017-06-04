var React = require('react');

class AddConvertibleNoteForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cap: '',
      discount: ''
    }
    this.handleCapChange = this.handleCapChange.bind(this);
    this.handleDiscountChange = this.handleDiscountChange.bind(this);
  }

  
}

module.exports = AddConvertibleNoteForm;
