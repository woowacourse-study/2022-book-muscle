## 01 클로저의 의미 및 원리 이해

우선 클로저(Closure)는 자바스크립트의 고유의 개념이 아닌 여러 함수형 프로그래밍 언어에서 등장하는 보편적인 특성이다.

따라서 클로저를 설명하는 다양한 방법이 있는데,

그 중에서 MDN의 클로저에 대한 설명은 다음과 같다.

> "클로저는 함수와 그 함수가 선언될 당시의 LexicalEnvironment의 상호관계에 따른 현상"

앞서 배운 실행 컨텍스트의 개념들에 따르면, LexicalEnvironment 의 environmentRecord 와 outerEnvironmentReference 에 의해 변수의 유효범위인 스코프가 결정되고 스코프가 결정되고 스코프체인이 가능해진다.

아래의 코드처럼 외부 함수에서 변수를 선언하고 내부 함수에서 해당 변수를 참조하는 경우에 대해서 위의 개념을 토대로 클로저를 이해해보자.

```js
// 일반적인 상황
var outer = function () {
  var a = 1;
  var inner = function () {
    console.log(++a); // 출력 2
  };
  inner();
};
outer();
```

위의 코드에서 함수가 호출되면서 일어나는 콜스택의 상황을 도식화하면 다음과 같다.

<img src="https://images.velog.io/images/cks3066/post/05556326-b5d2-4d14-a539-a8863fe35ded/IMG_0257.PNG" width="600">

먼저, outer 함수가 호출되면 outer 실행 컨텍스트가 콜스택에 올라오게 될 것이다. 그 후 outer 내부에서 내부 함수인 inner 함수가 호출되면 콜스택에 상단에 올라오게 될 것이다.

inner 함수에서 ++a 명령어를 실행하는 과정에서 environmentRecord 에 a 라는 식별자를 가진 변수가 존재하지 않으니 outerEnvironmentReference 가 참조하고 있는 a 변수에 접근해서 해당 변수의 값을 2로 바꿔준 뒤 출력한다.

그 후 outer 실행 컨텍스트가 종료되면 outer의 LexicalEnvironment 에 저장된 식별자(a, inner) 에 대한 참조가 없기 때문에 모두 GC(Garbage Collector)의 수집대상이 된다.

지금까지 우리가 학습한 내용이며 특별한 현상은 찾아보기 힘들다.

그렇다면, outer 실행 컨텍스트가 종료된 후에도 outer의 LexicalEnvironment 에 저장된 식별자를 참조하고 있도록 임의적으로 조작한다면 어떻게 될까?

아래 코드와 함께 살펴보자.

```js
// 외부 함수의 변수를 참조하는 내부 함수
var outer = function () {
  var a = 1;
  var inner = function () {
    return ++a;
  };
  return inner;
};
var outer2 = outer();
console.log(outer2()); // 출력: 2
console.log(outer2()); // 출력: 3
```

우리는 해당 코드에서 outer2 변수에 outer 함수의 실행 결과를 할당했으며,
이 과정에서 콜스택에 호출되었던 outer 의 실행 컨텍스트는 outer2 변수에 실행 결과를 할당해줌과 동시에 종료될 것이다.

outer2 는 outer 함수의 실행 결과인 inner 함수를 참조하게 될 것이며, 여기에서 outer2 함수의 호출은 즉 inner 함수의 호출을 의미한다.

그런데, inner 함수는 내부 로직에서 스코프 체이닝에 따라 자신의 외부 함수인 outer 의 변수에 접근하고 있지만
코드 상에서 inner 함수가 호출되는 시점에서는 이미 outer 의 실행 컨텍스트가 종료되었다.

그렇다면 inner 가 참조하고 사용하는 값들은 어디에 있는 것일까?

<img src="https://images.velog.io/images/cks3066/post/b2a6b169-b3ae-4cc0-95f3-1cfcbab1bbd7/IMG_0258.PNG" width="600">

해당 코드의 콜스택 과정을 같이 살펴보면, 호출된 outer 함수가 종료되고 콜스택상에서도 사라져야 할 실행 컨텍스트 임에도 불구하고 사라지지않고 공간을 점유하고 있는 부분(노란색 부분)이 보일 것이다.

물론, 함수가 종료되지 않았다는 의미는 아니며 해당 실행 컨텍스트의 LexicalEnvironment 속 식별자 중 어딘가에서 참조받고 있는 변수가 존재한다면 GC의 수집대상에서 제외되고 남아있는다는 의미이다.

위 코드의 경우로 돌아가보면, 내부 함수 inner 에서 외부 함수 outer 의 변수 a 를 참조하고 있고, inner 함수도 다른 변수에 참조되어 언젠가 어딘가에서 다시 호출될 가능성을 가지고 있다.
이는 inner 함수에서 a 대한 참조를 끊지 않고 있다는 것인데, 이 경우 inner 함수가 변수 a 대한 접근이 가능하도록 GC가 수거하지 않고 남아있는다.

이처럼, 함수의 실행 컨텍스트가 종료된 후에도 LexicalEnvironment가 GC의 수집 대상에서 제외되는 경우는 지역변수를 참조하는 내부함수가 외부로 전달된 경우가 유일하다.

> 클로저란 어떤 함수 A에서 선언한 변수 a를 참조하는 내부 함수 B를 외부로 전달한 경우, A의 실행 컨텍스트가 종료된 이후에도 변수 a가 사라지지 않는 현상을 말한다.

#### 클로저에 대한 정의

<img src="https://images.velog.io/images/cks3066/post/5ba11a70-5b05-4102-be53-53a7d127eb9a/IMG_0259.PNG" width="700">

#### return 없이도 클로저가 발생하는 다양한 경우

여기서 한가지 주의할 점이 있는데, `클로저란 어떤 함수 A에서 선언한 변수 a를 참조하는 내부 함수 B를 외부로 전달한 경우,` 에서 `외부로 전달`이 곧 return 만을 의미한다는 것이 아니라는 점이다.

setInterval / setTimeout / eventListener 등이 내부 함수로 동작하고 콜백 함수에서 외부 함수의 지역 변수를 참조한다면 이 또한 클로저이다.

### 클로저와 메모리 관리

클로저는 필요에 의해 의도적으로 함수의 지역변수를 메모리를 소모하도록 함으로써 발생한다. 따라서 '메모리 소모'의 관리법에 대해서도 적용할 수 있어야 한다.

간단하게 설명한다면 `참조 카운트를 0으로 만들면된다.`
해당 식별자들을 참조하고 있는 내부 함수가 남아있어서 GC의 수거대상이 되지 않는다면 이 관계를 끊어주면 될 것이다.

보통 참조를 끊을때는 null 이나 undefined 를 할당한다.
(하지만 기억을 좀 되살려본다면 undefined 의 직접적 사용은 지양하자고했으니 null 을 할당해주는 편이 더 좋을 것이다)

예시로 앞서보았던 코드에 적용해보자면 이런 식일 것이다.

```js
// 외부 함수의 변수를 참조하는 내부 함수
var outer = function () {
  var a = 1;
  var inner = function () {
    return ++a;
  };
  return inner;
};
var outer2 = outer();
console.log(outer2()); // 출력: 2
console.log(outer2()); // 출력: 3
outer2 = null; // 참조 끊기
```

### 클로저 활용 사례

클로저에 대한 개념을 알아보았으니 이 클로저를 어디에서 사용하게 되는지 알아볼 것이다.

여기서 소개할 클로저 활용 사례로는 아래의 4가지가 있다.

1. 콜백 함수 내부에서 외부 데이터를 사용하고자 할 때
2. 접근 권한 제어(정보 은닉)
3. 부분 적용 함수(Partially Applied Function)
4. 커링 함수(Currying function)

#### 콜백 함수 내부에서 외부 데이터를 사용하고자 할 때

콜백 함수 내부에서 외부에 선언된 데이터를 사용하는 경우를 한번 살펴보겠다.

여러 과일의 이름을 요소로 가지고 있는 fruit 배열이 있고 어떤 DOM 엘리먼트를 클릭하였을때마다 그 과일 이름을 배열의 인덱스 순서에 따라 보여주는 함수가 있다고 생각을 해보자.

```js
var fruits = ['apple', 'banana', 'peach']; // 과일의 이름을 가지고 있는 배열
var $ul = document.createElement('ul'); // 과일 이름의 배열 list 를 가질 list 컨테이너

var alertFruit = function (fruit) {
  // 엘리먼트 클릭 시 해당 과일의 이름을 보여주는 함수
  alert('your choice is ' + fruit);
};

fruits.forEach(function (fruit) {
  var $li = document.createElement('li'); // ul 엘리먼트 안에 들어갈 과일 이름을 가진 li 엘리먼트
  $li.innerText = fruit; // 엘리먼트의 과일 이름 부여
  $li.addEventListener('click', alertFruit); // 과일 이름을 가진 li 엘리먼트에 alertFruit 함수를 이벤트 핸들러로 하는 click 이벤트 등록
  $ul.appenChild($li); // ul 엘리먼트에 li 엘리먼트 추가
});

document.body.apeendChild($ul); // ul 엘리먼트 body에 추가
```

위의 코드에서 생성된 과일 이름을 가진 li 엘리먼트를 클릭한다고 한다면, 어떤 값이 출력될 것 같은가?
우리가 원하는 출력값은 'apple', 'banana', 'peach' 등의 값이 겠지만, 실제 출력 값은 [object MouseEvent] 이다.

alertFruit 함수의 매개변수에 그저 클릭 이벤트가 인자로 전달된 것인데, 이는 addEventListenr는 콜백함수로 이용되는 함수의 첫번째 인자로 발생하는 event 를 전달한다는 특성과 연관이 있다. 첫번째 인자로 이벤트를 보내주니, 당연히 그 이벤트가 출력되는 것이다.

그렇다면 어떤 식으로 우리가 fruits 배열의 요소들을 인자로 콜백함수에 보내줄 수 있을까?

우리는 여기에서 bind 메서드를 이용할 수 도 있을 것이다.

```js
var fruits = ['apple', 'banana', 'peach'];
...
fruits.forEach(function(fruit) {
  ...

  $li.addEventListener('click', alertFruit.bind(null, fruit));

  ...
});
```

위와 같이 명시적으로 fruit 를 첫번째 인자로 보내준다면, 우리가 원하는 fruit 가 출력되는 모습을 볼 수 있다. 하지만 이렇게 하면 이벤트 객체가 인자로 넘어오는 순서가 바뀌는 점 및 함수 내부에서의 this가 원래의 this가 원래의 값과 달라지는 점은 감안해야 한다.

그렇다면 여기서 클로저를 사용해볼 수 있지 않을까? 그 방법은 고차 함수를 활용하는 것으로, 함수형 프로그래밍에서 자주 쓰이는 방식이다.

```js
var fruits = ['apple', 'banana', 'peach'];
...
var alertFruitBuilder = function (fruit) {
  return function () {
  	alert('your choice is ' + fruit);
  }
}

fruits.forEach(function(fruit) {
  var $li = document.createElement('li');
  $li.innerText = fruit;
  $li.addEventListener('click', alertFruitBuilder(fruit));
  $ul.appenChild($li);
});

```

위의 코드에서는 외부 함수의 변수를 참조하는 내부 함수를 반환하는 클로저를 이용하였는데, 이때 alertFruitBuilder 가 콜백함수로 실행되면 다시 함수가 되어, 리스너에 반환된 함수를 콜백 함수로 반환할 것이다. 이때 인자로 넘어온 fruit에 참조할 수 있게 되는 것이다.

#### 접근 권한 제어(정보 은닉)

정보 은닉은 어떤 모듈의 내부 로직에 대해 외부로의 노출을 최소화해서 모듈간의 결합도를 낮추고 유연성을 높이고자 하는 현대 프로그래밍 언어의 중요한 개념 중 하나이다.

본 책에는 클로저를 이용한 객체 선언으로 정보 은닉에 대해 잘 설명하고 있지만, 사실 class 내부에서도 private 을 선언할 수 있는 현재의 JS 문법에서 이런식의 사용이 필요할까 하는 생각이 있다.
따라서, 책에서 설명하는 예시를 간략하게만 보고 넘어가도록 하겠다.

```js
var createCar = function () {
  var fuel = Math.ceil(Math.random() * 10 + 10);	// 연료(L)
  var power = Math.ceil(Math.random() * 3 + 2);		// 연비 (km / L)
  var moved = 0;									// 총 이동거리
  return {
  	get moved () {
	  return moved;
    },
    run : function () {
      // 자동차 동작 방식
      ...
      // fuel 변수와 power 변수가 사용됨
    }
  };
};
var car = createCar();
```

createCar 은 객체를 생성하는 함수이며, 이제는 한 눈에 보이겠지만 반환하는 객체의 내부 메서드들에서 외부 변수를 사용하는 클로저이다. moved 메서드를 이용하여 moved 변수에 직접적으로 접근할 수 있는 방법을 제공하고 있고, fuel 과 power 변수는 run 메서드 내부에서만 사용될 뿐 직접적으로 접근할 수 있는 방법은 전혀 없으며, 이것을 접근 권한 제어(정보 은닉) 이라고 한다.

사실, run 메서드로 보호가 되지 않는 상황으로 다른 함수로 해당 메서드를 덮어쓸 수 있는데 이때는 `Object.freeze` 메서드들 이용할 수 있다.

```js
var createCar = function () {
  var fuel = Math.ceil(Math.random() * 10 + 10);	// 연료(L)
  var power = Math.ceil(Math.random() * 3 + 2);		// 연비 (km / L)
  var moved = 0;									// 총 이동거리
  var publicMembers =   	{
    get moved () {
	  return moved;
    },
    run : function () {
      // 자동차 동작 방식
      ...
      // fuel 변수와 power 변수가 사용됨
    }
  };
  Object.freeze(publicMembers)
  return publicMembers;
};
```

위와 같이 사용할 수 있다.

#### 부분 적용 함수(Partially Applied Function)

부분 적용 함수란 n개의 인자를 받는 함수에 미리 m개의 인자만 넘겨 기억했다가, 나중에 (n-m)개의 인자를 넘기면 비로소 원래 함수의 실행 결과를 얻을 수 있게끔 하는 함수이다.

해당 부분은 대표적인 예시인 디바우스만 보고 지나가도록 하겠다.

```js
var debounce = function (evnetName, func, wait) {
  var timeoutId = null;
  return function (event) {
  	var self = this;
    console.log(eventName, 'event 발생');
    clearTimeout(timeoutId);
    timeoutId = setItmeout(func.bind(self, event), wait);
  };
}
var moveHandler = function (e) {
  console.log('move event 처리'
}

document.body.addEventListener('mousemove' debounce('move', moveHandler, 500));
```

디바운스는 같은 이벤트들이 반복해서 발생할때마다 clearTimeout 함수로 대기열을 초기화해주고 반복하는 이벤트가 더이상 실행되지 않을때에야 비로소 이벤트가 발생하도록 해주는 이벤트 최적화의 방법 중 하나이다.
이 debounce 함수는 부분 적용 함수이며, eventName, func, wait 가 이미 전달된 상황에서 event 가 인자로 전달될 때야 비로소 함수가 실행되는 형태로 볼 수 있다.

#### 커링 함수(Currying function)

커링 함수란 여러 개의 인자를 받는 함수를 하나의 인자만 받는 함수로 나눠서 순차적으로 호출될 수 있게 체인 형태로 구성한 것을 말합니다. 부분 함수와 기본적인 맥락은 비슷하지만 커링은 한 번에 하나의 인자만 전달하는 것을 원칙으로 한다. 따라서 마지막 인자가 전달되기 전까지는 원본 함수가 실행 되지 않는다.

커링 함수의 예시를 한번 살표보자.

```js
var curryThree = function (func) {
  return function (a) {
    return function (b) {
      return func(a, b);
    };
  };
};
var getMaxWidth10 = curryThree(Math.max)(10);
console.log(getMaxWidth10(8)); // 출력: 10
```

위는 3개의 인자를 받는 커링함수이다. func 에 Math.max 가 인자로 전달되었으며, a 에 10, b 에 8이 전달되고 마지막 인자인 8이 전달되자 비로소 둘 중 큰 값인 10이 출력된 것이다.

필요한 인자 개수만큼 리턴해주다가 마지막에 리턴해주는 방식을 취하는데 함수형 프로그매잉에서는 이를 지연 실행이라고 한다.
하지만 위와 같은 형태는 가독성이 떨어진다는 단점이 있는데,

```js
var curryThree = func => a > b => func(a, b);
```

위와 같이 화살표 함수를 이용하면 좀 더 가독성이 좋게 커링 함수를 이용할 수 있다.

REST API를 이용한 HTTP 요청같은 경우 커링을 이용하기 아주 수월한데,

```js
var getInformation = (baseUrl) => (path) => (id) =>
  fetch(baseUrl + path + '/' + id);
```

위 커링 함수의 동작방식을 생각한다면 baseUrl 을 담아두고 각기 다른 path 를 담아두어 사용할 수도 있고, baseUrl 과 path 를 담아두고 각기 다른 id 를 담아 호출할 수 있는 방법으로 유용하게 사용할 수 도 있을 것이다.

여러 프레임워크나 라이브러리에서 커링을 상당히 광범위 하게 사용하고 있다. 대표적으로 Flux 아키텍처의 구현체 중 하나인 Redux 의 미들웨어 Logger, thunk 의 구조가 커링 함수로 이루어져있다.

```js
// Redux Middleware 'Logger'
const logger = store -> next => action => {
  console.log('dispatching', action);
  console.log('next state', store.getState());
  return next(action);
}
// Redux Middleware 'thunk'
const thunk = store -> next => action => {
  return typeof action === 'function'
  	? action(dispatch, store.getState)
  	: next(action);
};
```

자세한 설명은 해당 미들웨어를 사용하게 된다면 알게 되겠지만 마지막 매개변수인 action이 인자로 들어오는 순간 반환된 함수가 의도한 행동을 취한다 정도로 생각하고 넘어가고 될 것이다.
