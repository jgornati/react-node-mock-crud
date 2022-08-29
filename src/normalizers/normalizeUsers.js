import {normalize, schema, denormalize} from 'normalizr';
import facePhoto from "./normalizeFacePhotos";

const user = new schema.Entity('users', {face_photo: [facePhoto]}, {idAttribute: "id"});

export function normalizeDatos(myData) {

    const mySchema = {users: [user]};
    const normalizedData = normalize(myData, mySchema);
    return normalizedData;
}


export function normalizeDato(myData) {

    const mySchema = user;
    const normalizedData = normalize(myData, mySchema);

    return normalizedData;
}

export function denormalizeDato(myData, store) {

    const mySchema = user;

    const normalizedData = denormalize(myData, mySchema, store);

    return normalizedData;
}

export default user;
