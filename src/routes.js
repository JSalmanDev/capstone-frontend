import React from 'react';
import $ from 'jquery';

window.jQuery = $;
window.$ = $;
global.jQuery = $;


const routes = [
    //User Routes
    { path: '/dashboard', exact: true, role:'user', user: true, component:  '' },
];

export default routes;