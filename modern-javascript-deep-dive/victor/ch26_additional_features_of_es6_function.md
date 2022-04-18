## 모던 자바스크립트 Deep Dive - Ch26 ES6 함수의 추가 기능

💡 일반 함수 호출과 생성자 함수 호출(17.2.4 절에 자세히 설명돼 있다.)
- 일반 함수로 호출할 수 있다. => callable
- 생성자 함수로 호출할 수 있다. => constructor
    - 생성자 함수로 호출할 수 있다 === new 연산자와 함께 호출할 수 있다.
- 생성자 함수로 호출할 수 없다. => non-constructor


### 함수의 구분
- ES6 이전의 모든 함수들은 일반 함수로 호출할 수 있었으며, 생성자 함수로서도 호출이 가능했다.(17.2.4 절에 자세히 설명돼 있다.)
    - 일반 함수로 호출 할 수 있다. => callable
    - 생성자 함수로 호출 할 수 있다. => constructor
        - 생성자 함수로 호출 할 수 있다 === new 연산자와 함께 호출할 수 있다.

```javascript
function test() {}

test(); // 일반 함수로 호출
new test(); // 생성자 함수로 호출
```

- ES6 이전에 객체의 프로퍼티에 바인딩된 함수를 메서드라 불렀는데, 이 메서드도 일반 함수로 호출 가능하며 생성자 함수로도 호출이 가능하다.
```javascript
const testObj = {
    testNum: 1000,
    testFunc: function () {
        return this.testNum;
    }
}

console.log(testObj.testFunc()); // 1000

// 일반 함수로 호출
const normalFunc = testObj.testFunc;
console.log(normalFunc()); // undefined

// 생성자 함수로 호출
console.log(new testObj.testFunc) // testFunc {}
```

- ES6에서는 함수를 사용하는 목적에 따라 크게 세 가지 종류로 구분을 했다.

|ES6 함수의 구분|constructor|prototype|super|arguments|
|:---:|:---:|:---:|:---:|:---:|
|일반 함수|O|O|X|O|
|메서드|X|X|O|O|
|화살표 함수|X|X|X|X|

### 메서드
- ES6부터 메서드는 메서드 축약 표현으로 정의된 함수만을 의미한다.

- 메서드는 constructor가 아니다.
    - 따라서 prototype 프로퍼티가 없고, 프로토타입도 생성하지 않는다.
```javascript
const testObj = {
    foo: function () {
        console.log('이것은 메서드가 아니여~');
    },
    bar() {
        console.log('이것은 메서드!');
    },
}

// 일반 함수로 호출
testObj.foo();
testObj.bar();

// 생성자 함수로 호출 - 메서드는 constructor가 아니다.
new testObj.foo();
new testObj.bar(); // TypeError: testObj.bar is not a constructor
```
- 메서드 내부에서 super 키워드를 사용할 수 있다.
    - 메서드는 자신을 바인딩한 객체를 가리키는 내부 슬록 `[[HomeObject]]`를 갖는다.

### 화살표 함수
- 화살표 함수는 콜백 함수 내부에서 this가 전역 객체를 가리키는 문제를 해결하기 위한 대안으로 유용하다.

- 매개 변수 선언

```javascript
const test1 = (x, y) => x + y; // 매개 변수는 소괄호에 감싸서 전달

const test2 = x => x + 10; // 매개 변수가 하나라면 소괄호 생략 가능

const test3 = () => 100; // 매개 변수가 없으면 소괄호 생력 불가
```

- [즉시 실행 함수(IIFE, Immediately Invoked Function Expression)](https://developer.mozilla.org/ko/docs/Glossary/IIFE)로 실행 가능하다.

```javascript
// 즉시 실행 함수로 실행
const result = ((num) => num + 100)(200);

console.log(result) // 300
```

### 화살표 함수와 일반 함수의 차이
1. 화살표 함수는 non-constructor 이다.
    - 따라서 화살표 함수로는 인스턴스를 생성할 수 없다.

```javascript
const foo = () => {
    console.log('과연 생성자 함수로 호출할 수 있을까?');
}

new foo(); // TypeError: foo is not a constructor
```

2. 중복된 매개변수 이름을 선언할 수 없다.
```javascript
const foo = (num, num) => num + num; // SyntaxError: Duplicate parameter name not allowed in this context
```

3. 화살표 함수는 함수 자체의 this, arguments, super, new.target 바인딩을 갖지 않는다.
- 따라서 화살표 함수 내부에서 위의 값들을 참조하면, 상위 스코프의 값을 참조하게 된다.

❗️ [new.target](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/new.target)은 함수 또는 생성자가 new 연산자로 호출됐는지를 감지할 수 있다.

```javascript
function foo() {
    if (!new.target) {
        console.log('생성자 함수로 호출되지 않았다.');
    }

    console.log(`성자 함수로 호출됐다. ${new.target}`);
}

foo(); // 생성자 함수로 호출되지 않았다.
new foo(); // 성자 함수로 호출됐다. function foo () { ... }
```

4. 화살표 함수의 this
- 화살표 함수는 this 바인딩을 갖지 않는다.
- 따라서 화살표 함수 내부에서 this를 참조하면 상위 스코프의 this를 참조한다.
    - 이를 lexical this라고 한다.
    - 즉, 화살표 함수의 this는 렉시컬 스코프처럼 **함수가 정의된 위치에 의해 결정이 된다.**
️
```javascript
// 화살표 함수의 this는 상위 스코프의 this를 가리킨다.
const testObj = {
    num: 1,
    // 화살표 함수 내의 this는 전역 객체를 가리킨다.
    test: () => { console.log(this.num) }
};

testObj.test(); // undefined
```

5. 화살표 함수는 this 바인딩이 없으므로, `call, apply, bind` 메서드로 화살표 함수 내부의 this를 교체할 수 없다.

6. 클래스 필드에 할당한 화살표 함수 내의 this
- 모든 클래스 필드는 인스턴스 프로퍼티가 된다.
    - 해당 내용은 25.7.3 절에 자세히 설명되어 있다.

- 화살표 함수의 상위 스코프는 클래스 외부(= 전역 스코프)이지만, this 참조가 원활하게 진행된다.

```javascript
class Test {
    num = 100;

    printNum = () => { 
        console.log(this.num);
    }
}

const test = new Test();
test.printNum(); // 100
```

- 이런 현상의 이유는 클래스 필드에 할당한 화살표 함수 내부에서 참조한 this는 constructor 내부의 this 바인딩과 같기 때문이다.
    - constructor 내부의 this 바인딩은 클래스가 생성한 인스턴스를 가리킨다.
- 즉, 위 예시코드는 아래의 예시 코드와 동일하게 동작된다,

```javascript
class Test {
    constructor() {
        this.num = 100;
        this.printNum = () => {
            console.log(this.num);
        }
    }
}

const test = new Test();
test.printNum(); // 100
```

❗️클래스 내부의 모든 코드에는 strict mode가 적용이 된다. strict mode가 적용됐을 때, 일반 함수의 this를 참조하면 전역 객체가 아니고 undefined가 반환된다.
