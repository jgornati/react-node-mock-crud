import React, { useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
//Components
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import CancelIcon from "@material-ui/icons/CloseRounded";
// import {} from '@material-ui/core/colors';
import CircularProgress from '@material-ui/core/CircularProgress';


const useStyles = makeStyles(theme => ({
    fab: {
        margin: theme.spacing(1),
        backgroundColor: "#EAEAEA",
        boxShadow: "rgb(234 234 234 / 77%) 0px 5px 16px 0px",
        "&:hover": {
            backgroundColor: "#b9b9b9",
        },
    },
    wrapper: {
        position: 'relative',
    },
    fabProgress: {
        margin: theme.spacing(1),
        color: theme.palette.primary,
        position: 'absolute',
        top: -6,
        left: -6,
        zIndex: 1,
    }
}));

export default function BtnCancel(props) {
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
                <Fab variant={"extended"} aria-label="edit" className={classes.fab} onClick={() => onClick()}
                     disabled={fetching}>
                    <CancelIcon/> Cancelar
                </Fab>
                {fetching && <CircularProgress size={68} className={classes.fabProgress}/>}
            </div>
        );
    else
        return (<div></div>)
}