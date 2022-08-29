import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
//Components
import { Box } from "@material-ui/core";
import ReactQuill, { Quill } from "react-quill";
import clsx from "clsx";
import * as PropTypes from "prop-types";
import ImageResize from 'quill-image-resize-module-react';

const useStyles = makeStyles(theme => ({
    containerHTMLEditor: {
        margin: theme.spacing(2, 0),
        position: "relative",
        width: "100%",
        "& .labelHTMLEditor": {
            position: "absolute",
            top: "-8px",
            left: "9px",
            padding: "0 5px",
            fontSize: "0.75rem",
            backgroundColor: "white",
            color: "rgba(0, 0, 0, 0.54)",
        },
        "&:hover .ql-container, &:hover .ql-toolbar,": {
            borderColor: "#000"
        },
        "&:focus .ql-container, &:focus .ql-toolbar,": {
            borderColor: "red"
        }
    },
    reactQuill: {
        width: "100%",
        height: "100%",
        marginBottom: "5px",
        "& .ql-toolbar": {
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
        },
        "& .ql-container": {
            borderBottomLeftRadius: "8px",
            borderBottomRightRadius: "8px",
            height: props => props.rows ? props.rows : "80px"
        }
    }
}));

export default function HTMLEditor(props) {
    const classes = useStyles(props);
    const [value, setValue] = useState('');
    Quill.register('modules/imageResize', ImageResize);

    let modules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],               // custom button values
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
            [{ 'direction': 'rtl' }],                         // text direction
            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'font': [] }],
            [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
            ['link', 'image', 'video'],
            ['clean'],
        ],
        imageResize: {
            parchment: Quill.import('parchment'),
            modules: ['Resize', 'DisplaySize']
        },
    };

    let formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'video','align'
    ];
    return (
        <Box component={"div"} className={classes.containerHTMLEditor}>
            <ReactQuill style={props.style} className={clsx([props.className, classes.reactQuill])}
                        value={props.value ? props.value : value}
                        onChange={props.onChange ? props.onChange : setValue}
                        modules={props.modules ? props.modules : modules}
                        formats={props.formats ? props.formats : formats}
                        placeholder={props.placeholder}
                        id={props.id}
                        disabled={props.disabled ? props.disabled : false}
            />
            <label className={"labelHTMLEditor"}>
                {props.textLabel}
            </label>
        </Box>
    )
}

HTMLEditor.propTypes = {
    style: PropTypes.object,
    className: PropTypes.any,
    modules: PropTypes.object,
    formats: PropTypes.array,
    placeholder: PropTypes.any,
    textLabel: PropTypes.string,
    /** Height body in px. */
    rows: PropTypes.string,
};