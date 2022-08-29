import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import Hidden from '@material-ui/core/Hidden';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import GroupIcon from '@material-ui/icons/Group';
//IMG
import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import { useSelector } from "react-redux";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        height: "28px"
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    flecha: {
        position: "fixed",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        top: "120px",
        width: "24px",
        height: "24px",
        borderRadius: "100%",
        border: "1px solid",
        borderColor: theme.palette.grey[500],
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: theme.palette.background.paper
    },
    flechaDrawerOpen: {
        left: drawerWidth - 12,
        transition: theme.transitions.create('left', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    flechaDrawerClose: {
        left: theme.spacing(7) - 12,
        [theme.breakpoints.up('sm')]: {
            left: theme.spacing(9) - 12,
        },
        transition: theme.transitions.create('left', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    flechaIcon: {
        padding: "0px"
    },
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
    itemVisitado: {
        backgroundColor: theme.palette.action.selected,
        "& .MuiListItemIcon-root": {
            color: theme.palette.selected[theme.palette.type]
        }
    },
    linkVisitado: {},
    link: {
        color: theme.palette.text[theme.palette.type],
        textDecoration: "none",
    },
    btnItemMenu: {
        "& a": {
            textDecoration: "none",
            display: "flex",
            color: "inherit",
            alignItems: "center",
            width: "100%"
        }
    }
}));

export default function NavLeft(props) {
    const classes = useStyles();
    let location = useLocation();

    //Store

    const ItemsMenu = () => {
        return (<List>
            <ListItem button className={clsx(classes.btnItemMenu, {
                [classes.itemVisitado]: location.pathname.indexOf("users") !== -1,
            })}>
                <Link to={"/users"}>
                    <ListItemIcon><GroupIcon/></ListItemIcon>
                    <ListItemText primary={"Usuarios"}/>
                </Link>
            </ListItem>

        </List>)
    }

    const list = anchor => (
        <div
            className={clsx(classes.list, {
                [classes.fullList]: anchor === 'top' || anchor === 'bottom',
            })}
            role="presentation"
            onClick={props.handleDrawerOpen}
            onKeyDown={props.handleDrawerOpen}
        >
            {ItemsMenu()}
            <Divider/>

        </div>
    );


    return (
        <div>
            <Hidden xsDown implementation="css">
                <div className={clsx(classes.flecha, {
                    [classes.flechaDrawerOpen]: props.open,
                    [classes.flechaDrawerClose]: !props.open,
                })}>
                    <IconButton className={classes.flechaIcon}
                                onClick={props.handleDrawerOpen}>
                        {!props.open ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
                    </IconButton>
                </div>
                <Drawer
                    variant="permanent"
                    className={clsx(classes.drawer, {
                        [classes.drawerOpen]: props.open,
                        [classes.drawerClose]: !props.open,
                    })}
                    classes={{
                        paper: clsx({
                            [classes.drawerOpen]: props.open,
                            [classes.drawerClose]: !props.open,
                        }),
                    }}
                >
                    <div className={clsx(classes.toolbar)}/>
                    <Divider/>
                    <List>
                        {ItemsMenu()}
                    </List>
                    <Divider/>
                </Drawer>
            </Hidden>
            <Hidden smUp>
                <SwipeableDrawer
                    anchor='left'
                    open={props.open}
                    onClose={props.handleDrawerOpen}
                    onOpen={props.handleDrawerOpen}
                >
                    {list('left')}
                </SwipeableDrawer>
            </Hidden>
        </div>
    );
}
