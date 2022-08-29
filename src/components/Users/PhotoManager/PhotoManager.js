import React from "react";
import Fab from "@material-ui/core/Fab";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import Box from "@material-ui/core/Box";
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import style from "../../../assets/css/PhotoManager.module.css";
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Camera from "./Camera";
import File from "./File";
import {useMediaQuery} from "@material-ui/core";

export default function PhotoManager(props) {
    const {open, setOpen, setLoading, changeFacePhoto, setFiles, files} = props;
    const [openCamera, setOpenCamera] = React.useState(false);
    const [openFile, setOpenFile] = React.useState(false);
    const isMobile = useMediaQuery('(max-width:899px)');

    const handleClose = () => {
        setOpen((prev) => {
            return !prev;
        })
    };

    const handleOpenCamera = () => {
        setOpen(false);
        setOpenCamera(true);
    };

    const handleOpenFile = () => {
        setOpen(false);
        setOpenFile(true);
    };


    if (!isMobile)
        return (
            <React.Fragment>

                <SwipeableDrawer
                    anchor={"bottom"}
                    open={open}
                    onClose={handleClose}
                    onOpen={handleClose}
                >
                    <Box display={"flex"} justifyContent={"center"} margin={"40px"}>
                        <Fab variant="extended" className={style.btnItem} onClick={handleOpenFile}>
                            <FileCopyIcon className={style.extendedIcon}/>
                            Seleccionar archivo
                        </Fab>
                        <Fab variant="extended" className={style.btnItem} onClick={handleOpenCamera}>
                            <CameraAltIcon className={style.extendedIcon}/>
                            Tomar foto
                        </Fab>
                    </Box>
                </SwipeableDrawer>
                <Camera setOpen={setOpenCamera} open={openCamera} setFiles={setFiles} files={files}/>
                <File setOpen={setOpenFile} open={openFile} setLoading={setLoading} changeFacePhoto={changeFacePhoto}
                      setFiles={setFiles} files={files}/>
            </React.Fragment>
        );
    else if (!!isMobile)
        return (
            <React.Fragment>
                <File setOpen={setOpen} open={open} setLoading={setLoading} changeFacePhoto={changeFacePhoto}
                      setFiles={setFiles} files={files}/>
            </React.Fragment>
        );
}
