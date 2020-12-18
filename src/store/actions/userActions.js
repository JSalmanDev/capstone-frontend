import {
    SIGN_IN,
    SIGN_OUT,
    SIDE_NAVIGATION,
    SIDE_NAVIGATION_Refresh,
    SET_ROUTE
} from './types/types';

export const signIn = data => {
    return {
        type: SIGN_IN,
        payload: data,
    };  
};

export const setRoute = data => {
    return {
        type: SET_ROUTE,
        payload: data,
    };  
};

export const sideNavigation = data => {
    return {
        type: SIDE_NAVIGATION,
        payload: data,
    };
};

export const sideNavigationOnRefresh = () => {
    return {
            type: SIDE_NAVIGATION_Refresh
        };
};

export const signOut = () => {
    return {
        type: SIGN_OUT
    }
}