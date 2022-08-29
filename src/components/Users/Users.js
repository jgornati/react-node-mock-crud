import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
//Components
import UsersList from "./UsersList";
import CRUDUser from "./CRUDUser";

export default function Users() {
    //Effects
    useEffect(() => {
        return function cleanup() {
        }

    }, []);

    return (
        <Switch>
            <Route path="/users/new" component={CRUDUser}/>
            <Route path="/users/:idUser" component={CRUDUser}/>
            <Route path="/users" component={UsersList}/>
        </Switch>

    );
}

