import {normalize, schema, denormalize} from 'normalizr';

const role = new schema.Entity('roles', {}, {idAttribute: "id"});

export function normalizeDatos(myData) {

    const mySchema = {roles: [role]};
    const normalizedData = normalize(myData, mySchema);
    return normalizedData;
}


export function normalizeDato(myData) {

    const mySchema = role;
    const normalizedData = normalize(myData, mySchema);

    return normalizedData;
}

export function denormalizeDato(myData, store) {

    const mySchema = role;

    const normalizedData = denormalize(myData, mySchema, store);

    return normalizedData;
}

export default role;
