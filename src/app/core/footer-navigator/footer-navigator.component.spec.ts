import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterNavigatorComponent } from './footer-navigator.component';

describe('FooterNavigatorComponent', () => {
  let component: FooterNavigatorComponent;
  let fixture: ComponentFixture<FooterNavigatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterNavigatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FooterNavigatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
