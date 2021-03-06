import {
    Fn3,
    ICopy,
    IEmpty,
    IEquiv,
    IObjectOf,
    Pair,
    SEMAPHORE
} from "@thi.ng/api";
import { equiv } from "@thi.ng/equiv";
import { EquivMapOpts, IEquivSet } from "./api";
import { ArraySet } from "./array-set";

interface MapProps<K, V> {
    keys: IEquivSet<K>;
    map: Map<K, V>;
    opts: EquivMapOpts<K>;
}

const __private = new WeakMap<EquivMap<any, any>, MapProps<any, any>>();

export class EquivMap<K, V> extends Map<K, V>
    implements
        Iterable<Pair<K, V>>,
        ICopy<EquivMap<K, V>>,
        IEmpty<EquivMap<K, V>>,
        IEquiv {
    /**
     * Converts given vanilla object into an `EquivMap` instance with
     * default (or optionally provided) options and returns it. By
     * default uses strict `===` equality check for `equiv` option.
     *
     * @param obj
     * @param opts
     */
    static fromObject<T>(
        obj: IObjectOf<T>,
        opts?: Partial<EquivMapOpts<string>>
    ): EquivMap<string, T> {
        const m = new EquivMap<string, T>(null, {
            equiv: (a, b) => a === b,
            ...opts
        });
        for (let k in obj) {
            obj.hasOwnProperty(k) && m.set(k, obj[k]);
        }
        return m;
    }

    /**
     * Creates a new instance with optional initial key-value pairs and
     * provided options. If no `opts` are given, uses `ArraySet` for
     * storing canonical keys and `@thi.ng/equiv` for checking key
     * equivalence.
     *
     * @param pairs
     * @param opts
     */
    constructor(pairs?: Iterable<Pair<K, V>>, opts?: Partial<EquivMapOpts<K>>) {
        super();
        const _opts: EquivMapOpts<K> = { equiv, keys: ArraySet, ...opts };
        __private.set(this, {
            keys: new _opts.keys(null, { equiv: _opts.equiv }),
            map: new Map<K, V>(),
            opts: _opts
        });
        if (pairs) {
            this.into(pairs);
        }
    }

    [Symbol.iterator](): IterableIterator<Pair<K, V>> {
        return this.entries();
    }

    get [Symbol.species]() {
        return EquivMap;
    }

    get [Symbol.toStringTag]() {
        return "EquivMap";
    }

    get size() {
        return __private.get(this).keys.size;
    }

    clear() {
        const $this = __private.get(this);
        $this.keys.clear();
        $this.map.clear();
    }

    empty() {
        return new EquivMap<K, V>(null, __private.get(this).opts);
    }

    copy() {
        const $this = __private.get(this);
        const m = new EquivMap<K, V>();
        __private.set(m, {
            keys: $this.keys.copy(),
            map: new Map<K, V>($this.map),
            opts: $this.opts
        });
        return m;
    }

    equiv(o: any) {
        if (this === o) {
            return true;
        }
        if (!(o instanceof Map)) {
            return false;
        }
        if (this.size !== o.size) {
            return false;
        }
        for (let p of __private.get(this).map.entries()) {
            if (!equiv(o.get(p[0]), p[1])) {
                return false;
            }
        }
        return true;
    }

    delete(key: K) {
        const $this = __private.get(this);
        key = $this.keys.get(key, SEMAPHORE);
        if (key !== <any>SEMAPHORE) {
            $this.map.delete(key);
            $this.keys.delete(key);
            return true;
        }
        return false;
    }

    dissoc(...keys: K[]) {
        for (let k of keys) {
            this.delete(k);
        }
        return this;
    }

    forEach(fn: Fn3<V, Readonly<K>, Map<K, V>, void>, thisArg?: any) {
        for (let pair of __private.get(this).map) {
            fn.call(thisArg, pair[1], pair[0], this);
        }
    }

    get(key: K, notFound?: V): V | undefined {
        const $this = __private.get(this);
        key = $this.keys.get(key, SEMAPHORE);
        if (key !== <any>SEMAPHORE) {
            return $this.map.get(key);
        }
        return notFound;
    }

    has(key: K) {
        return __private.get(this).keys.has(key);
    }

    set(key: K, value: V) {
        const $this = __private.get(this);
        const k = $this.keys.get(key, SEMAPHORE);
        if (k !== <any>SEMAPHORE) {
            $this.map.set(k, value);
        } else {
            $this.keys.add(key);
            $this.map.set(key, value);
        }
        return this;
    }

    into(pairs: Iterable<Pair<K, V>>) {
        for (let p of pairs) {
            this.set(p[0], p[1]);
        }
        return this;
    }

    entries(): IterableIterator<Pair<K, V>> {
        return __private.get(this).map.entries();
    }

    keys(): IterableIterator<K> {
        return __private.get(this).map.keys();
    }

    values(): IterableIterator<V> {
        return __private.get(this).map.values();
    }

    opts(): EquivMapOpts<K> {
        return __private.get(this).opts;
    }
}
