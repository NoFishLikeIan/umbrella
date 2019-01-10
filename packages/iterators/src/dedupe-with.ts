import { Predicate2 } from "@thi.ng/api";
import { iterator } from "./iterator";

export function* dedupeWith<T>(equiv: Predicate2<T>, input: Iterable<T>) {
    let iter = iterator(input);
    let v: IteratorResult<T>;
    let prev: T;
    while (((v = iter.next()), !v.done)) {
        if (prev === undefined || !equiv(prev, v.value)) {
            prev = v.value;
            yield v.value;
        }
    }
}
