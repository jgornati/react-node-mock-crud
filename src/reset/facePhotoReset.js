import {
    resetFacePhotos,
    resetCreateFacePhoto,
    resetUpdateFacePhoto,
    resetDeleteFacePhoto
} from "../actions/FacePhotoActions";
import { resetUsers, resetCreateUser, resetUpdateUser, resetDeleteUser } from "../actions/UserActions";

var resetFacePhoto = {
    resetAll(dispatch) {
        dispatch(resetFacePhotos());
        dispatch(resetCreateFacePhoto());
        dispatch(resetUpdateFacePhoto());
        dispatch(resetDeleteFacePhoto());
        dispatch(resetUsers());
        dispatch(resetCreateUser());
        dispatch(resetUpdateUser());
        dispatch(resetDeleteUser());
    },
};

export default resetFacePhoto;
