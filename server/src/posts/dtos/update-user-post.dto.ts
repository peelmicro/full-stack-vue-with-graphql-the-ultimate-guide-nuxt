export class UpdateUserPostDto {
  readonly postId: string;
  readonly userId: string;
  readonly title: string;
  readonly imageUrl: string;
  readonly categories: string[];
  readonly description: string;
}