import { Reducer, $$reduce } from "@thi.ng/transducers";

type KalmanStep = [number, number];

function step(x: number, a: number, p: number) {
    const error = x - a;
    const errorVariance = p + 1;

    const K = p / errorVariance;

    const aPrime = a + K * error;
    const pPrime = p * (1 - K) + 1;

    return [aPrime, pPrime] as KalmanStep;
}

export function kalman(a: number, p: number): Reducer<KalmanStep[], number>;
export function kalman(
    a: number,
    p: number,
    xs: Iterable<number>
): Reducer<KalmanStep[], number>;
export function kalman(...args: any[]): any {
    const res = $$reduce(kalman, args);
    if (res !== undefined) {
        return res;
    }
    const [a, p] = args;
    return [
        () => [[a, p]],
        (acc: any) => acc,
        (acc: any, x: any) => {
            const last = acc[acc.length - 1];
            acc.push(step(x, last[0], last[1]));
            return acc;
        },
    ];
}
