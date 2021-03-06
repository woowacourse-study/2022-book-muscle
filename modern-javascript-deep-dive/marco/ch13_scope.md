# 13장 스코프

- 스코프는 `유효범위`를 의미한다.
- 변수 선언 시 사용하는 키워드 var, let, const에 따라 변수의 스코프가 `모두 다르게 작동`한다.
- 함수 `매개변수의 스코프`는 `함수 몸체 내부`로 한정된다.
- 모든 식별자(변수 이름, 함수 이름, 클래스 이름 등)는 `자신이 선언된 위치에 의해` 다른 코드가 식별자 자신을 참조할 수 있는 유효 범위(스코프)가 결정된다.
- 즉, 스코프는 `식별자가 유효한 범위`를 말한다.
  - "코드가 어디서 실행되며 주변에 어떤 코드가 있는지"를 `렉시컬 환경`이라고 부른다. 즉, 코드의 문맥(context)는 렉시컬 환경으로 이루어진다. 이를 구현한 것이 `실행컨텍스트`이다. 모든 코드는 실행 컨텍스트에서 평가되고 실행된다.
- `스코프`란 자바스크립트 `엔진`이 `식별자를 검색할 때 사용하는 규칙`이라고 할 수도 있다.
  - 동일한 식별자 명을 가진 변수가 다른 스코프에 있을 때, 엔진이 어떤 변수를 참조해야 할 지를 결정할 때 스코프를 통해 결정하기 때문이다.
- 스코프 내에서는 같은 식별자 명으로 중복 선언할 수 없으나, 다른 스코프에서는 같은 이름의 식별자를 사용할 수 있다.
  - let, const 키워드로 선언한 변수는 같은 스코프 내에서 중복 선언을 허용하지 않는다.
  - 다만, var 키워드로 선언한 변수는 같은 스코프 내에서 중복 선언이 허용된다. 그런데 이는 변수값이 재할당되어 변경되는 부작용이 있기 때문에 주의해야 한다.

## 스코프의 종류

- 전역 스코프
  - 전역은 `코드의 가장 바깥 영역`을 의미한다.
  - 전역 변수
    - 전역에 변수를 선언하면 전역 스코프를 갖는 전역 변수가 된다.
    - 전역 변수는 어디서든지 참조할 수 있다.
- 지역 스코프
  - 지역은 `함수 몸체 내부`를 의미한다.
  - 지역 변수
    - 지역 변수는 자신의 지역 스코프와 하위 지역 스코프에서 유효하다.
- 변수는 자신이 선언된 위치에 의해 자신이 유효한 범위인 스코프가 결정된다.

## 스코프 체인

- 변수를 참조할 때 자바스크립트 엔진은 `스코프 체인`을 통해 변수를 참조하는 코드의 스코프에서 시작하여 `상위 스코프 방향으로` 이동하며 선언된 변수를 `검색`한다.

## 함수 레벨 스코프

- 지역 스코프는 `코드 블록(if, for, while, try/catch)`이 아닌 `함수`에 의해서만 생성된다.
  - 지역은 함수 몸체 내부를 의미하기 때문이다.
- `var` 키워드로 선언된 변수는 `함수 레벨 스코프`를 따른다. 이는 var로 선언된 변수는 오로지 `함수의 코드블록(함수 몸체)`만을 지역 스코프로 인정한다는 의미이다.
  - 만약 if 문이나 for문 내부에 var 키워드로 변수를 선언했다 하더라도, if 문 내부에 해당 변수가 지역 스코프에 생기지 않고 전역 변수가 된다(이미 전역에 동일한 식별자명의 변수가 있다면 그 전역변수의 값에 영향을 준다).

```jsx
var i = 10;

for (var i = 0; i < 5; i++) {
  // <- for문 내부의 var는 전역변수이고, 이미 선언된 전역변수 i를 중복 선언한다.
  console.log(i); // 0 1 2 3 4
}

console.log(i); // 5   <- 헉 변경됐다!
```

- 반면, `let, const` 키워드는 var와 달리 `블록 레벨 스코프`를 지원한다.
  - 따라서 위 예시 코드에서 for문 내부에 변수 i를 let 키워드로 선언하면 전역에 있던 `var i = 10` 에게 영향을 미치지 않는다.

```jsx
var i = 10;

for (let) i = 0; i < 5; i++) {
  console.log(i); // 0 1 2 3 4
}

console.log(i); // 10   전역변수 값 유지
```

### 렉시컬 스코프

- 자바스크립트는 렉시컬 스코프를 따른다.
  - 따라서 함수를 어디서 호출했는지가 아니라 `함수를 어디서 정의했는지에 따라` 그 함수의 상위 스코프가 결정된다.
  - 즉, `함수가 호출된 위치`는 상위 스코프 결정에 어떠한 영향을 주지 않는다.
  - 꼭 기억하자! 함수의 상위 스코프는 `언제나 자신이 정의된 스코프다`.(이미 정적으로 결정된 것이다)
- 렉시컬 스포크는 `클로저`와 깊은 관계가 있다!!!!! 클로저 딱 기다려~~

```jsx
var x = 1;

// 함수 정의 시, 상위 스코프가 정적으로 결정된다.
// bar() 함수는 자신이 정의된 전역 스코프를 상위 스코프로 사용한다.
function foo() {
  var x = 10;
  bar(); // 함수 호출은 상위 스코프와 상관없다.
}

function bar() {
  console.log(x);
}

foo(); // 1
bar(); // 1
```
