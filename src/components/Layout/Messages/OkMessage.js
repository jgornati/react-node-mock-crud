import React from "react";
import Snackbar from '@material-ui/core/Snackbar';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

class OkMessage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {show: false};
    }

    componentDidUpdate(prevProps) {
        let endedProcess = false;
        Object.entries(this.props.state).forEach(
            ([key, value]) => {
                if (key !== "notifications") {
                    var valuePrev = prevProps.state[key];
                    if (value.create && valuePrev && valuePrev.create && !value.create.isCreating && valuePrev.create.isCreating && !value.create.error) {
                        endedProcess = true;
                    }
                    if (value.update && valuePrev && valuePrev.update && !value.update.isUpdating && valuePrev.update.isUpdating && !value.update.error) {
                        endedProcess = true;
                    }
                    if (value.delete && valuePrev && valuePrev.delete && !value.delete.isDeleting && valuePrev.delete.isDeleting && !value.delete.error) {
                        endedProcess = true;
                    }
                    if (value.notify && valuePrev && valuePrev.notify && !value.notify.isNotifying && valuePrev.notify.isNotifying && !value.notify.error) {
                        endedProcess = true;
                    }
                }
            }
        );
        if (this.state.show !== endedProcess && endedProcess) {
            this.setState({show: endedProcess});
            setTimeout(() => this.setState({show: false}), 5000);
        }
    }


    render() {
        const {show} = this.state;
        return (
            <Snackbar
                open={show}
                onClose={() => {
                    this.setState({show: false})
                }}
                autoHideDuration={6000}
                message="La operación se ha realizado con éxito."
            />
        )
    }
}

function mapStateToProps(state) {
    return {
        state: state,
    };
}

// Wrap the components to inject dispatch and state into it
export default withRouter(connect(mapStateToProps)(OkMessage));
