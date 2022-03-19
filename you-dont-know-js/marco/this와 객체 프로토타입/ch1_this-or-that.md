# 1. this라나 뭐라나

## 1.1 this를 왜?

- idetinfy()와 speak() 두 함수는 객체별로 따로따로 함수를 작성할 필요 없이 다중 콘텍스트 객체인 me와 you 모두에서 재사용할 수 있다. 암시적인 객체 레퍼런스를 '함께 넘기는' this 체계가 API 설계상 조금 더 깔끔하고 명확하며 재사용하기 쉽다. 사용 패턴이 복잡해질수록 보통 명시적인 인자로 콘텍스트를 넘기는 방법(매개변수)이 ths 콘텍스트를 사용하는 것보다 코드가 더 지저분해진다.
- 여러 함수가 적절한 콘텍스트 객체를 자동 참조하는 구조가 편리하다.

```jsx
function identify() {
  return this.name.toUpperCase();
}

function speak() {
  const greeting = `Hello, I'm ${identify.call(this)}`;
  console.log(greeting);
}

const me = {
  name: "Marco",
};

const you = {
  name: "Reader",
};

identify.call(me);
identify.call(you);
speak.call(me);
speak.call(you);
```

## 1.2 헷갈리는 것들

### 1.2.1 자기 자신

- this가 함수 그 자체를 가리킨다는 것은 오해이다.

  - 자바스크립트에서 함수는 this로 자기 참조를 할 수가 없다.
  - 함수가 내부에서 자신을 참조할 때 일반적으로 this만으로는 부족하며 렉시컬 식별자(Lexical Identifier, 변수)를 거쳐 함수 객체를 참조한다.

    - 기명함수는 함수명 자체가 내부에서 자신을 가리키는 레퍼런스로 쓰인다.
    - 하지만 익명함수는 함수 자신을 참조할 방법이 마땅치 않다.

    ```jsx
    function foo(num) {
      console.log("foo: " + num);

      this.count++; // this.count에서 this는 함수 객체를 바라보는 것이 아니며, 전역을 바라본다.
    }

    foo.count = 0; // foo 함수 객체에 count 프로퍼티가 추가된다.

    for (let i = 0; i < 10; i++) {
      if (i > 5) {
        foo(i);
      }
    }

    console.log(foo.count); // 0
    ```

    ```jsx
    function foo(num) {
      console.log("foo: " + num);

      foo.count++; // this 없이 함수 객체 레퍼런스로 foo 식별자를 대신 사용할 수 있다.
    }

    foo.count = 0;

    for (let i = 0; i < 10; i++) {
      if (i > 5) {
        foo(i);
      }
    }

    console.log(foo.count); // 4
    ```

    ```jsx
    function foo(num) {
      console.log("foo: " + num);

      this.count++; // this를 사용하면서
    }

    foo.count = 0;

    for (let i = 0; i < 10; i++) {
      if (i > 5) {
        foo.call(foo, i); // foo 함수 내부에서 this가 foo함수 객체를 직접 가리키도록 강제한다.
      }
    }

    console.log(foo.count); // 4
    ```

### 1.2.2 자신의 스코프

-
- this가 바로 함수의 스코프를 가리킨다는 말도 오해다.
  - 분명한 것은 `this`는 어떤 식으로도 `함수의 렉시컬 스코프를 참조하지 않는다`는 사실이다.
    - 내부적으로 `스코프`는 별개의 식별자가 달린 프로퍼티로 구성된 `객체`의 일종이나 `스코프 '객체'`는 자바스크립트 구현체인 '엔진'의 `내부 부품`이기 때문에 `일반 자바스크립트 코드로는 접근하지 못한다`.
  - 렉시컬 스코프 안에 있는 뭔가를 this 레퍼런스로 참조할 수 없다.

## 1.3 this는 무엇인가?

- this는 작성 시점이 아닌 `런타임 시점(호출)` 에 `바인딩` 되며, `함수 호출 당시 상황`에 따라 `콘텍스트`가 결정된다.
  - 즉, 함수 선언 위치와 상관없이 this 바인딩은 오로지 어떻게 함수를 호출했느냐에 따라 정해진다.
- 어떤 함수를 호출하면 `활성화 레코드`(=실행 콘텍스트) 가 만들어진다.
  - 여기엔 함수가 호출된 근원(콜스택)과 호출 방법, 전달된 인자 등의 정보가 담겨 있다.
    - this 레퍼런스는 그 중 하나로, 함수가 실행되는 동안 이용할 수 있다.

## 1.4. 정리하기

- this는 함수 자신을 가리키지 않는다.
- this는 함수의 렉시컬 스코프를 가리키는 레퍼런스가 아니다.
- this는 실제로 `함수 호출 시점`에 바인딩되며, 무엇을 가리킬지는 전적으로 `함수를 호출한 코드`에 달렸다.
