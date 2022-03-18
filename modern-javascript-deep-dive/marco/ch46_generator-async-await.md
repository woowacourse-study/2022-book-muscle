# 제너레이터와 async/await

## 제너레이터란?

- 제너레이터는 코드 블록의 실행을 `일시 중지`했다가 필요한 시점에 `재개`할 수 있는 특수한 `함수`다.

- 일반함수와 비교한 제너레이터 함수의 특징
  - 1. `제너레이터 함수`는 `함수 호출자`에게 `함수 실행의 제어권을 양도`할 수 있다.
    - 반면, 호출된 `일반 함수`는 `함수 호출자`로부터 함수 실행의 `제어권을 넘겨 받아서` 함수 코드를 일괄 실행한다.
  - 2. `제너레이터 함수`는 함수 호출자와 `함수의 상태`를 주고받을 수 있다.
    - 반면, 일반 함수는 함수가 실행되고 있는 동안에는 함수 외부에서 함수 내부로 값을 전달하여 함수의 상태를 변경할 수 없다(호출 시 매개변수로 값을 주입받고, 실행 후 결과값을 외부로 반환하는 것이 전부다)
  - 3. `제너레이터 함수`를 호출하면 함수 코드를 실행하는 것이 아니라, `제너레이터 객체`(이터러블이면서 이터레이터임)를 반환한다.
    - 반면, `일반 함수`를 호출하면 `함수 코드를 일괄 실행`하고 `값을 반환`한다.

## 제너레이터 함수의 정의

- `function*` 키워드로 선언하고, 하나 이상의 `yield 표현식`을 포함한다. 이를 제외하면 일반 함수를 정의하는 방법과 같다.
- `에스터리스크(*)`의 위치는 function 키워드와 함수 이름 사이라면 어디든지 상관없으나, 일관성을 유지하기 위해 function 키워드 바로 뒤에 붙이는 것이 권장된다.
- 사용 불가 경우
  - 제너레이터 함수는 화살표 함수로 정의할 수 없다.
  - 제너레이터 함수는 new 연산자와 함께 생성자 함수로 호출할 수 없다.

```js
// 제너레이터 함수 선언문
function* genDecFunc() {
  yield 1;
}

// 제너레이터 함수 표현식
const genExpFunc = function* () {
  yield 1;
};

// 제너레이터 메서드
const obj = {
  *genObjMethod() {
    yield 1;
  },
};

// 제너레이터 클래스 메서드
class MyClass {
  *genClsMethod() {
    yield 1;
  }
}
```

## 제너레이터 객체

- `제너레이터 객체`는 제너레이터 함수가 반환한 것이다,
  - 그리고 `이터러블`이면서 동시에 `이터레이터`다.
    - 즉, Symbol.iterator 메서드를 상속받는 `이터러블`이면서,
    - `next` 메서드를 소유하는 `이터레이터`다.
      - (`next` 메서드는 `value, done` 프로퍼티를 갖는 이터레이터 리절트 객체를 반환한다.)
      - 제너레이터의 `next` 메서드에 전달한 인수는 제너레이터 함수의 yield 표현식을 할당받는 변수에 할당된다.

```js
// 제너레이터 함수
function* genFunc() {
  yield 1;
  yield 2;
  yield 3;
}

// 제너레이터 함수를 호출하면 제너레이터 객체를 반환한다.
const generator = genFunc();

// 제너레이터 객체는 이터러블이면서 동시에 이터레이터다.
// 이터러블은 Symbol.iterator 메서드를 직접 구현하거나 프로토타입 체인을 통해 상속받은 객체다.
console.log(Symbol.iterator in generator); // true
// 이터레이터는 next 메서드를 갖는다.
console.log("next" in generator); // true
```

- 제너레이터 객체의 메서드 3개

  - 1. next
    - next 메서드를 호출하면, yield 표현식까지 코드블록을 실행하고, yield된 값을 value 프로퍼티 값으로, false를 done 프로퍼티 값으로 갖는 `이터레이터 리절트 객체`를 반환한다.

  ```js
  // 위 코드 예제에서 이어짐
  console.log(generator.next()); // {value: , done: false}
  ```

  - 2. return
    - return 메서드를 호출하면 인수로 전달받은 값을 value 프로퍼티 값으로, true를 done 프로퍼티 값으로 갖는 이터레이터 리절트 객체를 반환한다.

  ```js
  console.log(generator.return("End")); // {value: "End", done: true}
  ```

  - 3. throw
    - throw 메서드를 호출하면 인수로 전달받은 에러를 발생시키고, undefined를 value 프로퍼티 값으로, true를 done 프로퍼티 값으로 갖는 이터레이터 리절트 객체를 반환한다.

  ```js
  console.log(generator.throw("Error")); // {value: undefined, done: true}
  ```

- 제너레이터의 일시중지와 재개

```js
function* genFunc() {
  // 처음 next 메서드를 호출하면 첫 번째 yield 표현식까지 실행되고 일시 중지된다.
  // 이때 yield된 값 1은 next 메서드가 반환한 이터레이터 리절트 객체의 value 프로퍼티에 할당된다.
  // x 변수에는 아직 아무것도 할당되지 않았다. x 변수의 값은 next 메서드가 두 번째 호출될 때 결정된다.
  const x = yield 1;

  // 두 번째 next 메서드를 호출할 때 전달한 인수 10은 첫 번째 yield 표현식을 할당받는 x 변수에 할당된다.
  // 즉, const x = yield 1;은 두 번째 next 메서드를 호출했을 때 완료된다.
  // 두 번째 next 메서드를 호출하면 두 번째 yield 표현식까지 실행되고 일시 중지된다.
  // 이때 yield된 값 x + 10은 next 메서드가 반환한 이터레이터 리절트 객체의 value 프로퍼티에 할당된다.
  const y = yield x + 10;

  // 세 번째 next 메서드를 호출할 때 전달한 인수 20은 두 번째 yield 표현식을 할당받는 y 변수에 할당된다.
  // 즉, const y = yield (x + 10);는 세 번째 next 메서드를 호출했을 때 완료된다.
  // 세 번째 next 메서드를 호출하면 함수 끝까지 실행된다.
  // 이때 제너레이터 함수의 반환값 x + y는 next 메서드가 반환한 이터레이터 리절트 객체의 value 프로퍼티에 할당된다.
  // 일반적으로 제너레이터의 반환값은 의미가 없다.
  // 따라서 제너레이터에서는 값을 반환할 필요가 없고 return은 종료의 의미로만 사용해야 한다.
  return x + y;
}

// 제너레이터 함수를 호출하면 제너레이터 객체를 반환한다.
// 이터러블이며 동시에 이터레이터인 제너레이터 객체는 next 메서드를 갖는다.
const generator = genFunc(0);

// 처음 호출하는 next 메서드에는 인수를 전달하지 않는다.
// 만약 처음 호출하는 next 메서드에 인수를 전달하면 무시된다.
// next 메서드가 반환한 이터레이터 리절트 객체의 value 프로퍼티에는 첫 번째 yield된 값 1이 할당된다.
let res = generator.next();
console.log(res); // {value: 1, done: false}

// next 메서드에 인수로 전달한 10은 genFunc 함수의 x 변수에 할당된다.
// next 메서드가 반환한 이터레이터 리절트 객체의 value 프로퍼티에는 두 번째 yield된 값 20이 할당된다.
res = generator.next(10); //  10 -> x
console.log(res); // {value: 20, done: false}

// next 메서드에 인수로 전달한 20은 genFunc 함수의 y 변수에 할당된다.
// next 메서드가 반환한 이터레이터 리절트 객체의 value 프로퍼티에는 제너레이터 함수의 반환값 30이 할당된다.
res = generator.next(20); // 20 -> y
console.log(res); // {value: 30, done: true}
```

## 제너레이터의 활용

### 이터러블의 구현

- 이터레이션 프로토콜을 준수하여 이터러블을 생성하는 방식
  - 무한 피보나치 수열 생성 함수 예제

```js
// 무한 이터러블을 생성하는 제너레이터 함수
const infiniteFibonacci = (function* () {
  let [pre, cur] = [0, 1];

  while (true) {
    [pre, cur] = [cur, pre + cur];
    yield cur;
  }
})();

// infiniteFibonacci는 무한 이터러블이다.
for (const num of infiniteFibonacci) {
  if (num > 10000) break;
  console.log(num); // 1 2 3 5 8...2584 4181 6765
}
```

### 비동기 처리

- 제너레이터 함수는 next 메서드와 yield 표현식을 통해 함수 호출자와 함수의 상태를 주고받을 수 있다.
  이러한 특성을 활용하여 프로미스를 사용한 비동기 처리를 동기 처리처럼 구현할 수 있다.
  - 즉, 프로미스의 후속 처리 메서드 then/catch/finally 없이 비동기 처리 결과를 반환하도록 구현할 수 있다.

## async/await

- ES8에서 제너레이터보다 간단하고 가독성 좋게 비동기 처리를 `마치 동기 처리처럼 구현`할 수 있는 `async/await`가 도입되었다.

### async 함수

- await 키워드는 반드시 async 함수 내부에서 사용해야 한다.
- async 함수는 언제나 프로미스를 반환한다.

- async 선언 방식

```js
// async 함수 선언문
async function foo(n) {
  return n;
}
foo(1).then(v => console.log(v)); // 1

// async 함수 표현식
const bar = async function (n) {
  return n;
};
bar(2).then(v => console.log(v)); // 2

// async 화살표 함수
const baz = async n => n;
baz(3).then(v => console.log(v)); // 3

// async 메서드
const obj = {
  async foo(n) {
    return n;
  },
};
obj.foo(4).then(v => console.log(v)); // 4

// async 클래스 메서드
class MyClass {
  async bar(n) {
    return n;
  }
}
const myClass = new MyClass();
myClass.bar(5).then(v => console.log(v)); // 5
```

### await 키워드

- await 키워드는 프로미스가 settled 상태(비동기 처리가 수행된 상태)가 될 때까지 대기하다가 settled 상태가 되면 프로미스가 resolve한 처리 결과를 반환한다.
  - await 키워드는 반드시 프로미스 앞에서 사용해야 한다.
  - await 키워드는 다음 실행을 일시 중지시켰다가 프로미스가 settled 상태가 되면 다시 재개한다.

### 에러 처리

- 비동기 처리를 위한 콜백 패턴의 단점 중 가장 심각한 것은 에러 처리가 곤란한다는 것이다.
  - 비동기 함수의 콜백함수를 호출한 것은 비동기 함수가 아니기 때문에 `try...catch`문을 사용해 에러를 캐치할 수 없다.
- 하지만 `async/await` 에서 에러 처리는 `try...catch` 문을 사용할 수 있다.
  - 콜백 함수를 인수로 전달받는 비동기 함수와 달리 `프로미스를 반환하는 비동기 함수`는 `명시적`으로 호출할 수 있기 때문에 호출자가 명확하다.

```js
// try catch 문 사용
const fetch = require("node-fetch");

const foo = async () => {
  try {
    const wrongUrl = "https://wrong.url";

    const response = await fetch(wrongUrl);
    const data = await response.json();
    console.log(data);
  } catch (err) {
    console.error(err); // TypeError: Failed to fetch
  }
};

foo();
```

```js
// await 메서ㅡ 사용
const fetch = require("node-fetch");

const foo = async () => {
  const wrongUrl = "https://wrong.url";

  const response = await fetch(wrongUrl);
  const data = await response.json();
  return data;
};

foo().then(console.log).catch(console.error); // TypeError: Failed to fetch`
```
