let fs = require('fs');
let path = require('path');


class FacePhotoService {

    static create(facePhoto, file) {
        let originalFilename = file.originalFilename
        let newPath = `${path.join(__dirname,'/../public')}/${originalFilename}`;
        let rawData = fs.readFileSync(file.filepath)
        fs.writeFileSync(newPath, rawData);

        facePhoto.id = `pic-${new Date().getUTCMilliseconds()}`;
        facePhoto.filename = originalFilename;
        facePhoto.path = newPath;

        return facePhoto;
    }
}

module.exports = FacePhotoService

