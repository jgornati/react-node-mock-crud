import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
//Components
import {
    Box,
    Breadcrumbs,
    Chip,
    Container,
    FormControlLabel,
    MenuItem,
    Switch,
    TextField,
    Typography,
} from '@material-ui/core';
import CustomPaper from "../../library/CustomPaper/CustomPaper";
import PaperHeader from "../../library/CustomPaper/PaperHeader";
import ContainerBtn from "../../library/Buttons/ContainerBtn";
import BtnSave from "../../library/Buttons/BtnSave";
import BtnCancel from "../../library/Buttons/BtnCancel";
import Grid from "@material-ui/core/Grid";
import PaperBody from "../../library/CustomPaper/PaperBody";
//Img
import DoneIcon from '@material-ui/icons/Done';
//Hooks
import { useValidator } from "../../utils/validator";
import { useDispatch, useSelector } from "react-redux";
//Actions
import { createUser, fetchUser, saveCreateUser, saveUpdateUser, updateUser } from "../../actions/UserActions";
//reset
import userReset from "../../reset/userReset";
import { useHistory } from "react-router";
import { fetchRolesIfNeeded } from "../../actions/RoleActions";
import FacePhoto from "./FacePhoto";
import clone from "lodash/clone";
import { createFacePhoto, updateFacePhoto } from "../../actions/FacePhotoActions";

export default function CRUDUser(props) {
    const dispatch = useDispatch();
    let {idUser} = useParams();
    const mounted = useRef();
    const history = useHistory();

    //Store
    const users = useSelector(state => state.users);
    const roles = useSelector(state => state.roles);
    const user = idUser ? users.update.activo : users.create.nuevo;
    const facePhotos = useSelector(state => state.facePhotos);

    //State
    const [files, setFiles] = useState([]);
    const savingLoader = idUser ? users.update.isUpdating : users.create.isCreating;
    const disabled = (idUser ? users.update.isUpdating : users.create.isCreating) || users.byId.isFetching;
    const error = idUser ? users.update.error : users.create.error;

    //Hooks
    let rule = {
        name: ["required"],
        lastname: ["required"],
        email: ["required"],
    };
    const [validator, validate] = useValidator(rule);


    //Effects
    useEffect(() => {
        window.scrollTo(0, 0);
        if (idUser)
            dispatch(fetchUser(idUser));

        dispatch(fetchRolesIfNeeded({}));

        return function cleanup() {
            userReset.resetAll(dispatch);
        }
    }, []);


    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
        } else {
            if (!users.create.isCreating && !users.create.error) {
                userReset.resetAll(dispatch);
                window.scrollTo(0, 0);
                history.push("/users/new");
                setFiles([]);
            }
        }
    }, [users.create.isCreating]);

    //User
    const handleChangeUser = (e) => {
        let cambio = {};
        cambio[e.target.id ? e.target.id : e.target.name] = e.target.value;
        changeUser(cambio);
    };


    const changeUser = (cambio) => {
        if (idUser)
            dispatch(updateUser(cambio));
        else
            dispatch(createUser(cambio));
    };

    const handleChangeStatusUser = () => {
        let cambio = {};
        cambio.status = !user.status;
        changeUser(cambio);
    }

    const changeFacePhoto = (cambio, idFacePhoto) => {
        //Verificar si ya esta siendo actualizado
        let facePhoto = idFacePhoto && facePhotos.update.activos.indexOf(idFacePhoto) === -1 && facePhotos.create.nuevos.indexOf(idFacePhoto) === -1 ? facePhotos.byId.facePhotos[idFacePhoto] : null;
        if (facePhoto) {
            let actualizar = facePhoto ? clone(facePhoto) : null;
            if (actualizar) {
                let cambioAssetLanguage = {};
                cambioAssetLanguage[actualizar.id] = actualizar;
                if (idFacePhoto.toString().indexOf("-") === -1)
                    dispatch(updateFacePhoto(cambioAssetLanguage));
                else
                    dispatch(createFacePhoto(cambioAssetLanguage));
            }
        }
        cambio.id = idFacePhoto;
        cambio.idUser = user.id;
        let cambioAssetLanguage = {};
        cambioAssetLanguage[idFacePhoto] = cambio;
        if (idFacePhoto.toString().indexOf("-") === -1)
            dispatch(updateFacePhoto(cambioAssetLanguage));
        else
            dispatch(createFacePhoto(cambioAssetLanguage));
    };

    //Submit
    const onSubmit = (e) => {
        e.preventDefault();
        if (validator.isValid()) {
            if (idUser)
                dispatch(saveUpdateUser(files));
            else
                dispatch(saveCreateUser(files));
        }
    };


    return (
        <Container maxWidth={"lg"}>
            <Breadcrumbs aria-label="breadcrumb" separator={"‣"}>
                <Link color="inherit" to="/">
                    Home
                </Link>
                <Link color="inherit" to="/users">
                    Usuarios
                </Link>
            </Breadcrumbs>
            <Typography component={"h1"} variant={"h1"}>
                {!idUser ? "Nuevo usuario" : "Modificar usuario"}
            </Typography>
            <form onSubmit={onSubmit}>
                <Grid container spacing={2}>
                    <Grid item md={6} sm={12} xs={12}>
                        <CustomPaper>
                            <PaperHeader>
                                <Typography variant={"overline"} component={"span"}>
                                    Datos del usuario
                                </Typography>
                            </PaperHeader>
                            <PaperBody spacing={2}>
                                <Grid container spacing={1}>
                                    <Grid item md={6} sm={12} xs={12}>
                                        <FacePhoto files={files} setFiles={setFiles}
                                                   changeFacePhoto={changeFacePhoto}
                                                   facePhoto={user && user.face_photo && user.face_photo.length > 0 ? facePhotos.byId.facePhotos[user.face_photo[0]] : null}
                                                   file={user.path} disabled={disabled}/>
                                    </Grid>
                                    <Grid item md={6} sm={12} xs={12}>
                                        <TextField
                                            id="name"
                                            placeholder="Nombre"
                                            variant="outlined"
                                            margin={"normal"}
                                            label={"Nombre *"}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            InputProps={{
                                                disabled: disabled,
                                                type: "text"
                                            }}
                                            disabled={disabled}
                                            fullWidth
                                            value={user && user.name ? user.name : ""}
                                            onChange={handleChangeUser}
                                            onBlur={validate}
                                            error={!validator.isValidById("name")}
                                            helperText={validator.getHelperTextById("name")}
                                        />
                                        <TextField
                                            id="lastname"
                                            placeholder="Apellido"
                                            variant="outlined"
                                            label={"Apellido *"}
                                            margin={"normal"}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            InputProps={{
                                                disabled: disabled,
                                                type: "text"
                                            }}
                                            disabled={disabled}
                                            fullWidth
                                            value={user && user.lastname ? user.lastname : ""}
                                            onChange={handleChangeUser}
                                            onBlur={validate}
                                            error={!validator.isValidById("lastname")}
                                            helperText={validator.getHelperTextById("lastname")}
                                        />
                                    </Grid>

                                    <Grid container>
                                        <TextField
                                            id="dni"
                                            placeholder="DNI"
                                            variant="outlined"
                                            margin={"normal"}
                                            label={"DNI *"}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            InputProps={{
                                                disabled: disabled,
                                                type: "number",
                                            }}
                                            disabled={true}
                                            fullWidth
                                            value={user && user.dni ? user.dni : ""}
                                            onChange={(e) => handleChangeUser(e)}
                                            onBlur={validate}
                                            error={!validator.isValidById("dni")}
                                            helperText={validator.getHelperTextById("dni")}
                                        />
                                    </Grid>
                                </Grid>
                                <Box display={"flex"} justifyContent={"space-between"} marginTop={"50px"} width={"100%"}>
                                    {
                                        idUser &&
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={user && !!user.status}
                                                    onChange={() => handleChangeStatusUser()}
                                                    disabled={disabled}
                                                    name="estado"
                                                    inputProps={{'aria-label': 'secondary checkbox'}}
                                                />}
                                            label="Estado"
                                        />
                                    }
                                    {
                                        user.status === 1 &&
                                        <Chip
                                            icon={<DoneIcon/>}
                                            label="Activo"
                                            color="primary"
                                            variant="outlined"
                                        />
                                    }
                                    {
                                        user.status === 0 &&
                                        <Chip
                                            icon={<DoneIcon/>}
                                            label="Inactivo"
                                            color="secondary"
                                            variant="outlined"
                                        />
                                    }
                                </Box>
                            </PaperBody>
                        </CustomPaper>
                    </Grid>
                    <Grid item md={6} sm={12} xs={12}>
                        <CustomPaper>
                            <PaperHeader>
                                <Typography variant={"overline"} component={"span"}>
                                    Contacto
                                </Typography>
                            </PaperHeader>
                            <PaperBody spacing={2}>
                                <Grid item md={12} sm={12} xs={12}>
                                    <TextField
                                        id="email"
                                        placeholder="Email"
                                        variant="outlined"
                                        margin={"normal"}
                                        label={"Email *"}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            disabled: disabled,
                                            type: "text",
                                        }}
                                        disabled={true}
                                        fullWidth
                                        value={user && user.email ? user.email : ""}
                                        onChange={(e) => handleChangeUser(e)}
                                        onBlur={validate}
                                        error={!validator.isValidById("email")}
                                        helperText={validator.getHelperTextById("email")}
                                    />
                                    <TextField
                                        id="mobilePhone"
                                        placeholder="Celular"
                                        variant="outlined"
                                        margin={"normal"}
                                        label={"Celular"}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            disabled: disabled,
                                            type: "number",
                                        }}
                                        disabled={true}
                                        fullWidth
                                        value={user && user.mobilePhone ? user.mobilePhone : ""}
                                        onChange={(e) => handleChangeUser(e)}
                                        onBlur={validate}
                                        error={!validator.isValidById("mobilePhone")}
                                        helperText={validator.getHelperTextById("mobilePhone")}
                                    />
                                    <TextField
                                        id="enterprise"
                                        placeholder="Empresa"
                                        variant="outlined"
                                        margin={"normal"}
                                        label={"Empresa"}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            disabled: disabled,
                                            type: "text",
                                        }}
                                        disabled={true}
                                        fullWidth
                                        value={user && user.enterprise ? user.enterprise : ""}
                                        onChange={(e) => handleChangeUser(e)}
                                        onBlur={validate}
                                        error={!validator.isValidById("enterprise")}
                                        helperText={validator.getHelperTextById("enterprise")}
                                    />
                                    <TextField
                                        id={"idRole"}
                                        select
                                        fullWidth
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        label={"Rol *"}
                                        placeholder={"Seleccione rol"}
                                        value={user && user.idRole ? user.idRole : ""}
                                        onChange={(e) => handleChangeUser(e)}
                                        InputProps={{
                                            disabled: disabled,
                                            id: "idRole", name: "idRole",
                                        }}
                                        disabled={disabled}
                                        variant="outlined"
                                        margin={"normal"}
                                        onBlur={validator.validate}
                                        error={!validator.isValidById("idRole")}
                                        helperText={validator.getHelperTextById("idRole")}
                                    >
                                        {
                                            roles && roles.allIds.map((idRole) => {
                                                let role = roles.byId.roles[idRole];
                                                if (role)
                                                    return (
                                                        <MenuItem key={`rol-${idRole}`} value={idRole}>
                                                            {role.name}
                                                        </MenuItem>
                                                    )
                                            })
                                        }
                                    </TextField>
                                </Grid>
                            </PaperBody>
                        </CustomPaper>
                    </Grid>
                </Grid>

                <ContainerBtn>
                    <BtnCancel
                        onClick={() => props.location.pathname === "/users/new" ? props.history.push("/users") : props.history.goBack()}/>
                    <BtnSave loading={savingLoader} disabled={disabled} error={error}/>
                </ContainerBtn>
            </form>

        </Container>
    );
}
