import React, { useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
//Components
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as PropTypes from "prop-types";
import { green, red } from "@material-ui/core/colors";

const useStyles = makeStyles(theme => ({
    fab: {
        margin: theme.spacing(1),
    },
    wrapper: {
        position: 'relative',
    },
    fabProgress: {
        margin: theme.spacing(1),
        color: red[100],
        position: 'absolute',
        top: -1,
        left: "2px",
        zIndex: 1,
    }
}));

export default function BtnAdd(props) {
    const classes = useStyles();
    const [mostrar, setMostrar] = React.useState(true);
    const isInitialMount = useRef(true);

    const {loading, onClick, fetching} = props;

    useEffect(() => {
        if (isInitialMount.current)
            isInitialMount.current = false;
        else {
            if (loading)
                setMostrar(false);
            else {
                const timer = setTimeout(() => {
                    setMostrar(true);
                }, 5000);
                return () => clearTimeout(timer);
            }

        }
    }, [loading]);

    if (mostrar)
        return (
            <div className={classes.wrapper}>
                <Fab color="primary" aria-label="edit" className={classes.fab} onClick={() => onClick()}
                     disabled={fetching}
                     variant="extended"
                >
                    <span style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                        <AddIcon style={{marginRight: "6px"}}/>
                        {fetching && <CircularProgress size={35} className={classes.fabProgress}/>}
                    </span>
                    Agregar
                </Fab>
            </div>
        );
    else
        return (<div></div>)
}

BtnAdd.propTypes = {
    loading: PropTypes.bool,
    onClick: PropTypes.any,
    fetching: PropTypes.bool,
};