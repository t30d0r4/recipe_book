import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllRecipesPage } from './all-recipes.page';

describe('AllRecipesPage', () => {
  let component: AllRecipesPage;
  let fixture: ComponentFixture<AllRecipesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AllRecipesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
