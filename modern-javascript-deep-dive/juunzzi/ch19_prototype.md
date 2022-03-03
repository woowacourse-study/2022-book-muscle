# (P 259 ~ 280)

## 0. 객체 지향 프로그래밍이란 ?

명령형 프로그래밍의 절차지향적 관점에서 벗어나 여러 객체의 집합으로 프로그램을 표현하는 프로그래밍 패러다임을 말한다.

## 1. 자바스크립트는 객체 지향 프로그래밍을 지원하나요 ?

자바스크립트는 명령형, 함수형, 프로토타입 기반, 객체지향 프로그래밍을 지원하는 **멀티 패러다임 프로그래밍 언어**입니다. 객체 지향 프로그래밍의 특징인 **상속**, **캡슐화** 등을 표면적으로 지원하지 않는다고 하여 객체 지향 언어가 아니라고 오해하는 경우도 있으나, 객체 지향 프로그래밍 능력을 가진 **프로토타입 기반의 객체지향 언어** 입니다.

## 2. 객체 지향 프로그래밍의 특징은 ?

[링크](https://gmlwjd9405.github.io/2018/07/05/oop-features.html)

### **추상화**

어떤 영역에서 필요로 하는 속성이나 행동을 추출하는 작업이다. 사물들의 공통된 특징, 추상적 특징을 파악해 인식의 대상으로 삼는 것을 말한다. `ex) 아우디와 벤츠는 자동차다. 또 준찌, 록바는 사람이다.(아닐지도 ㅋㅋ..)`

사람에게는 다양한 속성이 있다. 이 중 우리가 구현하는 프로그램이 이름과 주소라는 속성에만 관심이 있다고 가정한다면, 이 들만 추출해내는 것 그것을 **추상화**라고 한다.

### **캡슐화**

일반적으로 연관이 있는 변수와 함수를 클래스로 묶어내는 작업을 말한다. (키워드 : 정보은닉, 높은 응집도, 낮은 결합도) 정보은닉을 이뤄내는 것만이 캡슐화가 아니다. 잘된 캡슐화를 이뤄내기 필요한 것이 **정보은닉** 일 뿐이다.

**Tell, Don’t Ask 규칙 = 데이터를 달라고 부탁하지 말고 직접 해달라고 하기!**

### **상속**

객체들을 일반화 관계로 만드는 것이다. (여러 개체들이 가진 공통된 특성을 부각시켜 하나의 개념이나 법칙으로 성립시키는 과정) 일반적으로 일반화 관계는 상속으로 이해된다.

자식 클래스를 외부로부터 은닉할 수 있기에 캡슐화의 일종이라 볼 수 있다.

어떤 객체의 프로퍼티 또는 메서드를 다른 객체가 상속받아 그대로 사용할 수 있는 것을 말한다.

### **다형성**

일반적으로 자바의 오버라이딩을 말한다. 서로 다른 클래스의 객체가 같은 메시지를 받았을 때 각자의 방식으로 동작하는 능력을 말한다.

## 3. Prototype으로 상속하기 (코드재사용!)

프로토타입 객체에 메소드를 생성해두고, 생성자 함수로 생성되는 객체들은 이를 공유하도록 한다. (상속)

### 상속 하지 않은 경우

```jsx
/** node 환경에서 테스트. not browser */

function Circle(rad) {
  this.rad = rad;
  this.getArea = function () {
    return Math.PI * this.rad ** 2;
  };
}

const c1 = new Circle(5);
const c2 = new Circle(10);

console.log(c1.getArea === c2.getArea); // false -> 메소드를 객체별로 소유하게됨.
```

### 프로토타입을 통해 상속하는 경우

```jsx
/** node 환경에서 테스트. not browser */

function Circle(rad) {
  this.rad = rad;
}

Circle.prototype.getArea = function () {
  return Math.PI * this.rad ** 2;
};

const c1 = new Circle(5);
const c2 = new Circle(10);

console.log(c1.getArea === c2.getArea); // true. prototype으로부터 상속받은 메소드.
```

### [[Prototype]]에 대해 알아?

객체 생성 방식에 따라 결정되는 이 프로퍼티의 값은 다음과 같이 이해할 수 있지.

```jsx
const person = { name: "person" };

// 객체 리터럴 방식으로 생성된 객체는 Object.prototype

const juunzzi = new Person();

// 생성자 함수로 생성되는 객체는 Person.prototype
```

**모든 객체는 하나의 프로토타입을 갖는다. 그리고 모든 프로토타입은 생성자 함수와 연결되어있다.**

`생성자 함수` - `생성자 함수.prototype` - `객체`

## 4. Prototype으로 보는 Entity들의 관계

`생성자 함수` - 이 함수 객체의 prototype 프로퍼티는 `prototype` 을 가리킵니다.

`prototype` - 이 객체의 constructor 프로퍼티는 `생성자 함수` 를 가리킵니다.

`객체` - `prototype`으로 부터 내용을 상속받으며, `생성자 함수`로 부터 탄생됩니다.

## 5. non-constructor인 화살표 함수는 프로토타입을 참조하나요?

prototype 프로퍼티를 소유하지 않으며, 프로토타입 또한 생성하지 않습니다.

## 6. Function 생성자 함수로 함수 객체를 만들게 되면, 이는 클로저가 될 수 있을까요?

렉시컬 스코프를 만들지 않고, 전역 함수 인 것처럼 스코프를 생성하며 클로저도 만들지 않습니다. 자신의 영역(스코프) 속 지역변수를 기억하지 못하기 때문이겠죠?

## 7. 프로토타입의 생성 시점

생성자 함수가 생성되는 시점에 더불어 생성됩니다.

```jsx
console.log(Person.prototype); // 함수 정의가 평가되어 함수 객체를 생성하는 시점에 프로토타입도 더불어 생성된다. -> 호이스팅

function Person() {
  console.log("hi");
}
```

# (P 280 ~ 312)

## 8. `__proto__` 의 역할

프로토타입 상속 관계 (프로토타입 체인)에서 메소드와 프로퍼티를 찾아나가기 위해. 접근한 프로퍼티나 메소드가 프로토타입 체인 속에 존재하는지 확인할 수 있다.

아래처럼 프로토타입 체인을 거슬러 올라가며, 프로퍼티에 접근할 수 있겠지요 ?!

```jsx
// 생성자 함수
function constructorFunction() {}

// 생성자 함수가 가리키는 프로토타입에 `name` 프로퍼티를 추가
constructorFunction.prototype.name = " 1234 ";

// 객체를 생성
const object = new constructorFunction();

// 이 객체가 가리키는 프로토타입은 constructorFunction.prototype
console.log(object.__proto__); // { name: ' 1234 ' }

// constructorFunction.prototype 가 가리키는 prototype은 Object.prototype
console.log(object.__proto__.__proto__); // [Object: null prototype] {}
```

## 9.객체 리터럴로 객체를 만드는 경우 그 객체의 프로토타입은 뭐죠 ?

`Object.prototype` 입니다. 리터럴로 객체를 생성하더라도, 자바스크립트 자체의 추상연산에 의해 생성된다. 이 추상연산 과정에서 프로토타입이 `Object.prototype`으로 설정된다고 한다.

```jsx
const obj = {
  name: 21,
};

console.log(obj.__proto__); // Object.prototype 입니다.
```

## 10. 프로토타입 체인 파헤치기

`Object.getPrototypeOf` 메소드를 활용하면 더 명확하게 어떤 프로토타입을 가리키는지 확인할 수 있네요!!

이를 통해 다음 코드를 분석해보자면,

```jsx
// 생성자 함수입니다.
function Person(name) {
  this.name = name;
}

// 생성자 함수가 가리키는 프로토타입을 수정합니다.
Person.prototype.sayHello = function () {
  console.log(this.name);
};

// 객체를 생성합니다. (생성자 함수를 통해)
const me = new Person("juunzzi");

// 객체가 가리키는 프로토타입과 생성자 함수의 프로토타입은 같은 곳을 가리킵니다.
console.log(Object.getPrototypeOf(me) === Person.prototype);

// 생성자 함수가 가리키는 프로토타입의 프로토타입은 지금 상황에선 Object 생성자 함수가 가리키는 프로토타입 입니다.
console.log(Object.getPrototypeOf(Person.prototype) === Object.prototype);
```

프로토타입 체인이 만들어지면, 객체의 프로퍼티에 접근할 때 `이 체인을 따라 검색`하게 됩니다.

**- 프로토타입 체인은 상속과 프로퍼티 검색을 위한 메커니즘**

**- 스코프 체인은 식별자 검색을 위한 메커니즘**

## 11. 자바스크립트에도 오버라이딩이 있다구요?!?

네 있습니다. 여기서 잠깐 **오버라이딩이란 ?**

### 오버라이딩

상위 클래스가 가진 메소드를 하위 클래스에서 재정의하여 사용하는 방식이다. 그렇다면, 자바스크립트은 프로토타입 간 상속이 가능한 언어이기 때문에 메소드를 재정의하는 것 또한 가능한가 보군요.

다음과 같이 오버라이딩을 구현할 수 있어요. (이를 **프로퍼티 섀도잉**이라 부른다네요)

```jsx
function Person(name) {
  this.name = name;
}

// 프로토타입 메소드를 추가
Person.prototype.sayHello = function () {
  console.log(this.name);
};

const me = new Person("juunzzi");

// 인스턴스 메소드 추가
me.sayHello = function () {
  console.log(`me는 ${this.name}입니다`);
};

me.sayHello(); // me는 juunzzi입니다.
```

이 때 중요한건, 프로토타입 메소드를 덮어씌우지 않는다는 사실이에요. 덮어 씌우는 것이 아니라 `인스턴스의 메소드`로 추가한다는 사실!

### 오버라이딩을 풀고싶다면 ?

```jsx
// ...

delete me.sayHello;

me.sayHello(); // juunzzi
```

## 12. 프로토타입 변경, 그리고 instanceof 연산잔

우선 프로토타입의 변경은 다음과 같이 수행할 수 있어요.

```jsx
function Person(name) {
  this.name = name;
}
const me = new Person("juunzzi");

const parent = {};

Object.setPrototypeOf(me, parent);

console.log(parent === Object.getPrototypeOf(me)); // true
```

만약 프로토타입 체인 상에 내가 원하는 생성자 함수의 프로토타입이 존재하는지 확인하고 싶다면 ?

```jsx
console.log(me instanceof Object); // true

console.log(me instanceof Person); // false -> 변경되어 Person이 존재하지 않게된다.

console.log(me instanceof parent.constructor); // true -> 프로토타입 객체는 생성자 함수와 1:1 대응이다 무조건.
```

## 13. 프로토타입도 정적 메소드와 정적 프로퍼티를 가질 수 있겠지요?

당연하죠 ~~!!@

```jsx
function Person(name) {
  this.name = name;
}
Person.staticMethod = function () {};
Person.staticMember = 10;

console.log(Person.staticMember); // 10 -> 인스턴스를 만들지 않아도 접근할 수 있어요
```
