import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Box } from "@material-ui/core";

const BoxCustom = withStyles((theme) => ({
    root: {
        display: "flex",
        flexWrap: "wrap",
        padding: theme.spacing(3),
    },
}))(Box);

export default function PaperHeader(props) {
    return (
        <BoxCustom component={"div"} className={props.className} style={props.style}>
            {props.children}
        </BoxCustom>
    )
}
