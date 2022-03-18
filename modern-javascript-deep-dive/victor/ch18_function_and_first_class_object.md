## 모던 자바스크립트 Depp Dive - Ch18 함수와 일급 객체

### 🥇 일급 객체의 조건
- 아래의 조건을 만족하는 객체를 일급 객체라고 한다.
    1. 무명의 리터럴로 생성할 수 있다. 즉, 런타임에 생성이 가능하다.
    2. 변수나 자료구조(객체, 배열 등)에 저장할 수 있다.
    3. 함수의 매개변수에 전달할 수 있다.
    4. 함수의 반환값으로 사용할 수 있다.

- 함수는 일급 객체이고 이는 객체처럼 사용할 수 있음을 의미한다.
    - 객체가 사용되는 곳에 함수도 사용할 수 있다.
    - 함수 객체와 일반 객체의 차이점은 호출 여부로 달라진다. 함수 객체는 호출할 수 있지만, 일반 객체는 호출할 수 없다.
- 위 조건 중 3번 4번에 의해서 자바스크립트에서 함수형 프로그래밍이 가능하다.

❗️ 함수형 프로그래밍에 대해서 알고 싶다면 [여기](https://jongminfire.dev/함수형-프로그래밍이란) 참고!! 하지만 공식 문서는 아니니 그냥 이런 거구나 정도로만 받아들이기~~

### 함수 객체의 프로퍼티
1. arguments 프로퍼티
- arguments 프로퍼티의 값은 arguments 객체이다.
- arguments 객체는 함수 호출 시 전달되는 인수에 대한 정보를 저장하고 있으며, 순회  가능한 유사 배열 객체이다.
    - arguments 객체에 대한 자세한 내용은 [여기서](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Functions/arguments) 확인 가능하다.
- 함수 내부에서 지역 변수처럼 사용된다.

- arguments 객체는 아래와 같이 `가변 인자 함수`를 구현할 때 활용할 수 있다.

```javascript
function mySum() {
    let result = 0;

    for(let i = 0; i < arguments.length; i++) {
        result += arguments[i];
    }

    return result;
}

console.log(mySum(1, 2, 3, 4, 5)); // 15
```
❗️ 주의할 점은 만약 실행 환경이 ES6와 호환이 된다면, arguments 객체를 이용하는 것보다 [Rest parameter(나머지 매개변수)](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Functions/rest_parameters)를 이용하는 것이 권장됩니다.

- Rest Parameter를 활용한 예시

```javascript
function mySumWithRestParameter(...rest) {
    return rest.reduce((acc, cur) => acc + cur, 0);
}

console.log(mySumWithRestParameter(1, 2, 3, 4, 5)); // 15
```

<br>

2. caller 프로퍼티
- caller 프로퍼티의 값은 자신을 호출한 함수를 가리킨다.

<br>

3. length 프로퍼티
- length 프로퍼티의 값은 함수를 정의할 떄 선언한 매개 변수의 개수이다.
    - arguments 객체의 length 값과 다를 수 있다

```javascript
function testFunc(a, b, c) {
    console.log(arguments.length) // 4;
    console.log(testFunc.length) // 3
}

testFunc(1, 2, 3, 4);
```

<br>

4. name 프로퍼티
- name 프로퍼티의 값은 함수의 이름이다.
- ES5와 ES6에서 다르게 동작한다.
    - ES5에서 익명함수의 경우 name 프로퍼티 값은 빈 문자열이다.
    - ES6에서 익명함수의 경우 name 프로퍼티 값은 함수 객체를 가리키는  식별자이다.

<br>

5. prototype 프로퍼티
- prototype 프로퍼티는 생성자 함수로 호출할 수 있는 함수 객체만이 소유하는 프로퍼티이다.
- prototype 프로퍼티는 함수가 객체를 생성하는 생성자 함수로 호출될 때 생성자 함수가 생성할 인스턴스의 프로토타입 객체를 가리킨다.

<br>

6. \_\_proto\_\_ 프로퍼티
- 접근자 프로퍼티이며, Object.prototype 객체의 프로퍼티를 상속받은 것을 알 수 있다.
    - 이와 관련된 자세한 내용은 `19장 프로토타입`에서 명시되어 있다.
