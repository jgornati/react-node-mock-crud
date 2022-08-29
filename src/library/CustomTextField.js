import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Box, TextField, useTheme } from "@material-ui/core";

const TxtField = withStyles((theme) => ({
    root: {
        marginTop: "15px",
        marginBottom: "20px",
        "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
            transform: "translate(14px, -15px) scale(0.75)"
        },
        "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
        },
        "& .MuiInputBase-input": {
            paddingLeft: "5px"
        },
        "& .MuiOutlinedInput-root": {
            backgroundColor: theme.palette.textField["background"],
            color: theme.palette.textField["color"],
        }
    }
}))(TextField);

export default function CustomTextField(props) {
    let theme = useTheme();

    if (theme.palette.textField)
        return (
            <TxtField {...props} ref={props.ref}>
                {props.children}
            </TxtField>
        )
    else
        return (
            <TextField {...props} ref={props.ref}/>
        )
}
