import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
//IMG
import logo from '../../../assets/img/logoColor.svg';
import { Hidden } from "@material-ui/core";
//Actions

window.Pusher = require('pusher-js');

const useStyles = makeStyles(theme => ({
    grow: {
        position: 'fixed',
        width: '100%',
        flexGrow: 1,
        zIndex: theme.zIndex.drawer + 1,
        [theme.breakpoints.down('sm')]: {
            position: "relative"
        },
    },
    menuButton: {
        display: "flex",
        alignContent: "center",
        alignItems: "center",
    },
    appBar: {
        backgroundColor: theme.palette.type === "dark" ? "rgba(0,0,0,0.74)" : "rgba(255,255,255,0.58)",
        backdropFilter: "blur(6px)",
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
}));

export default function NavSup(props) {
    const classes = useStyles();

    return (
        <div className={classes.grow}>
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: props.open,
                })}
            >
                <Toolbar>
                    <Hidden smUp>
                        <Link to="/" className={classes.menuButton} onClick={() => props.handleDrawerOpen()}>
                            <IconButton
                                edge="start"
                                className={classes.menuButton}
                                color="primary"
                                aria-label="open drawer"
                            >
                                <MenuIcon/>
                            </IconButton>
                        </Link>
                    </Hidden>
                    <Link to="/" className={classes.menuButton}>
                        <img style={{width: "120px", marginRight: '10px'}} src={logo} alt=""/>
                    </Link>
                </Toolbar>
            </AppBar>
        </div>
    );
}
