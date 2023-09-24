import { log, map, filter, reduce, add } from "./fx.js";
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
