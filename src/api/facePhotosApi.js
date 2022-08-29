import c from '../constants/Constants';

require('es6-promise').polyfill();
require('isomorphic-fetch');


const facePhotos = {

    getAll(filtros) {
        var esc = encodeURIComponent;
        var query = "";
        if (filtros)
            query = Object.keys(filtros)
                .map(k => esc(k) + '=' + esc(filtros[k]))
                .join('&');

        let defaultOptions = {
            url: '',
            method: 'GET',
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*',
                "Content-Type": "application/json;charset=UTF-8",
            },
            // cache: false,
            dataType: 'json',
        };
        if (!!localStorage.token) {
            defaultOptions.headers["Authorization"] = "Bearer " + localStorage.token;
        }
        return fetch(c.BASE_URL + '/facePhotos/?' + query, defaultOptions);
    },
    getOne(idFacePhoto) {
        let defaultOptions = {
            url: '',
            method: 'GET',
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*',
                "Content-Type": "application/json;charset=UTF-8",
            },
            // cache: false,
            dataType: 'json',
        };
        if (!!localStorage.token) {
            defaultOptions.headers["Authorization"] = "Bearer " + localStorage.token;
        }
        return fetch(c.BASE_URL + '/facePhotos/' + idFacePhoto, defaultOptions);
    },
    getFile(idFacePhoto, filtros) {
        var esc = encodeURIComponent;
        var query = "";
        if (filtros)
            query = Object.keys(filtros)
                .map(k => esc(k) + '=' + esc(filtros[k]))
                .join('&');
        let defaultOptions = {
            url: '',
            method: 'GET',
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*',
                "Content-Type": "application/json;charset=UTF-8",
                "pragma": "no-cache",
                "cache-control": "no-cache",
            }
        };
        if (!!localStorage.token) {
            defaultOptions.headers["Authorization"] = "Bearer " + localStorage.token;
        }
        return fetch(c.BASE_URL + '/facePhotos/' + idFacePhoto + '/file/?' + query, defaultOptions);
    },
    saveCreate(facePhoto) {
        let defaultOptions = {
            url: '',
            method: 'POST',
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*',
                "Content-Type": "application/json;charset=UTF-8",
            },
            // cache: false,
            dataType: 'json',
            body: JSON.stringify(facePhoto)
        };
        if (!!localStorage.token) {
            defaultOptions.headers["Authorization"] = "Bearer " + localStorage.token;
        }

        return fetch(c.BASE_URL + '/facePhotos/', defaultOptions);
    },
    saveUpdate(facePhoto) {
        let defaultOptions = {
            url: '',
            method: 'PUT',
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*',
                "Content-Type": "application/json;charset=UTF-8",
            },
            // cache: false,
            dataType: 'json',
            body: JSON.stringify(facePhoto)
        };
        if (!!localStorage.token) {
            defaultOptions.headers["Authorization"] = "Bearer " + localStorage.token;
        }

        return fetch(c.BASE_URL + '/facePhotos/' + facePhoto.id, defaultOptions);
    },
    saveUpdateFacePhotos(activos) {
        let defaultOptions = {
            url: '',
            method: 'PUT',
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*',
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Bearer " + localStorage.token,
            },
            // cache: false,
            dataType: 'json',
            body: JSON.stringify(activos)
        };
        if (!!localStorage.token) {
            defaultOptions.headers["Authorization"] = "Bearer " + localStorage.token;
        }
        return fetch(c.BASE_URL + '/facePhotos/all', defaultOptions);
    },
    saveDelete(facePhoto) {
        let defaultOptions = {
            url: '',
            method: 'DELETE',
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*',
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Bearer " + localStorage.token,
            },
            // cache: false,
            dataType: 'json',
        };
        if (!!localStorage.token) {
            defaultOptions.headers["Authorization"] = "Bearer " + localStorage.token;
        }
        return fetch(c.BASE_URL + '/facePhotos/' + facePhoto.id, defaultOptions);
    },
    saveCreateFacePhotos(nuevos) {
        let defaultOptions = {
            url: '',
            method: 'POST',
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*',
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Bearer " + localStorage.token,
            },
            // cache: false,
            dataType: 'json',
            body: JSON.stringify(nuevos)
        };
        if (!!localStorage.token) {
            defaultOptions.headers["Authorization"] = "Bearer " + localStorage.token;
        }
        return fetch(c.BASE_URL + '/facePhotos/all', defaultOptions);
    },
    printFacePhoto(idFacePhoto) {
        let defaultOptions = {
            url: '',
            method: 'GET',
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*',
                "Content-Type": "multipart/form-data",
                "Authorization": "Bearer " + localStorage.token,
            },
            cache: "no-cache"
        };
        return fetch(c.BASE_URL + '/facePhotos/' + idFacePhoto + "/edit/", defaultOptions);
    },
};

export default facePhotos;
