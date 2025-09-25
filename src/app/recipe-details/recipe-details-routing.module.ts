import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecipeDetailsPage } from './recipe-details.page';
import { RecipeResolver } from '../edit-recipe/edit-recipe-resolver';

const routes: Routes = [
  {
    path: ':id',
    component: RecipeDetailsPage,
    resolve: { recipe: RecipeResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipeDetailsPageRoutingModule {}
