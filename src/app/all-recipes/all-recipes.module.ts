import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllRecipesPageRoutingModule } from './all-recipes-routing.module';

import { AllRecipesPage } from './all-recipes.page';
import { RecipeComponent } from '../components/recipe/recipe.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllRecipesPageRoutingModule,
    RecipeComponent,
    ReactiveFormsModule
  ],
  declarations: [AllRecipesPage],
})
export class AllRecipesPageModule {}
