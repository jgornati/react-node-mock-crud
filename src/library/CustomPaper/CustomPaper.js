import React from 'react';
import { Paper } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
//Usar este en vez de Container con maxwidth porque le mete muchos margenes

const CustomStyledPaper = withStyles((theme) => ({
    root: {
        marginTop: "25px",
        boxShadow: theme.shadows[25],
    },
}))(Paper);


export default function CustomPaper(props) {
    return (
        <CustomStyledPaper style={props.style}>
            {props.children}
        </CustomStyledPaper>
    )
}

