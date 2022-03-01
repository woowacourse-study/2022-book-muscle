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
obj.method(); //(메서드) 출력: obj 객체 { method: f }
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
코드가 좀 길어 알아보기 한 눈에 안들어 온다면 함수(메서드)가 호출되는 부분을 중심으로 살펴보자. 그때가 바로 실행 컨텍스트가 생성되고 this가 바인딩 되는 시점이기 때문이다.
각 함수의 실행 시점에 따라 순서를 적어놨다. 순서를 출력 결과를 살펴보자.

(1) obj.outer() 실행
이 부분의 출력 결과를 예상하기는 수월하다. 앞서 말했듯 `.` 앞에 있는 객체가 this를 가리키고 있다는 것만 알고있으면 해당 메서드가 가리키고 있는 this 는 obj1 일 것이며, 출력은 `obj1` 이 될 것이다.

(2) innerFunction() 실행 \*
해당 함수는 분명 obj1 객체의 outer 메서드 내부에서 생성되고 호출되었다. 그렇다면 innerFunction 함수의 this는 obj1 을 가리킬까?
앞서 해당 책의 저자는 설명했다. `.`으로 호출되는 경우, 즉 메서드로 호출되는 것이 아니면 this 가 가리키는 대상은 `전역 객체`일 것이라고.
해당 함수는 메서드가 아닌 함수로서 호출되었고 innerFunction 함수의 this가 가리키는 대상은 `전역객체 window`이다.

(3) obj2.innerMethod() 실행
이제 감이 왔을 것이라 생각한다. 해당 함수는 메서드로서 실행되었고 이 함수의 this 가 가리키는 대상은 `.` 앞의 객체, `obj2` 일 것이다.

### 메서드 내부 함수에서의 this

위에서 살펴보았다. (2) innerFunction() 과 같은 경우를 다시 생각해보자. 실행 컨텍스트를 배웠고 상위 스코프에 대해서 인식이 있는 우리에겐 해당 함수가 가리키는 this가 상위 스코프인 obj1 을 가리키는 것이 보다 자연스러울 것이다.
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
