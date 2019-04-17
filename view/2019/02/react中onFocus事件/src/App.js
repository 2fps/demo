import React, { Component } from 'react';
import './App.css';

class App extends Component {
  focusFn = (e) => {
    console.log(e.target.className);
  }
  render() {
    return (
      <div className="outer" tabIndex="-1" onFocus={ this.focusFn }>
        <div className="middle" tabIndex="-1">
          <div className="inner" tabIndex="-1">
          </div>
        </div>
      </div>
    );
  }
}

export default App;
