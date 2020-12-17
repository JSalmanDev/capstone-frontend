import React from 'react';
import $ from 'jquery';
import RequireAuth from './RequireAuth';

window.jQuery = $;
window.$ = $;
global.jQuery = $;

//Users
const Dashboard = React.lazy(() => import("./Demo/dashboard/dashboard"));

//Not Found
// const NotFound = React.lazy(() => import("./Demo/NotFound/NotFound"));

const routes = [
    //users routes
    { path: '/dashboard', exact: true, role:'user', user: true, component: RequireAuth(Dashboard) },
    { path: '/not-found', exact: true, role:'public', component: RequireAuth(NotFound) }
];

export default routes;