import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyRecipesPageRoutingModule } from './my-recipes-routing.module';

import { MyRecipesPage } from './my-recipes.page';
import { RecipeComponent } from '../components/recipe/recipe.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyRecipesPageRoutingModule,
    RecipeComponent,
  ],
  declarations: [MyRecipesPage],
})
export class MyRecipesPageModule {}
