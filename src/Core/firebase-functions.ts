import { firebaseAuth as auth, firebaseDB as database } from '../config/fire';
import { IRaceObj, IRaceScoreObj, IRaceStarObj, IScoreObj, IUserNameObj } from './definitions';

type ICallbackType = (error: {error: boolean, message: string}) => void;
type IUserNameCallBack = (userName: IUserNameObj) => void;
type IScoreCallback = (score: IScoreObj) => void;
type IRaceCallback = (race: IRaceObj) => void;
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

export function createScore(score: IScoreObj) {
  if (auth.currentUser !== null) {
    database.ref('scores').push({
      WPM: score.WPM,
      averageWPM: score.averageWPM,
      createOn: { '.sv': 'timestamp' },
      userId: auth.currentUser.uid,
    });
  }
}

export function getUserScores(callback: IScoreCallback) {
  if (auth.currentUser) {
    database.ref('scores').orderByChild('userId').equalTo(auth.currentUser.uid)
    .on('child_added', (snapshot) => {
      if (snapshot.key) {
        const score: IScoreObj = snapshot.val();
        score.key = snapshot.key;
        callback(score);
      }
    });
  }
}

export function createRace(race: IRaceObj) {
  if (auth.currentUser !== null) {
    database.ref('races').push({
      createOn: { '.sv': 'timestamp' },
      script: race.script,
      title: race.title,
      userId: auth.currentUser.uid,
    });
  }
}

export function createRaceScore(score: IRaceScoreObj) {
  if (auth.currentUser !== null) {
    database.ref('raceScores').push({
      WPM: score.WPM,
      averageWPM: score.averageWPM,
      createOn: { '.sv': 'timestamp' },
      raceId: score.raceId,
      userId: auth.currentUser.uid,
    });
  }
}

export function createRaceStar(star: IRaceStarObj) {
  if (auth.currentUser !== null) {
    database.ref('raceScores').push({
      raceId: star.raceId,
      userId: auth.currentUser.uid,
    });
  }
}

export function getUserRaces(callback: IRaceCallback) {
  if (auth.currentUser !== null) {
    database.ref('races').orderByChild('userId').equalTo(auth.currentUser.uid)
    .on('child_added', (snapshot) => {
      if (snapshot.key) {
        const race: IRaceObj = snapshot.val();
        race.key = snapshot.key;
        callback(race);
      }
    });
  }
}

export function getRaces(callback: IRaceCallback) {
  if (auth.currentUser !== null) {
    database.ref('races').orderByChild('userId').equalTo(auth.currentUser.uid)
    .on('child_added', (snapshot) => {
      if (snapshot.key) {
        const race: IRaceObj = snapshot.val();
        race.key = snapshot.key;
        callback(race);
      }
    });
  }
}

export function getRace(callback: IRaceCallback, raceId: string) {
  database.ref(`races/${raceId}`).on('child_added', (snapshot) => {
    if (snapshot.key) {
      const race: IRaceObj = snapshot.val();
      race.key = snapshot.key;
      callback(race);
    }
  });
}
