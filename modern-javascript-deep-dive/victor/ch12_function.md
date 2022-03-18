# 모던 자바스크립트 Deep Dive - Ch12 함수

## 함수의 정의 
- 자신의 외부 코드가 호출할 수 있는 하위 프로그램(출처: [MDN web docs - function](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Functions))
- 함수 본문에는 문(statement)가 있다.
- 값을 전달받으면 일련의 명령문이 실행되고 값을 반환한다.

## ❗️ 이건 기억하자
### 함수는 객체다
- MDN docs에 모든 함수는 Function 객체라고 명시되어 있다.
- 함수도 값이다.
    - 단, 일반 객체와는 차이점이 있다.
    - 이에 대한 자세한 내용은 `18장 - 함수와 일급 객체`에 나와있다.

### 함수를 정의하는 방법은 4가지나 존재한다 😮
- 함수 선언문
- 함수 표현식
- 화살표 함수
- Function 생성자 함수

각 방법의 특징은 아래와 같다.

1. 함수 선언문
    - 예시

    ```javascript
    function testFunc() {
        console.log('this is test!');
    }
    ```
    
    - 함수 선언문 방식을 이용한다면 함수의 이름을 생략할 수 없다.(익명 함수는 이용 불가)
        - 함수 선언문 방식으로 함수 선언 시 이름을 생략하면 SyntaxError가 발생한다.
    
    ```javascript
    // Uncaught SyntaxError: Function statements require a function name
    function () {
        console.log('this is test!');
    }
    ```

    - 함수 선언문으로 선언한 함수는 `함수 호이스팅`이 발생한다.
        - 코드 평가 단계에서 함수 선언문은 실행이 되고 함수 객체를 생성한다.
        - 추가로 자바스크립트 엔진은 함수 이름과 같은 이름의 식별자를 생성하고 해당 식별자에 방금 생성한 함수 객체를 할당한다.
        - 따라서 코드가 실행되는 시점(런타임)에는 이미 함수 객체가 생성되어 있으며, 함수 이름과 같은 이름의 식별자에 할당까지 끝났기 때문에 함수 선언문의 위치와 관계없이 식별자를 통해 함수에 접근하고 실행시킬 수 있다.

    ```javascript
    console.log(testFunc); // f testFunc(){ return 100; }
    console.log(testFunc()); // 100

    function testFunc() {
        return 100;
    }
    ```

<br>

2. 함수 표현식
    - 예시
    ```javascript
    var test = function testFunc() {
        console.log('this is test!');
    }
    ```

    - 함수 표현식 방식을 이용한다면 함수의 이름을 생략할 수 있다.(익명 함수 이용 가능)
        - 함수 표현식으로 생성하는 함수는 일반적으로 함수 이름을 생략한다.
    
    ```javascript
    var test = function () {
        return 100;
    }

    console.log(test()); // 100
    ```

    - function 리터럴로 기명 함수를 생성할 때, 함수 선언문 방식이냐 함수 표현식 방식이냐의 판단은 문맥에 따라 이루어진다.
        - 만약 function 리터럴이 변수에 할당되거나 피연산자로 사용될 경우에는 함수 표현식 방식으로 판단된다.

    - 함수 표현식으로 선언한 함수는 `변수 호이스팅`이 발생한다.
        - 코드 평가 단계에서 변수가 선언되고 값이 초기화된다.
        - 코드가 실행되는 시점(런타임)에는 함수 표현식의 function 리터럴이 평가되어 함수 객체가 생성되고 변수에 할당이 된다.
        - 이러한 특성 때문에 함수 선언문보다 함수 표현식이 권장된다.

    ```javascript
    console.log(test); // undefined
    console.log(test()); // Uncaught TypeError: test is not a function

    var test = function () {
        return 100;
    }
    ```

3. 화살표 함수
    - 예시
    ```javascript
    var test = () => {
        return 100;
    }

    console.log(test()); // 100
    ```
    - ES6에서 도입된 함수 선언 방법이다.
    - 화살표 함수는 항상 익명 함수로 정의한다.
    - MDN docs에 의하면 this 값을 어휘적으로 바인딩한다고 한다.(출처 - [MDN web docs - function](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Functions#화살표_함수_표현식_))
    - 화살표 함수에 대한 자세한 내용은 `26.3절 화살표 함수`에 또는 MDN의 [해당 문서](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Functions/Arrow_functions)에 나와 있다.    

4. Function 생성자 함수
    - 예시
    ```javascript
    // 브라우저에 해당 코드를 실행하면 에러가 발생한다.
    var test = new Function('a', 'b', 'return a * b;');

    console.log(test(10, 20)); // 200
    ```

    - [MDN docs](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Functions#function_생성자)에 의하면 Function 생성자 함수로 함수를 생성하는 것은 권장되지 않는다.
<br>


### 함수 이름은 함수 내부에서만 참조할 수 있다.
- 이런 특성은 함수 표현식의 예제로 확인 가능하다.
```javascript
var test = function testFunc() {
    console.log(testFunc); // f testFunc() { console.log(testFunc); }
}

test();
console.log(testFunc); // Uncaught ReferenceError: testFunc is not defined
```

- 추가로, 함수 내부에서 함수 이름을 참조할 수 있는 특성 덕분에 함수 이름으로 `재귀 호출`이 가능하다.

<br>

### 즉시 실행 함수(IIFE, Immediately Invoked Function Expression)
- 정의되자마자 즉시 실행되는 함수이다.
- 예시
```javascript
var result = (function() {
    var testNum = 100;
    return testNum;
}());

console.log(result); // 100
console.log(testNum); // Uncaught ReferenceError: testNum is not defined
```

- 활용
```javascript
var increaser = (function() {
    var count = 0
    return function () {
        return ++count
    }
}());

console.log(increaser()); // 1
console.log(increaser()); // 2
console.log(increaser()); // 3

// 즉시 실행 함수 내부에서 선언한 count 변수는 외부에서 직접 접근이 불가능하다.
console.log(count) // Uncaught ReferenceError: count is not defined
```

<br>

### 중첩 함수
- 예시
```javascript
// 외부 함수
function outerFunc() {
    var x = 1;

    // 내부 함수 또는 중첩 함수, 헬퍼 함수
    function innerFunc() {
        var y = 100;

        console.log(x+y);
    }

    innerFunc();
}

outerFunc();
```

<br>

### 🤙 콜백 함수와 고차 함수
- [콜백 함수(Callback Function)](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function)
    - 함수의 매개 변수를 통해 다른 함수의 내부로 전달되는 함수

- 고차 함수(Higher-Order Function, HOF)
    - 매개 변수를 통해 함수의 외부에서 콜백 함수를 전달받은 함수

### 👼순수함수와 👿비순수 함수
- 순수 함수(Pure Function)
    - 외부 상태에 의존하지 않는 함수
    - 외부 상태를 변화시키지 않는다.
    - 동일한 인수가 전달되면 언제나 동일한 결괏값이 반환된다.

- 비순수 함수(Impure Function)
    - 외부 상태에 의존하는 함수
    - 외부 상태를 변경하는 함수
    - 함수 내부에서 직접 외부 상태를 참조하지 않아도 매개 변수를 통해 객체를 전달받으면 이 또한 비순수 함수이다.

❗️ 부수 효과(side effect)는 함수 내부에 외부에 있는 상태를 변경시키는 행위
