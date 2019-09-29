export interface IScoreObj {
  averageWPM: number;
  createdOn: number;
  key: string;
  userName: string;
  userId: string;
  WPM: number;
}

export interface IUserNameObj {
  key: string;
  userId: string;
  username: string;
}

export interface IRaceObj {
  createdOn: number;
  key: string;
  scores: {
    [key: string]: IScoreObj;
  };
  script: string;
  stars: {
    [key: string]: {userId: string};
  };
  title: string;
  userId: string;
}

export interface IRaceScoreObj {
  averageWPM: number;
  createdOn: number;
  key: string;
  raceId: string;
  userName: string;
  userId: string;
  WPM: number;
}

export interface IRaceStarObj {
  raceId: string;
  userId: string;
}
