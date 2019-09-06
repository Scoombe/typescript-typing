import { firebaseAuth as auth, firebaseDB as database } from '../config/fire';
import { IUserNameObj } from './definitions';

type ICallbackType = (error: {error: boolean, message: string}) => void;
type IUserNameCallBack = (userName: IUserNameObj) => void;
// auth functions

export function createUser(userDetails: { email: string, password: string, username: string },
                           callback: ICallbackType): void {
  auth.createUserWithEmailAndPassword(userDetails.email, userDetails.password).then(() => {
    if (auth.currentUser !== null) {
      database.ref('usernames').push({
        userId: auth.currentUser.uid,
        username: userDetails.username,
      });
    }
    callback({ error: false, message: '' });
  }).catch((error: any) => {
    callback({ error, message: error.message });
  });
}

export function signIn(email: string, password: string, callback: ICallbackType): void {
  auth.signInWithEmailAndPassword(email, password).then(() => {
    callback({ error: false, message: '' });
  }).catch((error: any) => {
    callback({ error, message: error.message });
  });
}

export function signOut(): void {
  auth.signOut();
}

export function getUsername(callback: IUserNameCallBack): void {
  if (auth.currentUser !== null) {
    database.ref('usernames').orderByChild('userId').equalTo(auth.currentUser.uid)
    .on('child_added', (snapshot) => {
      if (snapshot.key !== null) {
        callback({
          key: snapshot.key,
          userId: snapshot.val().userId,
          username: snapshot.val().username,
        });
      }
    });
  }
}
