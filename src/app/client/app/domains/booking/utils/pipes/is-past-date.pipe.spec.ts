import { IsPastDatePipe } from './is-past-date.pipe';

describe('IsPastDatePipe', () => {
  it('create an instance', () => {
    const pipe = new IsPastDatePipe();
    expect(pipe).toBeTruthy();
  });
});
