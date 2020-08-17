// https://medium.com/@olxc/trampolining-and-stack-safety-in-scala-d8e86474ddfa
// https://gist.github.com/tusharmath/f1eaa6e0bdb3cc2c37835497a85c0b60

export abstract class Trampoline<A> {
  abstract map<B>(ab: (a: A) => B): Trampoline<B>;
  abstract flatMap<B>(ab: (a: A) => Trampoline<B>): Trampoline<B>;
}

export class Done<A> extends Trampoline<A> {
  private readonly _val: A;
  constructor(val: A) {
    super();
    this._val = val;
  }

  map<B>(ab: (a: A) => B): Trampoline<B> {
    return new Done<B>(ab(this._val));
  }

  flatMap<B>(ab: (a: A) => Trampoline<B>): Trampoline<B> {
    return ab(this._val);
  }
}

class FlatMap<A, B> extends Trampoline<B> {
  private readonly _sub: Trampoline<A>;
  private readonly _cont: (a: A) => Trampoline<B>;

  constructor(sub: Trampoline<A>, cont: (a: A) => Trampoline<B>) {
    super();
    this._sub = sub;
    this._cont = cont;
  }

  map<C>(bc: (b: B) => C): Trampoline<C> {
    return new FlatMap<B, C>(this, (b: B) => new Done<C>(bc(b)));
  }
  flatMap<C>(bc: (b: B) => Trampoline<C>): Trampoline<C> {
    return new FlatMap<B, C>(this, bc);
  }
}

export class More<A> extends Trampoline<A> {
  private readonly _fn: () => Trampoline<A>;
  constructor(fn: () => Trampoline<A>) {
    super();
    this._fn = fn;
  }

  map<B>(ab: (a: A) => B): Trampoline<B> {
    return new FlatMap<A, B>(this, (a: A) => new Done(ab(a)));
  }

  flatMap<B>(ab: (a: A) => Trampoline<B>): Trampoline<B> {
    return new FlatMap<A, B>(this, ab);
  }
}

// this has to be in a separate imperative function because we dont have tail recursion
export function execute<A>(a: Trampoline<A>): A {
  let result = a;
  while (true) {
    if (result instanceof More) {
      result = result['_fn']();
    } else if (result instanceof Done) {
      return result['_val'];
    } /* istanbul ignore next line */ else if (result instanceof FlatMap) {
      const cont = result['_cont'];
      const sub = result['_sub'];

      if (sub instanceof Done) {
        result = result['_cont'](sub['_val']);
      } else if (sub instanceof More) {
        result = new FlatMap(sub['_fn'](), cont);
      } /* istanbul ignore next line */ else if (sub instanceof FlatMap) {
        result = new FlatMap(sub['_sub'], a => new FlatMap(sub['_cont'](a), cont));
      }
    }
  }
}
