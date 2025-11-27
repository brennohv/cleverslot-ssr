import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcriptionResultPageComponent } from './subcription-result-page.component';

describe('SubcriptionResultPageComponent', () => {
  let component: SubcriptionResultPageComponent;
  let fixture: ComponentFixture<SubcriptionResultPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubcriptionResultPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubcriptionResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
