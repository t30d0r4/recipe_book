import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecipeDetailsPageRoutingModule } from './recipe-details-routing.module';

import { RecipeDetailsPage } from './recipe-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecipeDetailsPageRoutingModule,
    RecipeDetailsPage
  ],
  declarations: []
})
export class RecipeDetailsPageModule {}
