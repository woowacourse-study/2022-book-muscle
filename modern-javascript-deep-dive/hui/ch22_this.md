### this란?

this는 자기 참조 변수이다. this를 통해서 자신이 속한 객체 또는 자신이 생성할 인스턴스의 프로퍼티나 메서드를 참조할 수 있다.

```jsx
//객체 리터럴
const circle = {
  radius: 5,
  getDiameter() {
    // this는 메서드를 호출한 객체를 가리킨다.
    return 2 * this.radius;
  },
};
console.log(circle.getDiameter());

//생성자 함수
function Circle(radius) {
  this.radius = radius;
}

Circle.prototype.getDiameter = function () {
  return 2 * this.radius;
};

const circle = new Circle(5);
console.log(circle.getDiameter()); // 10
```

### this는 언제 생성되나?

this는 자바스크립트 엔진에 의해 암묵적으로 생성되며 코드 어디서든 참조할 수 있다.

this가 가리키는 값, 즉 this 바인딩은 `함수 호출 방식`에 의해 동적으로 결정된다. 또한 `strict mode` 역시 this 바인딩에 영향을 준다.

```jsx
// 함수에서 호출
function foo() {
  console.log(this); // window
}

// 객체에서 호출
const person = {
  name: 'Lee',
  getName() {
    console.log(this); //{name:'Lee', getName:f}
  },
};

// 생성자 함수 내부
function Person(name) {
  this.name = name;
  console.log(this); //Person {name: 'Lee'}
}

//strict mode인 일반 함수에서 호출
function foo() {
  'use strict';

  console.log(this); // undefined
}
```

strict mode를 적용하면 일반 함수 내부에서는 this에 undefined가 바인딩 된다.

### 함수 호출 방식에 따라 달라지는 this 바인딩

1. 전역 호출
2. 일반 함수 호출
3. 메서드 호출
4. 생성자 함수 호출
5. Function.prototype.apply/call/bind 메서드에 의한 간접 호출
6. callback 호출

### 전역 호출

```jsx
console.log(this); // window
```

전역에서 this는 전역 객체를 가리킨다. 브라우저에서는 window이고, Node.js에서는 global을 호출한다.

### 일반 함수 호출

```jsx
const foo = function () {
  console.log(this); //window
};
function foo() {
  console.log(this); //window
}
function bar() {
  foo(); // window
}
const obj = {
  a: 20,
  b() {
    foo(); //window
  },
  c() {
    //콜백함수
    setTimeout(function () {
      console.log(this); // window
    }, 100);
  },
};
```

일반 함수에서 this는 전역 객체를 가리킨다. 호출 되는 방식이 함수라면 아묻따 this는 전역이다. 단 strict mode면 this는 undefined이다.

```jsx
//strict mode에서의 일반 함수 this는 undefined이다.
function foo() {
  'use strict';

  console.log(this); // undefined
}
```

단 this를 사용하는 것 처럼 하는 방법도 있다.

```jsx
//that
const obj = {
  a: 20,
  c() {
    const that = this; // {a:20,c:f}
    setTimeout(function () {
      console.log(that.a); //20
    }, 100);
  },
};

//arrow function
const obj = {
  a: 20,
  c() {
    setTimeout(() => {
      console.log(this);
    }, 100); // {a:20, c:f}
  },
};
```

that을 사용하는 방법은 요즘은 자주 사용되지 않는다. 화살표 함수는 this 바인딩을 따로 하지 않기 때문에 위와 같은 방식으로 사용할 수 있다. this를 따로 바인딩 하지 않는다는 말은 `호출 방식`에 의해 this가 결정 되는게 아니라, 호출된 환경에 따라 this가 바인딩 된다는 의미이다. 현재 화살표 함수가 정의된 위치 바로 위에 있는 context의 this가 화살표 함수의 this로 바인딩된다.

따라서 obj의 this가 화살표 함수의 this로 바인딩 되는 것이다.

### 메서드 호출

메서드로서 호출할 때의 this는 호출한 대상 객체가 바인딩 된다.

```jsx
var value = 1;
const obj = }
	value: 100,
	foo() {
		console.log(this); // {value: 100, foo: f}
	}
}
```

만약 메서드를 함수에 할당하고 그 함수를 실행하면 this는 무엇을 가리킬까?

```jsx
const foo = {
  a() {
    console.log(this);
  },
};

const fooA = foo.a;
foo.a(); //{a:f}
fooA(); //window
```

위에서 말했듯이 this에 바인딩 될 객체는 호출 시점에 결정된다. 메서드였다고 하더라도 일반 함수로써 호출됐다면 this는 아묻따 전역 객체를 가리킨다.

### 생성자 함수 호출

생성자 함수 내부의 this에는 생성자 함수가 생성할 인스턴스가 바인딩된다.

```jsx
//생성자 함수
function Circle(radius) {
  this.radius = radius;
  this.getDiameter = function () {
    return 2 * this.radius;
  };
}

const circle1 = new Circle(5);
const circle2 = new Circle(10);

console.log(circle1.getDiameter()); //10
console.log(circle2.getDiameter()); //20

//new 연산자와 함께 호출하지 않으면 생성자 함수로 동작하지 않는다.
const circle3 = Circle(15);
console.log(circle3); //undefined
console.log(radius); // 15
console.log(getDiameter); //f(){ return 2 * this.radius}
console.log(getDiameter()); //30
console.log(this); // window
```

아래 생성자 함수가 아닌 일반 함수로 사용한 예시를 보면 this가 전역을 가리키게 되며, radius와 getDiameter가 전역의 프로퍼티가 된다.

책에 나와있지는 않지만 이러한 위험이 있어 생성자 함수에서 this를 쓰는 것은 지양해야 할 것 같다.

```jsx
//new를 강제하는 생성자 함수
function Circle(radius) {
  if (!new.target) {
    throw 'Circle() must be called with new';
  }
  this.radius = radius;
  this.getDiameter = function () {
    return 2 * this.radius;
  };
}

const circle = Circle(5); // Circle() must be called with new
```

이 때 위의 new.target을 사용하여 new 키워드를 강제해주면 문제를 해결할 수 있다. 이렇게 되면 함수가 new가 아닌 일반 함수로 호출되는 것을 막을 수 있다.

### Function.prototype.apply/call/bind 메서드에 의한 간접 호출

apply, call, bind 메서드는 Function.prototype의 메서드다. 즉, 이들 메서드는 모든 함수가 상속받아 사용할 수 있다. apply, call, bind를 메서드로 호출하면, 호출한 함수의 this를 apply, call, bind의 인자로 바인딩한다.

```jsx
//사용법

//apply
//this로 바인딩할 객체를 필수로 전달한다.
//인수로 전달할 값들 혹은 객체들을 배열 혹은 유사 배열 객체로 전달한다.
//이는 필수는 아니다.
Function.prototype.apply(thisArg[,argsArray])

//call
//apply와 마찬가지로 this를 필수로 전달한다.
//apply와 다르게 인수를 ,로 나열하여 넘겨준다. 마찬가지로 필수는 아니다.
Function.prototype.call(thisArg[,arg1[,arg2[, ...]]]])

//bind
//마찬가지로 this를 필수로 전달한다.
//그 다음 넘겨줄 인수는 call과 형태가 같다. 마찬가지로 필수는 아니다.
Function.prototype.bind(thisArg[,arg1[,arg2[, ...]]]])
```

apply,call과 bind의 차이는, 앞 2개는 바인딩과 동시에 함수를 호출하는 것이고, bind는 단지 binding만 한다는 것이다.

apply와 call은 단지 인수를 넘겨주는 방식의 차이 밖에 없다.

```jsx
//사용 예

function getThisBinding() {
  console.log([...arguments]);
  return this;
}

const thisArg = { a: 1 };

console.log(getThisBinding()); // window

console.log(getThisBinding.apply(thisArg, [1, 2, 3])); // {a: 1} [1,2,3]
console.log(getThisBinding.call(thisArg, 1, 2, 3)); // {a: 1} [1,2,3]

const bindedGetThisBinding = getThisBinding.bind(thisArg, 1, 2, 3);
console.log(bindedGetThisBinding()); // {a: 1} [1,2,3]
```

### 콜백 함수로 호출

다음 코드는 어떻게 동작할까?

```jsx
const person = {
  name: 'Lee',
  foo(callback) {
    setTimeout(callback, 100); // ?
  },
};

person.foo(function () {
  console.log(this.name);
});
```

person의 메서드 foo에서 callback을 실행했으니 this.name이 ‘Lee’로 나오지 않을까? 하하 나오지 않는다. 잘 보면 `콜백을 일반 함수로 실행`했다. `일반 함수로 실행`하면 this는 아묻따 뭐???? 🎤🎤🎤 그렇다 `전역 객체`. 전역 객체의 name 프로퍼티는 브리우저 창의 이름을 나타내는 빌트인 프로퍼티이며 기본 값은 ‘ ‘이다. 따라서 위 코드는 ‘ ‘을 출력한다.

해당 코드를 원하는 대로 동작시키려면 위에 나온 bind를 사용하면 된다.

```jsx
const person = {
  name: 'Lee',
  foo(callback) {
    setTimeout(callback.bind(this), 100); // 'Lee'
  },
};

person.foo(function () {
  console.log(this.name);
});
```

우리가 콜백 함수로 자주 넘겨주는 상황이 있다.

```jsx
class App {
  constructor() {
    document
      .querySelector('.button')
      .addEventListener('click', this.submitHandler.bind(this));
  }

  submitHandler() {
    //...
    console.log(this);
  }
}
```

이벤트 핸들러 함수로 bind this를 왜 쓰는 걸까? 이것을 알아보기 이전에 우선 다음 코드를 먼저 보자

```jsx
//...
document.querySelector('.button').addEventListener('click', function () {
  console.log(this);
}); // 콜백으로 일반 함수
```

버튼을 클릭하면 this는 무엇으로 나올까? 콜백 함수로 일반 함수를 넘겨 줬으니 전역 객체가 나올까? 정답은... button element가 나온다!

그 이유는 addEventListener라는 함수가 콜백 함수를 처리할 때 this를 타겟 엘리먼트로 바인딩 하도록 정의가 돼 있어서 그렇다.

이런 점이 좀 까다롭다. 콜백으로 넘겨주면 호출이 어떻게 되는지 알 수 없는 경우가 있을 수 있기 때문이다. 콜백은 함수의 제어권을 실행하는 주체에게 위임하는 것이기 때문에 실행하는 주체가 어떻게 콜백을 호출하느냐에 따라 this가 달라진다.

```jsx
//addEventListener 내부 상상도
addEvenetListener('event', callback){
	//...
	callback.bind(this.element);
}
```

아무튼 돌아와서... addEventListener에서 this는 타겟 엘리먼트이기 때문에 bind(this)를 해줌으로써 콜백함수의 this에 현재 this인 App을 바인딩 해주는 것이다. 그렇게 되면 우리가 원하던 대로 App의 프로퍼티를 this로 접근할 수 있게 된다.

```jsx
// 1
//this를 bind하지 않으면 submitHandler의 this는 button element가 된다.
class App {
  constructor() {
    document
      .querySelector('.button')
      .addEventListener('click', this.submitHandler);
  }

  submitHandler() {
    //...
    console.log(this); //button element
  }
}

// 2
// this를 bind하면 submitHandler의 this는 App이 된다.
class App {
  constructor() {
    this.a = 50;
    document
      .querySelector('.button')
      .addEventListener('click', this.submitHandler.bind(this));
  }

  submitHandler() {
    //...
    console.log(this); // App {a: 50}
  }
}

// 3
// handler 메서드를 화살표 함수로 하면 호출 방식과 상관없이
// this가 따로 바인딩이 안되기 때문에 정의된 환경 바로 위 컨텍스트의 this가
// 화살표 함수의 this로 바인딩 된다.
class App {
  constructor() {
    this.a = 50;
    document
      .querySelector('.button')
      .addEventListener('click', this.submitHandler);
  }

  submitHandler = () => {
    //...
    console.log(this); // App {a: 50}
  };
}
```

### 마치며

arrow function에 대한 의문이 생겼다.

```jsx
const a = {
  b: 5,
  c: function () {
    console.log(this);
  },
  d() {
    console.log(this);
  },
  e: () => {
    console.log(this);
  },
};
a.c(); // {a:5,c:f}
a.d(); // {a:5,c:f}
a.e(); // window

class App {
  constructor() {
    console.log('constructor ', this);
    this.b();
    this.c();
  }

  b = () => {
    console.log('화살표 함수 ', this);
  };

  c() {
    console.log('메서드 ', this);
  }
}
new App();
```

a.e()의 결과로 전역이 출력된다. 왜 그런건지 찾아봐야겠다.
