import c from '../constants/Constants';
import $ from 'jquery';

// import data from '../../mock/users.json';

require('es6-promise').polyfill();

require('isomorphic-fetch');


var users = {

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
        return fetch(c.BASE_URL + '/users/?' + query, defaultOptions);

        //Simular fetch
        // return new Promise((resolve) => {
        //         let rta = {};
        //         rta.json = () => {
        //             return data
        //         }
        //         resolve(rta)
        //     }
        // )
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

        //Simular fetch
        // return new Promise((resolve) => {
        //         let _user = null;
        //         data.users.some((user) => {
        //             console.log(user)
        //             if (user.id === parseInt(idUser))
        //                 _user = user;
        //         })
        //         let rta = {};
        //         rta.json = () => {
        //             return _user
        //         }
        //         resolve(rta)
        //     }
        // )
    },
    getFile(idUser, filtros) {
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
        return fetch(c.BASE_URL + '/users/' + idUser + '/file/?' + query, defaultOptions);
    },
    saveCreate(nuevo, files) {
        var formData = new FormData();
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
        var formData = new FormData();
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
