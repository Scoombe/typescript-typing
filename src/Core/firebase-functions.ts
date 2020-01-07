import { differenceInDays } from 'date-fns';
import { firebaseAuth as auth, firebaseDB as database } from '../config/fire';
import { IRaceObj, IRaceScoreObj, IScoreObj, IUserNameObj } from './definitions';
type ICallbackType = (error: {error: boolean, message: string}) => void;
type IUserNameCallBack = (userName: IUserNameObj) => void;
type IScoreCallback = (score: IScoreObj) => void;
type IRaceCallback = (race: IRaceObj) => void;
type IStarCallback = (count: number) => void;
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
      createdOn: { '.sv': 'timestamp' },
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

export function getScoresFromToday(callback: IScoreCallback) {
  if (auth.currentUser) {
    database.ref('scores').orderByChild('userId').equalTo(auth.currentUser.uid)
    .on('child_added', (snapshot) => {
      if (snapshot.key && differenceInDays(snapshot.val().createdOn, new Date()) === 0) {
        const score: IScoreObj = snapshot.val();
        score.key = snapshot.key;
        callback(score);
      }
    });
  }
}

export function createRace(race: IRaceObj) {
  if (auth.currentUser !== null) {
    database.ref('usernames').orderByChild('userId').equalTo(auth.currentUser.uid)
    .on('child_added', (snapshot) => {
      if (auth.currentUser !== null && snapshot.key) {
        database.ref('races').push({
          createdOn: { '.sv': 'timestamp' },
          script: race.script.trim(),
          title: race.title,
          userId: auth.currentUser.uid,
          userName: snapshot.val().username,
        });
      }
    });
  }
}

export function createRaceScore(score: IRaceScoreObj) {
  if (auth.currentUser !== null) {
    database.ref('usernames').orderByChild('userId').equalTo(auth.currentUser.uid)
    .on('child_added', (snapshot) => {
      if (auth.currentUser !== null && snapshot.key) {
        database.ref('raceScores').push(
          {
            WPM: score.WPM,
            averageWPM: score.averageWPM,
            createdOn: { '.sv': 'timestamp' },
            raceId: score.raceId,
            userId: auth.currentUser.uid,
            userName: snapshot.val().username,
          },
        );
      }
    });
  }
}

export function createRaceStar(raceId: string) {
  if (auth.currentUser !== null) {
    database.ref('raceStars').push({
      raceId,
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

export function getGlobalRaces(callback: IRaceCallback) {
  let userStarred: boolean;
  if (auth.currentUser !== null) {
    database.ref('races').on('child_added', (snapshot) => {
      if (snapshot.key) {
        if (differenceInDays(new Date(), snapshot.val().createdOn) <= 14) {
          database.ref('raceStars').orderByChild('raceId').equalTo(snapshot.key).on('value', (starSnapshot) => {
            if (snapshot.key && auth.currentUser !== null) {
              userStarred = false;
              const race: IRaceObj = snapshot.val();
              race.key = snapshot.key;
              if (starSnapshot.exists) {
                starSnapshot.forEach((value) => {
                  if (value.val().userId === snapshot.val().userId) {
                    userStarred = true;
                  }
                });
                race.userStarred = userStarred;
                race.stars = starSnapshot.numChildren();
              } else {
                race.stars = 0;
              }
              callback(race);
            }
          });
        }
      }
    });
  }
}

export function getStarredRaces(callback: IRaceCallback) {
  let userStarred: boolean;
  if (auth.currentUser !== null) {
    database.ref('races').on('child_added', (snapshot) => {
      if (snapshot.key) {
        database.ref('raceStars').orderByChild('raceId').equalTo(snapshot.key).on('value', (starSnapshot) => {
          if (snapshot.key && auth.currentUser !== null) {
            userStarred = false;
            const race: IRaceObj = snapshot.val();
            race.key = snapshot.key;
            if (starSnapshot.exists) {
              starSnapshot.forEach((value) => {
                if (value.val().userId === snapshot.val().userId) {
                  userStarred = true;
                }
              });
              race.userStarred = userStarred;
              race.stars = starSnapshot.numChildren();
            } else {
              race.stars = 0;
            }
            if (userStarred) {
              // tslint:disable-next-line: no-console
              console.log(race);
              callback(race);
            }
          }
        });
      }
    });
  }
}

export function getRace(callback: IRaceCallback, raceId: string) {
  let userStarred = false;
  database.ref(`races/${raceId}`).on('value', (raceSnapshot) => {
    if (raceSnapshot.key) {
      database.ref('raceScores').orderByChild('raceId').equalTo(raceSnapshot.key).on('value', (scoreSnapshot) => {
        const race: IRaceObj = raceSnapshot.val();
        database.ref('raceStars').orderByChild('raceId').equalTo(raceSnapshot.key).on('value', (starSnapshot) => {
          if (starSnapshot.exists) {
            starSnapshot.forEach((value) => {
              if (value.val().userId === raceSnapshot.val().userId) {
                userStarred = true;
              }
            });
          }
          if (scoreSnapshot.exists()) {
            race.scores = scoreSnapshot.val();
          } else if (raceSnapshot.key) {
            race.key = raceSnapshot.key;
          }
          race.userStarred = userStarred;
          callback(race);
        });
      });
    }
  });
}
