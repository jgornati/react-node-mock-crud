//api
import usersApi from "../api/usersApi"
//constants
import * as errorMessages from '../constants/MessageConstants';
//normalizers
import { normalizeDatos, normalizeDato, denormalizeDato } from "../normalizers/normalizeUsers";
//lodash
import merge from "lodash/merge";
//utils
import authUtil from "../utils/auth";

//USERS
export const REQUEST_USERS = 'REQUEST_USERS';
export const RECEIVE_USERS = 'RECEIVE_USERS';
export const INVALIDATE_USERS = 'INVALIDATE_USERS';
export const ERROR_USERS = "ERROR_USERS";
export const RESET_USERS = "RESET_USERS";


export function invalidateUsers() {
    return {
        type: INVALIDATE_USERS
    }
}

function requestUsers() {
    return {
        type: REQUEST_USERS,
    }
}

function receiveUsers(json) {
    return {
        type: RECEIVE_USERS,
        users: normalizeDatos(json),
        receivedAt: Date.now()
    }
}

function errorUsers(error) {
    return {
        type: ERROR_USERS,
        error: error,
    }
}

export function resetUsers() {
    return {
        type: RESET_USERS
    }
}

export function fetchUsers(filtros) {
    return dispatch => {
        dispatch(requestUsers());
        return usersApi.getAll(filtros)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    var data = response.json();
                    return data;
                }
            })
            .then(function (data) {
                console.log(data)
                dispatch(receiveUsers(data));
            })
            .catch(function (error) {
                console.log(error);
                switch (error.status) {
                    case 401:
                        dispatch(errorUsers(errorMessages.UNAUTHORIZED_TOKEN));
                        return;
                    default:
                        dispatch(errorUsers(errorMessages.GENERAL_ERROR));
                        return;
                }
            });
    }
}

function shouldFetchUsers(state) {
    const users = state.users.byId;
    if (!users) {
        return true
    } else if (users.isFetching) {
        return false
    } else {
        return users.didInvalidate;
    }
}

export function fetchUsersIfNeeded(filtros) {
    return (dispatch, getState) => {
        if (shouldFetchUsers(getState())) {
            return dispatch(fetchUsers(filtros))
        }
    }
}


//MODEL
export const REQUEST_USER = 'REQUEST_USER';
export const RECEIVE_USER = 'RECEIVE_USER';
export const INVALIDATE_USER = 'INVALIDATE_USER';
export const ERROR_USER = "ERROR_USER";
export const RESET_USER = "RESET_USER";


export function invalidateUser() {
    return {
        type: INVALIDATE_USER
    }
}

function requestUser() {
    return {
        type: REQUEST_USER,
    }
}

export function receiveUser(json) {
    return {
        type: RECEIVE_USER,
        user: normalizeDato(json),
        receivedAt: Date.now()
    }
}

function errorUser(error) {
    return {
        type: ERROR_USER,
        error: error,
    }
}

export function fetchUser(idUser) {
    return dispatch => {
        dispatch(requestUser());
        return usersApi.getOne(idUser)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    var data = response.json();
                    //Refresco token
                    //auth.addToken(response.headers);
                    return data;
                }
            })
            .then(function (data) {
                dispatch(receiveUser(data));
            })
            .catch(function (error) {
                console.log(error)
                switch (error.status) {
                    case 401:
                        dispatch(errorUser(errorMessages.UNAUTHORIZED_TOKEN));
                        return;
                    default:
                        dispatch(errorUser(errorMessages.GENERAL_ERROR));
                        return;
                }
            });
    }
}

//FILE
export const RECEIVE_FILE_USER = 'RECEIVE_FILE_USER';

function receiveFileUser(file) {
    return {
        type: RECEIVE_FILE_USER,
        file: file,
        receivedAt: Date.now()
    }
}

export function fetchFileUser(idUser, filtros) {
    let nombreArchivo = "";
    let tipoArchivo = "";
    return dispatch => {
        return usersApi.getFile(idUser, filtros)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    response.headers.forEach(function (val, key) {
                        if (key === "content-disposition") {
                            // nombreArchivo = val.replace("attachment; filename=", "");}
                            var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                            var matches = filenameRegex.exec(val);
                            if (matches != null && matches[1]) {
                                nombreArchivo = matches[1].replace(/['"]/g, '');
                            }
                        }
                        if (key === "content-type") {
                            tipoArchivo = val;
                        }
                    });
                    var data = response.blob();
                    return data;
                }
            })
            .then(function (data) {
                let file = new File([data], nombreArchivo, {type: tipoArchivo});
                let fileObj = {};
                fileObj[nombreArchivo] = file;
                dispatch(receiveFileUser(fileObj));
            })
            .catch(function (error) {
                console.log(error);
                switch (error.status) {
                    case 401:
                        dispatch(errorUser(errorMessages.UNAUTHORIZED_TOKEN));
                        return;
                    default:
                        dispatch(errorUser(errorMessages.GENERAL_ERROR));
                        return;
                }
            });
    }
}


//UPDATE MODEL
export const UPDATE_USER = 'UPDATE_USER';
export const REQUEST_UPDATE_USER = "REQUEST_UPDATE_USER";
export const SUCCESS_UPDATE_USER = "SUCCESS_UPDATE_USER";
export const ERROR_UPDATE_USER = "ERROR_UPDATE_USER";
export const RESET_UPDATE_USER = "RESET_UPDATE_USER";
export const DELETE_UPDATE_USER = "DELETE_UPDATE_USER";

function requestUpdateUser() {
    return {
        type: REQUEST_UPDATE_USER,
    }
}

function receiveUpdateUser(user) {
    return {
        type: SUCCESS_UPDATE_USER,
        receivedAt: Date.now(),
        user: normalizeDato(user)
    }
}

function errorUpdateUser(error) {
    return {
        type: ERROR_UPDATE_USER,
        error: error,
    }
}

export function resetUpdateUser() {
    return {
        type: RESET_UPDATE_USER,
    }
}

export function updateUser(user) {
    return {
        type: UPDATE_USER,
        user
    }
}

export function saveUpdateUser(files) {
    return (dispatch, getState) => {
        dispatch(requestUpdateUser());

        let store = {};
        Object.keys(getState()).forEach(
            (key) => {
                if (getState()[key].byId)
                    store[key] = merge({}, getState()[key].byId[key], getState()[key].update.activo, getState()[key].create.nuevo);
            });

        let user = denormalizeDato(getState().users.update.activo, store);

        return usersApi.saveUpdate(user, files)
            .then(function (data, textStatus, response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    //Refresco token
                    authUtil.addToken(response);
                    dispatch(receiveUpdateUser(data));
                }
            })
            .catch(function (error) {
                console.log(error, error.status);
                switch (error.status) {
                    case 401:
                        dispatch(errorUpdateUser(errorMessages.UNAUTHORIZED_TOKEN));

                        return;
                    default:
                        try {
                            if (error.responseJSON && error.responseJSON.message !== "")
                                try {
                                    dispatch(errorUpdateUsers(JSON.parse(error.responseJSON.message)));
                                } catch (e) {
                                    dispatch(errorUpdateUsers(error.responseJSON.message));
                                }
                            else
                                error.json().then((error) => {
                                    dispatch(errorUpdateUser(JSON.parse(error.message)));
                                    if (error.data && error.data.length > 0)
                                        dispatch(receiveUpdateUser(error.data));
                                }).catch(() => {
                                    dispatch(errorUpdateUser(errorMessages.GENERAL_ERROR));
                                });
                            return;
                        } catch {
                            dispatch(errorUpdateUser(errorMessages.GENERAL_ERROR));
                        }
                        ;
                }
            });
    }
}

export function deleteUpdateUser(user) {
    return {
        type: DELETE_UPDATE_USER,
        user
    }
}

//UPDATE USERS
export const REQUEST_UPDATE_USERS = "REQUEST_UPDATE_USERS";
export const SUCCESS_UPDATE_USERS = "SUCCESS_UPDATE_USERS";
export const ERROR_UPDATE_USERS = "ERROR_UPDATE_USERS";
export const RESET_UPDATE_USERS = "RESET_UPDATE_USERS";

function requestUpdateUsers() {
    return {
        type: REQUEST_UPDATE_USERS,
    }
}

function receiveUpdateUsers(users) {
    return {
        type: SUCCESS_UPDATE_USERS,
        receivedAt: Date.now(),
        users: normalizeDatos(users)
    }
}

function errorUpdateUsers(error) {
    return {
        type: ERROR_UPDATE_USERS,
        error: error,
    }
}

export function resetUpdateUsers() {
    return {
        type: RESET_UPDATE_USERS,
    }
}

export function saveUpdateUsers() {
    return (dispatch, getState) => {
        dispatch(requestUpdateUsers());

        let store = {};
        Object.keys(getState()).forEach(
            (key) => {
                if (getState()[key].byId)
                    store[key] = merge({}, getState()[key].byId[key], getState()[key].update.activo, getState()[key].create.nuevo);
            });

        let users = getState().users.update.activos.map((idUser) => {
            return denormalizeDato(getState().users.update.activo[idUser], store);
        });

        return usersApi.saveUpdateUsers(users)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    //Refresco token
                    authUtil.addToken(response);
                    var data = response.json();
                    return data;
                }
            })
            .then(function (json) {
                dispatch(receiveUpdateUsers(json));
            })
            .catch(function (error) {
                console.log(error, error.status);
                switch (error.status) {
                    case 401:
                        dispatch(errorUpdateUsers(errorMessages.UNAUTHORIZED_TOKEN));
                        return;
                    default:
                        if (error.responseJSON && error.responseJSON.message !== "")
                            try {
                                dispatch(errorUpdateUsers(JSON.parse(error.responseJSON.message)));
                            } catch (e) {
                                dispatch(errorUpdateUsers(error.responseJSON.message));
                            }
                        else
                            error.json().then((error) => {
                                dispatch(errorUpdateUsers(JSON.parse(error.message)));
                            }).catch(() => {
                                dispatch(errorUpdateUsers(errorMessages.GENERAL_ERROR));
                            });


                        return;
                }
            });
    }
}

//ALTA USER
export const CREATE_USER = 'CREATE_USER';
export const REQUEST_CREATE_USER = "REQUEST_CREATE_USER";
export const SUCCESS_CREATE_USER = "SUCCESS_CREATE_USER";
export const ERROR_CREATE_USER = "ERROR_CREATE_USER";
export const RESET_CREATE_USER = "RESET_CREATE_USER";
export const DELETE_CREATE_USER = "DELETE_CREATE_USER";


//ALTA USER
function requestCreateUser() {
    return {
        type: REQUEST_CREATE_USER,
    }
}

function receiveCreateUser(user) {
    return {
        type: SUCCESS_CREATE_USER,
        receivedAt: Date.now(),
        user: normalizeDato(user)
    }
}

export function errorCreateUser(error) {
    return {
        type: ERROR_CREATE_USER,
        error: error,
    }
}

export function resetCreateUser() {
    return {
        type: RESET_CREATE_USER
    }
}

export function createUser(user) {
    return {
        type: CREATE_USER,
        user
    }
}

export function deleteCreateUser(user) {
    return {
        type: DELETE_CREATE_USER,
        user
    }
}

export function saveCreateUser(files) {
    return (dispatch, getState) => {
        dispatch(requestCreateUser());
        let store = {};
        Object.keys(getState()).forEach(
            (key) => {
                if (getState()[key].byId)
                    store[key] = merge({}, getState()[key].byId[key], getState()[key].update.activo, getState()[key].create.nuevo);
            });

        let user = denormalizeDato(getState().users.create.nuevo, store);

        return usersApi.saveCreate(user, files)
            .then(function (data, textStatus, response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    //Refresco token
                    authUtil.addToken(response);
                    dispatch(receiveCreateUser(data));
                }
            })
            .catch(function (error) {
                console.log(error, error.status);
                switch (error.status) {
                    case 401:
                        dispatch(errorCreateUser(errorMessages.UNAUTHORIZED_TOKEN));

                        return;
                    default:
                        try {
                            if (error.responseJSON && error.responseJSON.message !== "")
                                try {
                                    dispatch(errorCreateUsers(JSON.parse(error.responseJSON.message)));
                                } catch (e) {
                                    dispatch(errorCreateUsers(error.responseJSON.message));
                                }
                            else
                                error.json().then((error) => {
                                    dispatch(errorCreateUser(JSON.parse(error.message)));
                                    if (error.data)
                                        dispatch(receiveCreateUser(error.data));
                                }).catch(() => {
                                    dispatch(errorCreateUser(errorMessages.GENERAL_ERROR));
                                });
                            return;
                        } catch {
                            dispatch(errorCreateUser(errorMessages.GENERAL_ERROR));
                        }
                        ;
                }
            });
    }
}

//CREATE USERS
export const REQUEST_CREATE_USERS = "REQUEST_CREATE_USERS";
export const SUCCESS_CREATE_USERS = "SUCCESS_CREATE_USERS";
export const ERROR_CREATE_USERS = "ERROR_CREATE_USERS";
export const RESET_CREATE_USERS = "RESET_CREATE_USERS";

function requestCreateUsers() {
    return {
        type: REQUEST_CREATE_USERS,
    }
}

function receiveCreateUsers(users) {
    return {
        type: SUCCESS_CREATE_USERS,
        receivedAt: Date.now(),
        users: normalizeDatos(users)
    }
}

function errorCreateUsers(error) {
    return {
        type: ERROR_CREATE_USERS,
        error: error,
    }
}

export function resetCreateUsers() {
    return {
        type: RESET_CREATE_USERS,
    }
}

export function saveCreateUsers() {
    return (dispatch, getState) => {
        dispatch(requestCreateUsers());

        let store = {};
        Object.keys(getState()).forEach(
            (key) => {
                if (getState()[key].byId)
                    store[key] = merge({}, getState()[key].byId[key], getState()[key].update.activo, getState()[key].create.nuevo);
            });

        let users = getState().users.create.nuevos.map((idUser) => {
            return denormalizeDato(getState().users.create.nuevo[idUser], store);
        });

        return usersApi.saveCreateUsers(users)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    //Refresco token
                    authUtil.addToken(response);
                    var data = response.json();
                    return data;
                }
            })
            .then(function (json) {
                dispatch(receiveCreateUsers(json));
            })
            .catch(function (error) {
                console.log(error, error.status);
                switch (error.status) {
                    case 401:
                        dispatch(errorCreateUsers(errorMessages.UNAUTHORIZED_TOKEN));

                        return;
                    default:
                        if (error.responseJSON && error.responseJSON.message !== "")
                            try {
                                dispatch(errorCreateUsers(JSON.parse(error.responseJSON.message)));
                            } catch (e) {
                                dispatch(errorCreateUsers(error.responseJSON.message));
                            }
                        else
                            error.json().then((error) => {
                                dispatch(errorCreateUsers(JSON.parse(error.message)));
                            }).catch(() => {
                                dispatch(errorCreateUsers(errorMessages.GENERAL_ERROR));
                            });


                        return;
                }
            });
    }
}

//DELETE USER
export const DELETE_USER = 'DELETE_USER';
export const REQUEST_DELETE_USER = "REQUEST_DELETE_USER";
export const SUCCESS_DELETE_USER = "SUCCESS_DELETE_USER";
export const ERROR_DELETE_USER = "ERROR_DELETE_USER";
export const RESET_DELETE_USER = "RESET_DELETE_USER";

function requestDeleteUser() {
    return {
        type: REQUEST_DELETE_USER,
    }
}

function receiveDeleteUser(user) {
    return {
        type: SUCCESS_DELETE_USER,
        receivedAt: Date.now(),
        user: normalizeDato(user)
    }
}

function errorDeleteUser(error) {
    return {
        type: ERROR_DELETE_USER,
        error: error,
    }
}

export function resetDeleteUser(error) {
    return {
        type: RESET_DELETE_USER,
        error: error,
    }
}

export function deleteUser(user) {
    return {
        type: DELETE_USER,
        user
    }
}

export function saveDeleteUser(user) {
    return dispatch => {
        dispatch(requestDeleteUser());
        return usersApi.saveDelete(user)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    var data = response.json();
                    //Refresco token
                    //auth.addToken(response.headers);
                    return data;
                }
            })
            .then(function (data) {
                dispatch(resetDeleteUser());
                dispatch(receiveDeleteUser(data));
            })
            .catch(function (error) {
                console.log(error, error.status);
                switch (error.status) {
                    case 401:
                        dispatch(errorDeleteUser(errorMessages.UNAUTHORIZED_TOKEN));

                        return;
                    default:
                        if (error.responseJSON && error.responseJSON.message !== "")
                            try {
                                dispatch(errorDeleteUser(JSON.parse(error.responseJSON.message)));
                            } catch (e) {
                                dispatch(errorDeleteUser(error.responseJSON.message));
                            }
                        else
                            error.json().then((error) => {
                                dispatch(errorDeleteUser(JSON.parse(error.message)));
                            }).catch(() => {
                                dispatch(errorDeleteUser(errorMessages.GENERAL_ERROR));
                            });
                        return;
                }
            });
    }
}

//PRINT USER
export const REQUEST_PRINT_USER = "REQUEST_PRINT_USER";
export const SUCCESS_PRINT_USER = "SUCCESS_PRINT_USER";
export const ERROR_PRINT_USER = "ERROR_PRINT_USER";
export const RESET_PRINT_USER = "RESET_PRINT_USER";

function requestPrintUser() {
    return {
        type: REQUEST_PRINT_USER,
    }
}

function receivePrintUser(turnos) {
    return {
        type: SUCCESS_PRINT_USER,
        receivedAt: Date.now(),
        turnos: normalizeDatos(turnos)
    }
}

function errorPrintUser(error) {
    return {
        type: ERROR_PRINT_USER,
        error: error,
    }
}

export function resetPrintUser() {
    return {
        type: RESET_PRINT_USER,
    }
}

export function printUser(idUser) {
    return (dispatch, getState) => {
        let nombreArchivo = "";
        let tipoArchivo = "";
        dispatch(requestPrintUser());
        return usersApi.printUser(idUser)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    response.headers.forEach(function (val, key) {
                        if (key === "content-disposition") {
                            // nombreArchivo = val.replace("attachment; filename=", "");}
                            var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                            var matches = filenameRegex.exec(val);
                            if (matches != null && matches[1]) {
                                nombreArchivo = matches[1].replace(/['"]/g, '');
                            }
                        }
                        if (key === "content-type") {
                            tipoArchivo = val;
                        }
                    });
                    var data = response.blob();
                    return data;
                }
            })
            .then(function (data) {
                console.log(nombreArchivo, tipoArchivo);
                let file = new File([data], nombreArchivo, {type: tipoArchivo});
                let reader = new FileReader();
                let a = document.createElement("a");
                document.body.appendChild(a);
                a.style = "display: none";
                reader.onloadend = function () {
                    a.href = reader.result;
                    a.download = file.name;
                    a.click();
                };
                if (file) {
                    reader.readAsDataURL(file);
                }
                dispatch(receivePrintUser(file));
            })
            .catch(function (error) {
                console.log(error, error.status);
                switch (error.status) {
                    case 401:
                        dispatch(errorPrintUser(errorMessages.UNAUTHORIZED_TOKEN));

                        return;
                    default:
                        if (error.responseJSON && error.responseJSON.message !== "")
                            dispatch(errorPrintUser(JSON.parse(error.responseJSON.message)));
                        else
                            error.json().then((error) => {
                                dispatch(errorPrintUser(JSON.parse(error.message)));
                            }).catch(() => {
                                dispatch(errorPrintUser(errorMessages.GENERAL_ERROR));
                            });
                        return;
                }
            });
    }
}
