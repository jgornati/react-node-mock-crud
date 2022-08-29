import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
//Components
import {
    Breadcrumbs,
    Container,
    InputAdornment,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    TextField,
    Tooltip,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { useDispatch, useSelector } from "react-redux";
import userReset from "../../reset/userReset";
import { fetchUsers, invalidateUsers, resetUsers, saveDeleteUser } from "../../actions/UserActions";
import { Skeleton } from "@material-ui/lab";
import CustomPaper from "../../library/CustomPaper/CustomPaper";
import PaperHeader from "../../library/CustomPaper/PaperHeader";
import CropFreeIcon from "@material-ui/icons/Search";
import Grow from "../../library/Grow";
import PaperFooter from "../../library/CustomPaper/PaperFooter";
import Pagination from "@material-ui/lab/Pagination";
import { Link } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import BtnAdd from "../../library/Buttons/BtnAdd";
import ContainerBtn from "../../library/Buttons/ContainerBtn";
import { fetchRolesIfNeeded } from "../../actions/RoleActions";
import c from "../../constants/Constants";
import AddIcon from "@material-ui/icons/Add";
import Avatar from "@material-ui/core/Avatar";
//Icons
//Img

const useStyles = makeStyles((theme) => ({
    form: {
        padding: theme.spacing(2, 0)
    },
    root: {
        display: 'flex',
        justifyContent: "space-between"
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
    },
    cover: {
        width: 151,
        backgroundSize: "contain"
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
}));


function UsersList(props) {
    const classes = useStyles();
    const dispatch = useDispatch();

    //Store
    const users = useSelector(state => state.users);
    const roles = useSelector(state => state.roles);
    const facePhotos = useSelector(state => state.facePhotos);

    //State
    const [search, setSearch] = useState("");


    const params = new URLSearchParams(props.location.search);
    const order = params.get("order") ? params.get("order") : "id";
    const direction = params.get("direction") ? params.get("direction") : "asc";
    const page = params.get("page") ? params.get("page") : 1;
    const searchPhase = params.get("sp") ? params.get("sp") : "";
    const idCategorySelected = params.get("idCategory") ? params.get("idCategory") : "";

    const disabled = users.byId.isFetching || users.delete.isDeleting;

    //Hooks
    const timer = useRef();


    //Effects
    useEffect(() => {
        window.scrollTo(0, 0);

        if (searchPhase !== search) {
            setSearch(searchPhase);
        }
        dispatch(fetchRolesIfNeeded({}));

        return function cleanup() {
            userReset.resetAll(dispatch);
        }
    }, []);

    useEffect(() => {
        let filtros = {
            searchPhase: search ? search : "",
            order: order,
            direction: direction,
            page: page,
            idCategory: idCategorySelected,
            with: ["facePhoto"]
        };

        dispatch(resetUsers());
        dispatch(invalidateUsers());
        dispatch(fetchUsers(filtros));
    }, [props.location.search]);

    const changeOrder = (or) => {
        params.set("order", or ? or : "");
        let direction = params.get("direction");
        params.set("direction", direction === "asc" ? "desc" : "asc");
        props.history.push("/users?" + params.toString());
    };
    const WAIT_INTERVAL = 500;

    const changeSearch = (e) => {

        clearTimeout(timer.current);
        let valor = e.target.value;
        setSearch(e.target.value);

        timer.current = setTimeout(() => triggerChange(valor), WAIT_INTERVAL);
    };

    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            clearTimeout(timer.current);
            triggerChange();
        }
    };

    const triggerChange = (searchPhase) => {
        if ((!searchPhase && !search) || (searchPhase === "")) {
            params.delete("sp");
            props.history.push("/users?" + params.toString());
        } else {
            params.delete("page");
            params.set("sp", searchPhase ? searchPhase : search);
            props.history.push("/users?" + params.toString());
        }
    };

    const handleChangePage = (e, page) => {
        let pagina = page;
        let paramsPagina = new URLSearchParams(props.location.search);
        paramsPagina.set("page", pagina ? pagina : "1");
        props.history.push("/users?" + paramsPagina.toString());
    };

    const handleChangeEstado = (idUser) => {
        let user = users.byId.users[idUser];
        dispatch(saveDeleteUser(user));
    }

    let Users = [];

    if (users.byId.isFetching) {
        Users = [...Array(5).keys()].map((i) => {
            return (
                <TableRow key={`skel-${i}`}>
                    {[...Array(9).keys()].map((i) =>
                        <TableCell key={`TableCellSkell-${i}`}>
                            <Skeleton variant="text"/>
                        </TableCell>
                    )}
                </TableRow>
            );
        });
    }

    if (!users.byId.isFetching)
        Users = users.allIds.map(idUser => {
            let user = users.byId.users[idUser];
            let role = user && user.idRole ? roles.byId.roles[user.idRole] : null;
            let facePhoto = user && user.face_photo && user.face_photo.length > 0 ? facePhotos.byId.facePhotos[user.face_photo[0]] : null;
            return (
                <TableRow key={`user-${user.id}`}>
                    <TableCell>{user ? user.id : ""}</TableCell>
                    <TableCell>
                        <Avatar aria-label="recipe" className={classes.avatar}
                                src={facePhoto ? `${c.API_HOST}/storage/photos/${facePhoto.filename}` : ""}>
                            {user.lastname ? user.lastname.charAt(0) :
                                <AddIcon/>}
                        </Avatar>
                    </TableCell>
                    <TableCell>{user ? user.name : ""}</TableCell>
                    <TableCell>{user ? user.lastname : ""}</TableCell>
                    <TableCell>{user ? user.email : ""}</TableCell>
                    <TableCell>{user ? user.enterprise : ""}</TableCell>
                    <TableCell>{role ? role.name : ""}</TableCell>
                    <TableCell>
                        <Switch
                            disabled={disabled}
                            checked={user.status === true || user.status === 1}
                            onChange={() => handleChangeEstado(user.id)}
                            name={"estado"}
                            color={"primary"}
                            size={"small"}
                        />
                    </TableCell>
                    <TableCell>
                        <Link to={"/users/" + user.id}
                        >
                            <Tooltip title="Editar">
                                <IconButton aria-label="editar" size={"small"} disabled={disabled}>
                                    <EditIcon color="secondary"/>
                                </IconButton>
                            </Tooltip>
                        </Link>
                    </TableCell>
                </TableRow>
            )
        });

    if (Users.length === 0)
        Users.push(
            <TableRow key={0}>
                <TableCell align="center" colSpan={11}>No se encontraron usuarios</TableCell>
            </TableRow>)


    const totalPaginas = Math.ceil(users.totalUsers ? users.totalUsers / 50 : 0);


    return (
        <Container maxWidth={"lg"}>
            <Breadcrumbs aria-label="breadcrumb" separator={"‣"}>
                <Link color="inherit" to="/">
                    Home
                </Link>
            </Breadcrumbs>
            <Typography component={"h1"} variant={"h1"}>
                Usuarios
            </Typography>
            <CustomPaper>
                {/*<PaperHeader>*/}
                {/*    <TextField*/}
                {/*        id="search"*/}
                {/*        placeholder="Buscar ..."*/}
                {/*        variant="outlined"*/}
                {/*        InputLabelProps={{*/}
                {/*            shrink: true,*/}
                {/*        }}*/}
                {/*        InputProps={{*/}
                {/*            endAdornment:*/}
                {/*                <InputAdornment position="end">*/}
                {/*                    <IconButton>*/}
                {/*                        <CropFreeIcon/>*/}
                {/*                    </IconButton>*/}
                {/*                </InputAdornment>,*/}
                {/*            // disabled: disabled*/}
                {/*        }}*/}
                {/*        value={search ? search : ""}*/}
                {/*        onChange={(e) => changeSearch(e)}*/}
                {/*        onKeyDown={(e) => handleKeyDown(e)}*/}
                {/*    />*/}
                {/*    <Grow/>*/}
                {/*</PaperHeader>*/}
                <TableContainer>
                    <Table aria-label="Tabla de contenido">
                        <TableHead>
                            <TableRow>
                                <TableCell width={"10px"}>
                                    <TableSortLabel
                                        active={order === "id"}
                                        direction={direction}
                                        onClick={() => changeOrder("id")}
                                    >
                                        <b>ID</b>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell width={"50px"}/>
                                <TableCell>
                                    <TableSortLabel
                                        active={order === "name"}
                                        direction={direction}
                                        onClick={() => changeOrder("name")}
                                    >
                                        <b>Nombre</b>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={order === "lastname"}
                                        direction={direction}
                                        onClick={() => changeOrder("lastname")}
                                    >
                                        <b>Apellido</b>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={order === "email"}
                                        direction={direction}
                                        onClick={() => changeOrder("email")}
                                    >
                                        <b>Email</b>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={order === "enterprise"}
                                        direction={direction}
                                        onClick={() => changeOrder("enterprise")}
                                    >
                                        <b>Empresa</b>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={order === "idRol"}
                                        direction={direction}
                                        onClick={() => changeOrder("idRol")}
                                    >
                                        <b>Rol</b>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell width={"10px"}/>
                                <TableCell width={"10px"}/>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                Users
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <PaperFooter style={{justifyContent: "center"}}>
                    {
                        !!totalPaginas && totalPaginas > 1 &&
                        <Pagination count={totalPaginas} page={page ? parseInt(page) : 1} color="primary"
                                    onChange={handleChangePage} size={"small"}/>
                    }
                </PaperFooter>
            </CustomPaper>
            <ContainerBtn>
                <BtnAdd onClick={() => props.history.push("/users/new")} fetching={disabled}/>
            </ContainerBtn>
        </Container>)
}

export default UsersList;
