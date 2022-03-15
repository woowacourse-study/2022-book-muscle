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
