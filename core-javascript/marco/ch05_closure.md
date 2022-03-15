# 클로저

- MDN 정의에 따르면, 클로저는 "함수와 그 함수가 선언될 당시의 lexical environment의 상호관계에 따른 현상"이라고 이해할 수 있다.
- inner 함수의 실행 시점에는 outer 함수는 이미 실행이 종료된 상태인데, outer 함수의 LexicalEnvironment에 어떻게 접근할 수 있을까? 이는 가비지 컬렉터의 동작 방식 때문이다.
  - 가비지 컬렉터는 어떤 값을 참조하는 변수가 하나라도 있다면 그 값은 수집 대상에 포함시키지 않는다.
- 즉, 클로저란 어떤 `함수 A`에서 선언한 `변수 a`를 참조하는 `내부함수 B`를 외부로 전달할 경우, `함수 A`의 실행 컨텍스트가 종료된 이후에도 `변수 a`가 사라지지 않는 현상이다.
  - 내부 함수를 외부로 전달하는 방법에는 함수를 return하는 방식뿐 아니라 콜백으로 전달하는 경우도 포함된다.

## 클로저와 메모리 관리

- 메모리 소모는 클로저의 본질적인 특성일 뿐이다.
  - 의도대로 설계한 `메모리 소모`에 대한 관리법만 잘 파악해서 적용하면 충분하다.
- 클로저는 어떤 필요에 의해 의도적으로 함수의 지역변수가 메모리를 소모하도록 함으로써 발생한다.
  - 그렇다면 그 필요성이 사라진 시점에는 더는 메모리를 소모하지 않게(참조 카운트를 0으로) 해주면 된다.
    - 참조 카운트를 0으로 만드는 방법은 식별자에 참조형이 아닌 기본형 데이터(null 또는 undefined)를 할당하면 된다.

```jsx
let outer = (function () {
  let a = 1;
  let inner = function () {
    return ++a;
  };
  return inner;
})();

console.log(outer());
console.log(outer());
outer = null; // outer 식별자의 inner 함수 참조를 끊는다.
```

```jsx
// setInterval
(function () {
  let a = 0;
  let intervalId = null;
  let inner = function () {
    if (++a >= 10) {
      clearInterval(intervalId);
      inner = null; // inner 식별자의 함수 참조 끊기
    }
    console.log(a);
  };
  intervalId = setInterval(inner, 1000);
})();
```

## 2. 클로저 활용 사례

### (1) 콜백 함수 내부에서 외부 데이터를 사용하고자 할 때

### (2) 접근 권한 제어(정보 은닉)

- closure라는 단어는 사전적으로 '닫혀있음, 폐쇄성, 완결성' 정도의 의미를 지닌다. outer 함수는 외부(전역 스코프)로부터 격리된 공간이다. 외부에서는 오직 outer 함수가 return한 정보에만 접근할 수 있다. 외부에 제공하고자 하는 정보들을 모아서 return하고, 내부에서만 사용할 정보들은 return하지 않는 것으로 접근 권한 제어가 가능하다.
  - 즉, return한 변수들은 공개 멤버가 되고, 그렇지 않은 변수들은 비공개 멤버가 된다.

### (3) 부분 적용 함수

- 부분 적용 함수란 n개의 인자를 받는 함수에 미리 m개의 인자만 넘겨 기억시켰다가, 나중에 나머지 (n-m)개의 인자를 넘기면 비로소 원래 함수의 실행 결과를 얻을 수 있게끔 하는 함수이다.

```jsx
const add = function () {
  let result = 0;
  for (let i = 0; i < arguments.length; i++) {
    result += arguments[i];
  }
  return result;
};

const addPartial = add.bind(null, 1, 2, 3, 4, 5);
console.log(addPartial(6, 7, 8, 9, 10)); // 55
```

- 실무에서 부분함수를 사용하기에 적합한 예로 디바운스가 있다. 디바운스는 짧은 시간 동안 동일한 이벤트가 많이 발생할 경우 이를 전부 처리하지 않고 처음 또는 마지막에 발생한 이벤트에 대해 한 번만 처리하는 것으로, 성능 최적화에 큰 도움을 주는 기능이다.
  - 특히, scroll, wheel, mousemove, resize 등에 적용하기 좋다.

### (4) 커링 함수

- 커링 함수란 여러 개의 인자를 받는 함수를 하나의 인자만 받는 함수로 나눠서 순차적으로 호출할 수 있게 체인형태로 구성한 것을 말한다.

  - 부분적용함수와 다른 점은 커링은 하나의 인자만 전달하는 것을 원칙으로 한다는 것이다.

- Currying 은 1967년 Christopher Strachey 가 Haskell Brooks Curry의 이름에서 착안한 것이다. Currying은 여러 개의 인자를 가진 함수를 호출 할 경우, 파라미터의 수보다 적은 수의 파라미터를 인자로 받으면 누락된 파라미터를 인자로 받는 기법을 말한다. 즉 커링은 함수 하나가 n개의 인자를 받는 과정을 n개의 함수로 각각의 인자를 받도록 하는 것이다. 부분적으로 적용된 함수를 체인으로 계속 생성해 결과적으로 값을 처리하도록 하는 것이 그 본질이다. Haskell 및 Scala와 같은 언어는 currying이 기본적으로 내장되어 있지만, 자바스크립트는 커링이 내장되어 있지 않다. 하지만 자바스크립트도 커링을 구현할 수 있다.

```jsx
const curry3 = function (func) {
  return function (a) {
    return function (b) {
      return func(a, b);
    };
  };
};

const getMaxWith10 = curry3(Math.max)(10);

console.log(getMaxWith10(8)); // 10
```

- curry3 매개변수로

  - (1) Math.max 라는 함수가 func 매개변수에 인자로 들어간다
  - (2) 숫자 10이 그 다음 a 매개변수에 인자로 들어간다.
  - (3) getMaxWith10() 함수에 인자로 전달한 숫자 8이 b 매개변수에 인자로 들어간다.

- 인자가 많아질수록 가독성이 떨어질 수 있긴 하나, 화살표 함수를 쓰면 한 줄에 표기할 수 있다.

```jsx
const curry5 = func => a => b => c => d => e => func(a, b, c, d, e);

console.log(curry5(Math.max)(1)(2)(3)(4)(5)); // 5
```

- 커링 함수가 유용한 경우는 다음과 같다. 당장 필요한 정보만 받아서 전달하고 또 필요한 정보가 들어오면 전달하는 식으로 하면 결국 마지막 인자가 넘어갈 때까지 함수 실행을 미루는 셈이며, 이를 함수형 프로그래밍에서는 `지연실행`이라고 칭한다.
  - HTML5의 fetch 함수는 url을 받아 해당 url에 HTTP 요청을 한다. 보통 REST API를 이용할 경우 baseUrl은 몇 개로 고정되지만 나머지 path나 id는 매우 많을 수 있다. 이런 상황에서 서버에 정보를 요청할 필요가 있을 때마다 매번 baseUrl부터 전부 기입해주기보다는 공통적인 요소는 먼저 기억시켜두고 특정한 값(id)만으로 서버 요청을 수행하는 함수를 만들어두는 편이 개발효율성이나 가독성 측면에서 좋다.

```jsx
const getInformation = function (baseUrl) {
  return function (path) {
    return function (id) {
      return fetch(baseUrl + path + "/" + id);
    };
  };
};

// 화살표 함수 버전
const getInformation = baseUrl => path => id =>
  fetch(baseUrl + path + "/" + id);
```

- Redux의 미들웨어 중 Logger도 커링을 사용했다.
