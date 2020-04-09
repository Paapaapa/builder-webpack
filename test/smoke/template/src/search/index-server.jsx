const React = require('react');
const logoSmall = require('../img/logo-16x16.png');
require('./search.less');

class Search extends React.Component {
  render() {
    return (
      <div>
        <p className="p-text">
          明月几时有，自己抬头瞅
        </p>
        <img src={logoSmall} alt="logo-small" />
      </div>
    );
  }
}

module.exports = <Search />;
