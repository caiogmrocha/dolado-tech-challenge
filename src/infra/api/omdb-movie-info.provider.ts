import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";

import { firstValueFrom } from 'rxjs';

import { MovieInfo, MovieInfoProvider } from "@/app/interfaces/api/movie-info.provider";

@Injectable()
export class OmdbMovieInfoProvider implements MovieInfoProvider {
  constructor (
    private readonly httpService: HttpService,
  ) {}

  public async getMovieInfo(title: string): Promise<MovieInfo> {
    const response = await firstValueFrom(this.httpService.get(`http://www.omdbapi.com/`, {
      params: {
        apikey: process.env.OMDB_API_KEY,
        t: title,
      }
    }));

    return {
      title: response.data.Title,
      releasedAt: new Date(response.data.Released),
      rating: parseFloat(response.data.imdbRating),
    };
  }
}
