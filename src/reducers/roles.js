import {
    INVALIDATE_ROLES,
    ERROR_ROLES,
    RECEIVE_ROLES,
    REQUEST_ROLES,
    RESET_ROLES,
    ERROR_ROLE,
    RECEIVE_ROLE,
    REQUEST_ROLE,
    UPDATE_ROLE,
    REQUEST_UPDATE_ROLE,
    SUCCESS_UPDATE_ROLE,
    ERROR_UPDATE_ROLE,
    RESET_UPDATE_ROLE,
    REQUEST_UPDATE_ROLES,
    SUCCESS_UPDATE_ROLES,
    ERROR_UPDATE_ROLES,
    RESET_UPDATE_ROLES,
    CREATE_ROLE,
    ERROR_CREATE_ROLE,
    REQUEST_CREATE_ROLE,
    RESET_CREATE_ROLE,
    SUCCESS_CREATE_ROLE,
    REQUEST_CREATE_ROLES,
    SUCCESS_CREATE_ROLES,
    ERROR_CREATE_ROLES,
    RESET_CREATE_ROLES,
    DELETE_ROLE,
    DELETE_CREATE_ROLE,
    DELETE_UPDATE_ROLE,
    REQUEST_DELETE_ROLE,
    SUCCESS_DELETE_ROLE,
    ERROR_DELETE_ROLE,
    RESET_DELETE_ROLE,
    REQUEST_PRINT_ROLE,
    SUCCESS_PRINT_ROLE,
    ERROR_PRINT_ROLE,
    RESET_PRINT_ROLE,
    RECEIVE_FILE_ROLE
} from '../actions/RoleActions';

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
        roles: {},
        files: {},
    }
}

function rolesById(state = getInitialStateById(), action) {
    switch (action.type) {
        case INVALIDATE_ROLES:
            return Object.assign({}, state, {
                didInvalidate: true
            });
        case REQUEST_ROLES:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            });
        case ERROR_ROLES:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                error: action.error
            });
        case RESET_ROLES:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                error: null,
                lastUpdated: null,
                roles: {}
            });
        case RECEIVE_ROLES:
            let dato = action.roles.entities.roles;
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                roles: merge({}, state.roles, dato),
                lastUpdated: action.receivedAt
            });
        case REQUEST_ROLE:
            return Object.assign({}, state, {
                isFetching: true,
            });
        case ERROR_ROLE:
            return Object.assign({}, state, {
                isFetching: false,
                error: action.error
            });
        case RECEIVE_ROLE:
            let datoRole = action.role.entities.roles;
            return Object.assign({}, state, {
                roles: merge({}, state.roles, datoRole),
                isFetching: false,
            });
        case RECEIVE_FILE_ROLE:
            return Object.assign({}, state, {
                files: merge({}, state.files, action.file),
            });

        case SUCCESS_DELETE_ROLE:
            let datoRoleEliminado = action.role.entities.roles;
            return Object.assign({}, state, {
                roles: mergeWith(clone(datoRoleEliminado), state.roles, (objValue, srcValue) => {
                    return objValue;
                })
            });
        case SUCCESS_CREATE_ROLE:
            let datoRoleCreado = action.role.entities.roles;
            return Object.assign({}, state, {
                roles: mergeWith(clone(datoRoleCreado), state.roles, (objValue, srcValue) => {
                    return objValue;
                })
            });
        case SUCCESS_CREATE_ROLES:
            let datosRoleCreado = action.roles.entities.roles;
            return Object.assign({}, state, {
                roles: mergeWith(clone(datosRoleCreado), state.roles, (objValue, srcValue) => {
                    return objValue;
                })
            });
        case SUCCESS_UPDATE_ROLE:
            let datoRoleActualizado = action.role.entities.roles;
            return Object.assign({}, state, {
                roles: mergeWith(clone(datoRoleActualizado), state.roles, (objValue, srcValue) => {
                    return objValue;
                })
            });
        case SUCCESS_UPDATE_ROLES:
            let datosRoleActualizado = action.roles.entities.roles;
            return Object.assign({}, state, {
                roles: mergeWith(clone(datosRoleActualizado), state.roles, (objValue, srcValue) => {
                    return objValue;
                })
            });

        //USER
        case RECEIVE_USER:
            let user = action.user.entities && action.user.entities.roles ? action.user.entities.roles : {};
            return Object.assign({}, state, {
                roles: merge({}, state.roles, user),
            });
        case RECEIVE_USERS:
            let users = action.users.entities && action.users.entities.roles ? action.users.entities.roles : {};
            return Object.assign({}, state, {
                roles: merge({}, state.roles, users),
            });
        case SUCCESS_DELETE_USER:
            let datouserEliminado = action.user.entities && action.user.entities.roles ? action.user.entities.roles : {};
            return Object.assign({}, state, {
                roles: mergeWith(clone(datouserEliminado), pickBy(state.roles, function (role) {
                    return role.id.toString().indexOf("-") === -1
                }), (objValue, srcValue) => {
                    return objValue;
                })
            });
        case SUCCESS_CREATE_USER:
            let datouserCreado = action.user.entities && action.user.entities.roles ? action.user.entities.roles : {};
            return Object.assign({}, state, {
                roles: mergeWith(clone(datouserCreado), pickBy(state.roles, function (role) {
                    return role.id.toString().indexOf("-") === -1
                }), (objValue, srcValue) => {
                    return objValue;
                })
            });
        case SUCCESS_UPDATE_USER:
            let datouserActualizado = action.user.entities && action.user.entities.roles ? action.user.entities.roles : {};
            return Object.assign({}, state, {
                roles: mergeWith(clone(datouserActualizado), pickBy(state.roles, function (role) {
                    return role.id.toString().indexOf("-") === -1
                }), (objValue, srcValue) => {
                    return objValue;
                })
            });
        case SUCCESS_UPDATE_USERS:
            let datosuserActualizado = action.users.entities && action.users.entities.roles ? action.users.entities.roles : {};
            return Object.assign({}, state, {
                roles: mergeWith(clone(datosuserActualizado), state.roles, (objValue, srcValue) => {
                    return objValue;
                })
            });
        default:
            return state
    }
}


function allRoles(state = [], action) {
    switch (action.type) {
        case RECEIVE_ROLES:
            return action.roles.result && action.roles.result.roles ? union(action.roles.result.roles, state) : (action.roles.result ? action.roles.result : state);
        case RECEIVE_ROLE:
            return action.role.result ? union([action.role.result], state) : state;

        case SUCCESS_CREATE_ROLE:
            let datoRoleSCreate = action.role.entities.roles;
            let idNuevoSCreate = null;
            if (Object.values(datoRoleSCreate).length > 0)
                idNuevoSCreate = Object.values(datoRoleSCreate)[0] && Object.values(datoRoleSCreate)[0].id ? Object.values(datoRoleSCreate)[0].id : null;
            if (idNuevoSCreate)
                return union(state, [idNuevoSCreate]);
            else
                return state;
        case SUCCESS_CREATE_ROLES:
            let rolesCreate = action.roles.entities && action.roles.entities.roles ? action.roles.entities.roles : null;
            return rolesCreate ?
                union(state, Object.values(rolesCreate).map((roles) => {
                    return roles.id
                })) : state;
        case RESET_ROLES:
            return [];

        case RECEIVE_USER:
            let user = action.user.entities && action.user.entities.roles ? action.user.entities.roles : null;
            return user ?
                union(state, Object.values(user).map((user) => {
                    return user.id
                })) : state;
        case RECEIVE_USERS:
            let users = action.users.entities && action.users.entities.roles ? action.users.entities.roles : null;
            return users ?
                union(state, Object.values(users).map((users) => {
                    return users.id
                })) : state;

        case SUCCESS_DELETE_USER:
            let userDelete = action.user.entities && action.user.entities.roles ? action.user.entities.roles : null;
            return userDelete ?
                union(filter(state, function (o) {
                    return o.toString().indexOf("-") === -1;
                }), Object.values(userDelete).map((user) => {
                    return user.id
                })) : state;
        case SUCCESS_CREATE_USER:
            let userCreate = action.user.entities && action.user.entities.roles ? action.user.entities.roles : null;
            return userCreate ?
                union(filter(state, function (o) {
                    return o.toString().indexOf("-") === -1;
                }), Object.values(userCreate).map((user) => {
                    return user.id
                })) : state;
        case SUCCESS_UPDATE_USER:
            let userUpdate = action.user.entities && action.user.entities.roles ? action.user.entities.roles : null;
            return userUpdate ?
                union(filter(state, function (o) {
                    return o.toString().indexOf("-") === -1;
                }), Object.values(userUpdate).map((user) => {
                    return user.id
                })) : state;
        case SUCCESS_UPDATE_USERS:
            let usersUpdate = action.users.entities && action.users.entities.roles ? action.users.entities.roles : null;
            return usersUpdate ?
                union(state, Object.values(usersUpdate).map((users) => {
                    return users.id
                })) : state;
        default:
            return state
    }
}

function totalRoles(state = null, action) {
    switch (action.type) {
        case RECEIVE_ROLES:
            return action.roles && action.roles.result.total ? action.roles.result.total : 0;
        case RESET_ROLES:
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
        case RECEIVE_ROLE:
            let dato = action.role.entities.roles;
            let role = dato && Object.keys(dato).length > 0 ? dato[Object.keys(dato)[0]] : {};
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                activo: role ? role : [],
                lastUpdated: action.receivedAt
            });
        case UPDATE_ROLE:
            let idsUpdate = [];
            Object.values(action.role).map((roleUpdate) => {
                if (roleUpdate && roleUpdate.id)
                    idsUpdate.push(roleUpdate.id);
            });
            return merge({}, state, {
                activo: action.role,
                activos: idsUpdate.length > 0 ? union(state.activos, idsUpdate) : state.activos,
                error: ""
            });
        case REQUEST_UPDATE_ROLE:
            return Object.assign({}, state, {
                isUpdating: true,
                error: null
            });
        case SUCCESS_UPDATE_ROLE:
            let datoRoleActualizado = {};
            if (Object.values(action.role.entities.roles).length > 0)
                datoRoleActualizado = Object.values(action.role.entities.roles)[0];
            return Object.assign({}, state, {
                isUpdating: false,
                lastUpdated: action.receivedAt,
                error: null,
                activo: datoRoleActualizado
            });
        case ERROR_UPDATE_ROLE:
            return Object.assign({}, state, {
                isUpdating: false,
                error: action.error
            });
        case REQUEST_UPDATE_ROLES:
            return Object.assign({}, state, {
                isUpdating: true,
                error: null
            });
        case SUCCESS_UPDATE_ROLES:
            return Object.assign({}, state, {
                isUpdating: false,
                lastUpdated: action.receivedAt,
                error: null,
                activo: {},
                activos: []
            });
        case ERROR_UPDATE_ROLES:
            return Object.assign({}, state, {
                isUpdating: false,
                error: action.error
            });
        case RESET_UPDATE_ROLE:
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

        case DELETE_ROLE:
            let datoRoleDelete = action.role;
            let idsDelete = [];
            Object.values(action.role).map((roleDelete) => {
                if (roleDelete && roleDelete.id)
                    idsDelete.push(roleDelete.id);
            });
            if (idsDelete.length > 0)
                return Object.assign({}, state, {
                    activo: omit(clone(state.activo), Object.keys(datoRoleDelete)),
                    activos: difference(clone(state.activos), idsDelete)
                });
            else
                return state;
        case DELETE_UPDATE_ROLE:
            let datoRoleDeleteUpdate = action.role;
            let idsDeleteUpdate = [];
            Object.values(action.role).map((roleDelete) => {
                if (roleDelete && roleDelete.id)
                    idsDeleteUpdate.push(roleDelete.id);
            });
            if (idsDeleteUpdate.length > 0)
                return Object.assign({}, state, {
                    activo: omit(clone(state.activo), Object.keys(datoRoleDeleteUpdate)),
                    activos: difference(clone(state.activos), idsDeleteUpdate)
                });
            else
                return state;
        case SUCCESS_DELETE_ROLE:
            let datoRoleDeleted = {};
            if (Object.values(action.role.entities.roles).length > 0)
                datoRoleDeleted = Object.values(action.role.entities.roles)[0];
            return Object.assign({}, state, {
                isUpdating: false,
                lastUpdated: action.receivedAt,
                error: null,
                activo: datoRoleDeleted
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
        case CREATE_ROLE:
            let idsCreate = [];
            Object.values(action.role).map((roleCreate) => {
                if (roleCreate && roleCreate.id)
                    idsCreate.push(roleCreate.id);
            });
            return merge({}, state, {
                isCreating: false,
                nuevo: action.role,
                nuevos: idsCreate.length > 0 ? union(state.nuevos, idsCreate) : state.nuevos,
                error: null,
            });
        case REQUEST_CREATE_ROLE:
            return Object.assign({}, state, {
                isCreating: true,
                error: null,
            });
        case SUCCESS_CREATE_ROLE:
            let datoRoleNuevo = {};
            if (Object.values(action.role.entities.roles).length > 0)
                datoRoleNuevo = Object.values(action.role.entities.roles)[0];
            return Object.assign({}, state, {
                isCreating: false,
                lastUpdated: action.receivedAt,
                error: null,
                nuevo: datoRoleNuevo,
                nuevos: []
            });
        case ERROR_CREATE_ROLE:
            return Object.assign({}, state, {
                isCreating: false,
                error: action.error
            });
        case REQUEST_CREATE_ROLES:
            return Object.assign({}, state, {
                isCreating: true,
                error: null
            });
        case SUCCESS_CREATE_ROLES:
            return Object.assign({}, state, {
                isCreating: false,
                lastUpdated: action.receivedAt,
                error: null,
                nuevo: {},
                nuevos: []
            });
        case ERROR_CREATE_ROLES:
            return Object.assign({}, state, {
                isCreating: false,
                error: action.error
            });
        case RESET_CREATE_ROLE:
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

        case DELETE_ROLE:
            let datoRoleDelete = action.role;
            let idsDelete = [];
            Object.values(action.role).map((roleDelete) => {
                if (roleDelete && roleDelete.id)
                    idsDelete.push(roleDelete.id);
            });
            if (idsDelete.length > 0)
                return Object.assign({}, state, {
                    nuevo: omit(clone(state.nuevo), Object.keys(datoRoleDelete)),
                    nuevos: difference(clone(state.nuevos), idsDelete)
                });
            else
                return state;
        case DELETE_CREATE_ROLE:
            let datoRoleDeleteCreate = action.role;
            let idsDeleteCreate = [];
            Object.values(action.role).map((roleDelete) => {
                if (roleDelete && roleDelete.id)
                    idsDeleteCreate.push(roleDelete.id);
            });
            if (idsDeleteCreate.length > 0)
                return Object.assign({}, state, {
                    nuevo: omit(clone(state.nuevo), Object.keys(datoRoleDeleteCreate)),
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
        case DELETE_ROLE:
            return merge({}, state, {
                isDeleting: false,
                eliminado: action.role,
                error: null,
            });
        case REQUEST_DELETE_ROLE:
            return Object.assign({}, state, {
                isDeleting: true,
                error: null,
            });
        case SUCCESS_DELETE_ROLE:
            return Object.assign({}, state, {
                isDeleting: false,
                error: null,
            });
        case ERROR_DELETE_ROLE:
            return Object.assign({}, state, {
                isDeleting: false,
                error: action.error
            });
        case RESET_DELETE_ROLE:
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
        case REQUEST_PRINT_ROLE:
            return Object.assign({}, state, {
                isPrinting: true,
                error: null,
            });
        case SUCCESS_PRINT_ROLE:
            return Object.assign({}, state, {
                isPrinting: false,
                lastUpdated: action.receivedAt,
                error: null,
            });
        case ERROR_PRINT_ROLE:
            return Object.assign({}, state, {
                isPrinting: false,
                error: action.error
            });
        default:
            return state
    }
}

const roles = combineReducers({
    byId: rolesById,
    allIds: allRoles,
    update: update,
    create: create,
    totalRoles: totalRoles,
    delete: deleter,
    print: print
});

export default roles;
