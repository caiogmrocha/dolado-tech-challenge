export class MovieReviewTitleAlreadyExistsException extends Error {
  constructor (private readonly id: number) {
    super(`Movie review title already exists`);
    this.name = 'MovieReviewTitleAlreadyExistsException';
  }
}
