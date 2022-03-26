### 함수의 구분

ES6 이전까지는 자바스크립트에서 함수는 일반 함수로 호출 될 수도 있었고 new 연산자와 함께 생성자 함수 일 수도 있었으며, 객체의 메서드로 호출될 수도 있었다. 이는 언뜻 봐도 편리해 보이면서, 많은 실수를 유발할 것 같다.

```jsx
var foo = function () {
  return 1;
};

foo(); //1

new foo(); //foo {}

var obj = { foo: foo };
obj.foo(); // 1
```

즉 ES6 이전 모든 함수는 callable이면서 contructor였다.

따라서 메서드 역시 생성자 함수가 될 수 있었다.

```jsx
var obj = {
  x: 5,
  foo: function () {
    return this.x;
  },
};
console.log(new obj.foo()); //foo {}
```

이런 예가 흔하진 않지만, 가능하다는 것 자체가 문제가 된다. 그리고 이는 성능 면에서도 문제가 있다. 객체에 바인딩된 함수 즉 메서드가 constructor라는 것은, 메서드가 prototype 프로퍼티를 가지며, 객체도 생성한다는 것을 의미하기 때문이다.

이는 콜백 함수도 마찬가지다. 콜백 함수도 constructor이기 때문에 불필요한 프로토타입 객체를 생성한다.

이처럼 ES6 이전에는 명확한 기준 없이 호출 방식에 특별한 제약이 없었고, 생성자 함수로 호출된게 아니었더라고, 프로토타입 객체를 생성했다.

이러한 문제를 해결하기 위해 ES6에서는 함수를 사용 목적에 따라 세 가지 종류로 명확히 구분했다

| ES6 함수의 구분 | constructor | prototype | super | arguments |
| --------------- | ----------- | --------- | ----- | --------- |
| 일반 함수       | O           | O         | X     | O         |
| 메서드          | X           | X         | O     | O         |
| 화살표 함수     | X           | X         | X     | X         |

일반 함수는 constructor이지만 ES6의 메서드와 화살표 함수는 non-constructor이다. 이에 대해 자세히 알아보자.

### 메서드

ES6에서 메서드는 `메서드 축약 표현`,으로 정의된 함수만을 의미한다.

```jsx
const obj = {
  x: 1,
  foo() {
    return this.x;
  }, // 메서드
  bar: function () {
    return this.x;
  }, // 일반함수, 메서드 아님
};
console.log(obj.foo()); // 1
console.log(obj.bar()); // 1
```

ES6에서의 축약표현으로 정의된 메서드는 인스턴스를 생성할 수 없는 non-constructor이다.

```jsx
new obj.foo(); // TypeError: obj.foo is not a constructor
new obj.bar(); // bar {}
```

ES6 메서드는 인스턴스를 생성할 수 없으므로 prototype 프로퍼티가 없고, 프로토타입도 생성하지 않는다.

```jsx
obj.foo.hasOwnProperty('prototype'); // false
obj.bar.hasOwnProperty('prototype'); // true
```

참고로 표준 빌트인 객체가 제공하는 프로토타입 메서드와 정적 메서드는 모두 non-constructor이다.

```jsx
String.prototype.toUpperCase.prototype; // undefined
String.fromCharCode.prototype; // undefined

Number.prototype.toFixed.prototype; // undefined
Number.isFinite.prototype; // undefined

Array.prototype.map.prototype; // undefined
Array.from.prototype; // undefined
```

---

ES6 메서드는 자신을 바인딩한 객체를 가리키는 내부 슬롯 `[[HomeObject]]`를 갖는다. super 참조는 내부 슬롯`[[HomeObject]]` 를 사용하여 수퍼클래스의 메서드를 참조하므로 내부 슬롯 `[[HomeObject]]` 를 갖는 ES6 메서드는 super 키워드를 사용할 수 있다.

```jsx
const base = {
  name: 'Lee',
  sayHi() {
    return `Hi! ${this.name}`;
  },
};

const derived = {
  __proto__: base, // 생성자에 프로토타입을 상속하는 과정
  sayHi() {
    return `${super.sayHi()}. how are you doing?`;
  },
};

console.log(derived.sayHi()); // Hi! Lee. how are you doing?
```

super는 sayHi의 [[HomeObject]]의 프로토타입인 base를 가리킨다. 이는 sayHi가 `ES6 메서드`라 가능하다. **일반 함수로 된 메서드였다면 [[HomeObject]]가 없어서 super 키워드를 사용할 수 없다.**

ES6 메서드에서는 본연의 기능 super를 추가하고 의미적으로 맞지 않는 constructor는 제거했다. 따라서 메서드를 정의할 때는 ES6의 방식으로 정의 하는게 좋다.

### 화살표 함수

기본적인화살표 함수 문법을 생략 하것슴다.

화살표 함수도 즉시 실행 함수(IIFE)로 사용할 수 있다.

```jsx
const person = ((name) => ({
  sayHi() {
    return `Hi? My Namei is ${name}.`;
  },
}))('Lee');

console.log(person.sayHi()); //Hi? My name is Lee.
```

화살표 함수도 일급객체이다. 따라서 map,filter,reduce 같은 고차 함수에 인수로 전달할 수 있다. 이 경우 일반적인 함수 표현식보다 표현이 간결하고 가독성이 좋다.

```jsx
[1, 2, 3].map((v) => v * 2);
```

이처럼 화살표 함수는 콜백 함수로서 정의할 때 유용하다. 화살표 함수는 표현만 간략한 것이 아니다. 화살표 함수는 일반 함수의 기능을 간략화 했으며, this도 편리하게 설계됐다. 일반 함수와 화살표 함수의 차이에 대해 살펴보자.

### 화살표 함수와 일반 함수의 차이

1. 화살표 함수는 인스턴스를 생성할 수 없는 non-constructor이다.

   ```jsx
   const Foo = () => {};
   new Foo(); // TypeError: Foo is not a constructor.
   ```

   화살표 함수는 인스턴스를 생성할 수 없으므로 prototype 프로퍼티가 없고 프로토타입도 생성하지 않는다.

   ```jsx
   const Foo = () => {};
   Foo.hasOwnProperty('prototype'); // false
   ```

   이 부분은 정확하게 이해 되지가 않는다. prototype 프로퍼티와 프로토타입이 뭐가 다른걸까? **proto** 이건가? prototype property vs prototype attribute라는 키워드가 있는 걸 보니 뭔가 다른가 보다. 다음에는 property를 공부해 봐야겠다.

2. 중복된 매개변수 이름을 선언할 수 없다.

   일반 함수는 매개변수 이름이 중복돼도 에러가 발생하지 않는다.

   ```jsx
   function normal(a, a) {
     return a + a;
   }
   console.log(normal(1, 2)); // 4

   //strict mode
   function normal(a, a) {
     'use strict';
     return a + a;
   } // SyntaxError

   const arrow = (a, a) => a + a;
   // SyntaxError
   ```

3. 화살표 함수는 함수 자체의 this, arguments, super, new.target 바인딩을 갖지 않는다.

   따라서 화살표 함수 내부에서 위 4개를 참조하면 스코프 체인을 통해 상위 스코프의 해당 키워드를 참조한다.

   만약 화살표 함수와 화살표 함수들이 중첩돼 있다면 상위 화살표 함수에도 해당 키워드들 바인딩이 없으므로, 스코프 체인 상에서 가장 가까운 상위 함수 중에서 화살표 함수가 아닌 함수의 해당 키워드를 참조한다.

### 화살표 함수 - this

화살표 함수와 일반 함수의 가장 큰 차이점은 this다. 화살표 함수에서의 this는 `상위 스코프 중 화살표 함수가 아닌 함수`의 this를 참조한다.

```jsx
const counter = {
  num: 1,
  getNumber: function () {
    return this.num;
  },
  increase: () => ++this.num,
};

console.log(counter.getNumber()); //1
console.log(counter.increase()); //NaN
```

객체의 메서드로 쓰인 일반 함수의 this는 그 객체이다. 따라서 getNumber의 결과는 obj의 프로퍼티 num, 즉 1이 나온다.

객체의 메서드로 쓰인 increase의 this는 무엇일까?

this 바인딩은 함수가 호출된 시점에 결정 되는 것이고, 함수가 메서드로서 호출된다면 this는 호출한 객체이니까 increase의 this도 호출한 객체인 counter일까?

결과를 보면 알겠지만 increase의 this는 counter가 아니다. 그 이유는 위에서 얘기 했듯이 화살표 함수의 this는 따로 바인딩 되는 방식이 없고, 상위 스코프 중 화살표 함수가 아닌 함수의 this를 참조하기 때문이다.

화살표 함수인 increase의 상위 스코프 중 일반 함수가 없기 때문에 increase의 this는 전역 객체까지 가버린 것이다. 전역 객체의 num을 참조하니 undefined가 나왔고, 그것을 증가시키는 연산을 해서 NaN이 나와버렸다.

저번 this를 공부하며 생겼던 의문이 이거였다. class의 메서드로 화살표 함수를 사용하면 this가 class인데 왜 객체의 메서드로 사용하면 전역이 나올까? 그 이유는 위에서 알아 본 것 처럼 화살표 함수의 this가 바인딩 되는 방식이 다르다는 점과, 추가적으로 class에서의 메서드 선언 방식 때문이었다.

class에서 메서드를 선언하면 해당 메서드가 클래스 필드에서 선언 됐다고 하더라도, 실제로는 constructor 내부에서 선언이 된다.

```jsx
const counter = {
  num: 1,
  increase: () => ++this.num,
};

console.log(counter.increase()); //NaN

//code
class Counter {
  constructor() {
    this.num = 1;
  }
  // 클래스 필드에 선언된 메서드
  increase = () => ++this.num;
}

//실제로는
class Counter {
  constructor() {
    this.num = 1;
    this.increase = () => ++this.num;
  }
}

console.log(new Counter().increase()); // 2
```

따라서 메서드의 상위 스코프는 해당 클래스의 constructor이다. 그리고 constructor의 this에는 해당 class가 바인딩 돼 있다. 따라서 화살표 함수로 선언된 class의 메서드는 this가 해당 class를 가리키게 되는 것이다.

화살표 함수도 apply, call, bind를 `호출은` 할 수 있다. 근데 바인딩은 안된다. 화살표 함수는 일편 단심 위(상위 스코프)만 바라본다. 주위의 어떤 유혹(apply,call,bind)에도 굴하지 않는다. 실로 충신이라 할 수 있다.

```jsx
window.x = 1;

const normal = function () {
  return this.x;
};
const arrow = () => this.x;

console.log(normal.call({ x: 10 })); // 10
console.log(arrow.call({ x: 10 })); // 1
```

따라서 메서드를 화살표 함수로 하는 것은 피해야 한다. _(여기서 메서드는 ES6의 축약형 메서드가 아닌 일반적인 메서드를 말한다.)_ this가 전역을 가리키기 때문이다.

프로토타입 객체의 프로퍼티에 화살표 함수를 할당하는 경우도 동일한 이유로 피해야 한다.

```jsx
function Person(name) {
  this.name = name;
}

Person.prototype.sayHi = () => console.log(`Hi ${this.name}`);

const person = new Person('Lee');
person.sayHi(); // Hi    ,this.name이 window.name을 가리켜서 공백이 나온다.

Person.prototype.sayHi = function () {
  console.log(`Hi ${this.name}`);
}; //일반 함수
const person2 = new Person('Jang');
person2.sayHi(); //Hi Jang
```

따라서 프로토타입의 프로퍼티를 동적으로 추가할 때는 일반 함수를 사용해야 한다.

### 화살표 함수 - super

화살표 함수는 함수 자체의 super 바인딩을 가지지 않는다. 따라서 화살표 함수 내부에서 super를 참조하면 this와 마찬가지로 상위 스코프의 super를 참조한다.

```jsx
class Base {
  constructor(name) {
    this.name = name;
  }

  sayHi() {
    return `Hi! ${this.name}`;
  }
}

class Derived extends Base {
  //상위 스코프인 constructor의 super를 가리킨다.
  //constructor의 super는 extends한 클래스다.
  sayHi = () => `${super.sayHi()} how are you doing?`;
}

const derived = new Derived('Lee');
console.log(derived.sayHi()); // Hi! Lee how are you doing?
```

### 화살표 함수 - arguments

화살표 함수는 자체적인 arguments 바인딩을 갖지 않는다. 따라서 화살표 함수 내부에서 arguments를 참조하면 this와 마찬가지로 상위 스코프의 arguments를 참조한다.

```jsx
(function () {
  const foo = () => console.og(arguments);
  foo(3, 4); // [Arguments] { '0':1, '1':2 }
})(1, 2);

//화살표 함수 foo의 arguments는 상위 스코프인 전역의 arguments를 가리킨다.
//하지만 전역에는 arguments 객체가 존재하지 않는다. arguments 객체는 함수 내부에서만 유효하다.
const foo = () => console.log(arguments);
foo(1, 2); // ReferenceError: arguments is not defined
```

본인이 아닌 상위의 arguments는 효용성이 높지 못할 것 같다.

따라서 화살표 함수로 가변 인자 함수(arguments)를 구현해야 할 때는 반드시 Rest 파라미터를 써야 한다.

### Rest 파라미터

ES6에 추가된 기능으로 Rest 파라미터도 있다. Rest 파라미터는 매개변수 이름 앞에 세개의 점 ...을 붙여서 정의한 매개변수를 의미한다. Rest 파라미터는 함수에 전달된 인수들의 목록을 배열로 전달받는다.

```jsx
function foo(...rest) {
  console.log(rest); //[1, 2, 3, 4, 5]
}

foo(1, 2, 3, 4, 5);
```

일반 매개변수와 Rest 파라미터는 함께 사용할 수 있다. 이때 함수에 전달된 인수들은 매개변수와 Rest 파라미터에 순차적으로 할당된다.

```jsx
function foo(param1, param2, ...rest) {
  console.log(param1); // 1
  console.log(param2); // 2
  console.log(rest); // [ 3, 4, 5]
}
foo(1, 2, 3, 4, 5);
```

Rest 파라미터는 반드시 마지막 파라미터여야 한다. 또한 반드시 하나만 선언할 수 있다.

```jsx
function foo(...rest,param){} //SyntaxError
function foo(...rest1,...rest2){} //SyntaxError
```

Rest 파라미터는 함수 정의 시 선언한 매개변수 개수를 나타내는 함수 객체의 length 프로퍼티에 영향을 주지 않는다. ~~함수에 length 프로퍼티가 있는지도 몰랐다.~~

```jsx
function foo(...rest){}
console.log(foo.length);// 0
function foo(x,..rest){}
console.log(foo.length); //1
function foo(x,y,..rest){}
console.log(foo.length); //2
```

따라서 화살표 함수에서 가변 인자를 구하고 싶을 때는 Rest 파라미터를 쓰면 된다.

```jsx
const arrow = (...rest) => {
  console.log(rest);
}; //[1,2,3,4]
arrow(1, 2, 3, 4);
```

### 매개변수 기본 값

ES6에서부터 함수의 매개변수에 기본 값을 설정할 수 있게 됐다.

```jsx
function sum(x = 0, y = 0) {
  return x + y;
}
console.log(sum(1, 2)); //3
console.log(sum(1)); //1
```

Rest 파라미터에는 기본 값을 설정할 수 없다.

```jsx
function foo(...rest = []){
	console.log(rest);
} //SyntaxError
```
