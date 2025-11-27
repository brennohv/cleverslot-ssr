import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileDefaultSelectorComponent } from './profile-default-selector.component';

describe('ProfileDefaultSelectorComponent', () => {
  let component: ProfileDefaultSelectorComponent;
  let fixture: ComponentFixture<ProfileDefaultSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileDefaultSelectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfileDefaultSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
