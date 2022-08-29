import React, { useEffect, useRef, useState } from "react";
import style from "../../../assets/css/Camera.module.css";
import { AppBar, Dialog, FormControl, MenuItem, Select, Zoom } from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Fab from "@material-ui/core/Fab";
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import ReplayIcon from '@material-ui/icons/Replay';
import clone from "lodash/clone";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function Camera(props) {
    const [imageDataURL, setImageDataURL] = useState(false);
    let player = useRef();
    let cameraNumber = useRef(0);
    let qCamera = useRef(0);
    const {open, setOpen, files, setFiles} = props;
    const [cameras, setCameras] = useState([]);

    useEffect(() => {
        if (!!open)
            initializeMedia();

    }, [open]);

    const handleClose = () => {
        setOpen(false);
    };

    const initializeMedia = async () => {
        setImageDataURL(null);

        if (!("mediaDevices" in navigator)) {
            navigator.mediaDevices = {};
        }

        if (!("getUserMedia" in navigator.mediaDevices)) {
            navigator.mediaDevices.getUserMedia = function (constraints) {
                var getUserMedia =
                    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

                if (!getUserMedia) {
                    return Promise.reject(new Error("getUserMedia Not Implemented"));
                }

                return new Promise((resolve, reject) => {
                    getUserMedia.call(navigator, constraints, resolve, reject);
                });
            };
        }

        //Get the details of video inputs of the device
        const videoInputs = await getListOfVideoInputs();
        qCamera.current = videoInputs;
        setCameras(videoInputs);
        //The device has a camera
        console.log("videoInputs", videoInputs);
        if (videoInputs.length) {
            navigator.mediaDevices
                .getUserMedia({
                    video: {
                        groupId: {
                            exact: videoInputs[cameraNumber.current].groupId,
                        },
                    },
                })
                .then((stream) => {
                    player.current.srcObject = stream;
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            alert("The device does not have a camera");
        }
    };

    const capturePicture = () => {
        var canvas = document.createElement("canvas");
        canvas.width = player.current.videoWidth;
        canvas.height = player.current.videoHeight;
        var contex = canvas.getContext("2d");
        contex.drawImage(player.current, 0, 0, canvas.width, canvas.height);
        player.current.srcObject.getVideoTracks().forEach((track) => {
            track.stop();
        });

        setImageDataURL(canvas.toDataURL());
    };

    const switchCamera = async (idCam) => {
        const listOfVideoInputs = await getListOfVideoInputs();

        // The device has more than one camera
        if (listOfVideoInputs.length > 1) {
            if (player.current.srcObject) {
                player.current.srcObject.getVideoTracks().forEach((track) => {
                    track.stop();
                });
            }

            // switch to second camera
            if (cameraNumber.current === 0) {
                cameraNumber.current = 1;
            }
            // switch to first camera
            else if (cameraNumber.current === 1) {
                cameraNumber.current = 0;
            }

            if (!!idCam)
                cameraNumber.current = idCam;

            // Restart based on camera input
            initializeMedia();
        } else if (listOfVideoInputs.length === 1) {
            alert("The device has only one camera");
        } else {
            alert("The device does not have a camera");
        }
    };

    const getListOfVideoInputs = async () => {
        // Get the details of audio and video output of the device
        const enumerateDevices = await navigator.mediaDevices.enumerateDevices();

        //Filter video outputs (for devices with multiple cameras)
        return enumerateDevices.filter((device) => device.kind === "videoinput");
    };

    const dataURLtoFile = (dataurl, filename) => {

        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], filename, {type: mime});
    }

    const handleSave = () => {
        let file = dataURLtoFile(imageDataURL, "screencapture");
        let picturesTemp = clone(files);
        picturesTemp[0] = file;
        setFiles(picturesTemp);
        handleClose();
    }


    const playerORImage = Boolean(imageDataURL) ? (
        <img src={imageDataURL} alt="cameraPic"/>
    ) : (
        <video
            ref={player}
            autoPlay
        ></video>
    );

    const handleChangeCamera = (e) => {
        switchCamera(e.target.value);
    }

    return (
        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
            <AppBar>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                        <CloseIcon/>
                    </IconButton>
                    <Typography variant="h6" className={style.title}>
                        Tomar foto
                    </Typography>
                    <FormControl>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={cameraNumber.current ? cameraNumber.current : 0}
                            variant={"outlined"}
                            style={{color: "white"}}
                            onChange={handleChangeCamera}
                        >
                            {
                                cameras && cameras.map((cam, index) => {
                                    console.log(cam);
                                    return (
                                        <MenuItem key={`cam-${index}`} value={index}>
                                            {cam.label}
                                        </MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </FormControl>
                    <Button autoFocus color="inherit" onClick={handleSave}>
                        Guardar
                    </Button>
                </Toolbar>
            </AppBar>
            <div className={style.cameraContainer}>
                {playerORImage}
                <div className={style.containerController}>
                    <Zoom
                        in={open}
                        unmountOnExit
                    >
                        <Fab aria-label={"Tomar foto"} color={"primary"}
                             onClick={!imageDataURL ? capturePicture : initializeMedia}
                             className={style.btnCapture}>
                            {
                                !imageDataURL ?
                                    <CameraAltIcon/>
                                    :
                                    <ReplayIcon/>
                            }
                        </Fab>
                    </Zoom>
                    {
                        qCamera.current > 0 &&
                        <Fab size={"small"} aria-label={"Cambiar cámara"} color={"secondary"}
                             onClick={switchCamera}>
                            <ReplayIcon/>
                        </Fab>
                    }
                </div>
            </div>
        </Dialog>
    );
}
