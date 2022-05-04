## 01 프로토타입의 개념 이해

자바스크립트는 프로토타입 기반 언어이다. 클래스 기반 언어에서는 '상속'을 사용하지만 프로토타입 기반 언어에서는 어떤 객체를 원형(Prototype)으로 삼고 이를 복제(참조)함으로써 상속과 비슷한 효과를 얻는다.

흔히 프로토타입을 이해하기위해 사용되는 도식이 있는데 아래 코드를 바탕으로 살펴보겠다.

```js
const instacne = new Constructor();
```

<img src="https://images.velog.io/images/cks3066/post/cb664965-859f-45ab-8c1b-eb405a3f875e/%E1%84%89%E1%85%A5%E1%84%8C%E1%85%A1%E1%86%AB.png" width="500">

위의 도식을 살펴본다면, 아래와 같은 특징이 있을 것이다.

- 윗변(실선)의 왼쪽 꼭짓점에는 `Constructor(생성자 함수)`
- 오른쪽 꼭짓점에는 `Constructor.prototype` 이라는 프로퍼티
- 왼쪽 꼭짓점으로 부터 아래를 향한 화살표 중간에 `new` , 종점에 `instance`
- 오른쪽 꼭짓점으로부터 대각선 아래로 향하는 화살표 종점에는 `instance.__proto__`

위의 도식의 특징을 살펴보았다면, 흐름을 한번 살펴보겠다.

- 어떤 Constructor를 new 연산자와 함께 호출한다.
- Constructor에서 정의된 내용을 바탕으로 새로운 인스턴스가 생성된다.
- 이때 instance에는 `__proto__`라는 프로퍼티가 자동으로 부여된다.
- 이 프로퍼티는 Constructor의 `prototype`이라는 프로퍼티를 참조한다.

특징과 설명에서 등장하는 `prototype`와 `__proto__`라는 프로퍼티는 프로토타입 개념의 핵심이라고 할 수 있다.
이 둘은 모두 객체로 되어있으며, `prototype` 객체 내부에는 인스턴스가 사용할 메서드를 저장한다.
`__proto__`는 이 `protoype`을 참조하며 이 메서드를에 접근할 수 있게 하는 역할을 한다.
(`__proto__` 는 더블 언어의 줄임말인 dunder proto 라고 읽는다.)

그렇다면, 예제를 통해 프로토타입에 좀 더 익숙해보자.

```js
const Constructor = function (someThing) {
  this.someThing = someThing;
}; // prototype 생성

const instance = new Constructor('someThing'); // __proto__ 부여
```

위의 코드에서는 Constructor 라는 생성자 함수가 있다. 코드 평가 과정에서 이 Constructor 생성자 함수가 생성될 때 프로토타입도 같이 생성된다. Constructor 생성자 함수는 new 연산자를 만나면 인스턴스를 생성하는데, 이 인스턴스에는 자동으로 `__proto__`(dunder proto)가 부여되며 이 dunder proto 는 Constructor의 프로토타입을 참조하고있다.

### `__proto__`

`__proto__` 를 앞으로 dunder proto라 지칭하겠다. 이 dunder proto에 대해 감을 잡기위해 하나의 예시를 더 살펴보기로 하자.

```js
const Person = function (name) {
  this.name = name;
};

Person.prototype.getName = function () {
  return '프로토타입 메서드: ' + this.name;
};

const onstar = new Person('onstar');
onstar.__proto__.getName(); // 프로토타입 메서드: undefined
onstar.getName(); // 프로토타입 메서드: onstar
```

위의 코드에서 이상한 점이 있는가? 이상한 점을 느끼지 못했다면 이전 챕터들에 대한 이해가 부족하거나 혹은 이미 자바스크립트적인 시각을 가지고 코드를 해석하고있는 것 일테다.

둘 중 어떤 시각을 가졌든 위의 코드를 다시 살펴보자.

앞선 내용에 따르면 Person 이라는 생성자 함수가 생성되면서, 이에 해당하는 prototype도 동시에 만들어졌을 것이다. 이 프로토타입에는 메서드를 직접 정의해줄 수 있는데 getName을 정의하는 부분이 바로 그러하다. Person의 프로토타입에 this가 가리키는 name 을 반환시키는 메서드를 할당해주었다. 그 후 new 연산자와 함께 생성자를 호출하여 생성된 인스턴스를 onstar 에 할당해주었다. 이 인스턴스는 생성자 함수의 로직에 따라 name 이라는 프로퍼티를 갖고 있게 될 것이다.

그렇다면 `onstar.__proto__.getName();` 이 undefined를 반환하는 이유는 무엇일까?
이 부분은 사실 너무 간단하다. getName 메서드는 this.name를 반환하는데, 이 메서드가 호출될 당시의 this가 name을 가지고있는 onstar 를 가리키고 있지 않기 때문이다.
메서드의 호출시 this 는? `.` 앞의 요소를 가리킬 것이고, 그 값은 dunder proto 이다. dunder proto는 Person.prototype 을 가리키고 그 내부에는 name 이라는 프로퍼티가 없다. 그 결과 undefined 가 반환되는 것이다.

우리는 위 과정을 통해 프로토타입, 인스턴스, dunder proto 의 관계를 조금이나마 살펴봤다.

그러면 `onstar.getName();` 이 onstar 를 반환하는 이유에 대해 설명할 수 있는가?
단순히 this 가 onstar 를 가리키기 때문이라고 생각한다면 좀 더 생각해보아야 할 것이다.
Person 생성자 함수에는 getName 메서드가 존재하지 않는다. 그 뜻은 인스턴스인 onstar 에도 마찬가지로 getName 메서드가 존재하지 않는다는 뜻이다. getName 메서드는 프로토타입에 존재할 뿐 인스턴스에는 존재하지 않는다. 그런데 어떻게 onstar 를 반환했을까?

그 이유는 자바스크립트의 특이성에 있다.
`onstar.getName()` 처럼 쓰인 코드는 `onstar.__proto__.getName.call(onstar)` 처럼 작동할 것이다.

이를 좀 더 프로토타입의 동작방식과 비슷하게 생각하면 `onstar(.__proto__).getName()` 이런 형태일 것인데, 개념상 dunder proto 부분이 생략되는 것에 더 유사할 것이다. 즉, dunder proto 를 생략해도 프로토타입의 메서드에 접근할 수 있게 해주며 이때 this 는 호출주체인 인스턴스를 가리키게 해준다.

이상하다고 느끼는게 당연하다. dunder proto가 생략이 가능하며, 생략을 해도 프로토타입에 있는 메서드나 프로퍼티에 자신의 것처럼 접근하는 것은 우리의 JS 상식에 벗어난다. 이는 자바스크립트의 프로토타입이 이렇게 이용될 것이라고 태초부터 정해져있었기 때문이다. 전체 구조를 설계한 브랜든 아이크의 아이디어로 '그냥 그런가보다' 하면 될 것이다.

### 프로토타입 도식

<img src="https://images.velog.io/images/cks3066/post/cb664965-859f-45ab-8c1b-eb405a3f875e/%E1%84%89%E1%85%A5%E1%84%8C%E1%85%A1%E1%86%AB.png" width="500">

위에서 한번 살펴보았던 도식이다. 이제 어느정도 프로토타입에 대해 이해가 되었다면, 생성사를 호출할 때 이 도식을 통해 다음 문장까지 연결시켜보자.

"new 연산자로 constructor를 호출하면 instance가 만들어지는데, 이 instance의 생략 가능한 프로퍼티인 `__proto__`는 constructor의 prototype을 참조한다!"

### constructor 프로퍼티

생성사 함수의 프로퍼티인 prototype 객체 내부에는 constructor라는 프로퍼티가 있다. 인스턴스의 `__proto__` 객체 내부에도 마찬가지이다. 이 constructor 프로퍼티는 단어 그대로 원래의 생성자 함수(자기 자신)을 참조한다.

이를 통해 다양하게 인스턴스를 생성하는 방법을 예시와 함께 살펴보자.

```js
const Person = function (name) {
  this.name = name;
};

const person1 = new Person('사람1');
const Person1Prototype = Object.getPrototypeOf(person1);
const Person2 = Person1Prototype.constructor('사람2');
const Person3 = Person.prototype.constructor('사람3');
const Person4 = Person1.__proto__.constructor('사람4');
const Person5 = Person1.constructor('사람5');
```

이렇게 생성자 함수 자체를 가리키는 constructor를 통해 생성자 함수에 접근할 수 있고 인스턴스를 생성할 수 있는데, constructor는 일부 예외적 상황을 제외하고는 값을 변경할 수 있다. 그렇기 때문에 생성자 함수에 접근하기 위해 constructor 프로퍼티에 의존하는 것은 항상 안전한 방법은 아니다. 다만 이 가변적인 constructor 프로퍼티 덕분에 클래스 상속을 흉내 내는 것이 가능해진 측면이 있다.

## 02 프로토타입 체인

prototype 객체를 참조하는 dunder proto를 생략하면 인스턴스는 prototype에 정의된 프로퍼티나 메서드를 마치 자신의 것처럼 사용할 수 있다.

```js
const Person = function (name) {
  this.name = name;
};

Person.prototype.getName = function () {
  return '프로토타입 메서드: ' + this.name;
};

const onstar = new Person('onstar');
onstar.__proto__.getName(); // 프로토타입 메서드: undefined
onstar.getName(); // 프로토타입 메서드: onstar
```

dunder proto가 생략되든 안되는 두 메서드 호출 코드는 같은 메서드를 가리킬 것이다.
하지만 onstar의 인스턴스가 자신의 getName 메서드를 가지고 있다면 어떻게될까?

```js
const Person = function (name) {
  this.name = name;
}

Person.prototype.getName = function() {
  return '프로토타입 메서드: ' + this.name;
}

const onstar = new Person('onstar');

onstar.getName = funtion() {
	return '인스턴스 메서드: ' + this.name;
}

onstar.__proto__.getName();		// 프로토타입 메서드: undefined
onstar.getName();				// 인스턴스 메서드: onstar
```

위의 실행결과를 보면 프로토타입의 메서드가 아닌 인스턴스 메서드가 호출된 것을 볼 수있다. 이 현상을 메서드 오버라이드라고 하는데, 자바스크립트 엔진은 호출 주체로부터 가장 가까운 대상인 자신의 메서드나 프로퍼티를 검색하고 그 다음 dunder proto를 검색하는 식으로 동작한다.

이 동작 방식때문에 프로토타입 체인이 가능한데, 그 이전에 짚고 넘어가야할 부분이 있다.
프로토타입은 객체이기때문에 모든 객체의 dunder proto는 Object.prototype과 연결된다는 부분이다. 그렇기때문에 이 Object.prototype 은 항상 접근할 수 있으며 위의 코드에서는 `onstar.__proto__.__proto__`가 바로 그 프로토타입을 가리킬 것이다.

Object.prototype 은 여러 메서드를 기본적으로 가지고있는데 한가지 예로 hasOwnProperty 메서드가 있으며 모든 인스턴스는 이 메서드에 접근할 수 있다.
`onstar.__proto__.__proto__.hasOwnProperty(something)` 과 같은 방식으로 접근해야 할 것인데, 이때도 dunder proto의 생략이 적용된다. 즉, `onstar.hasOwnProperty(something)`의 형태로 호출할 수 있다.

### 객체 전용 메서드의 예외사항

앞의 설명과 같이, 어떤 생성자 함수이든 prototype은 반드시 객체이기 때문에 Object.prototype이 언제나 프로토타입 체인의 최상단에 존재하게 된다. 따라서 객체에서만 사용할 메서드를 Object.prototype에 정의한다면 다른 데이터 타입도 해당 메서드를 사용할 수 있기때문에 이와 같은 방식으로 정의할 수 없다.

```js
Object.prototype.methodforObject = function () {
  console.log('객체 전용 메서드입니다');
};
const fruits = new Array('사과', '바나나');
fruits.methodforObject(); // 출력: 객체 전용 메서드입니다.
```

위와 같이, Object에서 사용할 메서드가 Array타입의 인스턴스에서도 호출이 가능한 것을 확인할 수 있다.

따라서 객체만을 대상으로 동작하는 객체 전용 메서드들은 부득이 Object.prototype이 아닌 생성자 함수인 Object에 스태틱 메서드로 부여할 수 밖에 없다. 생성자 함수 Object와 객체 리터럴 인스턴스 사이에는 this를 통한 연결이 불가능하기 때문에, '메서드명 앞의 대상이 곧 this'가 되는 방식인 this의 사용을 포기하고 대상 인스턴스를 인자로 직접 주입해야 하는 방식으로 구현되어 있다.

즉, `Object.freeze(instance)` 의 호출만 가능할 뿐 `instance.freeze()` 같은 호출은 할 수 없는 것이다. 따라서 Object.prototype 에는 어디서든 활용할 수 있는 범용적인 메서드만 정의되어있다.
