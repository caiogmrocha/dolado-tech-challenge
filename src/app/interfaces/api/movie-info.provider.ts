export type MovieInfo = {
  title: string;
  releasedAt: Date;
  rating: number;
  authors: string[];
}

export interface MovieInfoProvider {
  getMovieInfo(title: string): Promise<MovieInfo>;
}

export const MovieInfoProvider = Symbol('MovieInfoProvider');
