import { TestBed } from '@angular/core/testing';
import { Stats } from './stats';

describe('Stats', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Stats],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(Stats);
    const stats = fixture.componentInstance;
    expect(stats).toBeTruthy();
  });
});
