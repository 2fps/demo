import React from 'react';
import { connect } from 'react-redux';

import aAction from '../../store/A/aAction';

class A extends React.Component {
    changeValue = () => {
        this.props.getRandom(Math.random());
    }

    changeIP = () => {
        this.props.getStr(Math.random());
    }
    render() {
        return (
            <div>
                <button type="button" onClick={ this.changeValue }>修改值（未经过http）</button>
                <p>
                    { this.props.aValue }
                </p>
                <button type="button" onClick={ this.changeIP }>http请求</button>
                <p>
                    { this.props.str }
                </p>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        aValue: state.aReducer.aValue,
        str: state.aReducer.str
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        // 登录
        getRandom: (...args) => dispatch(aAction.getRandom(...args)),
        getStr: (...args) => dispatch(aAction.getStr(...args))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(A);