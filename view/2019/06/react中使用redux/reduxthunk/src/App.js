import React, { Component } from 'react';
import { Provider} from 'react-redux';

import A from './page/A/a';
// import B from './page/B/b';

import store from './store/store';

export default class App extends Component {
    render() {
        return (
            <Provider store={ store }>
                <A />
            </Provider>
        );
    }
}
