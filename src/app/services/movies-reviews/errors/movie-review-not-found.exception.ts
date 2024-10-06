export class MovieReviewNotFoundException extends Error {
  constructor(id: number) {
    super(`Movie review with id ${id} not found`);
  }
}
