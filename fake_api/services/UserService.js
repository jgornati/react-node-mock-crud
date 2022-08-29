let fs = require('fs');
let path = require('path');
let usersFilePath = path.join(__dirname, '../../mock/users.json');

const FacePhotoService = require("./FacePhotoService");
const {next} = require("lodash/seq");

class UserService {
    static getAll() {
        let usersFile = fs.readFileSync(usersFilePath);
        let Users = JSON.parse(usersFile);

        return Users;
    };

    static getOne(id) {
        let Users = this.getAll();
        let user = Users.users.find(user => user.id === id);

        return user;
    }

    static delete(id) {
        // Deberia usar el this.getOne(id) pero como estoy trabajando con archivos tengo que mutar el mismo objeto
        // para que se vuelva a rescribir.
        let Users = this.getAll();
        let user = Users.users.find(user => user.id === id);
        user['status'] = !user['status'];

        this.save(Users);

        return user;
    }

    static update(user, files) {

        //Face photo
        if (files && Object.keys(files).length > 0) {
            user.face_photo.forEach((_face_photo) => {
                let file = files[_face_photo.filename];
                FacePhotoService.create(_face_photo, file);
            })
        }
        //User
        let Users = this.getAll();
        const userIndexFoundById = Users.users.findIndex(_user => _user.id === user.id);
        Users.users[userIndexFoundById] = user;

        this.save(Users);

        return user;
    }

    static create(user, files) {
        //Face photo
        if (Object.keys(files).length > 0) {
            user.face_photo.forEach((_face_photo) => {
                let file = files[_face_photo.filename];
                FacePhotoService.create(_face_photo, file);
            })
        }

        let Users = this.getAll();
        //User
        user.status = 1;
        user.id = Users.users.length + 1;

        Users.total += 1;
        Users.users.push(user);

        this.save(Users);

        return user;
    }

    static save(users) {
        fs.writeFileSync(usersFilePath, JSON.stringify(users));
    }
}

module.exports = UserService

