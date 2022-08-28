/* @refresh reload */
import { render } from "solid-js/web";
import { Route, Router, Routes } from 'solid-app-router';

import "./style.css";
import App, { SingleImage } from "./App";

render(() =>
    <Router>
        <Routes>
            <Route path="/" component={App} />
            <Route path="/single/:path" component={SingleImage} />
        </Routes>
    </Router>,
    document.getElementById("root") as HTMLElement
);
