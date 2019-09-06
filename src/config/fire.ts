import * as firebase from 'firebase/app';
// include services that you want
import 'firebase/auth';
import 'firebase/database';

// import { FirebaseApp } from '@firebase/app-types';
// import { FirebaseAuth } from '@firebase/auth-types';
// import { FirebaseDatabase } from '@firebase/database-types';

const config = {
  apiKey: 'AIzaSyARJv5DXqYcoOFb0_r8WG9PrQ-uCX98zyE',
  authDomain: 'react-typing.firebaseapp.com',
  databaseURL: 'https://react-typing.firebaseio.com',
  projectId: 'react-typing',
};

const fire: firebase.app.App = firebase.initializeApp(config);
export const firebaseAuth: firebase.auth.Auth = fire.auth();
export const firebaseDB: firebase.database.Database = fire.database();
export default fire;
