import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditRecipePage } from './edit-recipe.page';
import { RecipeResolver } from './edit-recipe-resolver';

const routes: Routes = [
  {
    path: ':id',
    component: EditRecipePage,
    resolve: { recipe: RecipeResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditRecipePageRoutingModule {}
