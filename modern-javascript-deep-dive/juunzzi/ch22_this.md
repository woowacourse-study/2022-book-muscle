# this (p342 ~ p358)

## 1. 객체의 구조는?

---

객체란 객체 자신의 `state` 를 나타내는 `property`와 동작을 나타내는 `method`를 하나의 논리적인 단위로 묶은 복합적인 자료구조에요!

둘을 혼동하면, 좋은 의사소통이 되지 못할 것 같네요..!
<br></br>

## 2. this는 왜 필요할까요?

---

동작을 나타내는 메소드에서 객체 자신의 상태인 프로퍼티의 값을 변경하려면, 자기 자신을 어떻게 참조할 수 있을까요? 이 질문에서 `this`가 존재하는 이유를 알 수 있어요.

> - **객체 내부에서 자신의 프로퍼티 혹은 메소드를 참조하기 위해 필요합니다**

> - **생성자 함수가 정의되는 시점에는 아직 인스턴스를 생성하기 이전이다. 그렇기 때문에 자신이 생성할 인스턴스를 가리키는 식별자를 알 수없다. 따라서 자신이 생성할 인스턴스를 가리키는 어떠한 식별자가 필요한데 이것이 바로 `this` 이다.**

<br></br>

## 3. 그래서 this를 뭐라고 부르면 좋을까요

---

`this`는 자신이 속한 객체 혹은 자신이 생성할 인스턴스를 가리키는 `자기 참조 변수`에요. 이를 통해 자신이 속한 객체 혹은 생성할 인스턴스의 프로퍼티나 메소드를 참조할 수 있어요.

<br></br>

## 4. this 값을 바인딩

---

함수 호출 방식에 의해 동적으로 결정됩니다.

> 바인딩이란 식별자와 값을 연결하는 과정을 의미합니다.

### 객체 내부에서의 this 바인딩

```js
// this는 getDiameter를 호출하는 객체를 가리키게 되요. (circle)
const circle = {
  rad: 5,
  getDiameter() {
    return 2 * this.rad;
  },
};

console.log(circle.getDiameter()); // 10;
```

### 생성자 함수 내부에서의 this 바인딩

```js
// this는 생성자 함수가 만들 인스턴스를 가리키게 되요. (circle)
function Circle(rad) {
  this.rad = rad;
}

// 프로토타입의 메소드로 추가하여, 만들어질 객체도 상속받도록 구현했어요.
Circle.prototype.getDiameter = function () {
  return 2 * this.rad;
};

const circle = new Circle(5);

console.log(circle.getDiameter()); // 10
```

### 일반 함수 내부에서의 this 바인딩

`this`는 생성자 함수 내부와 객체 내부에서만 그 의미가 있습니다. 따라서 일반 함수의 경우에는 `window` 전역객체가 바인딩돼요.

```js
function square(number) {
  console.log(this); // window

  return number * number;
}

square(2);
```

<br></br>

## 5. 렉시컬 스코프의 결정 시기 vs this 바인딩의 결정 시기

---

렉시컬 스코프의 경우 **함수의 정의가 평가되어 함수 객체가 생성되는 시점에 결정되어요.**

하지만 this의 경우 함수 호출 방식에 따라 그 값이 다르기 때문에 **함수가 호출 될 때 결정된답니다.**

<br></br>

## 6. 함수가 호출될 때 결정된다고?

함수를 호출하는 방식은 다음 4가지입니다.

- 일반 함수로 호출

- 메서드 호출

- 생성자 함수로 호출

- apply call bind 메서드에 의한 간접 호출

이 4가지 방식에 따라 `this`값이 결정됩니다. 차근차근 알아볼까요?

### 😳 일반 함수로 호출

`일반함수로 호출`은 다음과 같다.

```jsx
function abc() {}

abc(); // 일반함수로 호출되는 경우
```

**기본적으로 `this`에는 전역 객체가 바인딩된다.**

어찌보면 당연한게 `this`는 객체의 프로퍼티나 메소드를 참조하기 위한 자기 참조 변수이므로 객체를 생성하지 않는 **일반 함수**에서 `this`는 의미가 없다.

하지만 일반함수로 호출 될때의 `this` 바인딩이 문제가 될 때가 존재한다. 다음의 코드를 보자

```jsx
const obj = {
  method() {
    console.log(this); // obj
    setTimeout(function () {
      console.log(this); // window
    }, 1000);
  },
};
```

위 처럼 메소드 내부에서의 `this`와 콜백함수의 `this` 값이 달라져 버리는 이상한 상황이 생길 수 있다.(일반 함수로 호출되는 경우 무조건 `this`가 `window || undefined` 이므로)

이러한 불일치를 막기위해 다음과 같은 방법을 사용할 수 있다. (`this` 일치 시키는 방법)

1. 메소드 내부의 지역변수에 담아둔다.

```js
const obj = {
  method() {
    const that = this; // obj
    setTimeout(function () {
      console.log(that); // obj
    }, 1000);
  },
};
```

2. apply, call, bind 메소드를 사용한다.

```js
const obj = {
  method() {
    setTimeout(
      function () {
        console.log(this); // obj
      }.bind(this),
      1000
    );
  },
};
```

> 화살표 함수에서의 `this`는 무조건 상위 스코프의 this를 따른다. 아래 코드에서 `화살표 함수`의 상위 스코프는 `method 함수`이다.

```jsx
const obj = {
  method() {
    setTimeout(() => {
      console.log(this); // obj
    }, 1000);
  },
};
```

### 메소드 호출

메소드를 호출할 때 메서드 이름 앞에 기술한 객체가 바인딩된다.

```jsx
const person = {
  name: "juunzzi",
  getName() {
    return this.name;
  },
};

console.log(person.getName());
```

이 때 중요한 것은 `getName` 프로퍼티가 가리키는 함수 객체는 `person`에 포함된 것이 아니라, 독립적으로 존재하는 별도의 객체라는 점이다.

그렇기 때문에, 다른 객체에 할당하는 것으로 다른 객체의 메서드가 될 수 도 있고, 일반 변수에 할당하여 일반 함수로 호출될 수도 있다.

```js
const person = {
  name: "juunzzi",
  getName() {
    return this.name;
  },
};

const anotherPerson = {
  name: "lokba",
};

// 1.getName이 가리키는 함수 객체를 another.getName에 할당한다.
anotherPerson.getName = person.getName;

// 2.getName 함수 객체를 호출하는 것은 anotherPerson 객체이다. 따라서 lokba가 출력
console.log(anotherPerson.getName()); // lokba

/*------*/

// 1.일반 변수에 담음
const normalFunction = person.getName;

// 2.일반함수로 호출되므로 this는 window
console.log(normalFunction()); // window.name이 출력된다.
```

### 생성자 함수 호출

우선 다음을 머리속에서 잘 구분해두자

```jsx
const func = function () {};

new func(); // 생성자 함수로 호출하는 경우

func(); // 일반 함수로 호출하는 경우
```

미래에 생성할 인스턴스를 가리킨다.

```jsx
function Circle(rad) {
  this.rad = rad;
  this.getThis = function () {
    return this;
  };
}

const circle1 = new Circle(5);

console.log(circle1.getThis()); // circle

const circle2 = Circle();

console.log(circle2.getThis()); // can't read property -> circle2가 undefined이다. (함수가 반환하는 값이 없으므로)
```

### apply, call, bind로 호출

**`apply,call` 은 새로운 this 값과 함께 함수를 호출하고, `bind`는 새로운 this값이 바인딩된 함수를 반환한다.**

# 정리

1. 일반 함수로 호출하면 전역 객체가 바인딩된다.
2. 화살표 함수로 호출하면 상위 스코프의 this값이 바인딩된다.
3. 생성자 함수로 호출하면 미래에 생성할 인스턴스가 바인딩된다.
4. apply call bind로 간접호출 하게되면, 본인이 원하는 값을 this에 바인딩 할 수 있다.
