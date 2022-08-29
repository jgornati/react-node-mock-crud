import React from "react";
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';


class ErrorMessage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {show: false, error: null};
    }

    componentDidUpdate(prevProps) {
        let error = null;
        Object.entries(this.props.state).forEach(
            ([key, value]) => {
                var valuePrev = prevProps.state[key];
                if (value.create && valuePrev && valuePrev.create && !value.create.isCreating && valuePrev.create.isCreating && value.create.error) {
                    error = value.create.error;
                }
                if (value.update && valuePrev && valuePrev.update && !value.update.isUpdating && valuePrev.update.isUpdating && value.update.error) {
                    error = value.update.error;
                }
                if (value.delete && valuePrev && valuePrev.delete && !value.delete.isDeleting && valuePrev.delete.isDeleting && value.delete.error) {
                    error = value.delete.error;
                }
                if (value.notify && valuePrev && valuePrev.notify && !value.notify.isNotifying && valuePrev.notify.isNotifying && value.notify.error) {
                    error = value.notify.error;
                }
            });
        if (this.state.show !== (error !== null) && error !== null && Object.keys(error).length > 0) {
            this.setState({show: true, error: error});
        }
    }


    render() {
        const {show, error} = this.state;
        let Errors;
        if (error != null && Object.keys(error).length > 0 && typeof error == "object") {
            Errors = Object.keys(error).map((nombre, index) => {
                let completeMessage = "";
                if (error[nombre])
                    error[nombre].forEach((mensaje) => {
                        completeMessage += mensaje;
                    });
                return <p key={nombre} style={{margin: "0px"}}>{completeMessage}</p>;
            });
        }
        else
            Errors = <p key={0} style={{margin: "0px"}}>{error}</p>;

        return (
            <Snackbar
                open={show}
                onClose={() => {
                    this.setState({show: false})
                }}
                //TransitionComponent={<Slide direction="up" />}
                //autoHideDuration={6000}
                // message={Errors}

            >
                <Alert severity="error" action={
                    <React.Fragment>
                        <IconButton size="small" aria-label="close" color="inherit" onClick={() => {
                            this.setState({show: false})
                        }}>
                            <CloseIcon fontSize="small"/>
                        </IconButton>
                    </React.Fragment>
                }>
                    {Errors}
                </Alert>
            </Snackbar>
        )
    }
}

function mapStateToProps(state) {
    return {
        state: state,
    };
}

// Wrap the components to inject dispatch and state into it
export default withRouter(connect(mapStateToProps)(ErrorMessage));
