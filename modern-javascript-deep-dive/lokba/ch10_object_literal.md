### Chapter 10. 객체 리터럴

---

#### 객체란

객체는 `프로퍼티`와 `메서드`로 구성된 집합체다.

```javascript
let racingCar = {
  //프로퍼티
  distance: 5,

  //메서드
  move: function () {
    this.distance++;
  },
};
```

- 프로퍼티 : 객체의 상태를 나타내는 값(**data**)
- 메서드 : 프로퍼티(상태 데이터)를 참조하고 조작할 수 있는 동작(**behavior**)

<br>

#### 객체 생성 방법

자바스크립트는 프로토타입 기반 객체지향 언어이기에, 다양한 객체 생성 방법을 지원한다.

- 객체 리터럴 - 가장 일반적이고 간단한 방법
- Object 생성자 함수
- 생성자 함수
- Object.create 메서드
- 클래스

<br>

#### Quiz 1.

```javascript
let person = {
  firstName : 'lokba',
  last-name : 'kim',
};
```

<br>

> **위 코드를 실행하면, 자바스크립트 엔진이 정상적으로 처리할까?**
> 답은 ❌다
> 프로퍼티의 키가 식별자 네이밍 규칙을 따르지 않는 경우에는 반드시 따옴표를 사용해야 한다.
> 위 코드에서는, 자바스크립트 엔진이 -를 연산자로 인식하여 SyntaxError가 발생한다.

<br>

#### Quiz 2.

```javascript
let crew = {
  nickname: "victor",
};

//1번
console.log(crew["nickname"]);

//2번
console.log(crew[nickname]);

//3번
console.log(crew["age"]);
```

<br>

**위 코드를 실행하면, 1 ~ 3번의 로그는 뭐가 찍힐까?**

```javascript
//1번
console.log(crew["nickname"]); //victor

//2번
console.log(crew[nickname]); // ReferenceError : nickname is not defined

//3번
console.log(crew["age"]); // undefined
```

-> 로그의 결과를 보고, 왜 그런지 한번 생각해보자! 🎯

<br>

#### ES6에 추가된 객체 리터럴 확장 기능

```javascript
let x = 1;
let y = 1;

//확장 기능 적용 이전 코드
let obj = {
  x: x,
  y: y,
};

//확장 기능 적용 후 코드
let obj = { x, y };
```

ES6에서는 프로퍼티 값으로 변수를 사용하는 경우, 변수 이름과 프로퍼티 키가 동일한 이름일 때 프로퍼티 키를 생략할 수 있다. 이것을 `property shorthand`라 한다.
