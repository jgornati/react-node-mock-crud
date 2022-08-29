//api
import facePhotosApi from "../api/facePhotosApi"
//constants
import * as errorMessages from '../constants/MessageConstants';
//normalizers
import { normalizeDatos, normalizeDato, denormalizeDato } from "../normalizers/normalizeFacePhotos";
//lodash
import merge from "lodash/merge";
//utils
import authUtil from "../utils/auth";

//FACEPHOTOS
export const REQUEST_FACEPHOTOS = 'REQUEST_FACEPHOTOS';
export const RECEIVE_FACEPHOTOS = 'RECEIVE_FACEPHOTOS';
export const INVALIDATE_FACEPHOTOS = 'INVALIDATE_FACEPHOTOS';
export const ERROR_FACEPHOTOS = "ERROR_FACEPHOTOS";
export const RESET_FACEPHOTOS = "RESET_FACEPHOTOS";


export function invalidateFacePhotos() {
    return {
        type: INVALIDATE_FACEPHOTOS
    }
}

function requestFacePhotos() {
    return {
        type: REQUEST_FACEPHOTOS,
    }
}

function receiveFacePhotos(json) {
    return {
        type: RECEIVE_FACEPHOTOS,
        facePhotos: normalizeDatos(json),
        receivedAt: Date.now()
    }
}

function errorFacePhotos(error) {
    return {
        type: ERROR_FACEPHOTOS,
        error: error,
    }
}

export function resetFacePhotos() {
    return {
        type: RESET_FACEPHOTOS
    }
}

export function fetchFacePhotos(filtros) {
    return dispatch => {
        dispatch(requestFacePhotos());
        return facePhotosApi.getAll(filtros)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    var data = response.json();
                    return data;
                }
            })
            .then(function (data) {
                dispatch(receiveFacePhotos(data));
            })
            .catch(function (error) {
                console.log(error);
                switch (error.status) {
                    case 401:
                        dispatch(errorFacePhotos(errorMessages.UNAUTHORIZED_TOKEN));
                        return;
                    default:
                        dispatch(errorFacePhotos(errorMessages.GENERAL_ERROR));
                        return;
                }
            });
    }
}

function shouldFetchFacePhotos(state) {
    const facePhotos = state.facePhotos.byId;
    if (!facePhotos) {
        return true
    } else if (facePhotos.isFetching) {
        return false
    } else {
        return facePhotos.didInvalidate;
    }
}

export function fetchFacePhotosIfNeeded(filtros) {
    return (dispatch, getState) => {
        if (shouldFetchFacePhotos(getState())) {
            return dispatch(fetchFacePhotos(filtros))
        }
    }
}


//MODEL
export const REQUEST_FACEPHOTO = 'REQUEST_FACEPHOTO';
export const RECEIVE_FACEPHOTO = 'RECEIVE_FACEPHOTO';
export const INVALIDATE_FACEPHOTO = 'INVALIDATE_FACEPHOTO';
export const ERROR_FACEPHOTO = "ERROR_FACEPHOTO";
export const RESET_FACEPHOTO = "RESET_FACEPHOTO";


export function invalidateFacePhoto() {
    return {
        type: INVALIDATE_FACEPHOTO
    }
}

function requestFacePhoto() {
    return {
        type: REQUEST_FACEPHOTO,
    }
}

export function receiveFacePhoto(json) {
    return {
        type: RECEIVE_FACEPHOTO,
        facePhoto: normalizeDato(json),
        receivedAt: Date.now()
    }
}

function errorFacePhoto(error) {
    return {
        type: ERROR_FACEPHOTO,
        error: error,
    }
}

export function fetchFacePhoto(idFacePhoto) {
    return dispatch => {
        dispatch(requestFacePhoto());
        return facePhotosApi.getOne(idFacePhoto)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    var data = response.json();
                    return data;
                }
            })
            .then(function (data) {
                dispatch(receiveFacePhoto(data));
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorFacePhoto(errorMessages.UNAUTHORIZED_TOKEN));
                        return;
                    default:
                        dispatch(errorFacePhoto(errorMessages.GENERAL_ERROR));
                        return;
                }
            });
    }
}

//FILE
export const RECEIVE_FILE_FACEPHOTO = 'RECEIVE_FILE_FACEPHOTO';

function receiveFileFacePhoto(file) {
    return {
        type: RECEIVE_FILE_FACEPHOTO,
        file: file,
        receivedAt: Date.now()
    }
}

export function fetchFileFacePhoto(idFacePhoto, filtros) {
    let nombreArchivo = "";
    let tipoArchivo = "";
    return dispatch => {
        return facePhotosApi.getFile(idFacePhoto, filtros)
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
                dispatch(receiveFileFacePhoto(fileObj));
            })
            .catch(function (error) {
                console.log(error);
                switch (error.status) {
                    case 401:
                        dispatch(errorFacePhoto(errorMessages.UNAUTHORIZED_TOKEN));
                        return;
                    default:
                        dispatch(errorFacePhoto(errorMessages.GENERAL_ERROR));
                        return;
                }
            });
    }
}


//UPDATE MODEL
export const UPDATE_FACEPHOTO = 'UPDATE_FACEPHOTO';
export const REQUEST_UPDATE_FACEPHOTO = "REQUEST_UPDATE_FACEPHOTO";
export const SUCCESS_UPDATE_FACEPHOTO = "SUCCESS_UPDATE_FACEPHOTO";
export const ERROR_UPDATE_FACEPHOTO = "ERROR_UPDATE_FACEPHOTO";
export const RESET_UPDATE_FACEPHOTO = "RESET_UPDATE_FACEPHOTO";
export const DELETE_UPDATE_FACEPHOTO = "DELETE_UPDATE_FACEPHOTO";

function requestUpdateFacePhoto() {
    return {
        type: REQUEST_UPDATE_FACEPHOTO,
    }
}

function receiveUpdateFacePhoto(facePhoto) {
    return {
        type: SUCCESS_UPDATE_FACEPHOTO,
        receivedAt: Date.now(),
        facePhoto: normalizeDato(facePhoto)
    }
}

function errorUpdateFacePhoto(error) {
    return {
        type: ERROR_UPDATE_FACEPHOTO,
        error: error,
    }
}

export function resetUpdateFacePhoto() {
    return {
        type: RESET_UPDATE_FACEPHOTO,
    }
}

export function updateFacePhoto(facePhoto) {
    return {
        type: UPDATE_FACEPHOTO,
        facePhoto
    }
}

export function saveUpdateFacePhoto() {
    return (dispatch, getState) => {
        dispatch(requestUpdateFacePhoto());

        let store = {};
        Object.keys(getState()).forEach(
            (key) => {
                if (getState()[key].byId)
                    store[key] = merge({}, getState()[key].byId[key], getState()[key].update.activo, getState()[key].create.nuevo);
            });

        let facePhoto = denormalizeDato(getState().facePhotos.update.activo, store);

        return facePhotosApi.saveUpdate(facePhoto)
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
                dispatch(receiveUpdateFacePhoto(json));
            })
            .catch(function (error) {
                console.log(error, error.status);
                switch (error.status) {
                    case 401:
                        dispatch(errorUpdateFacePhoto(errorMessages.UNAUTHORIZED_TOKEN));

                        return;
                    default:
                        try {
                            if (error.responseJSON && error.responseJSON.message !== "")
                                try {
                                    dispatch(errorUpdateFacePhotos(JSON.parse(error.responseJSON.message)));
                                } catch (e) {
                                    dispatch(errorUpdateFacePhotos(error.responseJSON.message));
                                }
                            else
                                error.json().then((error) => {
                                    dispatch(errorUpdateFacePhoto(JSON.parse(error.message)));
                                    if (error.data && error.data.length > 0)
                                        dispatch(receiveUpdateFacePhoto(error.data));
                                }).catch(() => {
                                    dispatch(errorUpdateFacePhoto(errorMessages.GENERAL_ERROR));
                                });
                            return;
                        } catch {
                            dispatch(errorUpdateFacePhoto(errorMessages.GENERAL_ERROR));
                        }
                        ;
                }
            });
    }
}

export function deleteUpdateFacePhoto(facePhoto) {
    return {
        type: DELETE_UPDATE_FACEPHOTO,
        facePhoto
    }
}

//UPDATE FACEPHOTOS
export const REQUEST_UPDATE_FACEPHOTOS = "REQUEST_UPDATE_FACEPHOTOS";
export const SUCCESS_UPDATE_FACEPHOTOS = "SUCCESS_UPDATE_FACEPHOTOS";
export const ERROR_UPDATE_FACEPHOTOS = "ERROR_UPDATE_FACEPHOTOS";
export const RESET_UPDATE_FACEPHOTOS = "RESET_UPDATE_FACEPHOTOS";

function requestUpdateFacePhotos() {
    return {
        type: REQUEST_UPDATE_FACEPHOTOS,
    }
}

function receiveUpdateFacePhotos(facePhotos) {
    return {
        type: SUCCESS_UPDATE_FACEPHOTOS,
        receivedAt: Date.now(),
        facePhotos: normalizeDatos(facePhotos)
    }
}

function errorUpdateFacePhotos(error) {
    return {
        type: ERROR_UPDATE_FACEPHOTOS,
        error: error,
    }
}

export function resetUpdateFacePhotos() {
    return {
        type: RESET_UPDATE_FACEPHOTOS,
    }
}

export function saveUpdateFacePhotos() {
    return (dispatch, getState) => {
        dispatch(requestUpdateFacePhotos());

        let store = {};
        Object.keys(getState()).forEach(
            (key) => {
                if (getState()[key].byId)
                    store[key] = merge({}, getState()[key].byId[key], getState()[key].update.activo, getState()[key].create.nuevo);
            });

        let facePhotos = getState().facePhotos.update.activos.map((idFacePhoto) => {
            return denormalizeDato(getState().facePhotos.update.activo[idFacePhoto], store);
        });

        return facePhotosApi.saveUpdateFacePhotos(facePhotos)
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
                dispatch(receiveUpdateFacePhotos(json));
            })
            .catch(function (error) {
                console.log(error, error.status);
                switch (error.status) {
                    case 401:
                        dispatch(errorUpdateFacePhotos(errorMessages.UNAUTHORIZED_TOKEN));
                        return;
                    default:
                        if (error.responseJSON && error.responseJSON.message !== "")
                            try {
                                dispatch(errorUpdateFacePhotos(JSON.parse(error.responseJSON.message)));
                            } catch (e) {
                                dispatch(errorUpdateFacePhotos(error.responseJSON.message));
                            }
                        else
                            error.json().then((error) => {
                                dispatch(errorUpdateFacePhotos(JSON.parse(error.message)));
                            }).catch(() => {
                                dispatch(errorUpdateFacePhotos(errorMessages.GENERAL_ERROR));
                            });


                        return;
                }
            });
    }
}

//ALTA FACEPHOTO
export const CREATE_FACEPHOTO = 'CREATE_FACEPHOTO';
export const REQUEST_CREATE_FACEPHOTO = "REQUEST_CREATE_FACEPHOTO";
export const SUCCESS_CREATE_FACEPHOTO = "SUCCESS_CREATE_FACEPHOTO";
export const ERROR_CREATE_FACEPHOTO = "ERROR_CREATE_FACEPHOTO";
export const RESET_CREATE_FACEPHOTO = "RESET_CREATE_FACEPHOTO";
export const DELETE_CREATE_FACEPHOTO = "DELETE_CREATE_FACEPHOTO";


//ALTA FACEPHOTO
function requestCreateFacePhoto() {
    return {
        type: REQUEST_CREATE_FACEPHOTO,
    }
}

function receiveCreateFacePhoto(facePhoto) {
    return {
        type: SUCCESS_CREATE_FACEPHOTO,
        receivedAt: Date.now(),
        facePhoto: normalizeDato(facePhoto)
    }
}

export function errorCreateFacePhoto(error) {
    return {
        type: ERROR_CREATE_FACEPHOTO,
        error: error,
    }
}

export function resetCreateFacePhoto() {
    return {
        type: RESET_CREATE_FACEPHOTO
    }
}

export function createFacePhoto(facePhoto) {
    return {
        type: CREATE_FACEPHOTO,
        facePhoto
    }
}

export function deleteCreateFacePhoto(facePhoto) {
    return {
        type: DELETE_CREATE_FACEPHOTO,
        facePhoto
    }
}

export function saveCreateFacePhoto() {
    return (dispatch, getState) => {
        dispatch(requestCreateFacePhoto());
        let store = {};
        Object.keys(getState()).forEach(
            (key) => {
                if (getState()[key].byId)
                    store[key] = merge({}, getState()[key].byId[key], getState()[key].update.activo, getState()[key].create.nuevo);
            });

        let facePhoto = denormalizeDato(getState().facePhotos.create.nuevo, store);

        return facePhotosApi.saveCreate(facePhoto)
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
                dispatch(receiveCreateFacePhoto(json));
            })
            .catch(function (error) {
                console.log(error, error.status);
                switch (error.status) {
                    case 401:
                        dispatch(errorCreateFacePhoto(errorMessages.UNAUTHORIZED_TOKEN));

                        return;
                    default:
                        try {
                            if (error.responseJSON && error.responseJSON.message !== "")
                                try {
                                    dispatch(errorCreateFacePhotos(JSON.parse(error.responseJSON.message)));
                                } catch (e) {
                                    dispatch(errorCreateFacePhotos(error.responseJSON.message));
                                }
                            else
                                error.json().then((error) => {
                                    dispatch(errorCreateFacePhoto(JSON.parse(error.message)));
                                    if (error.data)
                                        dispatch(receiveCreateFacePhoto(error.data));
                                }).catch(() => {
                                    dispatch(errorCreateFacePhoto(errorMessages.GENERAL_ERROR));
                                });
                            return;
                        } catch {
                            dispatch(errorCreateFacePhoto(errorMessages.GENERAL_ERROR));
                        }
                        ;
                }
            });
    }
}

//CREATE FACEPHOTOS
export const REQUEST_CREATE_FACEPHOTOS = "REQUEST_CREATE_FACEPHOTOS";
export const SUCCESS_CREATE_FACEPHOTOS = "SUCCESS_CREATE_FACEPHOTOS";
export const ERROR_CREATE_FACEPHOTOS = "ERROR_CREATE_FACEPHOTOS";
export const RESET_CREATE_FACEPHOTOS = "RESET_CREATE_FACEPHOTOS";

function requestCreateFacePhotos() {
    return {
        type: REQUEST_CREATE_FACEPHOTOS,
    }
}

function receiveCreateFacePhotos(facePhotos) {
    return {
        type: SUCCESS_CREATE_FACEPHOTOS,
        receivedAt: Date.now(),
        facePhotos: normalizeDatos(facePhotos)
    }
}

function errorCreateFacePhotos(error) {
    return {
        type: ERROR_CREATE_FACEPHOTOS,
        error: error,
    }
}

export function resetCreateFacePhotos() {
    return {
        type: RESET_CREATE_FACEPHOTOS,
    }
}

export function saveCreateFacePhotos() {
    return (dispatch, getState) => {
        dispatch(requestCreateFacePhotos());

        let store = {};
        Object.keys(getState()).forEach(
            (key) => {
                if (getState()[key].byId)
                    store[key] = merge({}, getState()[key].byId[key], getState()[key].update.activo, getState()[key].create.nuevo);
            });

        let facePhotos = getState().facePhotos.create.nuevos.map((idFacePhoto) => {
            return denormalizeDato(getState().facePhotos.create.nuevo[idFacePhoto], store);
        });

        return facePhotosApi.saveCreateFacePhotos(facePhotos)
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
                dispatch(receiveCreateFacePhotos(json));
            })
            .catch(function (error) {
                console.log(error, error.status);
                switch (error.status) {
                    case 401:
                        dispatch(errorCreateFacePhotos(errorMessages.UNAUTHORIZED_TOKEN));

                        return;
                    default:
                        if (error.responseJSON && error.responseJSON.message !== "")
                            try {
                                dispatch(errorCreateFacePhotos(JSON.parse(error.responseJSON.message)));
                            } catch (e) {
                                dispatch(errorCreateFacePhotos(error.responseJSON.message));
                            }
                        else
                            error.json().then((error) => {
                                dispatch(errorCreateFacePhotos(JSON.parse(error.message)));
                            }).catch(() => {
                                dispatch(errorCreateFacePhotos(errorMessages.GENERAL_ERROR));
                            });


                        return;
                }
            });
    }
}

//DELETE FACEPHOTO
export const DELETE_FACEPHOTO = 'DELETE_FACEPHOTO';
export const REQUEST_DELETE_FACEPHOTO = "REQUEST_DELETE_FACEPHOTO";
export const SUCCESS_DELETE_FACEPHOTO = "SUCCESS_DELETE_FACEPHOTO";
export const ERROR_DELETE_FACEPHOTO = "ERROR_DELETE_FACEPHOTO";
export const RESET_DELETE_FACEPHOTO = "RESET_DELETE_FACEPHOTO";

function requestDeleteFacePhoto() {
    return {
        type: REQUEST_DELETE_FACEPHOTO,
    }
}

function receiveDeleteFacePhoto(facePhoto) {
    return {
        type: SUCCESS_DELETE_FACEPHOTO,
        receivedAt: Date.now(),
        facePhoto: normalizeDato(facePhoto)
    }
}

function errorDeleteFacePhoto(error) {
    return {
        type: ERROR_DELETE_FACEPHOTO,
        error: error,
    }
}

export function resetDeleteFacePhoto(error) {
    return {
        type: RESET_DELETE_FACEPHOTO,
        error: error,
    }
}

export function deleteFacePhoto(facePhoto) {
    return {
        type: DELETE_FACEPHOTO,
        facePhoto
    }
}

export function saveDeleteFacePhoto(facePhoto) {
    return dispatch => {
        dispatch(requestDeleteFacePhoto());
        return facePhotosApi.saveDelete(facePhoto)
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
                dispatch(resetDeleteFacePhoto());
                dispatch(receiveDeleteFacePhoto(data));
            })
            .catch(function (error) {
                console.log(error, error.status);
                switch (error.status) {
                    case 401:
                        dispatch(errorDeleteFacePhoto(errorMessages.UNAUTHORIZED_TOKEN));

                        return;
                    default:
                        if (error.responseJSON && error.responseJSON.message !== "")
                            try {
                                dispatch(errorDeleteFacePhoto(JSON.parse(error.responseJSON.message)));
                            } catch (e) {
                                dispatch(errorDeleteFacePhoto(error.responseJSON.message));
                            }
                        else
                            error.json().then((error) => {
                                dispatch(errorDeleteFacePhoto(JSON.parse(error.message)));
                            }).catch(() => {
                                dispatch(errorDeleteFacePhoto(errorMessages.GENERAL_ERROR));
                            });
                        return;
                }
            });
    }
}

//PRINT FACEPHOTO
export const REQUEST_PRINT_FACEPHOTO = "REQUEST_PRINT_FACEPHOTO";
export const SUCCESS_PRINT_FACEPHOTO = "SUCCESS_PRINT_FACEPHOTO";
export const ERROR_PRINT_FACEPHOTO = "ERROR_PRINT_FACEPHOTO";
export const RESET_PRINT_FACEPHOTO = "RESET_PRINT_FACEPHOTO";

function requestPrintFacePhoto() {
    return {
        type: REQUEST_PRINT_FACEPHOTO,
    }
}

function receivePrintFacePhoto(turnos) {
    return {
        type: SUCCESS_PRINT_FACEPHOTO,
        receivedAt: Date.now(),
        turnos: normalizeDatos(turnos)
    }
}

function errorPrintFacePhoto(error) {
    return {
        type: ERROR_PRINT_FACEPHOTO,
        error: error,
    }
}

export function resetPrintFacePhoto() {
    return {
        type: RESET_PRINT_FACEPHOTO,
    }
}

export function printFacePhoto(idFacePhoto) {
    return (dispatch, getState) => {
        let nombreArchivo = "";
        let tipoArchivo = "";
        dispatch(requestPrintFacePhoto());
        return facePhotosApi.printFacePhoto(idFacePhoto)
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
                dispatch(receivePrintFacePhoto(file));
            })
            .catch(function (error) {
                console.log(error, error.status);
                switch (error.status) {
                    case 401:
                        dispatch(errorPrintFacePhoto(errorMessages.UNAUTHORIZED_TOKEN));

                        return;
                    default:
                        if (error.responseJSON && error.responseJSON.message !== "")
                            dispatch(errorPrintFacePhoto(JSON.parse(error.responseJSON.message)));
                        else
                            error.json().then((error) => {
                                dispatch(errorPrintFacePhoto(JSON.parse(error.message)));
                            }).catch(() => {
                                dispatch(errorPrintFacePhoto(errorMessages.GENERAL_ERROR));
                            });
                        return;
                }
            });
    }
}
