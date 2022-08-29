import React from 'react';
import { Switch } from 'react-router-dom';


import { createTheme, makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { CssBaseline } from '@material-ui/core';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
//Components
import NavSup from "./NavSup/NavSup"
import NavLeft from "./NavLeft/NavLeft"
import OkMessage from "./Messages/OkMessage";
import ErrorMessage from "./Messages/ErrorMessage";
import { Redirect, Route } from "react-router";
import Users from "../Users/Users";

//Actions

const useStyles = makeStyles(theme => ({
    offset: theme.mixins.toolbar,
    root: {
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
        },
        paddingTop: theme.spacing(9),
    },
    principal: {
        flexGrow: 1,
        padding: theme.spacing(0),
        marginTop: "24px",
        marginBottom: "90px",
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(0),
        },
    },
}))
export default function Layout() {
    const [open, setOpen] = React.useState(false);


    const handleDrawerOpen = () => {
        setOpen(!open);
    };

    const theme = createTheme({
        palette: {
            primary: {
                light: '#184A2C',
                main: '#184A2C',
                dark: '#184A2C',
                contrastText: '#fff',
            },
            secondary: {
                light: '#B38B59',
                main: '#B38B59',
                dark: '#B38B59',
                contrastText: '#000',
            },
            success: {
                light: "#aed581",
                main: '#4caf50',
                dark: "#80936a"
            },
            error: {
                main: '#f44336',
                light: '#ffcdd2',
                dark: '#8b1a12',
            },
            disabled: {
                light: '#fafafa',
                main: "#f5f5f5"
            },
            default: {
                main: '#2196f3',
                light: "#64b5f6",
                dark: "#1f8de5"
            },
            attention: {
                main: "#FFF42B",
                light: "#fff5a4",
                dark: "#a59c10",
            },
            selected: {
                light: '#184A2C',
                dark: '#B38B59',
            },
            text: {
                light: "black",
                dark: "white"
            },
            type: "light",
        },
        typography: {
            h1: {
                fontSize: "2rem",
                fontWeight: "900",
            },
            h2: {
                fontSize: "1rem",
                fontWeight: "600",
            },
            overline: {
                fontWeight: 700,
                lineHeight: "1",
                fontSize: "0.75rem",
                letterSpacing: "1.1px",
                textTransform: "uppercase",
                fontFamily: "Public Sans, sans-serif",
                color: "rgb(99, 115, 129)",
            },
            fontFamily: [
                "Public Sans",
                "sans-serif",
            ].join(','),
        },
        iconOutlined: {},
        overrides: {
            MuiOutlinedInput: {
                input: {
                    '&:-webkit-autofill': {
                        transitionProperty: "background-color, color",
                        transitionDuration: "5000s",
                        transitionTimingFunction: "ease-in-out",
                        color: "white",
                    },
                },
            },
        },
    });
    const classes = useStyles();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <NavSup open={open} handleDrawerOpen={handleDrawerOpen}/>
            <div className={classes.root}>
                <NavLeft open={open} handleDrawerOpen={handleDrawerOpen}/>
                <main className={classes.principal}>
                    <MuiPickersUtilsProvider utils={MomentUtils} locale="es">
                        <Switch>
                            <Redirect exact from="/" to="users"/>
                            <Route path="/users" component={Users}/>
                        </Switch>
                    </MuiPickersUtilsProvider>
                </main>
            </div>
            <OkMessage/>
            <ErrorMessage/>
        </ThemeProvider>
    );
}

