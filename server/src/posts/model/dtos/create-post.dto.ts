export class CreatePostDto {
  readonly title: string;
  readonly imageUrl: string;
  readonly categories: [string];
  readonly description: string;
  readonly createdBy: string;
}