import axios from 'axios';
import aType from './aActionType';

export default {
    getRandom: (value) => {
        return dispatch => {
            dispatch({
                type: aType.getRandom,
                data: {
                    value
                }
            });
        };
    },
    getStr: () => {
        return dispatch => {
            axios.post('/data').then((res) => {
                dispatch({
                    type: aType.getStr,
                    data: res.data.data
                });
            });
        }
    }
}