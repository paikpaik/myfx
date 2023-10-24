/* 
  ##########################################################################
  ########################            Fx            ########################
  ##########################################################################
*/
// 공통된 특징 :
//    1. 이터러블 : 이터러블을 인자로 받는다는 뜻은 지연성을 가질수 있다는 의미

// [ log ] 로그를 찍는 함수
const log = console.log;

// [ add ] 두개의 인자를 더해주는 함수
const add = (a, b) => a + b;

// [ sub ] a에서 b를 빼주는 함수
const sub = (a, b) => a - b;

// [ mult ] 두개의 인자를 곱해주는 함수
const mult = (a, b) => a * b;

// [ div ] 두개의 인자를 나눠주는 함수, 몫을 리턴
const div = (a, b) => a / b;

// [ left ] 두개의 인자를 나눠주는 함수, 나머지를 리턴
const left = (a, b) => a % b;

// [ curry ] 함수와 인자를 받아서 함수를 리턴하고 인자가 원하는 갯수가 되었을때
//           받아둔 함수를 평가시키는 함수
// 1. 표현력이 좋아짐.
const curry =
  (f) =>
  (a, ..._) =>
    _.length ? f(a, ..._) : (..._) => f(a, ..._);

// [ map ] 특정 조건에 맵핑되는 정보들을 나열하는 함수
// 1. 다형성을 가짐. Array를 상속받은 객체 뿐만 아니라 iterable protocol을
//    따르는 모든 객체, generator 함수도 맵핑이 가능
const map = curry((f, iter) => {
  let res = [];
  iter = iter[Symbol.iterator]();
  let cur;
  while (!(cur = iter.next()).done) {
    const a = cur.value;
    res.push(f(a));
  }
  return res;
});

// [ filter ] 특정 조건에 필터되는 정보들만 모아주는 함수
// 1. 다형성을 가짐. map과 동일
const filter = curry((f, iter) => {
  let res = [];
  iter = iter[Symbol.iterator]();
  let cur;
  while (!(cur = iter.next()).done) {
    const a = cur.value;
    if (f(a)) res.push(a);
  }
  return res;
});

// [ reduce ] 특정 조건이 계속해서 누적 적용되는 함수
// 1. 다형성을 가짐.
// 2. 초기값(acc)이 없어도 iter의 첫번째 값을 가져와서 적용
const reduce = curry((f, acc, iter) => {
  if (!iter) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  } else {
    iter = iter[Symbol.iterator]();
  }
  let cur;
  while (!(cur = iter.next()).done) {
    const a = cur.value;
    acc = f(acc, a);
  }
  return acc;
});

// [ go ] 코드를 값으로 다루어 연속적으로 실행되게 하는 함수
// 1. 표현력과 가독성이 좋아짐.
// 2. 응용해서 평가 순서를 결정할 수 있음.
const go = (...args) => reduce((a, f) => f(a), args);

// [ pipe ] 함수를 받아서 함수를 리턴하는 함수
// 1. 동일한 일을 하는 함수들을 묶어서 편하게 하나의 함수로 만들수 있음.
const pipe =
  (f, ...fs) =>
  (...as) =>
    go(f(...as), ...fs);

// [ range ] 숫자를 받아서 0부터 1씩 증가하는 배열을 리턴하는 함수
// 1. 숫자를 간단하게 배열로 펼칠수 있음.
const range = (l) => {
  let i = -1;
  let res = [];
  while (++i < l) {
    res.push(i);
  }
  return res;
};

// [ test ] 함수의 이름, 시간, test할 함수를 받아서 순회 시간을 리턴하는 함수
// 1. 간단하고 구별되게 함수들의 성능을 비교해볼 수 있음.
const test = (name, time, f) => {
  console.time(name);
  while (time--) f();
  console.timeEnd(name);
};

// [ take ] 숫자와 이터러블을 받아서 숫자만큼 배열을 0 부터 잘라주는 함수
// 1. 원하는 만큼만 배열을 자를 수 있음.
const take = curry((l, iter) => {
  let res = [];
  iter = iter[Symbol.iterator]();
  let cur;
  while (!(cur = iter.next()).done) {
    const a = cur.value;
    res.push(a);
    if (res.length == l) return res;
  }
  return res;
});
const takeAll = take(Infinity);

// [ find ] 원하는 이터러블의 첫번째 값을 리턴하는 함수
const find = curry((f, iter) => go(iter, filter(f), take(1), ([a]) => a));

// [ join ] 이터러블을 축약하거나 해당 seperator로 결합하는 함수
// 1. 배열이 아니어도 가능
const join = curry((sep = ",", iter) =>
  reduce((a, b) => `${a}${sep}${b}`, iter)
);

// [ queryStr ] 객체를 queryString으로 변환하는 함수
// 1. { limit: 10, offset: 10 } => limit=10&offset=10
const queryStr = pipe(
  Object.entries,
  map(([k, v]) => `${k}=${v}`),
  join("&")
);

// [ isIterable ] 이터러블인지 판단하는 함수
const isIterable = (a) => a && a[Symbol.iterator];

/* 
  ##########################################################################
  ########################     Lazy(지연성) Fx      ########################
  ##########################################################################
*/

// [ L ] Lazy(지연성)을 가지는 메서드의 객체
// 1. 지연성이란 전체를 순회하고 내부의 값을 평가하는것이 아니라 먼저 내부의 값이
//    평가될 때까지 기다리다가 내부의 값이 평가되는 순간에 내부의 값에 해당하는
//    순회를 하는 것(전체를 절대 다 순회하지 않음)
const L = {};

// [ L.range ] 지연성을 가지는 range
L.range = function* (l) {
  let i = -1;
  while (++i < l) {
    yield i;
  }
};

// [ L.map ] 지연성을 가지는 map
L.map = curry(function* (f, iter) {
  iter = iter[Symbol.iterator]();
  let cur;
  while (!(cur = iter.next()).done) {
    const a = cur.value;
    yield f(a);
  }
});

// [ L.filter ] 지연성을 가지는 filter
L.filter = curry(function* (f, iter) {
  iter = iter[Symbol.iterator]();
  let cur;
  while (!(cur = iter.next()).done) {
    const a = cur.value;
    if (f(a)) yield a;
  }
});

// [ L.entries ] 지연성을 가지고 객체를 키,값의 쌍을 담은 배열로 반환
L.entries = function* (obj) {
  for (const k in obj) yield [k, obj[k]];
};

// [ L.flatten ] 지연성을 가지고 여러 객체를 전부 펼치는 함수
L.flatten = function* (iter) {
  for (const a of iter) {
    if (isIterable(a)) yield* a;
    else yield a;
  }
};

// [ L.deepFlat ] 지연성을 가지고 깊은 뎁스의 여러 배열을 전부 펼치는 함수
L.deepFlat = function* f(iter) {
  for (const a of iter) {
    if (isIterable(a)) yield* f(a);
    else yield a;
  }
};

// [ L.flatMap ] 지연성을 가지고 flat과 map을 동시에 하는 함수
L.flatMap = curry(pipe(L.map, L.flatten));

/* 
  ##########################################################################
  ########################     Lazy(지연성) Fx를    ########################
  ########################     활용한 함수 축약      ########################
  ##########################################################################
*/

// [ LqueryStr ] 지연성을 가지고 객체를 queryString으로 변환하는 함수
// 1. { limit: 10, offset: 10 } => limit=10&offset=10
const LqueryStr = pipe(
  L.entries,
  L.map(([k, v]) => `${k}=${v}`),
  join("&")
);

// [ Lfind ] 지연성을 가지고 원하는 이터러블의 첫번째 값을 리턴하는 함수
const Lfind = curry((f, iter) => go(iter, L.filter(f), take(1), ([a]) => a));

// [ Lmap ] 지연성을 가지는 L.map을 활용한 map (지연성은 없음.)
const Lmap = curry(pipe(L.map, takeAll));

// [ Lfilter ] 지연성을 가지는 L.filter를 활용한 filter (지연성은 없음.)
const Lfilter = curry(pipe(L.filter, takeAll));

// [ Lflatten ] 지연성을 가지고 여러 배열을 즉시 펼치는 함수 (지연성은 없음.)
const Lflatten = pipe(L.flatten, takeAll);

// [ LdeepFlat ] 지연성을 가지고 깊은 뎁스의 여러 배열을 즉시 펼치는 함수 (지연성은 없음.)
const LdeepFlat = pipe(L.deepFlat, takeAll);

// [ LflatMap ] 지연성을 가지고 flat과 map을 동시에 하는 함수 (지연성은 없음.)
const LflatMap = curry(pipe(L.flatMap, takeAll));
/* 
  ##########################################################################
  ########################      Concurrency Fx      ########################
  ##########################################################################
*/

/* 
  ##########################################################################
  ########################          export          ########################
  ##########################################################################
*/
export {
  log,
  add,
  sub,
  map,
  div,
  left,
  filter,
  reduce,
  go,
  mult,
  curry,
  pipe,
  range,
  test,
  L,
  join,
  take,
  find,
  queryStr,
  LqueryStr,
  Lfind,
  Lmap,
  Lfilter,
  takeAll,
  isIterable,
  Lflatten,
  LdeepFlat,
  LflatMap,
};
