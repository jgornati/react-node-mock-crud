import { normalize, schema, denormalize } from 'normalizr';

const facePhoto = new schema.Entity('facePhotos', {}, {idAttribute: "id"});

export function normalizeDatos(myData) {

    const mySchema = {facePhotos: [facePhoto]};
    const normalizedData = normalize(myData, mySchema);
    return normalizedData;
}


export function normalizeDato(myData) {

    const mySchema = facePhoto;
    const normalizedData = normalize(myData, mySchema);

    return normalizedData;
}

export function denormalizeDato(myData, store) {

    const mySchema = facePhoto;

    const normalizedData = denormalize(myData, mySchema, store);

    return normalizedData;
}

export default facePhoto;
