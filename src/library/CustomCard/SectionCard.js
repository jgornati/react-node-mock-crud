import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {CardHeader, Card, CardContent, Typography, Box, Button, useTheme} from '@material-ui/core';
import hexToRGBA from "../hexToRGBA";

const CustomStyledCard = withStyles((theme) => ({
    root: {
        cursor: "pointer",
        boxShadow: "none",
        minWidth: "100px",
        "& .MuiCardContent-root": {
            padding: "10px",
        },
    },
}))
(Card);


export default function SectionCard(props) {
    const theme = useTheme();
    const {onClick, id, disabled, size} = props;

    let primaryColor = theme.palette.primary[theme.palette.type];
    return (
        <Button disabled={disabled} style={{
            padding: "0",
            borderRadius: "20px",
            margin: "8px",
            textTransform: "inherit",
            flexShrink: 0,
        }} onClick={() => onClick(id)}>
            <CustomStyledCard style={{
                borderColor: props.bgColor ? props.bgColor : primaryColor, borderStyle: "solid", borderWidth: "1px",
                backgroundColor: props.selected ? (props.bgColor ? props.bgColor : primaryColor) : "inherit"
            }}>
                <CardContent style={{padding: size ? "3px 10px" : ""}}>
                    <Typography variant={"p"} align={"center"}
                                style={{color: !props.selected ? (props.color ? props.color : primaryColor) : "white"}}>
                        {props.primaryText}
                    </Typography>
                </CardContent>
            </CustomStyledCard>
        </Button>
    )
}


