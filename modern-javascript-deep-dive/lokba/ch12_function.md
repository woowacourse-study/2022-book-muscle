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
