## 01 상황에 따라 달라지는 this

자바스크립트에서 this는 기본적으로 함수가 호출될 때 함께 결정된다.
(함수가 호출될때 생성되는 실행 컨텍스트는 생성과 동시에 this 바인딩 과정을 거치기 때문이다.)

### 전역 공간에서의 this

전역 공간에서는 전역 컨텍스트를 생성하는 주체가 전역 객체(브라우저:window, Node.js:global)이기 때문에 this는 이 전역 객체를 가리키게 된다.

```js
// 전역 공간(브라우저)
console.log(this); // window {aler: f(), atob: f(), ...}

// 전역 공간(Node.js)
console.log(this); // global {aler: f(), atob: f(), ...}
```

전역 변수를 선언하면 JS 엔진은 해당 변수를 전역 객체의 프로퍼티로도 할당하는데 예시를 통해 살펴보자.

```js
// 전역 공간(브라우저)
var a = 1;
```

이렇게 전역 공간에서 a 라는 식별자를 가진 변수를 선언하게 되면,

```js
// 전역 공간(브라우저)
console.log(a); // 출력: 1
console.log(window.a); // 출력: 1
console.log(this.a); // 출력: 1
```

위 처럼, `변수 a` , `window 의 프로퍼티 a` 그리고 `this 가 가리키고 있는 객체의 a` 는 모두 같은 값을 가리키고 있다.
이는 `전역 변수 a 는 window 의 프로퍼티로도 할당`이 되고 `this 가 가리키고 있는 객체는 전역 객체(window)` 라는 것을 보여준다.

대부분의 경우 해당 변수 a 는 window 의 프로퍼티로써의 역할과 거의 동일하게 움직이지만, delete 키워드를 이용한 '삭제' 명령에서는 다른 모습을 보여준다.

```
a = 1;
window.b = 2;
console.log(a, window.a, this.a) // 출력: 1 1 1
console.log(b, window.b, this.b) // 출력: 2 2 2

delete a; 	// false
		   // (=== delete window.a;)
console.log(a, window.a, this.a) // 출력: 1 1 1

delete b;  // true
		   // (=== delete window.b;)
console.log(b, window.b, this.b) // Uncaught ReferenceError : b is not defined
```

위처럼, 전역변수로 선언을 하든, 전역객체의 프로퍼티로 선언을 하든 동작은 같지만 delete 명령시 전역객체의 프로퍼티로 선언을 한 경우만 해당 변수를 삭제할 수 있는 것을 알 수 있다.

이는 JS 엔진이 변수의 의도치 않은 삭제에 대해 마련해둔 방어 전략이라 할 수 있는데, `전역객체의 프로퍼티로 선언하는 경우만 삭제 여부의 configurable 속성을 true로 부여`하게 해놓은 것이다.

### 함수 vs 메서드

this 를 이해하기 위해선, 함수를 호출하는 두 가지 방식인 함수 호출과 메서드 호출을 먼저 이해해야 한다.
이 둘을 구분하는 유일한 차이는 `독립성`에 있는데, 예제를 보며 확인하면 좀 더 쉽게 이해할 수 있다.

```js
function a() {
  console.log(this);
}

var obj = {
  method: a,
};

a(); // 함수로서 호출
obj.method(); // 메서드로서 호출
```

객체에 `.` 을 붙여서 호출하는 함수는 메서드로서의 호출이고 그 외에는 함수로서의 호출이다. (물론 `obj['method']()` 처럼 호출해도 `.` 의 의미와 같다)

그러면 `함수로서 호출될 때`와 `메서드로서 호출될 때` 해당 함수가 가리키고 있는 this 의 값은 어떻게 다를까?

결론부터 말하면 함수로서 호출될 때의 this 는 전역 객체를 가리키고 메서드로서 호출될 때는 호출을 실행한 주체, 즉 `. 앞에 있는 객체`를 가리킨다. 위의 예제의 출력 결과와 함께 다시 살펴보자.

```js
function a() {
  console.log(this);
}

var obj = {
  method: a,
};

a(); // (함수)  출력: 전역객체 window {...}
obj.method(); //(메서드) 출력: obj { method: f }
```

여기까지는 이해에 문제가 없을 수 있다. this 가 가리키는 대상이 꽤 직관적이다.

```js
//(코드상 모든 함수들은 해당 함수가 가리키고 있는 this를 출력한다)
var obj1 = {
  outer: function () {
    console.log(this);
    var innerFunction = function () {
      console.log(this);
    };
    innerFunction(); // innerFunction() 실행 (2)

    var obj2 = {
      innerMethod: innerFunction,
    };
    obj2.innerMethod(); // obj2.innerMethod() 실행(3)
  },
};
obj1.outer(); // obj1.outer() 실행 (1)
```

그렇다면 위와 같은 경우는 어떨까?
코드가 좀 길어 알아보기 한 눈에 안들어 온다면 함수(메서드)가 호출되는 부분을 중심으로 살펴보자.
그때가 바로 실행 컨텍스트가 생성되고 this가 바인딩 되는 시점이기 때문이다.
각 함수의 실행 시점에 따라 순서를 적어놨으니 순서에 따라 출력 결과를 살펴보자.

(1) obj.outer() 실행

이 부분의 출력 결과를 예상하기는 수월하다. 앞서 말했듯 `.` 앞에 있는 객체가 this를 가리키고 있다는 것만 알고있으면 해당 메서드가 가리키고 있는 this 는 obj1 일 것이며, 출력은 `obj1` 이 될 것이다.

(2) innerFunction() 실행 \*

해당 함수는 분명 obj1 객체의 outer 메서드 내부에서 생성되고 호출되었다. 그렇다면 innerFunction 함수의 this는 obj1 을 가리킬까?
앞서 해당 책의 저자는 설명했다. `.`으로 호출되는 경우, 즉 메서드로 호출되는 것이 아니면 this 가 가리키는 대상은 `전역 객체`일 것이라고.
해당 함수는 메서드가 아닌 함수로서 호출되었고 innerFunction 함수의 this가 가리키는 대상은 `전역객체 window`이다.

(3) obj2.innerMethod() 실행

이제 감이 왔을 것이라 생각한다. 해당 함수는 메서드로서 실행되었고 이 함수의 this 가 가리키는 대상은 `.` 앞의 객체, `obj2` 일 것이다.

### 메서드 내부 함수에서의 this

위에서 살펴보았던 (2) innerFunction() 과 같은 경우를 다시 생각해보자. 실행 컨텍스트를 배웠고 상위 스코프에 대해서 인식이 있는 우리에겐 해당 함수가 가리키는 this가 상위 스코프인 obj1 을 가리키는 것이 보다 자연스러울 것이다.
`메서드 내부 함수에서의 this 가 전역 객체를 가리키는 것`에 대해 더글라스 크락포드(JS 개발에 참여)는 `명백한 설계상의 오류`라고도 표현하였다.
그렇다면 우리는 이 때의 this 에 대해서 혼동할 필요가 없도록, 상위 스코프를 가리키도록 해주고싶은 마음이 들 것이다.

- 임의의 변수 self 이용

아쉽게도 ES5 까지에서는 이를 해결할 명확한 방법은 없고 우회하는 방법만 존재한다. 그것이 self 라는 변수를 만들어서 사용하는 것인데, 상위 스코프를 가리키는 this를 self 에 담아두고 이를 this 대신 이용하는 것이다. 예제와 함께 조금 더 살펴보자.

```js
var obj = {
  outer: function () {
    console.log(this); //  출력: obj1
    var self = this; // 상위스코프를 가리키는 임의의 self 생성
    var innerFunction = function () {
      console.log(self); //  출력: obj1 (this 대신 사용)
    };
    innerFunction();
  },
};
obj.outer();
```

변수에 상위스코프를 담아서 this 대신에 사용한다. 문제없이 잘 작동하고 ES6가 나오기 이전까지는 많이 쓰이던 방식이다. 직관적으로 변수에 담아서 this 대신에 사용한다는 것이 썩 내키지는 않는 사람들도 있을 것이다. 그래서 ES6는 우리에게 `화살표 함수`를 제공해주었다.

- this 를 바인딩하지 않는 화살표 함수

앞서 말했듯, ES6에서는 함수 내부에서 this가 전역객체를 바라보는 문제를 보완하고자, this를 바인딩하지 않는 화살표 함수를 새로 도입했다. `화살표 함수`는 `실행 컨텍스트 생성 시, this 바인딩 과정 자체를 제외`하여 `상위 스코프의 this를 그대로 활용`할 수 있도록 하였다.

```js
var obj = {
  outer: function () {
    console.log(this); //  출력: obj1
    var innerFunction = () => {
      console.log(this); // 출력: obj1
    };
    innerFunction(); // 실행컨텍스트 생성 시 화살표 함수를 만나면 this 바인딩 제외
  },
};
obj.outer();
```

화살표 함수가 나오게 된 과정에 대해 다시금 생각해보면 this 에 대해 조금 더 어렵지않게 다가갈 수 있을 것이다.

### 명시적 바인딩

앞서 임의의 self 변수에 상위 스코프의 this 를 담아 this 대신 사용하는 방법을 보았고, 이 문제를 보완하기 위한 화살표 함수에 대해서도 알게되었다.
이러한 this 가 바인딩 되는 규칙을 깨고 명시적으로 this 바인딩을 해줄 수 있는 방법이 있는데,
바로 `call, apply, bind 메서드`를 이용하는 방법이다.

#### 1) call 메서드

call 메서드는 메서드의 호출 주체인 함수를 즉시 실행하도록 하는 명령이다. (호출 주체는 해당 메서드를 부른, `.` 앞에 있는 대상이다)
첫 번째 인자를 this 로 바인딩하고, 이후의 인자들을 호출할 함수의 매개변수로 이용한다.

```js
var func = function (a, b, c) {
  console.log(this, a, b, c);
};

func(1, 2, 3); // 출력: Window {...} 1 2 3
func.call({ x: 1 }, 4, 5, 6); // 출력: { x: 1 } 4 5 6
```

call 메서드의 호출 주체인 func 를 즉시 호출하고, 첫번째 인자인 `{ x: 1 }` 로 해당 함수의 this 에 바인딩하였으며, 이후 인자들을 매개변수로 이용하였다.
예제는 함수에서만 살펴보았지만 객체의 메서드에서도 동일하게 작동한다.

#### 2) apply 메서드

apply 메서드는 call 메서드의 기능적 동작방식과 완전히 동일하다.
다만 다른 점은 첫번째 인자 이후 두번째 인자를 배열로 받아 배열의 요소들을 매개변수로 지정한다는 것이다.

call 메서드의 예시에서 함수로 사용했으니 이번엔 메서드로 호출해보겠다.

```js
var obj = {
  x: 1,
  method: function (a, b, c) {
    console.log(this, a, b, c);
  },
};
obj.method(1, 2, 3); // 출력: obj { x: 1, method: f } 1 2 3
obj.method.apply({ y: 2 }, [4, 5, 6]); // 출력: { y: 2 } 4 5 6
```

#### 3) bind 메서드

bind 메서드는 ES5에서 추가된 기능으로, call 메서드와 비슷하지만 즉시 호출하지는 않고 넘겨받은 this 및 인수들을 바탕으로 새로운 함수를 반환해주는 메서드이다.
첫번째 인자로 this 바인딩을 하고 두번째부터 인자로 넘겨받은 값들은 순서대로 매개변수에 등록하게 된다.
bind 를 통해 생성된 함수에 인자를 넘기면 bind 메서드에서 넘겨받은 값들에 뒤이어 등록된다.

함수에는 name 이라는 식별자를 담는 프로퍼티를 가지고 있는데, bind 메서드를 통해 새로 만들어진 함수엔 이 name 프로퍼티의 식별자 앞에 bound 라는 접두어가 붙는다.
즉, xxx 라는 식별자를 가진 어떤 함수의 name 프로퍼티가 bound xxx 라면 이 함수는 bind 메서드를 통해 새로 생성된 함수라는 것을 알 수 있다.

```js
var func = function (a, b, c, d) {
  console.log(this, a, b, c, d);
};
func(1, 2, 3, 4); // 출력: Window {...} 1 2 3 4
console.log(func.name); // 출력: func

var bindFunc = func.bind({ x: 1 }, 4, 5);
bindFunc(6, 7); // 출력: { x: 1} 4 5 6 7
console.log(bindFunc.name); // 출력:bound func
```

#### 상위 컨텍스트의 this를 내부함수에 전달하기

call, apply, bind 메서드에 대해서 살펴보았다.
그러면 self 변수와 화살표 함수를 이용한 방법이 아닌 이 명시적 바인딩을 이용해서 상위 컨텍스트의 this 를 바인딩하게 하는 방법을 살펴보자.

```js
// call 메서드 이용
var obj = {
  outer: function () {
    console.log(this);
    var innerFunc = function () {
      console.log(this);
    };
    innerFunc.call(this);
  },
};
obj.outer();
```

```js
// bind 메서드 이용
var obj = {
  outer: function () {
    console.log(this);
    var innerFunc = function () {
      console.log(this);
    }.bind(this);
    innerFunc();
  },
};
obj.outer();
```

apply는 call의 동작과 같기 때문에 제외하였다.
예시를 살펴보면 메서드가 호출되는 시점이 조금 다른 것을 확인할 수 있는데,
이는 this를 바인딩하고 해당 함수를 호출하는 call 메서드, this가 바인딩된 새로운 함수를 생성하는 bind 메서드의 차이에 대해서 생각해본다면 그 이유를 알 수 있을 것이다.

### 콜백 함수 내부에서의 this

함수A의 제어권을 다른 함수B(또는 메서드) 에게 넘겨주는 경우에, 함수A를 콜백 함수라고 한다.
이때 함수A의 this 는 함수B의 내부 로직에서 정한 규칙에 따라 값이 결정된다.

예로, 인자로 콜백 함수를 받으며 이벤트 리스너를 등록해주는 역할을 하는 addEventListener 메서드는 내부 로직에 따라 this 값을 addEventListener 가 가리키는 this 로 바인딩하게된다.
또 다른 예로, 인자로 콜백 함수를 받는 forEach 같은 배열 메서드에서는 함수 호출과 같이 this가 전역객체를 바라보도록 바인딩하는데, 내부적으로 원하는 this로 바인딩을 할 수 있도록 thisArg 매개변수를 가지고 있어서 인자로 넘길 수 있도록 하고있다.

이때 앞서 보았던 call, apply, bind 같은 메서드를 사용하여 명시적으로 this를 바인딩하여 콜백 함수를 넘겨줄 수 있다.

내부적으로 this 를 전역객체로 바인딩하게하는 setTimeout 함수를 통해 알아보자.

```js
var callBackFunc = function () {
  console.log(this);
};

setTimeout(callBackFunc, 1000);
// 1초 뒤 출력: Window {...}

setTimeout(callBackFunc.bind({ x: 1 }), 1000);
// 1초 뒤 출력: {x: 1}
```

### 생성자 함수 내부에서의 this

생성자 함수는 어떤 공통된 성질을 지니는 객체들을 생성하는 데 사용하는 함수이다.
자바스크립트는 함수에 생성자로서의 역할을 함께 부여했는데, new 명령어와 함께 함수를 호출하면 해당 함수가 생성자로서 동작하게 된다.
어떤 함수가 생성자 함수로서 호출된 경우, 내부에서의 this엔 곧 새로 만들 구체적인 인스턴스 자신이 바인딩된다.

좀 더 자세히 살펴보면, new 명령어와 함께 함수를 호출(생성자 함수 호출)하면 생선자의 prototype 프로퍼티를 참조하는 `__proto__`라는 프로퍼티가 있는 객체(인스턴스)를 만들고, 미리 준비된 공통 속성 및 개성을 해당 객체(this)에 부여한다.

```js
var Cat = function (name, age) {
  this.bark = '야옹';
  this.name = name;
  this.age = age;
  console.log(this);
};
var choco = new Cat('초코', 7); // 출력: Cat {bark: '야옹', name: '초코', age: 7}
var nabi = new Cat('나비', 5); // 출력: Cat {bark: '야옹', name: '나비', age: 5}
```

보는 것과 같이 생성자 함수를 호출하면 생성되는 객체(인스턴스)가 this에 바인딩된다.
