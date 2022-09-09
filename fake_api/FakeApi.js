let express = require('express');
let bodyParser = require('body-parser');
const formidable = require('formidable');
//Transformar el método parse para devolver una promise
const ns = {
    form_parse: async (req, form) => await new Promise((resolve, reject) => form.parse(req, (e, fields, files) => e ? reject(e) : resolve([fields, files])))
}

const port = 54321;

const UserService = require("./services/UserService");
const RolService = require("./services/RolService");
let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(function (req, res, next) {
    setTimeout(next, 400)
});
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

let path = require('path');
app.use('/storage/photos', express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.status(200).send('Bienvenidos al servidor de mock');
});

//Leer todos los roles
app.get('/roles', function (req, res) {
    res.json(RolService.getAll());
})

//Leer todos los usuarios
app.get('/users', function (req, res) {
    res.json(UserService.getAll());
})

//Leer un usuario
app.get('/users/:id', function (req, res) {
    const id = parseInt(req.params.id);
    res.json(UserService.getOne(id));
})

//Crear nuevo usuario
app.post('/users', async function (req, res) {
    const form = formidable({multiples: true});
    const [fields, files] = await ns.form_parse(req, form);

    let newUser = JSON.parse(fields.user);
    UserService.create(newUser, files);

    res.status(200).send(newUser);
})

//Actualizar usuario
app.put('/users', async function (req, res) {
    const form = formidable({multiples: true});
    const [fields, files] = await ns.form_parse(req, form);

    let updateUser = JSON.parse(fields.user);
    UserService.update(updateUser, files);

    res.send(200, updateUser);
})

//Eliminar un usuario
app.delete('/users/:id', function (req, res) {
    const id = parseInt(req.params.id);
    res.send(UserService.delete(id));
});

app.listen(port, () => console.log(`Server listening on port ${port}.`));
