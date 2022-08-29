import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
//Components
import CssBaseline from '@material-ui/core/CssBaseline';


const useStyles = makeStyles(theme => ({
    containerBtn: {
        position: 'fixed',
        bottom: theme.spacing(1),
        right: theme.spacing(1),
        display: "flex",
        alignItems: "center",
        zIndex:2
    },
}));

export default function ContainerBtn(props) {
    const classes = useStyles();

    return (
        <section className={classes.containerBtn}>
            <CssBaseline/>
            {props.children}
        </section>
    );
}