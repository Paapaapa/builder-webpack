const React = require('react');
require('./search.less');

class Search extends React.Component {
  render() {
    return (
      <div>
        <p className="p-text">
          明月几时有，自己抬头瞅
        </p>
      </div>
    );
  }
}

module.exports = <Search />;
