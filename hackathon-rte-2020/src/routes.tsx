import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Landing from "./pages/landing";
import Form from "./pages/Form";
import Detect from "./pages/Detection";


function Routes() {
    return(
        <BrowserRouter>
            <Route path="/" exact component={Landing} />
            <Route path="/user" component={Detect} />
            <Route path="/new-user" component={Form} />
        </BrowserRouter>
    )
}

export default Routes;