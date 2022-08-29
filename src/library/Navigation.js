import React from 'react';
import {Box, Button, useTheme} from "@material-ui/core";
import {ReactComponent as NextArrow} from "../assets/img/next-arrow.svg";
import {useHistory} from "react-router";
import Dni from "../endUserComponents/PhotoManager/Dni";
import PersonalData from "../endUserComponents/PhotoManager/PersonalData";
import DateDataPicker from "../endUserComponents/PhotoManager/DateDataPicker";
import Selfie from "../endUserComponents/PhotoManager/Selfie";
import Confirmation from "../endUserComponents/PhotoManager/Confirmation";

export default function Navigation(props) {
    const theme = useTheme();
    const history = useHistory();
    const {disabled, goToStep, prevStep} = props;


    return (
        <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} marginTop={"auto"}
             paddingBottom={"30px"}>

            <Button
                disabled={!prevStep}
                style={{textTransform: "inherit"}}
                size={"small"}
                component={"a"}
                onClick={prevStep}
            >
                Volver
            </Button>

            <Box display={"flex"} alignItems={"center"} justifyContent={"flex-end"} marginTop={"auto"}>
            {
                props.skip === true &&
                <Button
                    type={"button"}
                    disabled={disabled}
                    style={{textTransform: "inherit", fontWeight: "600"}}
                    color={"primary"}
                    size={"large"}
                    // component={"a"}
                    onClick={() => goToStep(props.next)}
                >
                    Omitir
                </Button>
            }

            <Button
                type={"submit"}
                disabled={disabled}
                endIcon={
                    <NextArrow style={{
                        fill: theme.palette.primary["main"],
                        width: "18px",
                    }}/>}
                style={{textTransform: "inherit", fontWeight: "600"}}
                color={"primary"}
                size={"large"}
                // component={"a"}
                // onClick={() => goToStep(props.next)}
            >
                Siguiente
            </Button>
            </Box>
        </Box>
    )
}
