//api
import rolesApi from "../api/rolesApi"
//constants
import * as errorMessages from '../constants/MessageConstants';
//normalizers
import {normalizeDatos, normalizeDato, denormalizeDato} from "../normalizers/normalizeRoles";
//lodash
import merge from "lodash/merge";
//utils
import authUtil from "../utils/auth";

//ROLES
export const REQUEST_ROLES = 'REQUEST_ROLES';
export const RECEIVE_ROLES = 'RECEIVE_ROLES';
export const INVALIDATE_ROLES = 'INVALIDATE_ROLES';
export const ERROR_ROLES = "ERROR_ROLES";
export const RESET_ROLES = "RESET_ROLES";


export function invalidateRoles() {
    return {
        type: INVALIDATE_ROLES
    }
}

function requestRoles() {
    return {
        type: REQUEST_ROLES,
    }
}

function receiveRoles(json) {
    return {
        type: RECEIVE_ROLES,
    roles: normalizeDatos(json),
        receivedAt: Date.now()
    }
}

function errorRoles(error) {
    return {
        type: ERROR_ROLES,
        error: error,
    }
}

export function resetRoles() {
    return {
        type: RESET_ROLES
    }
}

export function fetchRoles(filtros) {
    return dispatch => {
        dispatch(requestRoles());
        return rolesApi.getAll(filtros)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    var data = response.json();
                    return data;
                }
            })
            .then(function (data) {
                dispatch(receiveRoles(data));
            })
            .catch(function (error) {
                console.log(error);
                switch (error.status) {
                    case 401:
                        dispatch(errorRoles(errorMessages.UNAUTHORIZED_TOKEN));
                        return;
                    default:
                        dispatch(errorRoles(errorMessages.GENERAL_ERROR));
                        return;
                }
            });
    }
}

function shouldFetchRoles(state) {
    const roles = state.roles.byId;
    if (!roles) {
        return true
    } else if (roles.isFetching) {
        return false
    } else {
        return roles.didInvalidate;
    }
}

export function fetchRolesIfNeeded(filtros) {
    return (dispatch, getState) => {
        if (shouldFetchRoles(getState())) {
            return dispatch(fetchRoles(filtros))
        }
    }
}


//MODEL
export const REQUEST_ROLE = 'REQUEST_ROLE';
export const RECEIVE_ROLE = 'RECEIVE_ROLE';
export const INVALIDATE_ROLE = 'INVALIDATE_ROLE';
export const ERROR_ROLE = "ERROR_ROLE";
export const RESET_ROLE = "RESET_ROLE";


export function invalidateRole() {
    return {
        type: INVALIDATE_ROLE
    }
}

function requestRole() {
    return {
        type: REQUEST_ROLE,
    }
}

export function receiveRole(json) {
    return {
        type: RECEIVE_ROLE,
    role: normalizeDato(json),
        receivedAt: Date.now()
    }
}

function errorRole(error) {
    return {
        type: ERROR_ROLE,
        error: error,
    }
}

export function fetchRole(idRole) {
    return dispatch => {
        dispatch(requestRole());
        return rolesApi.getOne(idRole)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    var data = response.json();
                    return data;
                }
            })
            .then(function (data) {
                dispatch(receiveRole(data));
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorRole(errorMessages.UNAUTHORIZED_TOKEN));
                        return;
                    default:
                        dispatch(errorRole(errorMessages.GENERAL_ERROR));
                        return;
                }
            });
    }
}

//FILE
export const RECEIVE_FILE_ROLE = 'RECEIVE_FILE_ROLE';

function receiveFileRole(file) {
    return {
        type: RECEIVE_FILE_ROLE,
        file: file,
        receivedAt: Date.now()
    }
}

export function fetchFileRole(idRole, filtros) {
    let nombreArchivo = "";
    let tipoArchivo = "";
    return dispatch => {
        return rolesApi.getFile(idRole, filtros)
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
                dispatch(receiveFileRole(fileObj));
            })
            .catch(function (error) {
                console.log(error);
                switch (error.status) {
                    case 401:
                        dispatch(errorRole(errorMessages.UNAUTHORIZED_TOKEN));
                        return;
                    default:
                        dispatch(errorRole(errorMessages.GENERAL_ERROR));
                        return;
                }
            });
    }
}


//UPDATE MODEL
export const UPDATE_ROLE = 'UPDATE_ROLE';
export const REQUEST_UPDATE_ROLE = "REQUEST_UPDATE_ROLE";
export const SUCCESS_UPDATE_ROLE = "SUCCESS_UPDATE_ROLE";
export const ERROR_UPDATE_ROLE = "ERROR_UPDATE_ROLE";
export const RESET_UPDATE_ROLE = "RESET_UPDATE_ROLE";
export const DELETE_UPDATE_ROLE = "DELETE_UPDATE_ROLE";

function requestUpdateRole() {
    return {
        type: REQUEST_UPDATE_ROLE,
    }
}

function receiveUpdateRole(role) {
    return {
        type: SUCCESS_UPDATE_ROLE,
        receivedAt: Date.now(),
        role: normalizeDato(role)
    }
}

function errorUpdateRole(error) {
    return {
        type: ERROR_UPDATE_ROLE,
        error: error,
    }
}

export function resetUpdateRole() {
    return {
        type: RESET_UPDATE_ROLE,
    }
}

export function updateRole(role) {
    return {
        type: UPDATE_ROLE,
        role
    }
}

export function saveUpdateRole() {
    return (dispatch, getState) => {
        dispatch(requestUpdateRole());

        let store = {};
        Object.keys(getState()).forEach(
            (key) => {
                if (getState()[key].byId)
                    store[key] = merge({}, getState()[key].byId[key],getState()[key].update.activo,getState()[key].create.nuevo);
            });

        let role = denormalizeDato(getState().roles.update.activo, store);

        return rolesApi.saveUpdate(role)
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
                dispatch(receiveUpdateRole(json));
            })
            .catch(function (error) {
                            console.log(error, error.status);
                            switch (error.status) {
                                case 401:
                                    dispatch(errorUpdateRole(errorMessages.UNAUTHORIZED_TOKEN));

                                    return;
                                default:
                                if (error.responseJSON && error.responseJSON.message !== "")
                                    try
                                    {
                                        dispatch(errorUpdateRoles(JSON.parse(error.responseJSON.message)));
                                    } catch(e) {
                                        dispatch(errorUpdateRoles(error.responseJSON.message));
                                    }
                                    else
                                            error.json().then((error) => {
                                                dispatch(errorUpdateRole(JSON.parse(error.message)));
                                                if (error.data && error.data.length > 0)
                                                   dispatch(receiveUpdateRole(error.data));
                                            }).catch(() => {
                                            dispatch(errorUpdateRole(errorMessages.GENERAL_ERROR));
                                        });
                                    return;
                            }
                        });
    }
}

export function deleteUpdateRole(role) {
    return {
        type: DELETE_UPDATE_ROLE,
        role
    }
}

//UPDATE ROLES
export const REQUEST_UPDATE_ROLES = "REQUEST_UPDATE_ROLES";
export const SUCCESS_UPDATE_ROLES = "SUCCESS_UPDATE_ROLES";
export const ERROR_UPDATE_ROLES = "ERROR_UPDATE_ROLES";
export const RESET_UPDATE_ROLES = "RESET_UPDATE_ROLES";

function requestUpdateRoles() {
    return {
        type: REQUEST_UPDATE_ROLES,
}
}

function receiveUpdateRoles(roles) {
    return {
        type: SUCCESS_UPDATE_ROLES,
    receivedAt: Date.now(),
        roles: normalizeDatos(roles)
}
}

function errorUpdateRoles(error) {
    return {
        type: ERROR_UPDATE_ROLES,
    error: error,
}
}

export function resetUpdateRoles() {
    return {
        type: RESET_UPDATE_ROLES,
}
}

export function saveUpdateRoles() {
    return (dispatch, getState) => {
        dispatch(requestUpdateRoles());

        let store = {};
        Object.keys(getState()).forEach(
            (key) => {
                if (getState()[key].byId)
                    store[key] = merge({}, getState()[key].byId[key],getState()[key].update.activo,getState()[key].create.nuevo);
            });

        let roles = getState().roles.update.activos.map((idRole) => {
            return denormalizeDato(getState().roles.update.activo[idRole], store);
        });

        return rolesApi.saveUpdateRoles(roles)
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
                dispatch(receiveUpdateRoles(json));
            })
            .catch(function (error) {
                console.log(error, error.status);
                switch (error.status) {
                    case 401:
                        dispatch(errorUpdateRoles(errorMessages.UNAUTHORIZED_TOKEN));
                        return;
                    default:
                    if (error.responseJSON && error.responseJSON.message !== "")
                        try
                        {
                            dispatch(errorUpdateRoles(JSON.parse(error.responseJSON.message)));
                        } catch(e) {
                            dispatch(errorUpdateRoles(error.responseJSON.message));
                        }
                    else
                            error.json().then((error) => {
                                dispatch(errorUpdateRoles(JSON.parse(error.message)));
                            }).catch(() => {
                            dispatch(errorUpdateRoles(errorMessages.GENERAL_ERROR));
                        });


                        return;
                }
            });
    }
}

//ALTA ROLE
export const CREATE_ROLE = 'CREATE_ROLE';
export const REQUEST_CREATE_ROLE = "REQUEST_CREATE_ROLE";
export const SUCCESS_CREATE_ROLE = "SUCCESS_CREATE_ROLE";
export const ERROR_CREATE_ROLE = "ERROR_CREATE_ROLE";
export const RESET_CREATE_ROLE = "RESET_CREATE_ROLE";
export const DELETE_CREATE_ROLE = "DELETE_CREATE_ROLE";


//ALTA ROLE
function requestCreateRole() {
    return {
        type: REQUEST_CREATE_ROLE,
    }
}

function receiveCreateRole(role) {
    return {
        type: SUCCESS_CREATE_ROLE,
        receivedAt: Date.now(),
        role: normalizeDato(role)
    }
}

export function errorCreateRole(error) {
    return {
        type: ERROR_CREATE_ROLE,
        error: error,
    }
}

export function resetCreateRole() {
    return {
        type: RESET_CREATE_ROLE
    }
}

export function createRole(role) {
    return {
        type: CREATE_ROLE,
        role
    }
}

export function deleteCreateRole(role) {
    return {
        type: DELETE_CREATE_ROLE,
        role
    }
}

export function saveCreateRole() {
    return (dispatch, getState) => {
        dispatch(requestCreateRole());
        let store = {};
        Object.keys(getState()).forEach(
            (key) => {
                if (getState()[key].byId)
                    store[key] = merge({}, getState()[key].byId[key],getState()[key].update.activo,getState()[key].create.nuevo);
            });

        let role = denormalizeDato(getState().roles.create.nuevo, store);

        return rolesApi.saveCreate(role)
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
                dispatch(receiveCreateRole(json));
            })
            .catch(function (error) {
                            console.log(error, error.status);
                            switch (error.status) {
                                case 401:
                                    dispatch(errorCreateRole(errorMessages.UNAUTHORIZED_TOKEN));

                                    return;
                                default:
                                    if (error.responseJSON && error.responseJSON.message !== "")
                                        try
                                        {
                                            dispatch(errorCreateRoles(JSON.parse(error.responseJSON.message)));
                                        } catch(e) {
                                            dispatch(errorCreateRoles(error.responseJSON.message));
                                        }
                                    else
                                            error.json().then((error) => {
                                                dispatch(errorCreateRole(JSON.parse(error.message)));
                                                if (error.data)
                                                    dispatch(receiveCreateRole(error.data));
                                            }).catch(() => {
                                            dispatch(errorCreateRole(errorMessages.GENERAL_ERROR));
                                        });
                                    return;
                            }
                        });
    }
}

//CREATE ROLES
export const REQUEST_CREATE_ROLES = "REQUEST_CREATE_ROLES";
export const SUCCESS_CREATE_ROLES = "SUCCESS_CREATE_ROLES";
export const ERROR_CREATE_ROLES = "ERROR_CREATE_ROLES";
export const RESET_CREATE_ROLES = "RESET_CREATE_ROLES";

function requestCreateRoles() {
    return {
        type: REQUEST_CREATE_ROLES,
}
}

function receiveCreateRoles(roles) {
    return {
        type: SUCCESS_CREATE_ROLES,
    receivedAt: Date.now(),
        roles: normalizeDatos(roles)
}
}

function errorCreateRoles(error) {
    return {
        type: ERROR_CREATE_ROLES,
    error: error,
}
}

export function resetCreateRoles() {
    return {
        type: RESET_CREATE_ROLES,
}
}

export function saveCreateRoles() {
    return (dispatch, getState) => {
        dispatch(requestCreateRoles());

        let store = {};
        Object.keys(getState()).forEach(
            (key) => {
                if (getState()[key].byId)
                    store[key] = merge({}, getState()[key].byId[key],getState()[key].update.activo,getState()[key].create.nuevo);
            });

        let roles = getState().roles.create.nuevos.map((idRole) => {
            return denormalizeDato(getState().roles.create.nuevo[idRole], store);
        });

        return rolesApi.saveCreateRoles(roles)
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
                dispatch(receiveCreateRoles(json));
            })
            .catch(function (error) {
                console.log(error, error.status);
                switch (error.status) {
                    case 401:
                        dispatch(errorCreateRoles(errorMessages.UNAUTHORIZED_TOKEN));

                        return;
                    default:
                        if (error.responseJSON && error.responseJSON.message !== "")
                            try
                                {
                                    dispatch(errorCreateRoles(JSON.parse(error.responseJSON.message)));
                                } catch(e) {
                                    dispatch(errorCreateRoles(error.responseJSON.message));
                                }
                    else
                            error.json().then((error) => {
                                dispatch(errorCreateRoles(JSON.parse(error.message)));
                            }).catch(() => {
                            dispatch(errorCreateRoles(errorMessages.GENERAL_ERROR));
                        });


                        return;
                }
            });
    }
}

//DELETE ROLE
export const DELETE_ROLE = 'DELETE_ROLE';
export const REQUEST_DELETE_ROLE = "REQUEST_DELETE_ROLE";
export const SUCCESS_DELETE_ROLE = "SUCCESS_DELETE_ROLE";
export const ERROR_DELETE_ROLE = "ERROR_DELETE_ROLE";
export const RESET_DELETE_ROLE = "RESET_DELETE_ROLE";

function requestDeleteRole() {
    return {
        type: REQUEST_DELETE_ROLE,
    }
}

function receiveDeleteRole(role) {
    return {
        type: SUCCESS_DELETE_ROLE,
        receivedAt: Date.now(),
        role: normalizeDato(role)
    }
}

function errorDeleteRole(error) {
    return {
        type: ERROR_DELETE_ROLE,
        error: error,
    }
}

export function resetDeleteRole(error) {
    return {
        type: RESET_DELETE_ROLE,
        error: error,
    }
}

export function deleteRole(role) {
    return {
        type: DELETE_ROLE,
        role
    }
}

export function saveDeleteRole(role) {
    return dispatch => {
        dispatch(requestDeleteRole());
        return rolesApi.saveDelete(role)
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
                            dispatch(resetDeleteRole());
                            dispatch(receiveDeleteRole(data));
                        })
            .catch(function (error) {
                            console.log(error, error.status);
                            switch (error.status) {
                                case 401:
                                    dispatch(errorDeleteRole(errorMessages.UNAUTHORIZED_TOKEN));

                                    return;
                                default:
                                if (error.responseJSON && error.responseJSON.message !== "")
                                    try
                                    {
                                        dispatch(errorDeleteRole(JSON.parse(error.responseJSON.message)));
                                    } catch(e) {
                                        dispatch(errorDeleteRole(error.responseJSON.message));
                                    }
                                    else
                                            error.json().then((error) => {
                                                dispatch(errorDeleteRole(JSON.parse(error.message)));
                                            }).catch(()=> {
                                            dispatch(errorDeleteRole(errorMessages.GENERAL_ERROR));
                                        });
                                    return;
                            }
                        });
    }
}

//PRINT ROLE
export const REQUEST_PRINT_ROLE = "REQUEST_PRINT_ROLE";
export const SUCCESS_PRINT_ROLE = "SUCCESS_PRINT_ROLE";
export const ERROR_PRINT_ROLE = "ERROR_PRINT_ROLE";
export const RESET_PRINT_ROLE = "RESET_PRINT_ROLE";

function requestPrintRole() {
    return {
        type: REQUEST_PRINT_ROLE,
    }
}

function receivePrintRole(turnos) {
    return {
        type: SUCCESS_PRINT_ROLE,
        receivedAt: Date.now(),
        turnos: normalizeDatos(turnos)
    }
}

function errorPrintRole(error) {
    return {
        type: ERROR_PRINT_ROLE,
        error: error,
    }
}

export function resetPrintRole() {
    return {
        type: RESET_PRINT_ROLE,
    }
}

export function printRole(idRole) {
    return (dispatch, getState) => {
        let nombreArchivo = "";
        let tipoArchivo = "";
        dispatch(requestPrintRole());
        return rolesApi.printRole(idRole)
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
                dispatch(receivePrintRole(file));
            })
            .catch(function (error) {
                console.log(error, error.status);
                switch (error.status) {
                    case 401:
                        dispatch(errorPrintRole(errorMessages.UNAUTHORIZED_TOKEN));

                        return;
                    default:
                        if (error.responseJSON && error.responseJSON.message !== "")
                            dispatch(errorPrintRole(JSON.parse(error.responseJSON.message)));
                        else
                            error.json().then((error) => {
                                dispatch(errorPrintRole(JSON.parse(error.message)));
                            }).catch(() => {
                                dispatch(errorPrintRole(errorMessages.GENERAL_ERROR));
                            });
                        return;
                }
            });
    }
}