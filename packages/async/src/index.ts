import { Predicate } from "@thi.ng/api/api";
import { comp as _comp } from "@thi.ng/transducers/func/comp";

export type MaybeAsyncValue<T> = T | Promise<T>;
export type MaybeAsyncIterable<T> = Iterable<T> | AsyncIterable<T>;
export type MaybeAsyncGenerator<T> = IterableIterator<T> | AsyncIterableIterator<T>;

export type AsyncTransducer<A, B> = (rfn: AsyncReducer<any, B>) => AsyncReducer<any, A>;

export interface AsyncProducer<T> extends AsyncIterableIterator<T> {
    ready: boolean;
}

export interface AsyncReducer<Acc, Val> extends Array<any> {
    [0]: () => MaybeAsyncValue<Acc>;
    [1]: (acc: Acc) => MaybeAsyncValue<Acc>;
    [2]: (acc: Acc, x: MaybeAsyncValue<Val>) => Promise<Acc>;
}

export function comp<A, B>(a: AsyncTransducer<A, B>): AsyncTransducer<A, B>;
export function comp<A, B, C>(a: AsyncTransducer<A, B>, b: AsyncTransducer<B, C>): AsyncTransducer<A, C>;
export function comp<A, B, C, D>(a: AsyncTransducer<A, B>, b: AsyncTransducer<B, C>, c: AsyncTransducer<C, D>): AsyncTransducer<A, D>;
export function comp<A, B, C, D, E>(a: AsyncTransducer<A, B>, b: AsyncTransducer<B, C>, c: AsyncTransducer<C, D>, d: AsyncTransducer<D, E>): AsyncTransducer<A, E>;
export function comp<A, B, C, D, E, F>(a: AsyncTransducer<A, B>, b: AsyncTransducer<B, C>, c: AsyncTransducer<C, D>, d: AsyncTransducer<D, E>, e: AsyncTransducer<E, F>): AsyncTransducer<A, F>;
export function comp<A, B, C, D, E, F, G>(a: AsyncTransducer<A, B>, b: AsyncTransducer<B, C>, c: AsyncTransducer<C, D>, d: AsyncTransducer<D, E>, e: AsyncTransducer<E, F>, f: AsyncTransducer<F, G>): AsyncTransducer<A, G>;
export function comp<A, B, C, D, E, F, G, H>(a: AsyncTransducer<A, B>, b: AsyncTransducer<B, C>, c: AsyncTransducer<C, D>, d: AsyncTransducer<D, E>, e: AsyncTransducer<E, F>, f: AsyncTransducer<F, G>, g: AsyncTransducer<G, H>): AsyncTransducer<A, H>;
export function comp<A, B, C, D, E, F, G, H, I>(a: AsyncTransducer<A, B>, b: AsyncTransducer<B, C>, c: AsyncTransducer<C, D>, d: AsyncTransducer<D, E>, e: AsyncTransducer<E, F>, f: AsyncTransducer<F, G>, g: AsyncTransducer<G, H>, h: AsyncTransducer<H, I>): AsyncTransducer<A, I>;
export function comp<A, B, C, D, E, F, G, H, I, J>(a: AsyncTransducer<A, B>, b: AsyncTransducer<B, C>, c: AsyncTransducer<C, D>, d: AsyncTransducer<D, E>, e: AsyncTransducer<E, F>, f: AsyncTransducer<F, G>, g: AsyncTransducer<G, H>, h: AsyncTransducer<H, I>, i: AsyncTransducer<I, J>): AsyncTransducer<A, J>;
export function comp<A, B, C, D, E, F, G, H, I, J, K>(a: AsyncTransducer<A, B>, b: AsyncTransducer<B, C>, c: AsyncTransducer<C, D>, d: AsyncTransducer<D, E>, e: AsyncTransducer<E, F>, f: AsyncTransducer<F, G>, g: AsyncTransducer<G, H>, h: AsyncTransducer<H, I>, i: AsyncTransducer<I, J>, j: AsyncTransducer<J, K>, ...fns: AsyncTransducer<any, any>[]): AsyncTransducer<A, any>;
export function comp(...fns: any[]) {
    return _comp.apply(null, fns);
}

/**
 * Alias for `src.return()`. Causes the given generator to stop.
 *
 * @param src
 */
export function close(src: MaybeAsyncGenerator<any>) {
    src.return();
}

export function delay<T>(ms: number, val?: T) {
    return new Promise<T>((resolve) => {
        setTimeout(() => resolve(val), ms);
    });
}

export async function* once<T>(x: MaybeAsyncValue<T>) {
    yield await x;
}

export async function* constantly<T>(x: MaybeAsyncValue<T>, ms = 0) {
    x = await x;
    for (; ;) {
        yield x;
        if (ms > 0) {
            await delay(ms);
        }
    }
}

/**
 * ```
 * stream = dynamicSource(1, 1000);
 * trace(stream);
 * stream.next(3)
 * ```
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator/next
 *
 * @param x
 */
export async function* dynamicSource<T>(x: MaybeAsyncValue<T>, ms = 0) {
    for (; ;) {
        const y = yield await x;
        if (y !== undefined) {
            x = y;
        }
        if (ms > 0) {
            await delay(ms);
        }
    }
}

export function $iter<T>(x: Iterable<T> | AsyncIterable<T>) {
    let i: () => Iterator<T> | AsyncIterator<T>;
    if ((i = x[Symbol.iterator]) || (i = x[Symbol.asyncIterator])) {
        return i();
    }
}

export function tuples<A, B>(a: MaybeAsyncIterable<A>, b: MaybeAsyncIterable<B>): AsyncIterableIterator<[A, B]>;
export function tuples<A, B, C>(a: MaybeAsyncIterable<A>, b: MaybeAsyncIterable<B>, c: MaybeAsyncIterable<C>): AsyncIterableIterator<[A, B, C]>;
export async function* tuples(...src: MaybeAsyncIterable<any>[]) {
    const iters = src.map($iter);
    while (true) {
        const chunk = [];
        for (let i of iters) {
            const x = await i.next();
            if (x.done) {
                return;
            }
            chunk.push(x.value);
        }
        yield chunk;
    }
}

export async function trace(src: AsyncIterable<any>, prefix = "") {
    for await (let x of src) {
        console.log(prefix, x);
    }
    console.log(prefix, "done");
}

export function map<A, B>(fn: (x: A) => MaybeAsyncValue<B>): AsyncTransducer<A, B> {
    return (rfn: AsyncReducer<any, B>) => {
        return [
            rfn[0],
            rfn[1],
            async function (acc, x: MaybeAsyncValue<A>) {
                return rfn[2](acc, fn(await x));
            }];
    }
}

export function mapcat<A, B>(fn: (x: A) => MaybeAsyncValue<Iterable<MaybeAsyncValue<B>>>): AsyncTransducer<A, B> {
    return (rfn: AsyncReducer<any, B>) => {
        return [
            rfn[0],
            rfn[1],
            async function (acc, x: MaybeAsyncValue<A>) {
                const y = await fn(await x);
                if (y != null) {
                    for (let yy of y) {
                        acc = await rfn[2](acc, await yy);
                    }
                }
                return acc;
            }];
    }
}

export function filter<T>(fn: Predicate<T>): AsyncTransducer<T, T> {
    return (rfn: AsyncReducer<any, T>) => {
        return [
            rfn[0],
            rfn[1],
            async function (acc, x: MaybeAsyncValue<T>) {
                const y = await x;
                if (fn(y)) {
                    return rfn[2](acc, y);
                }
                return acc;
            }];
    }
}

export function append<T>(buf?: T[]): AsyncReducer<T[], T> {
    return [
        () => buf || [],
        (acc) => acc,
        async (acc, x) => (acc.push(await x), acc)
    ]
}

export const xf = comp(
    map((x: number) => delay(1000, x * 3)),
    filter((x: number) => !!(x & 1)),
    mapcat((x: number) => delay(500, [x - 1, x, x + 1]))
);

export async function transduce<A, B, C>(xf: AsyncTransducer<A, B>, rfn: AsyncReducer<C, B>, src: Iterable<A> | AsyncIterable<A>) {
    const [init, complete, step] = xf(rfn);
    let acc = await init();
    for await (let x of src) {
        acc = await step(acc, x);
    }
    return await complete(acc);
}

export async function* transform<A, B>(xf: AsyncTransducer<A, B>, src: MaybeAsyncIterable<A>) {
    const [_, __, step] = xf(append());
    for await (let x of src) {
        yield* await step([], x);
    }
    // TODO complete()
}

/**
 * Returns an AsyncProducer which only emits new values when user code
 * calls `.next(val)`. `undefined` values are unsupported and will be
 * skipped. Instances returned by this function are intended to be
 * consumed by `consumer()` or `consumeWith()`, both of which implement
 * special (configurable) read logic and allow producer / consumer pairs
 * to be used somewhat like CSP channels with a sliding buffer of length
 * = 1, i.e. writes to the producer will never block, but some older
 * values might be dropped if the consumer is too slow.
 *
 * ```
 * p = producer();
 * trace(transform(map((x)=>x*10), consumer(p)), "->");
 * p.next(23)
 * // -> 230
 * ```
 */
export function producer<T>() {
    const i = <AsyncProducer<T>>(async function* () {
        let x: T, y: T;
        for (; ;) {
            y = yield await x;
            if (y !== undefined) {
                x = y;
            }
            i.ready = y !== undefined;
        }
    })();
    i.next();
    return i;
}

/**
 * Returns a new async iterator which yields values read from given
 * `src` (an `AsyncProducer`) and uses custom read logic to do so.
 * Consumers constantly poll the `src` producer for values, but only
 * yield non-`undefined` values downstream. If an `undefined` value is
 * read from the producer, the consumer implements the following logic:
 *
 * - The first `maxWait` read attempts are spaced at the minimal delay
 *   (usually < 4ms, VM specific).
 * - All following read attempts will use a delay starting with
 *   `startLatency` an exponentially increasing up to `maxLatency` to
 *   ease CPU load.
 * - Any successful read resets the read attempt counter to temporarily
 *   switch back to min latency.
 *
 * Using these parameters consumers can be configured to suit different
 * expected value frequencies. E.g. For a consumer to always run at min
 * latency set `maxLatency = 0`.
 *
 * @param src
 * @param maxWait
 * @param maxLatency
 * @param startLatency
 */
export async function* consumer<T>(src: AsyncProducer<T>, maxWait = 100, maxLatency = 33, startLatency = 1.01) {
    let t: number = startLatency;
    let wait: number = 0;
    for (; ;) {
        if (src.ready) {
            const res = await src.next();
            if (res.done) {
                break;
            }
            yield res.value;
            t = startLatency;
            wait = 0;
        } else if (wait > maxWait) {
            await delay(t);
            t = Math.min(maxLatency, Math.pow(t, 1.01));
        } else {
            await delay(0);
            wait++;
        }
    }
}

/**
 * Similar to `consumer`, but instead of returning an iterator, uses the
 * given function `fn` to process consumed values.
 *
 * @param fn
 * @param src
 * @param maxWait
 * @param maxLatency
 * @param startLatency
 */
export async function consumeWith<T>(fn: (x: T) => void, src: AsyncProducer<T>, maxWait = 100, maxLatency = 33, startLatency = 1.01) {
    let t: number = startLatency;
    let wait: number = 0;
    for (; ;) {
        if (src.ready) {
            const res = await src.next();
            if (res.done) {
                break;
            }
            fn(res.value);
            t = startLatency;
            wait = 0;
        } else if (wait > maxWait) {
            await delay(t);
            t = Math.min(maxLatency, Math.pow(t, 1.01));
        } else {
            await delay(0);
            wait++;
        }
    }
}

const foo = transform(map((x) => delay(100, x)), [1, 2, 3, 4, 5]);
trace(foo, "a");
trace(foo, "b");

export const txresult = dynamicSource(null, 1000);
//trace(txresult, "txres");
export const demo = () => transduce(xf, append(), [1, 2, 3, 4, 5]).then((x) => txresult.next(x));
