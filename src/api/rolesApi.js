import c from '../constants/Constants';
// import data from '../../mock/roles.json';

require('es6-promise').polyfill();
require('isomorphic-fetch');


const roles = {

    getAll(filtros) {
        const esc = encodeURIComponent;
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
        return fetch(c.BASE_URL + '/roles/?' + query, defaultOptions);

        // //Simular fetch
        // return new Promise((resolve) => {
        //         let rta = {};
        //         rta.json = () => {
        //             return data
        //         }
        //         resolve(rta)
        //     }
        // )
    },
    getOne(idRole) {
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
        return fetch(c.BASE_URL + '/roles/' + idRole, defaultOptions);
        //Simular fetch
        // return new Promise((resolve) => {
        //         let _role = null;
        //         data.users.some((role) => {
        //             console.log(role)
        //             if (role.id === parseInt(idRole))
        //                 _role = role;
        //         })
        //         let rta = {};
        //         rta.json = () => {
        //             return _role
        //         }
        //         resolve(rta)
        //     }
        // )
    },
    getFile(idRole, filtros) {
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
        return fetch(c.BASE_URL + '/roles/' + idRole + '/file/?' + query, defaultOptions);
    },
    saveCreate(role) {
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
            body: JSON.stringify(role)
        };
        if (!!localStorage.token) {
            defaultOptions.headers["Authorization"] = "Bearer " + localStorage.token;
        }

        return fetch(c.BASE_URL + '/roles/', defaultOptions);
    },
    saveUpdate(role) {
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
            body: JSON.stringify(role)
        };
        if (!!localStorage.token) {
            defaultOptions.headers["Authorization"] = "Bearer " + localStorage.token;
        }

        return fetch(c.BASE_URL + '/roles/' + role.id, defaultOptions);
    },
    saveUpdateRoles(activos) {
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
        return fetch(c.BASE_URL + '/roles/all', defaultOptions);
    },
    saveDelete(role) {
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
        return fetch(c.BASE_URL + '/roles/' + role.id, defaultOptions);
    },
    saveCreateRoles(nuevos) {
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
        return fetch(c.BASE_URL + '/roles/all', defaultOptions);
    },
    printRole(idRole) {
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
        return fetch(c.BASE_URL + '/roles/' + idRole + "/edit/", defaultOptions);
    },
};

export default roles;
