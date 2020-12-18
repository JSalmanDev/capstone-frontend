import axios from 'axios';
import config from '../../config';

const initialState = {
  route: false,
  navigation: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case 'SIGN_IN':
      return {...state, user: action.payload};
    case 'SIGN_OUT': 
      return {...state, user: initialState };
    case 'SET_ROUTE':
      return {...state, route: action.payload };
    case 'SIDE_NAVIGATION':
      return {...state, navigation: action.payload };
    case 'SIDE_NAVIGATION_Refresh': 
      axios.get(`${config.prod}/api/category/list`)
        .then(res => {
          let sideNav = [{ id: 'navigation', title: 'Categories', type: 'group', icon: 'icon-navigation', children: [ ] }];
          let children = [{ id: 'dashboard', title: 'Dashboard', type: 'item', url: '/dashboard', icon: 'feather icon-home' }];
          res.data.data.forEach(elem => {
              children.push({ id: `${elem.id}`, title: `${elem.title}`, type: 'item', url: `/project?project=${elem.id}`, icon: 'feather icon-box' });
          });
          sideNav[0].children = children;
          return {...state, navigation: sideNav };
        })
        .catch(err => {
          console.log('Error refresh page: ', err);
          return {...state, navigation: [] };
        });
    default:
      return state;
  }
}