import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MorphologicalComponent } from './morphological.component';

describe('MorphologicalComponent', () => {
  let component: MorphologicalComponent;
  let fixture: ComponentFixture<MorphologicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MorphologicalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MorphologicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
