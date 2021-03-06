# 전역변수의 문제점

- 전역 변수는 위험하다.
- 지역 변수를 사용하자.

## 변수의 생명 주기

- 변수는 생명 주기가 있다. 즉, 언젠가 소멸해야 한다.
  - 변수의 생명 주기는 메모리 공간이 확보된 시점부터 메모리 공간이 해제되어 가용 메모리 풀에 반환되는 시점까지다.
    - 할당된 메모리 공간은 더 이상 그 누구도 참조하지 않을 때 가비지 콜렉터에 의해 해제되어 가용 메모리 풀에 반환된다
  - 만약 변수에 생명 주기가 없다면 한번 선언된 변수는 프로그램을 종료하지 않는 한 영원히 메모리 공간을 점유한다(비효율).
- 함수 내부에서 선언된 지역 변수는 해당 함수가 호출되어 실행되는 동안에만 유효하다.
  - 즉, 지역 변수의 생명 주기는 함수의 생명 주기와 일치한다.
- 그런데! 함수 몸체에서 선언된 지역 변수가 함수보다 오래 생존하는 경우가 있다!

  - 일반적으로 함수가 종료하면 함수가 생성한 스코프도 소멸한다. 하지만 함수가 종료된 이후에도 누군가가 해당 함수가 생성했던 스코프를 `참조`하고 있다면 스코프는 해제되지 않고 `생존`하게 된다.

- `호이스팅`은 변수 선언이 스코프의 선두로 끌어 올려진 것처럼 동작하는 자바스크립트 고유의 특징이며, `스코프`를 단위로 동작한다.

  - 전역변수의 호이스팅은 전역변수의 선언이 전역 스코프의 선두로 끌어 올려진 것처럼 동작한다.
  - 마찬가지로 지역변수의 호이스팅은 지역변수의 선언이 지역 스코프의 선두로 끌어 올려진 것처럼 동작한다.(->지역변수는 함수 전체에서 유효하게 된다)

### 전역 변수의 생명 주기

- var 키워드로 선언한 전역 변수의 생명 주기는 `전역 객체`의 생명 주기와 일치한다.(var 전역 변수는 웹페이지를 닫을 때 까지 유효하다)

- 전역 객체란, 코드 실행 전 자바스크립트 엔진에 의해 가장 먼저 생성되는 특수한 객체다. 클라이언트 사이드 환경(브라우저)에서는 `window`, 서버 사이드 환경(Node.js)에서는 `global` 객체이다.
- 전역 객체는 `표준 빌트인 객체(Object, Array...)`와 환경에 따른 `호스트 객체(Web API 또는 Node.js의 호스트 API)` 및 `var 키워드로 선언한 전역 변수와 전역 함수`를 프로퍼티로 갖는다.

## 전역 변수의 문제점

- 암묵적 결합
  - 암묵적 결합이란 모든 코드가 전역 변수를 참조하고 변경한다는 것이다. 변수의 유효범위가 크면 클수록 코드의 가독성이 나빠지며 의도치 않은 상태 변경 위험성이 높아진다.
- 긴 생명 주기
  - 전역 변수는 생명 주기가 길어서, 메모리 리소스도 오랜 기간 소비한다. 또한, var 키워드는 중복 선언이 되므로 의도치 않은 재할당이 이뤄질 수 있다.
- 스코프 체인 상에서 종점에 존재
  - 전역 변수의 검색 속도가 가장 느리다.
- 네임스페이스 오염
  - 자바스크립트의 가장 큰 문제점 중 하나는 파일이 분리되어 있어도 파일들이 하나의 전역 스코프를 공유하다는 것이다(충격 ㅇ0ㅇ).
    - 파일 간에 같은 이름의 전역 변수나 전역 함수가 있을 경우 예상치 못한 결과가 나타날 수 있다.

## 전역 변수 사용 억제 방법

- 변수의 스코프는 좁을수록 좋다!

### 즉시 실행 함수

- 모든 코드를 `즉시실행함수`로 감싸면 모든 변수는 `즉시실행함수`의 `지역 변수`가 된다. 이를 이용하여 전역 변수 사용을 제한할 수 있다.

```jsx
(function () {
  var foo = 10;
  //...
})();

console.log(foo); // ReferenceError
```

### 네임스페이스 객체

- 전역에 `네임스페이스` 역할을 담당할 객체를 생성하고 전역 변수처럼 사용하고 싶은 변수를 프로퍼티로 추가한다.
  - 네임스페이스를 분리해서 식별자 충돌을 방지하는 효과는 있으나,
  - 네임스페이스 객체 자체가 전역 변수이므로 그다지 유용해 보이지는 않는다.

```jsx
const MYAPP = {};

MYAPP.person = {
  name: "Marco",
  address: "Seoul",
};

console.log(MYAPP.person.name); // marco
```

### 모듈 패턴

- 모듈 패턴은 클래스를 모방한 것인데, `관련이 있는 변수와 함수를 모으고` `이를 즉시 실행 함수로 감싸서` 하나의 모듈을 만드는 것이다.
  - 이는 `클로저`를 기반으로 동작한다.
  - `전역변수의 억제` 및 `캡슐화`도 구현할 수 있다.

```jsx
const Counter = (function () {
  let num = 0; // private 변수!! 외부에서 접근할 수 없다.

  return {
    increase() {
      return ++num;
    },
    decrease() {
      return --num;
    },
  };
})();

console.log(Counter.num); // undefined
console.log(Counter.increase()); // 1
console.log(Counter.increase()); // 2
console.log(Counter.decrease()); // 1
console.log(Counter.decrease()); // 0
```

### ES6 모듈

> "자바스크립트의 가장 큰 문제점 중 하나는 파일이 분리되어 있어도 파일들이 하나의 전역 스코프를 공유하다는 것이다(충격 ㅇ0ㅇ)."

- 위에서 이렇게 정리하긴 했지만, `ES6 모듈`을 사용하면 더는 전역변수를 사용할 수 없고, ES6 모듈에서 `파일 자체의 독자적인 모듈 스코프`를 제공한다.
  - 따라서 모듈 내에서 var 키워드로 선언한 변수는 `더는 전역 변수가 아니며 window 객체의 프로퍼티도 아니다`. (흠...)

```jsx
<script type='module' src='lib.mjs'></script>
```
