# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.4.2](https://github.com/thi-ng/umbrella/compare/@thi.ng/geom@1.4.1...@thi.ng/geom@1.4.2) (2019-04-26)

**Note:** Version bump only for package @thi.ng/geom





## [1.4.1](https://github.com/thi-ng/umbrella/compare/@thi.ng/geom@1.4.0...@thi.ng/geom@1.4.1) (2019-04-24)

**Note:** Version bump only for package @thi.ng/geom





# [1.4.0](https://github.com/thi-ng/umbrella/compare/@thi.ng/geom@1.3.0...@thi.ng/geom@1.4.0) (2019-04-15)


### Features

* **geom:** add new shape factories & impls ([1a5ead1](https://github.com/thi-ng/umbrella/commit/1a5ead1))





# [1.3.0](https://github.com/thi-ng/umbrella/compare/@thi.ng/geom@1.2.21...@thi.ng/geom@1.3.0) (2019-04-11)


### Features

* **geom:** add AABB impls for vertices() & volume() ([a9ba010](https://github.com/thi-ng/umbrella/commit/a9ba010))
* **geom:** add inscribedSquare*() fns ([b1790b3](https://github.com/thi-ng/umbrella/commit/b1790b3))





## [1.2.21](https://github.com/thi-ng/umbrella/compare/@thi.ng/geom@1.2.20...@thi.ng/geom@1.2.21) (2019-04-09)

**Note:** Version bump only for package @thi.ng/geom





## [1.2.20](https://github.com/thi-ng/umbrella/compare/@thi.ng/geom@1.2.19...@thi.ng/geom@1.2.20) (2019-04-07)

**Note:** Version bump only for package @thi.ng/geom





## [1.2.19](https://github.com/thi-ng/umbrella/compare/@thi.ng/geom@1.2.18...@thi.ng/geom@1.2.19) (2019-04-03)

**Note:** Version bump only for package @thi.ng/geom





## [1.2.18](https://github.com/thi-ng/umbrella/compare/@thi.ng/geom@1.2.17...@thi.ng/geom@1.2.18) (2019-04-02)

**Note:** Version bump only for package @thi.ng/geom





## [1.2.17](https://github.com/thi-ng/umbrella/compare/@thi.ng/geom@1.2.16...@thi.ng/geom@1.2.17) (2019-04-02)

**Note:** Version bump only for package @thi.ng/geom





## [1.2.16](https://github.com/thi-ng/umbrella/compare/@thi.ng/geom@1.2.15...@thi.ng/geom@1.2.16) (2019-03-28)

**Note:** Version bump only for package @thi.ng/geom






# [1.2.0](https://github.com/thi-ng/umbrella/compare/@thi.ng/geom@1.1.1...@thi.ng/geom@1.2.0) (2019-02-05)


### Features

* **geom:** add ray-rect/aabb impls for intersects() ([5f7dd63](https://github.com/thi-ng/umbrella/commit/5f7dd63))


# [1.1.0](https://github.com/thi-ng/umbrella/compare/@thi.ng/geom@1.0.1...@thi.ng/geom@1.1.0) (2019-01-22)


### Bug Fixes

* **geom:** update Rect.toHiccup() format (separate widht/height vals) ([8c1df49](https://github.com/thi-ng/umbrella/commit/8c1df49))

### Features

* **geom:** add asPolyline() multi-fn ([c602379](https://github.com/thi-ng/umbrella/commit/c602379))
* **geom:** add attrib support to PathBuilder ([a017b10](https://github.com/thi-ng/umbrella/commit/a017b10))



## [1.0.1](https://github.com/thi-ng/umbrella/compare/@thi.ng/geom@1.0.0...@thi.ng/geom@1.0.1) (2019-01-21)

**Note:** Version bump only for package @thi.ng/geom



# [1.0.0](https://github.com/thi-ng/umbrella/compare/@thi.ng/geom@0.2.11...@thi.ng/geom@1.0.0) (2019-01-21)


### Build System

* update package build scripts & outputs, imports in ~50 packages ([b54b703](https://github.com/thi-ng/umbrella/commit/b54b703))


### BREAKING CHANGES

* enabled multi-outputs (ES6 modules, CJS, UMD)

- build scripts now first build ES6 modules in package root, then call
  `scripts/bundle-module` to build minified CJS & UMD bundles in `/lib`
- all imports MUST be updated to only refer to package level
  (not individual files anymore). tree shaking in user land will get rid of
  all unused imported symbols.


# [0.2.0](https://github.com/thi-ng/umbrella/compare/@thi.ng/geom@0.1.0...@thi.ng/geom@0.2.0) (2018-10-21)


### Features

* **geom:** add IToCubic, add/update impls ([ce131d4](https://github.com/thi-ng/umbrella/commit/ce131d4))


# 0.1.0 (2018-10-17)


### Features

* **geom:** add ICollate & ICopy impls, re-add/update convexHull2 ([3b1bf64](https://github.com/thi-ng/umbrella/commit/3b1bf64))
* **geom:** add/update factory fns, arg handling, tessel, poly area ([555fc51](https://github.com/thi-ng/umbrella/commit/555fc51))
* **geom:** add/update interfaces & impls ([2657df6](https://github.com/thi-ng/umbrella/commit/2657df6))
* **geom:** add/update tessellate() impls ([fa87f1e](https://github.com/thi-ng/umbrella/commit/fa87f1e))
* **geom:** add/update various shape impls & ops ([3a20ef3](https://github.com/thi-ng/umbrella/commit/3a20ef3))
* **geom:** import (updated) old thi.ng/geom package (minus vectors) ([c03259c](https://github.com/thi-ng/umbrella/commit/c03259c))
* **geom:** re-add Arc2, update Circle2, update helper fns ([aa6b120](https://github.com/thi-ng/umbrella/commit/aa6b120))
* **geom:** re-import & refactor partial port of thi.ng/geom (clojure) ([d655ec2](https://github.com/thi-ng/umbrella/commit/d655ec2))
* **geom:** update all shape types, add interfaces & ops, update tests ([9c27c77](https://github.com/thi-ng/umbrella/commit/9c27c77))
