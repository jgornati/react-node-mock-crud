import {
    INVALIDATE_USERS,
    ERROR_USERS,
    RECEIVE_USERS,
    REQUEST_USERS,
    RESET_USERS,
    ERROR_USER,
    RECEIVE_USER,
    REQUEST_USER,
    UPDATE_USER,
    REQUEST_UPDATE_USER,
    SUCCESS_UPDATE_USER,
    ERROR_UPDATE_USER,
    RESET_UPDATE_USER,
    REQUEST_UPDATE_USERS,
    SUCCESS_UPDATE_USERS,
    ERROR_UPDATE_USERS,
    RESET_UPDATE_USERS,
    CREATE_USER,
    ERROR_CREATE_USER,
    REQUEST_CREATE_USER,
    RESET_CREATE_USER,
    SUCCESS_CREATE_USER,
    REQUEST_CREATE_USERS,
    SUCCESS_CREATE_USERS,
    ERROR_CREATE_USERS,
    RESET_CREATE_USERS,
    DELETE_USER,
    DELETE_CREATE_USER,
    DELETE_UPDATE_USER,
    REQUEST_DELETE_USER,
    SUCCESS_DELETE_USER,
    ERROR_DELETE_USER,
    RESET_DELETE_USER,
    REQUEST_PRINT_USER,
    SUCCESS_PRINT_USER,
    ERROR_PRINT_USER,
    RESET_PRINT_USER,
    RECEIVE_FILE_USER
} from '../actions/UserActions';

import {
    CREATE_FACEPHOTO,
    UPDATE_FACEPHOTO,
    DELETE_FACEPHOTO
} from '../actions/FacePhotoActions';

import {combineReducers} from 'redux';

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
        users: {},
        files: {},
    }
}

function usersById(state = getInitialStateById(), action) {
    switch (action.type) {
        case INVALIDATE_USERS:
            return Object.assign({}, state, {
                didInvalidate: true
            });
        case REQUEST_USERS:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            });
        case ERROR_USERS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                error: action.error
            });
        case RESET_USERS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                error: null,
                lastUpdated: null,
                users: {}
            });
        case RECEIVE_USERS:
            let dato = action.users.entities.users;
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                users: merge({}, state.users, dato),
                lastUpdated: action.receivedAt
            });
        case REQUEST_USER:
            return Object.assign({}, state, {
                isFetching: true,
            });
        case ERROR_USER:
            return Object.assign({}, state, {
                isFetching: false,
                error: action.error
            });
        case RECEIVE_USER:
            let datoUser = action.user.entities.users;
            return Object.assign({}, state, {
                users: merge({}, state.users, datoUser),
                isFetching: false,
            });
        case RECEIVE_FILE_USER:
            return Object.assign({}, state, {
                files: merge({}, state.files, action.file),
            });

        case SUCCESS_DELETE_USER:
            let datoUserEliminado = action.user.entities.users;
            return Object.assign({}, state, {
                users: mergeWith(clone(datoUserEliminado), state.users, (objValue, srcValue) => {
                    return objValue;
                })
            });
        case SUCCESS_CREATE_USER:
            let datoUserCreado = action.user.entities.users;
            return Object.assign({}, state, {
                users: mergeWith(clone(datoUserCreado), state.users, (objValue, srcValue) => {
                    return objValue;
                })
            });
        case SUCCESS_CREATE_USERS:
            let datosUserCreado = action.users.entities.users;
            return Object.assign({}, state, {
                users: mergeWith(clone(datosUserCreado), state.users, (objValue, srcValue) => {
                    return objValue;
                })
            });
        case SUCCESS_UPDATE_USER:
            let datoUserActualizado = action.user.entities.users;
            return Object.assign({}, state, {
                users: mergeWith(clone(datoUserActualizado), state.users, (objValue, srcValue) => {
                    return objValue;
                })
            });
        case SUCCESS_UPDATE_USERS:
            let datosUserActualizado = action.users.entities.users;
            return Object.assign({}, state, {
                users: mergeWith(clone(datosUserActualizado), state.users, (objValue, srcValue) => {
                    return objValue;
                })
            });
        default:
            return state
    }
}


function allUsers(state = [], action) {
    switch (action.type) {
        case RECEIVE_USERS:
            return action.users.result && action.users.result.users ? union(state, action.users.result.users) : (action.users.result ? action.users.result : state);
        case RECEIVE_USER:
            return action.user.result ? union(state, [action.user.result]) : state;

        case SUCCESS_CREATE_USER:
            let datoUserSCreate = action.user.entities.users;
            let idNuevoSCreate = null;
            if (Object.values(datoUserSCreate).length > 0)
                idNuevoSCreate = Object.values(datoUserSCreate)[0] && Object.values(datoUserSCreate)[0].id ? Object.values(datoUserSCreate)[0].id : null;
            if (idNuevoSCreate)
                return union(state, [idNuevoSCreate]);
            else
                return state;
        case SUCCESS_CREATE_USERS:
            let usersCreate = action.users.entities && action.users.entities.users ? action.users.entities.users : null;
            return usersCreate ?
                union(state, Object.values(usersCreate).map((users) => {
                    return users.id
                })) : state;
        case RESET_USERS:
            return [];
        default:
            return state
    }
}

function totalUsers(state = null, action) {
    switch (action.type) {
        case RECEIVE_USERS:
            return action.users && action.users.result.total ? action.users.result.total : 0;
        case RESET_USERS:
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
        case RECEIVE_USER:
            let dato = action.user.entities.users;
            let user = dato && Object.keys(dato).length > 0 ? dato[Object.keys(dato)[0]] : {};
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                activo: user ? user : [],
                lastUpdated: action.receivedAt
            });
        case UPDATE_USER:
            let idsUpdate = [];
            Object.values(action.user).map((userUpdate) => {
                if (userUpdate && userUpdate.id)
                    idsUpdate.push(userUpdate.id);
            });
            return merge({}, state, {
                activo: action.user,
                activos: idsUpdate.length > 0 ? union(state.activos, idsUpdate) : state.activos,
                error: ""
            });
        case REQUEST_UPDATE_USER:
            return Object.assign({}, state, {
                isUpdating: true,
                error: null
            });
        case SUCCESS_UPDATE_USER:
            let datoUserActualizado = {};
            if (Object.values(action.user.entities.users).length > 0)
                datoUserActualizado = Object.values(action.user.entities.users)[0];
            return Object.assign({}, state, {
                isUpdating: false,
                lastUpdated: action.receivedAt,
                error: null,
                activo: datoUserActualizado
            });
        case ERROR_UPDATE_USER:
            return Object.assign({}, state, {
                isUpdating: false,
                error: action.error
            });
        case REQUEST_UPDATE_USERS:
            return Object.assign({}, state, {
                isUpdating: true,
                error: null
            });
        case SUCCESS_UPDATE_USERS:
            return Object.assign({}, state, {
                isUpdating: false,
                lastUpdated: action.receivedAt,
                error: null,
                activo: {},
                activos: []
            });
        case ERROR_UPDATE_USERS:
            return Object.assign({}, state, {
                isUpdating: false,
                error: action.error
            });
        case RESET_UPDATE_USER:
            return Object.assign({}, state, {
                isUpdating: false,
                activo: {},
                activos: [],
                error: ""
            });
        case CREATE_FACEPHOTO:
            let userfacePhotoCreateActivo = clone(state.activo);
            let userfacePhotoCreateActivos = clone(state.activos);
            Object.values(action.facePhoto).map((facePhotoCreate) => {
                if (facePhotoCreate && facePhotoCreate.idUser && userfacePhotoCreateActivo[facePhotoCreate.idUser]) {
                    if (facePhotoCreate.idUser.toString().indexOf("-") === -1)
                        userfacePhotoCreateActivo[facePhotoCreate.idUser].face_photo = union(userfacePhotoCreateActivo.face_photo, [facePhotoCreate.id]);
                } else if (facePhotoCreate) {
                    userfacePhotoCreateActivo.face_photo = union(userfacePhotoCreateActivo.face_photo ? userfacePhotoCreateActivo.face_photo : [], [facePhotoCreate.id]);
                }
                if (facePhotoCreate && facePhotoCreate.idUser && facePhotoCreate.idUser.toString().indexOf("-") === -1)
                    userfacePhotoCreateActivos = union(userfacePhotoCreateActivos, [facePhotoCreate.idUser]);
            });
            return Object.assign({}, state, {
                activo: userfacePhotoCreateActivo,
                activos: userfacePhotoCreateActivos
            });
        case UPDATE_FACEPHOTO:
            let userfacePhotoUpdateActivo = clone(state.activo);
            let userfacePhotoUpdateActivos = clone(state.activos);
            Object.values(action.facePhoto).map((facePhotoUpdate) => {
                if (facePhotoUpdate && facePhotoUpdate.idUser && userfacePhotoUpdateActivo[facePhotoUpdate.idUser]) {
                    if (facePhotoUpdate.idUser.toString().indexOf("-") === -1)
                        userfacePhotoUpdateActivo[facePhotoUpdate.idUser].face_photo = union(userfacePhotoUpdateActivo.face_photo, [facePhotoUpdate.id]);
                } else if (facePhotoUpdate) {
                    userfacePhotoUpdateActivo.face_photo = union(userfacePhotoUpdateActivo.face_photo ? userfacePhotoUpdateActivo.face_photo : [], [facePhotoUpdate.id]);
                }
                if (facePhotoUpdate && facePhotoUpdate.idUser && facePhotoUpdate.idUser.toString().indexOf("-") === -1)
                    userfacePhotoUpdateActivos = union(userfacePhotoUpdateActivos, [facePhotoUpdate.idUser]);
            });
            return Object.assign({}, state, {
                activo: userfacePhotoUpdateActivo,
                activos: userfacePhotoUpdateActivos
            });
        case DELETE_FACEPHOTO:
            let userfacePhotoDeleteActivo = clone(state.activo);
            let userfacePhotoDeleteActivos = clone(state.activos);
            Object.values(action.facePhoto).map((facePhotoDelete) => {
                if (facePhotoDelete && facePhotoDelete.idUser && userfacePhotoDeleteActivo[facePhotoDelete.idUser]) {
                    if (facePhotoDelete.idUser.toString().indexOf("-") === -1)
                        userfacePhotoDeleteActivo[facePhotoDelete.idUser].face_photo = difference(userfacePhotoDeleteActivo.face_photo, [facePhotoDelete.id]);
                } else if (facePhotoDelete) {
                    userfacePhotoDeleteActivo.face_photo = difference(userfacePhotoDeleteActivo.face_photo ? userfacePhotoDeleteActivo.face_photo : [], [facePhotoDelete.id]);
                }
                if (facePhotoDelete && facePhotoDelete.idUser && facePhotoDelete.idUser.toString().indexOf("-") === -1)
                    userfacePhotoDeleteActivos = union(userfacePhotoDeleteActivos, [facePhotoDelete.idUser]);
            });
            return Object.assign({}, state, {
                activo: userfacePhotoDeleteActivo,
                activos: userfacePhotoDeleteActivos
            });

        case DELETE_USER:
            let datoUserDelete = action.user;
            let idsDelete = [];
            Object.values(action.user).map((userDelete) => {
                if (userDelete && userDelete.id)
                    idsDelete.push(userDelete.id);
            });
            if (idsDelete.length > 0)
                return Object.assign({}, state, {
                    activo: omit(clone(state.activo), Object.keys(datoUserDelete)),
                    activos: difference(clone(state.activos), idsDelete)
                });
            else
                return state;
        case DELETE_UPDATE_USER:
            let datoUserDeleteUpdate = action.user;
            let idsDeleteUpdate = [];
            Object.values(action.user).map((userDelete) => {
                if (userDelete && userDelete.id)
                    idsDeleteUpdate.push(userDelete.id);
            });
            if (idsDeleteUpdate.length > 0)
                return Object.assign({}, state, {
                    activo: omit(clone(state.activo), Object.keys(datoUserDeleteUpdate)),
                    activos: difference(clone(state.activos), idsDeleteUpdate)
                });
            else
                return state;
        case SUCCESS_DELETE_USER:
            let datoUserDeleted = {};
            if (Object.values(action.user.entities.users).length > 0)
                datoUserDeleted = Object.values(action.user.entities.users)[0];
            return Object.assign({}, state, {
                isUpdating: false,
                lastUpdated: action.receivedAt,
                error: null,
                activo: datoUserDeleted
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
        case CREATE_USER:
            let idsCreate = [];
            Object.values(action.user).map((userCreate) => {
                if (userCreate && userCreate.id)
                    idsCreate.push(userCreate.id);
            });
            return merge({}, state, {
                isCreating: false,
                nuevo: action.user,
                nuevos: idsCreate.length > 0 ? union(state.nuevos, idsCreate) : state.nuevos,
                error: null,
            });
        case REQUEST_CREATE_USER:
            return Object.assign({}, state, {
                isCreating: true,
                error: null,
            });
        case SUCCESS_CREATE_USER:
            let datoUserNuevo = {};
            if (Object.values(action.user.entities.users).length > 0)
                datoUserNuevo = Object.values(action.user.entities.users)[0];
            return Object.assign({}, state, {
                isCreating: false,
                lastUpdated: action.receivedAt,
                error: null,
                nuevo: datoUserNuevo,
                nuevos: []
            });
        case ERROR_CREATE_USER:
            return Object.assign({}, state, {
                isCreating: false,
                error: action.error
            });
        case REQUEST_CREATE_USERS:
            return Object.assign({}, state, {
                isCreating: true,
                error: null
            });
        case SUCCESS_CREATE_USERS:
            return Object.assign({}, state, {
                isCreating: false,
                lastUpdated: action.receivedAt,
                error: null,
                nuevo: {},
                nuevos: []
            });
        case ERROR_CREATE_USERS:
            return Object.assign({}, state, {
                isCreating: false,
                error: action.error
            });
        case RESET_CREATE_USER:
            return Object.assign({}, state, {
                isCreating: false,
                error: null,
                nuevo: {},
                nuevos: []
            });
            //CREATE FACEPHOTO
        case CREATE_FACEPHOTO:
            let userfacePhotoCreateActivo = clone(state.nuevo);
            Object.values(action.facePhoto).map((facePhotoCreate) => {
                if (facePhotoCreate && facePhotoCreate.idUser && userfacePhotoCreateActivo[facePhotoCreate.idUser]) {
                    if (facePhotoCreate.idUser.toString().indexOf("-") !== -1)
                        userfacePhotoCreateActivo[facePhotoCreate.idUser].face_photo = union(userfacePhotoCreateActivo.face_photo, [facePhotoCreate.id]);
                } else if (facePhotoCreate) {
                    userfacePhotoCreateActivo.face_photo = union(userfacePhotoCreateActivo.face_photo ? userfacePhotoCreateActivo.face_photo : [], [facePhotoCreate.id]);
                }
            });
            return Object.assign({}, state, {
                nuevo: userfacePhotoCreateActivo,
                //nuevos: facePhotoCreate && facePhotoCreate.idUser ? union(state.nuevos, [facePhotoCreate.idUser]) : state.nuevos,
            });
        case UPDATE_FACEPHOTO:
            let userfacePhotoUpdateActivo = clone(state.nuevo);
            Object.values(action.facePhoto).map((facePhotoUpdate) => {
                if (facePhotoUpdate && facePhotoUpdate.idUser && userfacePhotoUpdateActivo[facePhotoUpdate.idUser]) {
                    if (facePhotoUpdate.idUser.toString().indexOf("-") !== -1)
                        userfacePhotoUpdateActivo[facePhotoUpdate.idUser].face_photo = union(userfacePhotoUpdateActivo.face_photo, [facePhotoUpdate.id]);
                } else if (facePhotoUpdate) {
                    userfacePhotoUpdateActivo.face_photo = union(userfacePhotoUpdateActivo.face_photo ? userfacePhotoUpdateActivo.face_photo : [], [facePhotoUpdate.id]);
                }
            });
            return Object.assign({}, state, {
                nuevo: userfacePhotoUpdateActivo,
                //nuevos: facePhotoUpdate && facePhotoUpdate.idUser ? union(state.nuevos, [facePhotoUpdate.idUser]) : state.nuevos,
            });
        case DELETE_FACEPHOTO:
            let userfacePhotoDeleteActivo = clone(state.nuevo);
            Object.values(action.facePhoto).map((facePhotoDelete) => {
                if (facePhotoDelete && facePhotoDelete.idUser && facePhotoDelete.idUser && userfacePhotoDeleteActivo[facePhotoDelete.idUser]) {
                    if (facePhotoDelete.idUser.toString().indexOf("-") !== -1)
                        userfacePhotoDeleteActivo[facePhotoDelete.idUser].face_photo = difference(userfacePhotoDeleteActivo.face_photo, [facePhotoDelete.id]);
                } else if (facePhotoDelete) {
                    userfacePhotoDeleteActivo.face_photo = difference(userfacePhotoDeleteActivo.face_photo ? userfacePhotoDeleteActivo.face_photo : [], [facePhotoDelete.id]);
                }
            });
            return Object.assign({}, state, {
                nuevo: userfacePhotoDeleteActivo,
                //nuevos: facePhotoDelete && facePhotoDelete.idUser ? union(state.nuevos, [facePhotoDelete.idUser]) : state.nuevos,
            });

        case DELETE_USER:
            let datoUserDelete = action.user;
            let idsDelete = [];
            Object.values(action.user).map((userDelete) => {
                if (userDelete && userDelete.id)
                    idsDelete.push(userDelete.id);
            });
            if (idsDelete.length > 0)
                return Object.assign({}, state, {
                    nuevo: omit(clone(state.nuevo), Object.keys(datoUserDelete)),
                    nuevos: difference(clone(state.nuevos), idsDelete)
                });
            else
                return state;
        case DELETE_CREATE_USER:
            let datoUserDeleteCreate = action.user;
            let idsDeleteCreate = [];
            Object.values(action.user).map((userDelete) => {
                if (userDelete && userDelete.id)
                    idsDeleteCreate.push(userDelete.id);
            });
            if (idsDeleteCreate.length > 0)
                return Object.assign({}, state, {
                    nuevo: omit(clone(state.nuevo), Object.keys(datoUserDeleteCreate)),
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
        case DELETE_USER:
            return merge({}, state, {
                isDeleting: false,
                eliminado: action.user,
                error: null,
            });
        case REQUEST_DELETE_USER:
            return Object.assign({}, state, {
                isDeleting: true,
                error: null,
            });
        case SUCCESS_DELETE_USER:
            return Object.assign({}, state, {
                isDeleting: false,
                error: null,
            });
        case ERROR_DELETE_USER:
            return Object.assign({}, state, {
                isDeleting: false,
                error: action.error
            });
        case RESET_DELETE_USER:
            return Object.assign({}, state, {
                isDeleting: false,
                error: null,
                eliminado: {}
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
        case REQUEST_PRINT_USER:
            return Object.assign({}, state, {
                isPrinting: true,
                error: null,
            });
        case SUCCESS_PRINT_USER:
            return Object.assign({}, state, {
                isPrinting: false,
                lastUpdated: action.receivedAt,
                error: null,
            });
        case ERROR_PRINT_USER:
            return Object.assign({}, state, {
                isPrinting: false,
                error: action.error
            });
        default:
            return state
    }
}

const users = combineReducers({
    byId: usersById,
    allIds: allUsers,
    update: update,
    create: create,
    totalUsers: totalUsers,
    delete: deleter,
    print: print
});

export default users;