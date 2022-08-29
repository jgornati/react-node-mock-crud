import {
    INVALIDATE_FACEPHOTOS,
    ERROR_FACEPHOTOS,
    RECEIVE_FACEPHOTOS,
    REQUEST_FACEPHOTOS,
    RESET_FACEPHOTOS,
    ERROR_FACEPHOTO,
    RECEIVE_FACEPHOTO,
    REQUEST_FACEPHOTO,
    UPDATE_FACEPHOTO,
    REQUEST_UPDATE_FACEPHOTO,
    SUCCESS_UPDATE_FACEPHOTO,
    ERROR_UPDATE_FACEPHOTO,
    RESET_UPDATE_FACEPHOTO,
    REQUEST_UPDATE_FACEPHOTOS,
    SUCCESS_UPDATE_FACEPHOTOS,
    ERROR_UPDATE_FACEPHOTOS,
    RESET_UPDATE_FACEPHOTOS,
    CREATE_FACEPHOTO,
    ERROR_CREATE_FACEPHOTO,
    REQUEST_CREATE_FACEPHOTO,
    RESET_CREATE_FACEPHOTO,
    SUCCESS_CREATE_FACEPHOTO,
    REQUEST_CREATE_FACEPHOTOS,
    SUCCESS_CREATE_FACEPHOTOS,
    ERROR_CREATE_FACEPHOTOS,
    RESET_CREATE_FACEPHOTOS,
    DELETE_FACEPHOTO,
    DELETE_CREATE_FACEPHOTO,
    DELETE_UPDATE_FACEPHOTO,
    REQUEST_DELETE_FACEPHOTO,
    SUCCESS_DELETE_FACEPHOTO,
    ERROR_DELETE_FACEPHOTO,
    RESET_DELETE_FACEPHOTO,
    REQUEST_PRINT_FACEPHOTO,
    SUCCESS_PRINT_FACEPHOTO,
    ERROR_PRINT_FACEPHOTO,
    RESET_PRINT_FACEPHOTO,
    RECEIVE_FILE_FACEPHOTO
} from '../actions/FacePhotoActions';

import {
    RECEIVE_USER,
    RECEIVE_USERS,
    SUCCESS_DELETE_USER,
    SUCCESS_CREATE_USER,
    SUCCESS_UPDATE_USER,
    SUCCESS_UPDATE_USERS

} from '../actions/UserActions';

import { combineReducers } from 'redux';

import merge from "lodash/merge";
import mergeWith from "lodash/mergeWith";
import union from "lodash/union";
import clone from "lodash/clone";
import difference from "lodash/difference";
import omit from "lodash/omit";
import pickBy from "lodash/pickBy";
import filter from "lodash/filter";

function getInitialStateById() {
    return {
        isFetching: false,
        didInvalidate: true,
        facePhotos: {},
        files: {},
    }
}

function facePhotosById(state = getInitialStateById(), action) {
    switch (action.type) {
        case INVALIDATE_FACEPHOTOS:
            return Object.assign({}, state, {
                didInvalidate: true
            });
        case REQUEST_FACEPHOTOS:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            });
        case ERROR_FACEPHOTOS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                error: action.error
            });
        case RESET_FACEPHOTOS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                error: null,
                lastUpdated: null,
                facePhotos: {}
            });
        case RECEIVE_FACEPHOTOS:
            let dato = action.facePhotos.entities.facePhotos;
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                facePhotos: merge({}, state.facePhotos, dato),
                lastUpdated: action.receivedAt
            });
        case REQUEST_FACEPHOTO:
            return Object.assign({}, state, {
                isFetching: true,
            });
        case ERROR_FACEPHOTO:
            return Object.assign({}, state, {
                isFetching: false,
                error: action.error
            });
        case RECEIVE_FACEPHOTO:
            let datoFacePhoto = action.facePhoto.entities.facePhotos;
            return Object.assign({}, state, {
                facePhotos: merge({}, state.facePhotos, datoFacePhoto),
                isFetching: false,
            });
        case RECEIVE_FILE_FACEPHOTO:
            return Object.assign({}, state, {
                files: merge({}, state.files, action.file),
            });

        case SUCCESS_DELETE_FACEPHOTO:
            let datoFacePhotoEliminado = action.facePhoto.entities.facePhotos;
            return Object.assign({}, state, {
                facePhotos: mergeWith(clone(datoFacePhotoEliminado), state.facePhotos, (objValue, srcValue) => {
                    return objValue;
                })
            });
        case SUCCESS_CREATE_FACEPHOTO:
            let datoFacePhotoCreado = action.facePhoto.entities.facePhotos;
            return Object.assign({}, state, {
                facePhotos: mergeWith(clone(datoFacePhotoCreado), state.facePhotos, (objValue, srcValue) => {
                    return objValue;
                })
            });
        case SUCCESS_CREATE_FACEPHOTOS:
            let datosFacePhotoCreado = action.facePhotos.entities.facePhotos;
            return Object.assign({}, state, {
                facePhotos: mergeWith(clone(datosFacePhotoCreado), state.facePhotos, (objValue, srcValue) => {
                    return objValue;
                })
            });
        case SUCCESS_UPDATE_FACEPHOTO:
            let datoFacePhotoActualizado = action.facePhoto.entities.facePhotos;
            return Object.assign({}, state, {
                facePhotos: mergeWith(clone(datoFacePhotoActualizado), state.facePhotos, (objValue, srcValue) => {
                    return objValue;
                })
            });
        case SUCCESS_UPDATE_FACEPHOTOS:
            let datosFacePhotoActualizado = action.facePhotos.entities.facePhotos;
            return Object.assign({}, state, {
                facePhotos: mergeWith(clone(datosFacePhotoActualizado), state.facePhotos, (objValue, srcValue) => {
                    return objValue;
                })
            });

        //USER
        case RECEIVE_USER:
            let user = action.user.entities && action.user.entities.facePhotos ? action.user.entities.facePhotos : {};
            return Object.assign({}, state, {
                facePhotos: merge({}, state.facePhotos, user),
            });
        case RECEIVE_USERS:
            let users = action.users.entities && action.users.entities.facePhotos ? action.users.entities.facePhotos : {};
            return Object.assign({}, state, {
                facePhotos: merge({}, state.facePhotos, users),
            });
        case SUCCESS_DELETE_USER:
            let datouserEliminado = action.user.entities && action.user.entities.facePhotos ? action.user.entities.facePhotos : {};
            return Object.assign({}, state, {
                facePhotos: merge({}, state.facePhotos, datouserEliminado),
            });
        case SUCCESS_CREATE_USER:
            let datouserCreado = action.user.entities && action.user.entities.facePhotos ? action.user.entities.facePhotos : {};
            return Object.assign({}, state, {
                facePhotos: mergeWith(clone(datouserCreado), pickBy(state.facePhotos, function (facePhoto) {
                    return facePhoto.id.toString().indexOf("-") === -1
                }), (objValue, srcValue) => {
                    return objValue;
                })
            });
        case SUCCESS_UPDATE_USER:
            let datouserActualizado = action.user.entities && action.user.entities.facePhotos ? action.user.entities.facePhotos : {};
            return Object.assign({}, state, {
                facePhotos: mergeWith(clone(datouserActualizado), pickBy(state.facePhotos, function (facePhoto) {
                    return facePhoto.id.toString().indexOf("-") === -1
                }), (objValue, srcValue) => {
                    return objValue;
                })
            });
        case SUCCESS_UPDATE_USERS:
            let datosuserActualizado = action.users.entities && action.users.entities.facePhotos ? action.users.entities.facePhotos : {};
            return Object.assign({}, state, {
                facePhotos: mergeWith(clone(datosuserActualizado), state.facePhotos, (objValue, srcValue) => {
                    return objValue;
                })
            });
        default:
            return state
    }
}


function allFacePhotos(state = [], action) {
    switch (action.type) {
        case RECEIVE_FACEPHOTOS:
            return action.facePhotos.result && action.facePhotos.result.facePhotos ? union(state, action.facePhotos.result.facePhotos) : (action.facePhotos.result ? action.facePhotos.result : state);
        case RECEIVE_FACEPHOTO:
            return action.facePhoto.result ? union(state, [action.facePhoto.result]) : state;

        case SUCCESS_CREATE_FACEPHOTO:
            let datoFacePhotoSCreate = action.facePhoto.entities.facePhotos;
            let idNuevoSCreate = null;
            if (Object.values(datoFacePhotoSCreate).length > 0)
                idNuevoSCreate = Object.values(datoFacePhotoSCreate)[0] && Object.values(datoFacePhotoSCreate)[0].id ? Object.values(datoFacePhotoSCreate)[0].id : null;
            if (idNuevoSCreate)
                return union(state, [idNuevoSCreate]);
            else
                return state;
        case SUCCESS_CREATE_FACEPHOTOS:
            let facePhotosCreate = action.facePhotos.entities && action.facePhotos.entities.facePhotos ? action.facePhotos.entities.facePhotos : null;
            return facePhotosCreate ?
                union(state, Object.values(facePhotosCreate).map((facePhotos) => {
                    return facePhotos.id
                })) : state;
        case RESET_FACEPHOTOS:
            return [];

        case RECEIVE_USER:
            let user = action.user.entities && action.user.entities.facePhotos ? action.user.entities.facePhotos : null;
            return user ?
                union(state, Object.values(user).map((user) => {
                    return user.id
                })) : state;
        case RECEIVE_USERS:
            let users = action.users.entities && action.users.entities.facePhotos ? action.users.entities.facePhotos : null;
            return users ?
                union(state, Object.values(users).map((users) => {
                    return users.id
                })) : state;

        case SUCCESS_DELETE_USER:
            let userDelete = action.user.entities && action.user.entities.facePhotos ? action.user.entities.facePhotos : null;
            return userDelete ?
                union(filter(state, function (o) {
                    return o.toString().indexOf("-") === -1;
                }), Object.values(userDelete).map((user) => {
                    return user.id
                })) : state;
        case SUCCESS_CREATE_USER:
            let userCreate = action.user.entities && action.user.entities.facePhotos ? action.user.entities.facePhotos : null;
            return userCreate ?
                union(filter(state, function (o) {
                    return o.toString().indexOf("-") === -1;
                }), Object.values(userCreate).map((user) => {
                    return user.id
                })) : state;
        case SUCCESS_UPDATE_USER:
            let userUpdate = action.user.entities && action.user.entities.facePhotos ? action.user.entities.facePhotos : null;
            return userUpdate ?
                union(filter(state, function (o) {
                    return o.toString().indexOf("-") === -1;
                }), Object.values(userUpdate).map((user) => {
                    return user.id
                })) : state;
        case SUCCESS_UPDATE_USERS:
            let usersUpdate = action.users.entities && action.users.entities.facePhotos ? action.users.entities.facePhotos : null;
            return usersUpdate ?
                union(state, Object.values(usersUpdate).map((users) => {
                    return users.id
                })) : state;
        default:
            return state
    }
}

function totalFacePhotos(state = null, action) {
    switch (action.type) {
        case RECEIVE_FACEPHOTOS:
            return action.facePhotos && action.facePhotos.result.total ? action.facePhotos.result.total : 0;
        case RESET_FACEPHOTOS:
            return null;
        default:
            return state
    }
}

function update(state = {
    isUpdating: false,
    activo: {},
    activos: []
}, action) {
    switch (action.type) {
        case RECEIVE_FACEPHOTO:
            let dato = action.facePhoto.entities.facePhotos;
            let facePhoto = dato && Object.keys(dato).length > 0 ? dato[Object.keys(dato)[0]] : {};
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                activo: facePhoto ? facePhoto : [],
                lastUpdated: action.receivedAt
            });
        case UPDATE_FACEPHOTO:
            let idsUpdate = [];
            Object.values(action.facePhoto).map((facePhotoUpdate) => {
                if (facePhotoUpdate && facePhotoUpdate.id)
                    idsUpdate.push(facePhotoUpdate.id);
            });
            return merge({}, state, {
                activo: action.facePhoto,
                activos: idsUpdate.length > 0 ? union(state.activos, idsUpdate) : state.activos,
                error: ""
            });
        case REQUEST_UPDATE_FACEPHOTO:
            return Object.assign({}, state, {
                isUpdating: true,
                error: null
            });
        case SUCCESS_UPDATE_FACEPHOTO:
            let datoFacePhotoActualizado = {};
            if (Object.values(action.facePhoto.entities.facePhotos).length > 0)
                datoFacePhotoActualizado = Object.values(action.facePhoto.entities.facePhotos)[0];
            return Object.assign({}, state, {
                isUpdating: false,
                lastUpdated: action.receivedAt,
                error: null,
                activo: datoFacePhotoActualizado
            });
        case ERROR_UPDATE_FACEPHOTO:
            return Object.assign({}, state, {
                isUpdating: false,
                error: action.error
            });
        case REQUEST_UPDATE_FACEPHOTOS:
            return Object.assign({}, state, {
                isUpdating: true,
                error: null
            });
        case SUCCESS_UPDATE_FACEPHOTOS:
            return Object.assign({}, state, {
                isUpdating: false,
                lastUpdated: action.receivedAt,
                error: null,
                activo: {},
                activos: []
            });
        case ERROR_UPDATE_FACEPHOTOS:
            return Object.assign({}, state, {
                isUpdating: false,
                error: action.error
            });
        case RESET_UPDATE_FACEPHOTO:
            return Object.assign({}, state, {
                isUpdating: false,
                activo: {},
                activos: [],
                error: ""
            });

        //USER
        case SUCCESS_CREATE_USER:
            return Object.assign({}, state, {
                activo: state.activo,
                activos: state.activos
            });
        case SUCCESS_UPDATE_USER:
            return Object.assign({}, state, {
                activo: state.activo,
                activos: state.activos
            });
        case SUCCESS_DELETE_USER:
            return Object.assign({}, state, {
                activo: state.activo,
                activos: state.activos
            });
        case SUCCESS_UPDATE_USERS:
            return Object.assign({}, state, {
                activo: state.activo,
                activos: state.activos
            });
        case DELETE_FACEPHOTO:
            let datoFacePhotoDelete = action.facePhoto;
            let idsDelete = [];
            Object.values(action.facePhoto).map((facePhotoDelete) => {
                if (facePhotoDelete && facePhotoDelete.id)
                    idsDelete.push(facePhotoDelete.id);
            });
            if (idsDelete.length > 0)
                return Object.assign({}, state, {
                    activo: omit(clone(state.activo), Object.keys(datoFacePhotoDelete)),
                    activos: difference(clone(state.activos), idsDelete)
                });
            else
                return state;
        case DELETE_UPDATE_FACEPHOTO:
            let datoFacePhotoDeleteUpdate = action.facePhoto;
            let idsDeleteUpdate = [];
            Object.values(action.facePhoto).map((facePhotoDelete) => {
                if (facePhotoDelete && facePhotoDelete.id)
                    idsDeleteUpdate.push(facePhotoDelete.id);
            });
            if (idsDeleteUpdate.length > 0)
                return Object.assign({}, state, {
                    activo: omit(clone(state.activo), Object.keys(datoFacePhotoDeleteUpdate)),
                    activos: difference(clone(state.activos), idsDeleteUpdate)
                });
            else
                return state;
        case SUCCESS_DELETE_FACEPHOTO:
            let datoFacePhotoDeleted = {};
            if (Object.values(action.facePhoto.entities.facePhotos).length > 0)
                datoFacePhotoDeleted = Object.values(action.facePhoto.entities.facePhotos)[0];
            return Object.assign({}, state, {
                isUpdating: false,
                lastUpdated: action.receivedAt,
                error: null,
                activo: datoFacePhotoDeleted
            });
        default:
            return state
    }
}

function create(state = {
    isCreating: false,
    nuevo: {},
    nuevos: [],
    error: ""
}, action) {
    switch (action.type) {
        case CREATE_FACEPHOTO:
            let idsCreate = [];
            Object.values(action.facePhoto).map((facePhotoCreate) => {
                if (facePhotoCreate && facePhotoCreate.id)
                    idsCreate.push(facePhotoCreate.id);
            });
            return merge({}, state, {
                isCreating: false,
                nuevo: action.facePhoto,
                nuevos: idsCreate.length > 0 ? union(state.nuevos, idsCreate) : state.nuevos,
                error: null,
            });
        case REQUEST_CREATE_FACEPHOTO:
            return Object.assign({}, state, {
                isCreating: true,
                error: null,
            });
        case SUCCESS_CREATE_FACEPHOTO:
            let datoFacePhotoNuevo = {};
            if (Object.values(action.facePhoto.entities.facePhotos).length > 0)
                datoFacePhotoNuevo = Object.values(action.facePhoto.entities.facePhotos)[0];
            return Object.assign({}, state, {
                isCreating: false,
                lastUpdated: action.receivedAt,
                error: null,
                nuevo: datoFacePhotoNuevo,
                nuevos: []
            });
        case ERROR_CREATE_FACEPHOTO:
            return Object.assign({}, state, {
                isCreating: false,
                error: action.error
            });
        case REQUEST_CREATE_FACEPHOTOS:
            return Object.assign({}, state, {
                isCreating: true,
                error: null
            });
        case SUCCESS_CREATE_FACEPHOTOS:
            return Object.assign({}, state, {
                isCreating: false,
                lastUpdated: action.receivedAt,
                error: null,
                nuevo: {},
                nuevos: []
            });
        case ERROR_CREATE_FACEPHOTOS:
            return Object.assign({}, state, {
                isCreating: false,
                error: action.error
            });
        case RESET_CREATE_FACEPHOTO:
            return Object.assign({}, state, {
                isCreating: false,
                error: null,
                nuevo: {},
                nuevos: []
            });



        //USER
        case SUCCESS_CREATE_USER:
            return Object.assign({}, state, {
                nuevo: {},
                nuevos: []
            });
        case SUCCESS_UPDATE_USER:
            return Object.assign({}, state, {
                nuevo: {},
                nuevos: []
            });
        case SUCCESS_DELETE_USER:
            return Object.assign({}, state, {
                nuevo: {},
                nuevos: []
            });
        case SUCCESS_UPDATE_USERS:
            return Object.assign({}, state, {
                nuevo: {},
                nuevos: []
            });
        case DELETE_FACEPHOTO:
            let datoFacePhotoDelete = action.facePhoto;
            let idsDelete = [];
            Object.values(action.facePhoto).map((facePhotoDelete) => {
                if (facePhotoDelete && facePhotoDelete.id)
                    idsDelete.push(facePhotoDelete.id);
            });
            if (idsDelete.length > 0)
                return Object.assign({}, state, {
                    nuevo: omit(clone(state.nuevo), Object.keys(datoFacePhotoDelete)),
                    nuevos: difference(clone(state.nuevos), idsDelete)
                });
            else
                return state;
        case DELETE_CREATE_FACEPHOTO:
            let datoFacePhotoDeleteCreate = action.facePhoto;
            let idsDeleteCreate = [];
            Object.values(action.facePhoto).map((facePhotoDelete) => {
                if (facePhotoDelete && facePhotoDelete.id)
                    idsDeleteCreate.push(facePhotoDelete.id);
            });
            if (idsDeleteCreate.length > 0)
                return Object.assign({}, state, {
                    nuevo: omit(clone(state.nuevo), Object.keys(datoFacePhotoDeleteCreate)),
                    nuevos: difference(clone(state.nuevos), idsDeleteCreate)
                });
            else
                return state;
        default:
            return state
    }
}

function deleter(state = {
    isDeleting: false,
    eliminado: {},
    error: ""
}, action) {
    switch (action.type) {
        case DELETE_FACEPHOTO:
            return merge({}, state, {
                isDeleting: false,
                eliminado: action.facePhoto,
                error: null,
            });
        case REQUEST_DELETE_FACEPHOTO:
            return Object.assign({}, state, {
                isDeleting: true,
                error: null,
            });
        case SUCCESS_DELETE_FACEPHOTO:
            return Object.assign({}, state, {
                isDeleting: false,
                error: null,
            });
        case ERROR_DELETE_FACEPHOTO:
            return Object.assign({}, state, {
                isDeleting: false,
                error: action.error
            });
        case RESET_DELETE_FACEPHOTO:
            return Object.assign({}, state, {
                isDeleting: false,
                error: null,
                eliminado: {}
            });
        //USER
        case SUCCESS_CREATE_USER:
            return Object.assign({}, state, {
                eliminado: {},
            });
        case SUCCESS_UPDATE_USER:
            return Object.assign({}, state, {
                eliminado: {},
            });
        case SUCCESS_DELETE_USER:
            return Object.assign({}, state, {
                eliminado: {},
            });
        case SUCCESS_UPDATE_USERS:
            return Object.assign({}, state, {
                eliminado: {},
            });
        default:
            return state
    }
}

function print(state = {
    isPrinting: false,
    error: ""
}, action) {
    switch (action.type) {
        case REQUEST_PRINT_FACEPHOTO:
            return Object.assign({}, state, {
                isPrinting: true,
                error: null,
            });
        case SUCCESS_PRINT_FACEPHOTO:
            return Object.assign({}, state, {
                isPrinting: false,
                lastUpdated: action.receivedAt,
                error: null,
            });
        case ERROR_PRINT_FACEPHOTO:
            return Object.assign({}, state, {
                isPrinting: false,
                error: action.error
            });
        default:
            return state
    }
}

const facePhotos = combineReducers({
    byId: facePhotosById,
    allIds: allFacePhotos,
    update: update,
    create: create,
    totalFacePhotos: totalFacePhotos,
    delete: deleter,
    print: print
});

export default facePhotos;
