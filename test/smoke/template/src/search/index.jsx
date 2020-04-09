
import React from 'react';
import ReactDom from 'react-dom';
import './search.less';
import logoSmall from '../img/logo-16x16.png';

class Search extends React.Component {
  constructor(...rest) {
    super(rest);
    this.state = {
      Text: null,
    };
  }

  loadText() {
    import('./text.jsx').then((Text) => {
      this.setState({
        Text: Text.default,
      });
    });
  }

  render() {
    const { Text } = this.state;

    return (
      <div>
        <p className="p-text">
          明月几时有，自己抬头瞅
        </p>
        <img src={logoSmall} alt="logo-small" />
        <div>
          {Text ? <Text /> : null}
        </div>
        <button onClick={this.loadText.bind(this)} type="button">加载Text</button>
      </div>
    );
  }
}

ReactDom.render(
  <Search />,
  document.getElementById('root'),
);
