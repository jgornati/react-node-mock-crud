import {resetUsers, resetCreateUser, resetUpdateUser, resetDeleteUser} from "../actions/UserActions";
import {
    resetFacePhotos,
    resetCreateFacePhoto,
    resetUpdateFacePhoto,
    resetDeleteFacePhoto
} from "../actions/FacePhotoActions";

var resetUser = {
    resetAll(dispatch) {
        dispatch(resetUsers());
        dispatch(resetCreateUser());
        dispatch(resetUpdateUser());
        dispatch(resetDeleteUser());
        dispatch(resetFacePhotos());
        dispatch(resetCreateFacePhoto());
        dispatch(resetUpdateFacePhoto());
        dispatch(resetDeleteFacePhoto());
    },
};

export default resetUser;