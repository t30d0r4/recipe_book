import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllRecipesPageRoutingModule } from './all-recipes-routing.module';

import { AllRecipesPage } from './all-recipes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllRecipesPageRoutingModule
  ],
  declarations: [AllRecipesPage]
})
export class AllRecipesPageModule {}
