import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Box, Button, Card, CardContent, Typography, useTheme} from '@material-ui/core';
import hexToRGBA from "../hexToRGBA";
import * as PropTypes from "prop-types";
/*
* Trabajar con colores RGB
* */

const CustomStyledCard = withStyles((theme) => ({
    root: {
        cursor: "pointer",
        boxShadow: "none",
        width: "110px",
        height: "110px",
        // paddingBottom: "10px",
        "& .icono": {
            marginTop: "20px",
        },
    },
}))
(Card);


export default function AssetCard(props) {
    const theme = useTheme();
    const {onClick, id, disabled} = props;

    let primaryColor = theme.palette.primary[theme.palette.type];

    return (
        <Button disabled={disabled} style={{
            padding: "0",
            borderRadius: "20px",
            margin: "8px",
            textTransform: "inherit",
            flexShrink: 0,
        }}
                onClick={() => onClick(id)}>
            <CustomStyledCard style={{
                borderColor: props.bgColor ? props.bgColor : primaryColor,
                borderStyle: "solid",
                borderWidth: "1px",
                backgroundColor: props.selected ? (props.bgColor ? props.bgColor : primaryColor) : "inherit"
            }}>
                <Box component={"div"} className={"icono"}>
                    <div className={"round"}
                         style={{
                             color: !props.selected ? (props.color ? props.color : primaryColor) : "white",
                             // backgroundImage: `linear-gradient(${props.selected ? "15deg" : "135deg"}, ${props.color ? props.color.replace(')', ', 0)').replace('rgb', 'rgba') : hexToRGBA(primaryColor, "0")} 0%, ${props.color ? props.color.replace(')', ', 0.24)').replace('rgb', 'rgba') : hexToRGBA(primaryColor, "0.24")} 100%)`,
                         }}>
                        {props.icon}
                    </div>
                </Box>
                <CardContent>
                    <Typography variant={"p"} align={"center"}
                                style={{color: !props.selected ? (props.color ? props.color : primaryColor) : "white"}}>
                        {props.primaryText}
                    </Typography>
                </CardContent>
            </CustomStyledCard>
        </Button>
    )
}

AssetCard.propTypes = {
    /** background color only RGB format. */
    bgColor: PropTypes.string,
    /** color color only RGB format. */
    color: PropTypes.string,
    selected: PropTypes.bool,
    icon: PropTypes.any.isRequired,
    primaryText: PropTypes.any.isRequired,
};