import { expect } from 'chai';
import restoreReduxStore from './index';

describe('Restore Redux Store enhancer', () => {
  it('should return function', () => {
    expect(restoreReduxStore()).to.be.a('function');
  });
});
