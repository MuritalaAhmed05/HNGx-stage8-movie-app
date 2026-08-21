export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path?: string;
  overview?: string;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
  vote_count?: number;
  media_type?: string;
}