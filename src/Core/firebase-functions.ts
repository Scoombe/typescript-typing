import { firebaseAuth as auth, firebaseDB as database } from '../config/fire';
import { IUserNameObj } from './definitions';

type ICallbackType = (error: {error: boolean, message: string}) => void;
type IUserNameCallBack = (userName: IUserNameObj) => void;
// auth functions

export function createUser(email: string, password: string, callback: ICallbackType): void {
  auth.createUserWithEmailAndPassword(email, password).then(() => {
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

export function createUsername(username: string) {
  if (auth.currentUser !== null) {
    database.ref('usernames').push({
      username,
      userId: auth.currentUser.uid,
    });
  }
}

export function getUsername(callback: IUserNameCallBack): void {
  if (auth.currentUser !== null) {
    database.ref('usernames').orderByChild('userId').equalTo(auth.currentUser.uid)
    .once('value', (snapshot) => {
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
