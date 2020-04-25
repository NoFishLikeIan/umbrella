import { Reducer, Transducer, $iter, compR } from "@thi.ng/transducers";

type KalmanStep = [number, number];

export function kalman(a: number, p: number): Transducer<number, KalmanStep>;
export function kalman(
    a: number,
    p: number,
    src: Iterable<number>
): IterableIterator<KalmanStep>;
export function kalman(
    a: number,
    p: number,
    src?: Iterable<number>
): IterableIterator<KalmanStep>;
export function kalman(...args: any[]): any {
    return (
        $iter(kalman, args) ||
        ((rfn: Reducer<any, KalmanStep>) => {
            let [a, p] = <number[]>args;
            return compR(rfn, (acc: any, x: number) => {
                const error = x - a;
                const errorVariance = p + 1;
                const K = p / errorVariance;
                a += K * error;
                p = p * (1 - K) + 1;
                return rfn[2](acc, [a, p]);
            });
        })
    );
}
