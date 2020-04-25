import {
    iterator1,
    Transducer,
} from "@thi.ng/transducers";
import { map } from '@thi.ng/transducers/xform/map';

type KalmanStep = [number, number]

/**
 */
export function kalman(P: number, a: number): Transducer<number, KalmanStep>;
export function kalman(P: number, a: number, src: Iterable<number>): IterableIterator<KalmanStep>;
export function kalman(P: number, a: number, src?: Iterable<number>): any {
    if (src) {
        return iterator1(kalman(P, a), src);
    }

    const signal = 100
    const noise = 15

    return map((x: number) => {
        const error = x - a
        const errorVar = P + noise

        const gainK = P / errorVar

        const aPrime = a + gainK * error
        const PPrime = P * (1 - gainK) + signal

        return [aPrime, PPrime, x]
    });

}
