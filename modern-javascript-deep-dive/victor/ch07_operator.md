## 모던 자바스크립트 Deep Dive - Ch7 연산자
### 연산자
- 하나 이상의 표현식에 연산을 수행해 하나의 값을 만든다.
- 연산자의 종류는 [여기](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Expressions_and_Operators#operators)에 정리되어 있다.

<br>

### 이번 챕터에서 인상 깊은 내용들
---
### 단순 산술 연산자 ++와 --
- 해당 연산자들은 부수 효과(side effect)가 있다.
- 전위 증가와 후위 증가로 나뉜다.

```javascript
    var value1 = 100;
    var value2;

    value2 = value1++;

    console.log(value1, value2); // 101 100

    value2 = ++value1;

    console.log(value1, value2); // 102 102

    value2 = ++value1++; // SyntaxError
    console.log(value1, value2)
```

<br>

### 연산자 +와 -
- + 연산자
    - 단항 연산자 일때 +
        - 아무런 효과가 없다.
        - 피연산자의 데이터 타입을 숫자형으로 변환하여 연산을 수행한다.
        - 주의할 점은 음수를 양수로 바꾸지 않는다는 것이다.
        - 부수 효과는 없다.
    - 그 외
        - 피연산자 중 하나 이상의 데이터 타입이 문자열 일때, 문자열 연결 연산자로 동작한다.
        - 그 외의 경우에는 덧셈으로 동작한다.

- - 연산자
    - 단항 연산자 일때 -
        - 양수를 음수로, 음수를 양수로 전환시켜주는 연산자
        - 피연산자의 데이터 타입을 숫자형으로 변환하여 연산을 수행한다.
        - 부수 효과는 없다.
    - 이항 연산자 일때
        - 뺄셈을 수행한다.

<br>

### 할당 연산자
- 좌항의 변수에 값을 할당한다.
    - 즉 부수 효과가 있다.
- 할당 연산자가 사용된 할당문은 표현식이다.
    - 할당문은 할당된 값으로 값이 평가된다.

<br>

### 동등 비교 연산자(==)와 일치 비교 연산자(===)
- 동등 비교 연산자는 좌항과 우항의 피연산자의 타입을 일치 시킨 후 같은 값인지 비교한다.
- 일치 비교 연산자는 좌항과 우항의 피연산자가 타입도 같고, 값도 같은 경우에만 true를 반환한다.

```javascript
    // 값이 isNaN인지 확인하고 싶다면 isNaN() 메서드 또는 Object.is() 메서드를 활용하라
    console.log(NaN === NaN) // false
```
### 삼항 조건 연산자
- 삼항 조건 연산자 표현식은 값으로 평가될 수 있는 표현식이다.
- 반먄, 비슷한 역할을 할 수 있는 `if ... else` 문은 표현식이 아닌 문이다.

### typeof 연산자
- 피연산자의 데이터 타입을 문자열로 반환한다.
- typeof 연산자가 반환하는 결과는 총 7가지가 있다.
    1. string
    2. number
    3. boolean
    4. undefined
    5. symbol
    6. object
    7. function
- typeof 연산자가 반환하는 문자열은 데이터 타입과 정확히 일치하지는 않는다.
    - null 값을 연산하면 'object'가 반환된다.
    - 이는 버그다.

```javascript
    var testNull = null;

    console.log(typeof testNull); // object
```

- 선언하지 않은 식별자에 typeof 연산자를 수행하면 undefined를 반환된다.(ReferenceError가 발생하지 않는다.)

<br>

