### Chapter 12. 함수

---

#### 1. 기초 지식

- 매개변수, 함수 이름, 인수

  ```jsx
  function add(x, y) {
    return x + y;
  }

  add(1, 2);
  ```

  - x와 y는 매개변수이다.
  - add는 함수 이름이다.
    - **함수 이름은 함수 몸체 내에서만 참조할 수 있는 식별자다.**
  - 1과 2는 인수이다.

<br>

#### 2. 함수를 정의하는 법

- 함수 선언문

  ```jsx
  function add(x, y) {
    return x + y;
  }
  ```

- 함수 표현식

  ```jsx
  const add = function (x, y) {
    return x + y;
  };
  ```

- 화살표 함수

  ```jsx
  const add = (x, y) => x + y;
  ```

- Function 생성자 함수

  ```jsx
  const add = new Function("x", "y", "return x + y");
  ```

<br>

#### 3. 함수 선언문의 특징

- 함수 선언문은 함수 이름을 생략할 수 없다.

  ```jsx
  function (x, y) {
    return x + y;
  }
  // SyntaxError : Function statements require a function name
  ```

<br>

- 흔히 놓칠 수 있는 부분🤔

  ```jsx
  function getNickname() {
    return "lokba";
  }

  //1번
  getNickname(); //"lokba"
  ```

  > 앞서 기초지식에서 `함수 이름은 함수 몸체 내에서만 참조할 수 있는 식별자다.`라고 배웠다. 근데 어떻게 1번에서 `getNickname`을 참조할 수 있는 것인가? <br> > **그 이유는, JS 엔진이 함수 이름과 동일한 이름의 식별자를 암묵적으로 생성한다.**

  ```jsx
  //JS 엔진 탐색 전
  function getNickname() {
    return "lokba";
  }

  //JS 엔진 탐색
  var getNickname = function getNickname() {
    return "lokba";
  };
  ```

  - 위 코드에서, JS엔진이 함수 선언문을 평가하는 과정을 자세하게 알아보자.🎯
    1. JS 엔진은 함수 선언문을 해석해 함수 객체를 생성한다.
    2. 함수 이름과 동일한 이름의 식별자를 암묵적으로 생성한다.
    3. 생성한 식별자에 함수 객체를 할당한다.

<br>

✅ 결론적으로, **우리는 함수 이름으로 함수를 호출하는 것이 아니라 함수 객체를 가리키는 식별자로 호출한다.**

<br>

#### 4. 함수 표현식

```jsx
//함수 표현식
const add = function (x, y) {
  return x + y;
};
```

> 함수 리터럴로 생성한 함수 객체를 어떻게 add 변수에 할당할 수 있을까?
> 자바스크립트에서 함수는 **일급 객체**이기 때문이다.
> **일급 객체란, 값의 성질을 갖는 객체를 의미**한다.

<br>

#### 5. 함수 선언문 vs 함수 표현식

- 문제 1 ~ 5에서는 어떤 것이 출력이 될까?🤔

  ```jsx
  //문제 1
  console.log(add);

  //문제 2
  console.log(sub);

  //문제 3
  console.log(mul);

  //문제 4
  console.log(add(2, 5));

  //문제 5
  console.log(sub(2, 5));

  //함수 선언문
  function add(x, y) {
    return x + y;
  }

  //함수 표현식
  var sub = function (x, y) {
    return x - y;
  };

  //함수 표현식
  const mul = function (x, y) {
    return x * y;
  };
  ```

- 정답

  ```jsx
  //문제 1
  console.log(add); //ƒ add(x, y) { return x + y; }

  //문제 2
  console.log(sub); //undefined

  //문제 3
  console.log(mul); //ReferenceError: mul is not defined

  //문제 4
  console.log(add(2, 5)); //7

  //문제 5
  console.log(sub(2, 5)); //TypeError: sub is not a function
  ```

<br>

#### 6. 화살표 함수의 특징

```jsx
//화살표 함수
const add = (x, y) => x + y;
```

- 화살표 함수는 항상 익명 함수로 정의한다.
- 기존 함수와 this 바인딩 방식이 다르다.
- prototype 프로퍼티가 없다.
- arguments 객체를 생성하지 않는다.

<br>

#### 7. 다양한 함수의 형태

- 즉시 실행 함수
  ```jsx
  //즉시 실행 함수
  (function () {
    var a = 3;
    var b = 5;
    return a * b;
  })();
  ```
  - 즉시 실행 함수는 반드시 그룹 연산자 ( ... )로 감싸야 한다.
    - why에 대한 설명은 스킵하겠다. 궁금하다면, 책을 보는 것을 추천한다.

<br>

- 재귀 함수
  - 생략

<br>

- 중첩 함수

  ```jsx
  //외부 함수
  function outer() {
    var x = 1;

    //중첨 함수 또는 내부 함수
    function inner() {
      var y = 2;
    }

    inner();
  }

  outer();
  ```

  - 함수 내부에 정의된 함수를 **중첩 함수** 또는 **내부 함수**라 한다.
  - 중첩 함수를 포함하는 함수는 **외부 함수**라 부른다.
  - **`일반적으로, 중첩 함수는 외부 함수를 돕는 헬퍼 함수의 역할을 한다.`**

<br>

- 콜백 함수

  ```jsx
  //고차 함수
  function repeat(count, func) {
    for (let i = 0; i < count; i++) {
      //콜백 함수의 호출 시점을 제어할 수 있다.
      func(i);
    }
  }

  //콜백 함수로 사용된다.
  var logAll = function (i) {
    console.log(i);
  };

  repeat(5, logAll);
  ```

  - 함수의 매개변수를 통해 다른 함수의 내부로 전달되는 함수를 **콜백 함수**라 한다.
  - 매개 변수를 통해 함수의 외부에서 콜백 함수를 전달받은 함수를 **고차 함수-HOF**라 한다.
  - **`콜백 함수도 고차 함수에 전달되어 헬퍼 함수의 역할을 한다.`**

<br>

#### 8. 순수 함수와 비순수 함수

- **순수 함수** : 어떤 외부 상태에 의존하지 않고 변경하지도 않는 함수
- **비순수 함수** : 외부 상태에 의존하거나 외부 상태를 변경하는 함수

  ```jsx
  var count = 0;

  //순수 함수 - 동일한 인수가 전달되면 언제나 동일한 값을 반환한다.
  function increase(n) {
    return ++n;
  }

  //비순수 함수 - count라는 외부 상태에 의존하며, 외부 상태를 변경한다.
  function decrease() {
    return --count;
  }
  ```
