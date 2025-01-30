export interface Movie {
  info: MovieInfo,
  title: string,
  year: number,
}

export interface MovieInfo {
  plot: string,
  rating: number,
}

export const ratingList = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]