import React, { useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
//Components
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import SaveIcon from '@material-ui/icons/SaveRounded';
import CheckIcon from '@material-ui/icons/Check';
import CircularProgress from '@material-ui/core/CircularProgress';
import clsx from 'clsx';
import Snackbar from '@material-ui/core/Snackbar';
import AddIcon from "@material-ui/icons/Add";
import { red } from "@material-ui/core/colors";


const useStyles = makeStyles(theme => ({
    fab: {
        margin: theme.spacing(1),
        color: '#fff',
        backgroundColor: "#7ecb20",
        boxShadow: "rgb(126 203 32 / 60%) 0px 5px 16px 0px",
        "&:hover": {
            backgroundColor: "#6bb014",
        }
    },
    wrapper: {
        position: 'relative',
    },
    buttonSuccess: {
        backgroundColor: theme.palette.secondary,
        '&:hover': {
            backgroundColor: theme.palette.secondary,
        },
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

export default function BtnSave(props) {
    const classes = useStyles();

    // const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const isInitialMount = useRef(true);

    const {loading, error, onClick, disabled} = props;

    const fabClass = clsx({
        [classes.buttonSuccess]: success,
    });

    useEffect(() => {
        if (isInitialMount.current)
            isInitialMount.current = false;
        else if (!loading && (error === "" || !error)) {
            setSuccess(true);
            const timer = setTimeout(() => {
                setSuccess(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [loading]);

    return (
        <div className={classes.wrapper}>
            <Fab type="submit" aria-label="edit" className={`${fabClass} ${classes.fab}`}
                 variant={"extended"}
                 disabled={loading || disabled} onClick={(e) => {
                if (onClick) onClick(e);
            }}>
                <span style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <div style={{display: "flex", alignItems: "center"}}>
                        {
                            success ?
                                <>
                                    <CheckIcon style={{marginRight: "6px"}}/> Guardado
                                </>
                                :
                                <>
                                    <SaveIcon style={{marginRight: "6px"}}/> Guardar
                                </>
                        }
                    </div>
                    {loading && <CircularProgress size={35} color="secondary" className={classes.fabProgress}/>}
                </span>
            </Fab>

            <Snackbar
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                key={0}
                open={success}
                //onClose={handleClose}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">Se guardaron los cambios</span>}

            >

            </Snackbar>
        </div>
    );
}