import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props)

    this.event1 = this.event1.bind(this, 1);
  }

  event1(a, e) {
    console.log('event1', a, e);
  }
  event2(a, e) {
    console.log('event2', a, e);
  }
  event3(a, e) {
    console.log('event3', a, e);
  }
  event4 = (e) => {
    console.log('event4', e);
  }

  render() {
    return (
      <div>
        <button onClick={ this.event1 }>event1</button>
        <button onClick={ (e) => { this.event2(2, e) } }>event2</button>
        <button onClick={ this.event3.bind(this, 3) }>event3</button>
        <button onClick={ this.event4 }>event4</button>
      </div>
    );
  }
}


export default App;
