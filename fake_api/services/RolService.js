let fs = require('fs');
let path = require('path');

let rolesFilePath = path.join(__dirname, '../../mock/roles.json');

class RolService {
    static getAll() {
        let rolesFile = fs.readFileSync(rolesFilePath);
        let roles = JSON.parse(rolesFile);
        return roles
    };
}

module.exports = RolService

