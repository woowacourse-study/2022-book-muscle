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
    - [styled-components](https://styled-components.com)는 태그드 템플릿을 활용한다.
        - 즉, styled-components를 사용한 경험이 있다면, 태그드 템플릿을 자신도 모르게 사용한 것이다.

### 불리언 타입
- 불리언 타입의 값은 `true`와 `false` 뿐이다.

### undefined 타입
- undefined 타입의 값은 `undefined` 뿐이다.
- 자바스크립트 엔진이 변수를 초기화할 때 사용하는 값이다.
    - var 키워드로 선언한 변수는 코드 평가 단계에서 `변수의 선언`과 `변수 초기화`가 동시에 일어나고, `변수 초기화` 단계에서 확보된 메모리 공간를 undefined로 초기화해서 변수에 할당한다.
- 의도적으로 undefined 값을 변수에 할당하는 것은 좋은 습관이 아니다.
    

### null 타입
- null 타입의 값은 `null`이 유일하다.
- 변수에 값이 없다는 것을 의도적으로 명시할 때 사용한다.
- 또는 함수가 유효한 값을 반환할 수 없는 경우 명시적으로 null을 반환한다.
    - ex) document.querySelector() 메서드로 조건에 맞는 요소를 검색하지 못하는 경우, 해당 메서드는 null을 반환한다.

### [심벌 타입](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
- 변경 불가능한 원시 타입의 값이다.
- 심벌 값은 다르값과 중복되지 않는 유일무이한 값이다.
- 심벌 값은 Symbol 함수를 호출해서 생성한다.
- 예제

```javascript
    const testSymbol1 = Symbol(100);
    const testSymbol2 = Symbol(100);

    console.log(testSymbol1 === 100); // false
    console.log(testSymbol1 === testSymbol2); // false 
```

### 객체 타입
- 자바스크립트는 객체 기반의 언어이다.
    - 자바스크립트를 이루고 있는 거의 모든 것이 객체이다.

### 데이터 타입의 필요성
1. 값을 저장할 떄 확보해야 하는 메모리 공간의 크기를 결정하기 위해서
2. 값을 참조할 때 한 번에 읽어 들여야 하는 메모리 공간의 크기를 결정하기 위해서
3. 메모리에서 읽어 들인 2진수를 해석하는 방법을 결정하기 위해서
    - 값은 메모리에 2진수 형태로 저장된다.

> 심볼 테이블이라는 자료 구조를 통해 식별자를 키로 바인딩된 값의 메모리 주소, 데이터 타입, 스코프 등을 관린하다고 한다.
어떤 식으로 동작하는지 조금 더 깊게 알고싶은데 자료를 못찾겠네 😇

### 동적 타이핑
- 자바스크립트는 동적 타입 언어이다.
    - var, let, const 등의 키워드로 변수를 선언할 뿐, 타입을 선언하지는 않는다.
- 자바스크립트의 변수 선언 시 타입을 가지지 않지만, 할당된 값에 의해 변수의 타입이 동적으로 할당된다.

