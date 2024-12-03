import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductTablePage } from './product-table.page';

describe('ProductTablePage', () => {
  let component: ProductTablePage;
  let fixture: ComponentFixture<ProductTablePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTablePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
