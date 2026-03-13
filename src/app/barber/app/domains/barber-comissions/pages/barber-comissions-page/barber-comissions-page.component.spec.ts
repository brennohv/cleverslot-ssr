import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaarberComissionsPageComponent } from './barber-comissions-page.component';

describe('BaarberComissionsPageComponent', () => {
  let component: BaarberComissionsPageComponent;
  let fixture: ComponentFixture<BaarberComissionsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaarberComissionsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BaarberComissionsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
