import { IObjectOf } from "@thi.ng/api";

export const renamer =
    (kmap: IObjectOf<PropertyKey>) => {
        const ks = Object.keys(kmap);
        const [a2, b2, c2] = ks;
        const [a1, b1, c1] = ks.map((k) => kmap[k]);
        switch (ks.length) {
            case 3:
                return (x) => {
                    const res: any = {};
                    let v;
                    v = x[c1], v !== undefined && (res[c2] = v);
                    v = x[b1], v !== undefined && (res[b2] = v);
                    v = x[a1], v !== undefined && (res[a2] = v);
                    return res;
                };
            case 2:
                return (x) => {
                    const res: any = {};
                    let v;
                    v = x[b1], v !== undefined && (res[b2] = v);
                    v = x[a1], v !== undefined && (res[a2] = v);
                    return res;
                };
            case 1:
                return (x) => {
                    const res: any = {};
                    let v = x[a1];
                    v !== undefined && (res[a2] = v);
                    return res;
                };
            default:
                return (x) => {
                    let k, v;
                    const res: any = {};
                    for (let i = ks.length - 1; i >= 0; i--) {
                        k = ks[i], v = x[kmap[k]], v !== undefined && (res[k] = v);
                    }
                    return res;
                };
        }
    };
