angular.module('fundingApp')
  .factory('Shareholders', function() {

    var shareholders = {};

    function addShareholder(props) {
      // ensure a name and type are provided
      if (!props.name || !props.type) return;

    }

    function removeShareholder(name) {
      if (shareholders.hasOwnProperty(name)) delete shareholders[name];
    }

    function getShareholder(name) {
      return shareholders[name];
    }

    function listShareholders() {
      return shareholders;
    }

    return {
      get: getShareholder,
      list: listShareholders,
      add: addShareholder,
      remove: removeShareholder
    };

  })
