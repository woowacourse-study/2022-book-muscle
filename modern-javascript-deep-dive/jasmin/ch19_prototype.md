# 프로토타입

자바스크립트는 클래스기반 객체지향 프로그래밍언어보다 더 강력한 객체 지향 프로그래밍능력을 가지고 있는 프로토타입 기반의 객체지향 프로그래밍언어이다.

자바스크립트는 객체 기반의 프로그래밍언어이며 **자바스크립트를 이루고 있는 거의 모든것이 객체**이다.

## 객체 지향 프로그래밍

객체 지향 프로그래밍은 프로그램을 명령어 또는 함수의 목록으로 보는 전통적인 명령형 프로그래밍의 절차지향적 관점에서 벗어나 여러개의 독립적 단위, 즉 **객체**의 집합으로 프로그램을 표현하려는 프로그래밍 패러다임을 말한다.

사람에게는 다양한 속성이 있지만 우리의 프로그램에서는 `이름`, `주소`라는 속성에만 관심이 있다고 가정하면 이러한 필요한 속성한 간추려 표현하는것을 `추상화`라고 한다.

**속성을 통하여 여러개의 값을 하나의 단위로 구성한 복합적인 자료구조를 객체**라고 하며 이러한 독립적인 객체의 집합으로 프로그램을 표현하려는 프로그래밍 패러다임이다.

객체지향 프로그래밍은 객체의 **상태**를 나타내는 데이터와 상태 데이터를 조작할수 있는 **동작**을 하나의 논리적인 단위로 묶어 생각한다.

## 상속과 프로토타입

상속은 객체지향 프로그래밍의 핵심 개념으로, 어떤 객체의 프로퍼티또는 메서드를 다른 객체가 상속받아 그대로 사용할수 있는것을 말한다.

자바스크립트는 프로토타입을 기반으로 상속을 구현하여 불필요한 중복을 제거한다.

```jsx
// 생성자 함수
function Circle(radius) {
  this.radius = radius;
  this.getArea = function () {
    // Math.PI는 원주율을 나타내는 상수다.
    return Math.PI * this.radius ** 2;
  };
}

// 반지름이 1인 인스턴스 생성
const circle1 = new Circle(1);
// 반지름이 2인 인스턴스 생성
const circle2 = new Circle(2);

// Circle 생성자 함수는 인스턴스를 생성할 때마다 동일한 동작을 하는
// getArea 메서드를 중복 생성하고 모든 인스턴스가 중복 소유한다.
// getArea 메서드는 하나만 생성하여 모든 인스턴스가 공유해서 사용하는 것이 바람직하다.
console.log(circle1.getArea === circle2.getArea); // false

console.log(circle1.getArea()); // 3.141592653589793
console.log(circle2.getArea()); // 12.566370614359172
```

여기서 `radius`값은 인스턴스마다 달라야 하지만 `getArea()` 함수는 동일한 내용의 메서드를 사용하는것은 모든 인스턴스가 공유해서 사용하는것이 바람직하다.

그런데 Circle생성자 함수는 인스턴스를 생성할때마다 `getArea`메서드를 중복 생성하고 모든 인스턴스가 중복 소유한다.

이제 상속을 통해 중복을 제거해보자. **자바스크립트는 프로토타입을 기반으로 상속을 구현한다.**

```jsx
// 생성자 함수
function Circle(radius) {
  this.radius = radius;
}

// Circle 생성자 함수가 생성한 모든 인스턴스가 getArea 메서드를
// 공유해서 사용할 수 있도록 프로토타입에 추가한다.
// 프로토타입은 Circle 생성자 함수의 prototype 프로퍼티에 바인딩되어 있다.
Circle.prototype.getArea = function () {
  return Math.PI * this.radius ** 2;
};

// 인스턴스 생성
const circle1 = new Circle(1);
const circle2 = new Circle(2);

// Circle 생성자 함수가 생성한 모든 인스턴스는 부모 객체의 역할을 하는
// 프로토타입 Circle.prototype으로부터 getArea 메서드를 상속받는다.
// 즉, Circle 생성자 함수가 생성하는 모든 인스턴스는 하나의 getArea 메서드를 공유한다.
console.log(circle1.getArea === circle2.getArea); // true

console.log(circle1.getArea()); // 3.141592653589793
console.log(circle2.getArea()); // 12.566370614359172
```

상속은 이렇게 재사용이란 관점에서 매우 유용하다.

생성자 함수가 생성할 모든 인스턴스가 공통적으로 사용할 프로퍼티나 메서드를 프로토타입에 미리 구현해두면 생성자 함수가 생성할 모든 인스턴스는 별도의 구현없이 상위 객체인 프로토타입의 자산을 공유하여 사용할수 있다.

## 프로토타입 객체

프로토타입 객체란 객체지향 프로그래밍의 근간을 이루는 객체간 상속을 구현하기 위해 사용된다.

프로토타입은 어떤 객체의 상위객체의 역할을 하는 객체로서 다른 객체에 공유 프로퍼티를 제공한다.

프로토타입을 상속받은 하위객체는 상위 객체의 프로퍼티를 자신의 프로퍼티처럼 자유롭게 사용가능하다.

모든객체는 `[[Prototype]]`이라는 내부 슬롯을 가지며, 이 내부슬롯의 값은 프로토타입의 참조다.

`[[Prototype]]`에 저장되는 프로토타입은 객체 생성 방식에 의해 결정된다. 객체가 생성될때 `생성방식`에 따라 프로토타입이 결정되고 `[[Prototype]]`에 저장된다.

예를들어, **객체 리터럴에 의해 생성된 객체의 프로토타입**은 Object.prototype이고 **생성자 함수에 의해 생성된 프로토타입**은 생성자함수의 prototype 프로퍼티에 바인딩 되어있는 객체다.
(이에대해서는 19.6에서 알아보자!)

모든 객체는 하나의 프로토타입을 갖는다. 그리고 모든 프로토타입은 생성자 함수와 연결되어있다.

`[[Prototype]]` 내부슬롯에는 직접 접근할수는 없지만 **proto**를 이용하여 자신의 프로토타입에 간접적으로 접근이 가능하다.

## `__proto__` 접근자 프로퍼티

모든객체는 **proto**접근자 프로퍼티를 통해 자신의 프로토타입, 즉 [[prototype]] 내부 슬롯에 간접적으로 접근 가능하다.

## `__proto__`는 접근자 프로퍼티이다!

자바스크립트는 내부슬롯과 내부 메서드에 직접적으로 접근하거나 호출할수 있는 방법을 제공하지 않는다.

하지만 일부내부슬롯과 내부 메서드에 한하여 간접적으로 접근할수 있는 수단을 제공하기는 한다.

`[[Prototype]]` 내부슬롯에는 직접 접근할수는 없지만 **proto**를 이용하여 자신의 프로토타입에 간접적으로 접근이 가능하다.

`__proto__` 는 getter이자 setter로 활용이 되어 부르거나 설정할수가 있다.

## `__proto__`는 상속을 통해 결정된다.

`__proto__` 접근자 프로퍼티는 객체가 직접 소유하는 프로퍼티가 아니라 `Object.prototype`의 프로퍼티이다.

모든 객체는 상속을 통하여 `Object.prototype.__proto__` 접근자 프로퍼티를 사용할수있다.

## 왜 `__proto__`를 이용하여 프로토타입에 접근을 할까?

`[[Prototype]]` 내부슬롯의 값, 즉 프로토타입에 접근하기 위해 접근자 프로퍼티를 사용하는 이유는 **상호참조**에 의해 프로토타입 체인이 생성되는것을 방지하기 위해서다.

```jsx
const parent = {};
const child = {};

// child의 프로토타입을 parent로 설정
child.__proto__ = parent;
// parent의 프로토타입을 child로 설정
parent.__proto__ = child; // TypeError: Cyclic __proto__ value
```

이렇게 서로를 참조하는코드가 정상적으로 처리되면 서로가 자신의 프로토타입이 되는 비정상적인 프로토타입 체인이 만들어지기에 에러를 발생시킨다.

<img src="./asset/prototype_chain.png">

프로토타입 체인은 단방향 연결리스트로 구현되어야한다. 즉, 프로퍼티 검색 방향이 한쪽 방향으로만 흘러가야 한다.

그림과 같은 서로가 자신의 프로토타입을 할 경우 프로토타입 체인 종점이 존재하지않기 때문에 프로토타입 체인에서 프로퍼티를 검색할시 무한루프에 빠진다.

그래서 아무런 체크없이 프로토타입을 교체할수 없도록 `__proto__` 접근자 프로퍼티를 통해 프로토타입에 접근하고 교체하도록 구현되어있다!

## `__proto__` 접근자 프로퍼티를 코드내에서 직접 사용하는것은 권장되지 않는다.

모든객체가 `__proto__` 프로퍼티를 사용할수 있는것이 아니다.

직접 상속을 통해 다음과 같이 `Object.prototype`을 상속받지 않는 객체를 생성할수도 있기 때문이다.

```jsx
// obj는 프로토타입 체인의 종점이다. 따라서 Object.__proto__를 상속받을 수 없다.
const obj = Object.create(null);

// obj는 Object.__proto__를 상속받을 수 없다.
console.log(obj.__proto__); // undefined

// 따라서 Object.getPrototypeOf 메서드를 사용하는 편이 좋다.
console.log(Object.getPrototypeOf(obj)); // null
```

그래서 `__proto__` 대신에 `Object.getPrototypeOf`로 접근을 하고 교체가 필요한경우 `Object.setPrototypeOf`를 이용할것을 권장한다.

```jsx
const obj = {};
const parent = { x: 1 };

// obj 객체의 프로토타입을 취득
Object.getPrototypeOf(obj); // obj.__proto__;
// obj 객체의 프로토타입을 교체
Object.setPrototypeOf(obj, parent); // obj.__proto__ = parent;

console.log(obj.x); // 1
```

## 함수 객체의 prototype 프로퍼티

**함수 객체만이 소유하는 prototype프로퍼티는 생성자 함수가 생성할 인스턴스의 프로토타입을 가리킨다.**

```jsx
// 함수 객체는 prototype 프로퍼티를 소유한다.
(function () {}.hasOwnProperty("prototype")); // -> true

// 일반 객체는 prototype 프로퍼티를 소유하지 않는다.
({}.hasOwnProperty("prototype")); // -> false
```

prototype 프로퍼티는 생성자 함수가 생성할 객체(인스턴스)의 프로토타입을 가르킨다!

따라서 생성자함수를 생성할수없는 non-constructor인 `화살표함수`와 es6 `메서드 축약표현으로 정의한 메서드`는 prototype프로퍼티를 소유하지도 생성하지도 않는다.

모든 객체가 가지고있는 `__proto__`접근자 프로퍼티와 함수 객체만이 가지고 있는 prototype 프로퍼티는 결국 동일한 프로토타입을 가르킨다.

| 구분                        | 소유        | 값                | 사용주체    | 사용 목적                                                                    |
| --------------------------- | ----------- | ----------------- | ----------- | ---------------------------------------------------------------------------- |
| `__proto__` 접근자 프로퍼티 | 모든 객체   | 프로토타입의 참조 | 모든객체    | 객체가 자신의 프로토타입에 접근 혹은 교체하기위해 사용                       |
| prototype 프로퍼티          | constructor | 프로토타입의 참조 | 생성자 함수 | 생성자 함수가 자신이 생성할 객체(인스턴스)의 프로토타입을 할당하기 위해 사용 |

```jsx
// 생성자 함수
function Person(name) {
  this.name = name;
}

const me = new Person("Lee");

// 결국 Person.prototype과 me.__proto__는 결국 동일한 프로토타입을 가리킨다.
console.log(Person.prototype === me.__proto__); // true
```

<img src="./asset/function_prototype.png">

## 프로토타입의 constructor 프로퍼티와 생성자 함수

모든 프로토타입은 constructor 프로퍼티를 가진다. 이 constructor 프로퍼티는 prototype 프로퍼티로 자신을 참조하고 있는 생성자 함수를 가리킨다.

이 연결은 생성자 함수가 생성시, 즉 함수 객체 생성시에 이뤄진다.

```jsx
// 생성자 함수
function Person(name) {
  this.name = name;
}

const me = new Person("Lee");

// me 객체의 생성자 함수는 Person이다.
console.log(me.constructor === Person); // true
```

위의 예제에서 Person 생성자 함수는 me객체를 생성하였다. 이때 me 객체는 프로토타입의 constructor 프로퍼티를 통해 생성자 함수와 연결된다.

me객체에는 constructor 프로퍼티가 없지만 me 객체의 프로토타입인 Person.prototype에는 constructor 프로퍼티가 있다.

따라서 me 객체는 프로토타입인 Person.prototype의 constructor프로퍼티를 상속받아 사용가능하다!

<img src="./asset/스크린샷%202022-03-15%20오후%203.58.59.png">
