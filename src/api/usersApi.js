import c from '../constants/Constants';
import $ from 'jquery';
require('es6-promise').polyfill();
require('isomorphic-fetch');

const users = {
    getAll(filtros) {
        let encodeURI = encodeURIComponent;
        let query = "";
        if (filtros)
            query = Object.keys(filtros)
                .map(k => encodeURI(k) + '=' + encodeURI(filtros[k]))
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
        return fetch(c.BASE_URL + '/users/?' + query, defaultOptions);
    },
    getOne(idUser) {
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
        return fetch(c.BASE_URL + '/users/' + idUser, defaultOptions);
    },
    getFile(idUser, filtros) {
        let encodeURI = encodeURIComponent;
        let query = "";
        if (filtros)
            query = Object.keys(filtros)
                .map(k => encodeURI(k) + '=' + encodeURI(filtros[k]))
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
        return fetch(c.BASE_URL + '/users/' + idUser + '/file/?' + query, defaultOptions);
    },
    saveCreate(nuevo, files) {
        let formData = new FormData();
        if (files) {
            files.forEach((file) => {
                if (file)
                    formData.append(file.name, file);
            });
        }
        formData.append("user", JSON.stringify(nuevo));
        return $.ajax({
            url: c.BASE_URL + '/users/',
            //dataType: 'json',
            data: formData,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('authorization', "Bearer " + localStorage.token);
            },
            contentType: false,
            type: 'POST',
            processData: false,
            enctype: 'multipart/form-data',
        });

    },
    saveUpdate(activo, files) {
        let formData = new FormData();
        if (files) {
            files.forEach((file) => {
                if (file)
                    formData.append(file.name, file);
            });
        }

        formData.append("user", JSON.stringify(activo));
        return $.ajax({
            url: c.BASE_URL + '/users',
            //dataType: 'json',
            data: formData,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('authorization', "Bearer " + localStorage.token);
            },
            contentType: false,
            type: 'PUT',
            processData: false,
            enctype: 'multipart/form-data',
        });
    },
    saveUpdateUsers(activos) {
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
        return fetch(c.BASE_URL + '/users/all', defaultOptions);
    },
    saveDelete(user) {
        let defaultOptions = {
            url: '',
            method: 'DELETE',
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*',
                "Content-Type": "application/json;charset=UTF-8",
            },
            // cache: false,
            dataType: 'json',
        };

        return fetch(c.BASE_URL + '/users/' + user.id, defaultOptions);
    },
    saveCreateUsers(nuevos) {
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
        return fetch(c.BASE_URL + '/users/all', defaultOptions);
    },
    printUser(idUser) {
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
        return fetch(c.BASE_URL + '/users/' + idUser + "/edit/", defaultOptions);
    },
};

export default users;
