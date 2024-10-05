export type MovieInfo = {
  title: string;
  releasedAt: Date;
  rating: number;
}

export interface MovieInfoProvider {
  getMovieInfo(title: string): Promise<MovieInfo>;
}

export const MovieInfoProvider = Symbol('MovieInfoProvider');
