import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllRecipesPage } from './all-recipes.page';

const routes: Routes = [
  {
    path: '',
    component: AllRecipesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllRecipesPageRoutingModule {}
