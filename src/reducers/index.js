import { combineReducers } from 'redux'
import users from "./users";
import roles from "./roles";
import facePhotos from "./facePhotos";

const appReducers = combineReducers({
    facePhotos,
    roles,
    users
});

export default appReducers;
