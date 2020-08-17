import { Trampoline, execute, Done, More } from '../../src/core/trampoline';

describe('Done', () => {
  describe('map', () => {
    it('should return new Done value containing the result of the contained value passed into the function', () => {
      const returnVal = 'returnVal';
      const fn = jest.fn().mockReturnValue(returnVal);

      const val = 'some val';
      const result = new Done('some val').map(a => fn(a));

      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith(val);

      expect(result).toBeInstanceOf(Done);
      expect((result as Done<string>)['_val']).toEqual(returnVal);
    });
  });
  describe('flatMap', () => {
    it('should return the result of the contained value passed into the function', () => {
      const returnVal = new More(() => new Done('returnVal'));
      const fn = jest.fn().mockReturnValue(returnVal);

      const val = 'some val';
      const result = new Done('some val').flatMap(a => fn(a));

      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith(val);

      expect(result).toBe(returnVal);
    });
  });
});

describe('More', () => {
  describe('map', () => {
    it('should not fire function outside of execute', () => {
      const returnVal = 'returnVal';
      const fn = jest.fn().mockReturnValue(returnVal);

      const result = new More(() => new Done('some val')).map(a => fn(a));

      expect(fn).not.toHaveBeenCalled();
    });
    it('should map result within execute', () => {
      const returnVal = 'returnVal';
      const fn = jest.fn().mockReturnValue(returnVal);

      const val = 'some val';
      const result = execute(new More(() => new Done(val)).map(a => fn(a)));

      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith(val);

      expect(result).toBe(returnVal);
    });
  });
  describe('flatMap', () => {
    it('should not fire function outside of execute', () => {
      const returnVal = new More(() => new Done('returnVal'));
      const fn = jest.fn().mockReturnValue(returnVal);

      const result = new More(() => new Done('some val')).flatMap(a => fn(a));

      expect(fn).not.toHaveBeenCalled();
    });
    it('should flatMap result within execute', () => {
      const innerVal = 'returnVal';
      const returnVal = new More(() => new Done(innerVal));
      const fn = jest.fn().mockReturnValue(returnVal);

      const val = 'some val';
      const result = execute(new More(() => new Done(val)).flatMap(a => fn(a)));

      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith(val);

      expect(result).toBe(innerVal);
    });
  });
});

describe('unsafeRun', () => {
  it('should not overflow stack with chained flatmaps', () => {
    const size = 10000;
    let chain: Trampoline<number> = new More(() => new Done(0));

    for (let i = 0; i < size; i++) {
      chain = chain.flatMap(x => new Done(x + 1));
    }

    const result = execute(chain);

    expect(result).toBe(10000);
  });

  it('should not overflow stack with chained maps', () => {
    const size = 10000;
    let chain: Trampoline<number> = new More(() => new Done(0));

    for (let i = 0; i < size; i++) {
      chain = chain.map(x => x + 1);
    }

    const result = execute(chain);

    expect(result).toBe(10000);
  });
});
