import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureAddNewEventComponent } from './feature-add-new-event.component';

describe('FeatureAddNewEventComponent', () => {
  let component: FeatureAddNewEventComponent;
  let fixture: ComponentFixture<FeatureAddNewEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureAddNewEventComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FeatureAddNewEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
