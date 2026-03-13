import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewBlockerDialogComponent } from './add-new-blocker-dialog.component';

describe('AddNewBlockerDialogComponent', () => {
  let component: AddNewBlockerDialogComponent;
  let fixture: ComponentFixture<AddNewBlockerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewBlockerDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddNewBlockerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
