## 모던 자바스크립트 Deep Dive - Ch6 데이터 타입
### 데이터 타입
- 값의 종류
    - 자바스크립트의 모든 값은 데이터 타입을 갖는다.

- 자바스크립트(ES6)는 7개의 데이터 타입을 제공한다.
    - 7개의 데이터 타입은 크게 **원시 타입(primitive type)**와 **객체 타입(object type or reference type)**로 나뉜다.

```bash

# 데이터 타입
┌─원시 타입
│  ├─숫자 타입(number type): 정수와 실수 구분없이 하나의 숫자 타입만 존재
│  │
│  ├─문자열 타입(string type): 문자열
│  │
|  ├─불리언 타입(boolean type): 논리적인 참과 거짓에 관련된 변수
│  │
|  ├─undefined 타입: var로 선언한 변수에 암묵적으로 할당되는 값
│  │
|  ├─null 타입: 값이 없다는 사실을 의도적으로 명시할 때 사용하는 값
│  │
|  └─심벌 타입(symbol type): ES6에서 추가된 7번째 타입
|
│
└─객체 타입: 객체, 함수, 배열 등
```

<br>

### 숫자 타입
- javascript에서 정수와 실수 모두 동일한 숫자 타입을 가지고 있다.
    - 숫자 값을 저장할 때 64bit의 부동 소점 형식을 따르기 때문에 사실상 정수 역시 실수로 처리한다.

```javascript
    console.log(1 === 1.0) // true
    console.log(4 / 2) // 2
    console.log(3 / 2) // 1.5
```

> 4 / 2 표현식의 값이 2.0이 아닌 2인 이유는 무엇일까? 🤔 

- 특별한 숫자 값
```javascript
    var a = 'test';

    console.log(10 / 0); // Infinity
    console.log(10 / -0); // -Infinity
    console.log(1 * a); // NaN
```

- 자연 상수
```javascript
    console.log(1e2); // 100
    console.log(typeof 1e2) // number
```

<br>

### 문자열 타입
- 텍스트 데이터를 나타내는 데 사용한다.
- 작은따옴표('), 큰따옴표("), 백틱(`)으로 텍스트를 감싸서 데이터를 표현한다.
- 문자열 텍스트를 위의 문자들로 감싸지 않으면, 텍스트를 키워드 또는 식별자 같은 토큰으로 인식하게 된다.

```javascript
var name = victor // ReferenceError: victor is not defined
```

- 피연산자에 하나 이상의 문자열이 있을 때, `+` 연산자는 문자열 연결 연산자로 동작한다.

```javascript
    var name = 'victor';
    var age = 26;

    var introduction = 'My name is' + name + 'and i am ' + age + ' years old.';

    console.log(typeof introduction) // string
```

<br>

### [템플릿 리터럴](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Template_literals)
- ES6부터 도입된 새로운 문자열 표기법이다.
- 텍스트를 백틱(`)으로 감싸서 표현한다.
- 일반 문자열 생성 방식(' 또는 "를 사용하는 방식)과 다르 템플릿 리터럴의 특징은 다음과 같다.
    1. 멀티라인 문자열(multi-line string)
    2. 표현식 삽입(expression interpolation)
    3. 태그드 템플릿(tagged template)

- 멀티라인 문자열
```javascript
    var templateUsingTemplateLiteral = `
        <div>
            <p>이것은 템플릿 리터럴<p>
        </div>
    `

    // SyntaxError: Invalid or unexpected token
    var tempalteUsingNormalString = '
        <div>
            <p>이것은 템플릿 리터럴<p>
        </div>
    '
```

- 표현식 삽입
```javascript
    var fruit = 'apple';
    console.log(`this is ${fruit}`); // this is apple

    console.log(`100 - 5 = ${100 - 5}`); // 95
```

- 태그드 템플릿
    - 태그드 템플릿에 대한 설명과 예시는 [여기](https://mygumi.tistory.com/395) 자세히 나와있다.
    - [styled-components](https://styled-components.com)는 태그트 템플릿을 활용한다.
        - 즉, styled-components를 사용한 경험이 있다면, 태그트 템플릿을 자신도 모르게 사용한 것이다.
