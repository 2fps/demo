import aType from './aActionType';

let a = {
    aValue: 0,
    str: ''
};

export default function (state = a, action) {
    switch(action.type) {
        case aType.getRandom:
            return Object.assign({}, state, {
                aValue: action.data.value
            });
        case aType.getStr:
            return Object.assign({}, state, {
                str: action.data
            });
        default:
            return state;
    }
}