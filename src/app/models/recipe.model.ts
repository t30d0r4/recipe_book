export class Recipe {
  constructor(
    public id: string = '',
    public title: string = '',
    public description: string = '',
    public author: string = '',
    public difficulty: number = 0,
    public ingredients: string[] = [],
    public totalTime: number = 0,
    public servings: number = 0,
    public images: string[] = []
  ) {}
}
