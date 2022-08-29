import React, {useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import * as PropTypes from "prop-types";
//Components
import {Box, Button, CircularProgress, Typography} from '@material-ui/core';
import clsx from "clsx";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
//Icons
import clone from "lodash/clone";
import c from "../../constants/Constants";
import PhotoManager from "./PhotoManager/PhotoManager";
//Img


const styles = makeStyles((theme) => ({
    fileInput: {
        marginBottom: "12px",
        "& label": {
            width: "100%",
            height: "100%",
            display: "flex",
            padding: "0px 8px",
            paddingBottom: "11px",
            paddingTop: "12px",
            borderRadius: "8px",
            backgroundColor: "rgba(241, 10, 77, 0.1)",
            cursor: "pointer",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            "& *": {
                pointerEvents: "none",
            },
        },
        "& input[type=file]": {
            width: "0.1px",
            height: "0.1px",
            opacity: 0,
            overflow: "hidden",
            top: "50%",
            left: "50%",
            position: "absolute",
            zIndex: "-1",
        }
    },
    mobile: {
        width: "100%",
        maxWidth: "120px",
        height: "120px",
        paddingRight: "6px",
    },
    desktop: {
        width: "100%",
        height: "100%",
        "& img": {
            objectFit: "cover",
            height: "100%",
        }
    },
    buttonUpload: {
        padding: 0,
        borderRadius: "8px",
        textTransform: "none",
        width: "100%",
        height: "100%",
        "& .MuiButton-label": {
            width: "100%",
            height: "100%",
            border: "1px dashed #7978786e",
            borderRadius: "8px",
            padding: "3px"
        },
    },
    labelButton: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "hidden",
        position: "relative",
        "& img": {
            position: "absolute",
            maxWidth: "100%",
            backgroundColor: "white",
        }
    },
    progress: {
        width: "80px !important",
        height: "80px !important",
        position: "absolute",
        "& svg circle": {
            strokeWidth: "1.2",
        }
    }
}));


export default function FacePhoto(props) {
    const classes = styles();
    let inputfileprod = React.createRef();
    let img = React.useRef();
    const [openPhotoManager, setOpenPhotoManager] = React.useState(false);
    const {
        disabled,
        files,
        setFiles,
        changeFacePhoto,
        facePhoto
    } = props;
    //State
    const [loading, setLoading] = React.useState(false);

    //Effects
    useEffect(() => {
        //Cargar foto
        for (let i = 0; i < files.length; i++) {
            let fileUploaded = files[i];
            let filename = "facephoto";
            if (fileUploaded.name)
                filename = fileUploaded.name.replace(/[^a-zA-Z0-9]/g, '.');
            Object.defineProperty(fileUploaded, 'name', {
                writable: true,
                value: filename
            })
            let reader = new FileReader();
            reader.onloadend = (e) => {
                setLoading(false);
                img.current.src = reader.result;
            };

            if (fileUploaded) {
                reader.readAsDataURL(fileUploaded);
            }

            let id = facePhoto && facePhoto.id  ? facePhoto.id : Date.now() + Math.random() + "-";
            let cambio = facePhoto ? clone(facePhoto) : {};
            cambio.filename = filename;
            changeFacePhoto(cambio, id);
        }
        return function cleanup() {
        }

    }, [files]);

    return (
        <Box component={"div"} width={"100%"} height={"100%"}>
            <Box component={"div"} className={clsx([classes.fileInput, classes.desktop])}>
                <Button className={classes.buttonUpload} disabled={disabled} onClick={()=>setOpenPhotoManager((prev) => !prev)}>
                    <label
                           className={classes.labelButton}
                    >
                        <AddPhotoAlternateIcon color={"primary"}/>
                        <Typography variant={"caption"} color={"primary"}>
                            Subir foto cara
                        </Typography>
                        <img ref={img} src={facePhoto ? `${c.API_HOST}/storage/photos/${facePhoto.filename}` : ""} alt=""/>
                        <CircularProgress className={classes.progress}
                                          style={{display: !loading ? "none" : "inherit"}}/>
                    </label>
                    <input disabled={disabled} ref={inputfileprod} type="file" name="mainFilePost" id={"mainFilePost"}
                           className="inputfile"
                           accept="image/*"
                    />
                </Button>
            </Box>
            <PhotoManager setOpen={setOpenPhotoManager} open={openPhotoManager} setLoading={setLoading}
                          changeFacePhoto={changeFacePhoto} setFiles={setFiles} files={files}/>
        </Box>
    );
}

FacePhoto.propTypes = {
    legend: PropTypes.string,
}
