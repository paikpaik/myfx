import {
  log,
  map,
  filter,
  reduce,
  add,
  go,
  pipe,
  sub,
  div,
  left,
  range,
  test,
  L,
  take,
} from "./fx.js";
import { products } from "./data.js";

// #######################################################################

// // map의 다형성 1
// function* gen() {
//   yield 2;
//   yield 3;
//   yield 4;
// }
// log(map((a) => a * a, gen()));

// #######################################################################

// // map의 다형성 2 (map을 이용해서 Map을 만들수 있음.)
// const m = new Map();
// m.set("a", 10);
// m.set("b", 20);
// log(new Map(map(([k, a]) => [k, a * a], m)));

// #######################################################################

// // filter의 다형성
//log(...filter((p) => p.price < 20000, products));
//log(...filter((p) => p.price >= 20000, products));
// function* gen() {
//   yield 1;
//   yield 2;
//   yield 3;
//   yield 4;
//   yield 5;
// }
// log(...filter((a) => a % 2, gen()));

// #######################################################################

// // reduce의 다형성
// log(reduce(add, 0, [1, 2, 3, 4, 5]));
// log(reduce(add, [1, 2, 3, 4, 5]));
// log(reduce((total_price, product) => total_price + product.price, 0, products));

// #######################################################################

// // go, curry를 이용한 표현력 비교
// go(
//   products,
//   (products) => filter((p) => p.price < 20000, products),
//   (products) => map((p) => p.price, products),
//   (prices) => reduce(add, prices),
//   log
// );

// go(
//   products,
//   filter((p) => p.price < 20000),
//   map((p) => p.price),
//   reduce(add),
//   log
// );

// #######################################################################

// // pipe를 이용한 함수 조합
// const total_price = pipe(
//   map((p) => p.price),
//   reduce(add)
// );

// const base_total_price = (predicate) => pipe(filter(predicate), total_price);

// go(
//   products,
//   filter((p) => p.price < 20000),
//   total_price,
//   log
// );

// go(
//   products,
//   base_total_price((p) => p.price < 20000),
//   log
// );

// go(
//   products,
//   filter((p) => p.price >= 20000),
//   total_price,
//   log
// );

// go(
//   products,
//   base_total_price((p) => p.price >= 20000),
//   log
// );

// #######################################################################

// go(
//   products,
//   map((p) => p.quantity),
//   reduce((a, b) => a + b),
//   log
// );

// #######################################################################

// // range와 L.range 성능 비교
// test("range", 10, () => reduce(add, range(1000000)));
// test("L.range", 10, () => reduce(add, L.range(1000000)));
// // range: 608.311ms
// // L.range: 437.586ms

// #######################################################################

// // take
// log(take(5, range(100)));
// console.time("");
// go(range(10000), take(5), reduce(add), log);
// console.timeEnd("");
// console.time("");
// go(L.range(10000), take(5), reduce(add), log);
// console.timeEnd("");

// #######################################################################

go(
  range(10),
  map((n) => n + 10),
  filter((n) => n % 2),
  take(2),
  log
);

go(
  L.range(10),
  L.map((n) => n + 10),
  L.filter((n) => n % 2),
  take(2),
  log
);
