import React from 'react';
import {Grid, Paper} from "@material-ui/core";
import {withStyles} from '@material-ui/core/styles';
//Usar este en vez de Container con maxwidth porque le mete muchos margenes

const CustomStyledPaper = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2,3),
    },
}))(Grid);


export default function PaperBody(props) {
    return (
        <CustomStyledPaper container style={props.style} spacing={props.spacing}>
            {props.children}
        </CustomStyledPaper>
    )
}

