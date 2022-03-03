## 25장. 클래스

자바스크립트는 `프로토타입 기반 객체지향 언어`이다.
프로토타입 기반 객체지향 언어는 `클래스가 필요 없는` 객체지향 프로그래밍 언어다.
`ES5`에서는 클래스 없이도 다음과 같이 `생성자함수` 와 `프로토타입` 을 통해 객체지향 언어의 `상속` 을 구현할 수도 있다.

```jsx
// ES5 생성자 함수
const Person = (function () {
  //생성자 함수
  function Person(name) {
    this.name = name;
  }

  // 프로토타입 메서드
  Person.prototype.sayHi = function () {
    console.log("Hi! My name is " + this.name);
  };

  // 생성자 함수 반환
  return Person;
})();

//인스턴스 생성
const me = new Person("Marco");
me.sayHi(); //"Hi! My name is Marco"
```

`ES6` 에서 도입된 클래스는 사실 함수이며 기존 프로토타입 기반 패턴을 클래스 기반 패턴처럼 사용할 수 있도록 하는 `문법적 설탕` 이라고 볼 수도 있으나, 클래스의 extends와 super 키워드는 상속 관계 구현을 더욱 간결하고 명료하게 하므로 `새로운 객체 생성 메커니즘`으로 보는 것이 좀 더 합당하다.

- 클래스는 생성자 함수보다 엄격하며 생성자 함수에서는 제공하지 않는 기능도 제공한다.
  - 클래스를 new 연산자 없이 호출하면 에러가 발생한다. 하지만 생성자 함수를 new 연산자 없이 호출하면 일반 함수로서 호출된다.
  - 클래스는 상속을 지원하는 extends와 super 키워드를 제공한다. 하지만 생성자 함수는 extends와 super키워드를 지원하지 않는다.
  - 클래스는 호이스팅이 발생하지 않는 것처럼 동작한다. 하지만 함수 선언문으로 정의된 생성자 함수는 함수 호이스팅이 발생하고, 함수 표현식으로 정의한 생성자 함수는 변수 호이스팅이 발생한다.
  - 클래스 내의 모든 코드에는 암묵적으로 strict mode가 지정되어 실행되며 strict mode를 해제할 수 없다. 하지만 생성자 함수는 암묵적으로 strict mode가 지정되지 않는다.
  - 클래스의 constructor, 프로토타입 메서드, 정적 메서드는 모두 프로퍼티 어트리뷰트 [[Enumerable]]의 값이 false다. 다시 말해, 열거되지 안흔ㄴ다.
- 클래스 정의 : class 키워드 사용, 파스칼 케이스 사용(첫글자 대문자), 일급 객체(표현식으로 정의 가능, 값으로 사용 가능)

  - 클래스 몸체에 정의할 수 있는 메서드는 constructor(생성자), 프로토타입 메서드, 정적 메서드의 세 가지가 있다.

  ```jsx
  //클래스 선언문
  class Person {
    //생성자
    constructor(name) {
      //인스턴스 생성 및 초기화
      this.name = name;
    }

    //프로토타입 메서드
    sayName() {
      console.log(`Hi! My name is ${this.name}`);
    }

    //정적 메서드
    static sayHello() {
      console.log("Hello!");
    }
  }

  //인스턴스 생성
  const me = new Person("Marco");

  //인스턴스의 프로토타입 참조
  console.log(me.name); //"Marco"

  //프로토타입 메서드 호출
  me.sayName(); //"Hi! My name is Marco"
  me.sayHello(); //"TypeError: me.sayHello is not a function

  //정적 메서드 호출
  Person.sayHello(); //"Hello!"
  ```

- 클래스 호이스팅
  - 클래스는 let, const 키워드로 선언한 변수처럼 `호이스팅된다`. 클래스 선언문 이전에 일시적 사각지대에 빠지기 때문에 호이스팅이 발생하지 않는 것처럼 동작한다. 사실 var, let, const, function, function\*, class 키워드를 사용하여 선언된 모든 식별자는 호이스팅된다. 모든 선언문은 런타임 이전에 먼저 실행되기 때문이다.
- 인스턴스 생성
  - 클래스는 생성자 함수이며 `new 연산자`와 함께 호출되어 인스턴스를 생성한다.
- 메서드

  - 클래스 몸체에는 0개 이상의 메서드만 선언할 수 있다. 클래스 몸체에서 정의할 수 있는 메서드는 `constructor(생성자)`, `프로토타입 메서드`, `정적 메서드`의 세 가지가 있다.

    - `constructor` : constructor는 인스턴스를 생성하고 초기화하기 위한 특수한 메서드다. constructor는 클래스 내에 최대 한 개만 존재할 수 있고 생략할 수 있다. constructor 내부에서 return 문은 반드시 생략한다.
      - `클래스의 constructor 메서드`와 `프로토타입의 constructor 프로퍼티`는 이름이 같아 혼동하기 쉽지만 `직접적인 관련이 없다`. 프로토타입의 constructor 프로퍼티는 모든 프로토타입이 가지고 있는 프로퍼티이며, 생성자 함수를 가리킨다.
    - `프로토타입 메서드` : 클래스 몸체에서 정의한 메서드는 생성자 함수에 의한 객체 생성 방식(ex, 클래스명.prototype.메서드명 = function() {)과 다르게 클래스의 prototype 프로퍼티에 메서드를 추가하지 않아도(메서드명() { ) 기본적으로 프로토타입 메서드가 된다.
    - `정적(static) 메서드` : 인스턴스를 생성하지 않아도 호출할 수 있는 메서드이다. 클래스에서는 메서드에 static 키워드를 붙이면 정적 메서드(클래스 메서드)가 된다. 정적 메서드는 프로토타입 메서드처럼 인스턴스로 호출하지 않고 클래스로 호출한다.

      - 정적 메서드와 프로토타입 메서드의 차이

        - 정적 메서드와 프로토타입 메서드는 자신이 속해 있는 `프로토타입 체인`이 다르다.
        - 정적 메서드는 클래스로 호출하고 프로토타입 메서드는 인스턴스로 호출한다.
        - 정적 메서드는 인스턴스 프로퍼티를 참조할 수 없지만 프로토타입 메서드는 인스턴스 프로퍼티를 참조할 수 있다.

        ```jsx
        class Square {
          // 정적 메서드
          static area(width, height) {
            return width * height;
          }
        }

        console.log(Square.area(10, 10)); //100
        ```

        ```jsx
        class Square {
          constructor(width, height) {
            this.width = width;
            this.height = height;
          }
          //프로토타입 메서드
          area() {
            return this.width * this.height;
          }
        }

        const square = new Square(10, 10);
        console.log(square.area()); //100
        ```

- 클래스의 인스턴스 생성 과정

  ```jsx
  class Person {
    // 생성자
    constructor(name) {
      //1. 암묵적으로 인스턴스가 생성되고 this에 바인딩된다.
      console.log(this);
      console.log(Object.getPrototypeOf(this) === Person.prototype);

      //2. this에 바인딩되어 있는 인스턴스를 초기화한다.
      this.name = name;

      //3. 완성된 인스턴스가 바인딩된 this로 암묵적으로 반환된다.
    }
  }
  ```

- 상속에 의한 클래스 확장

  - 상속에 의한 클래스 확장은 기존 클래스를 상속받아 새로운 클래스를 확장(extends)하여 정의하는 것이다. 클래스는 상속을 통해 다른 클래스를 확장할 수 있는 문법인 `extends` 키워드가 기본적으로 제공된다.

  ```jsx
  class Animal {
    constructor(age, weight) {
      this.age = age;
      this.weight = weight;
    }

    eat() {
      return "eat";
    }
    move() {
      return "move";
    }
  }

  // 상속을 통해 Animal 클래스를 확장한 Bird 클래스
  class Bird extends Animal {
    fly() {
      return "fly";
    }
  }

  const bird = new Bird(1, 5);
  console.log(bird); //[object Object] { age: 1, weight: 5}
  console.log(bird instanceof Bird); //true
  console.log(bird instanceof Animal); //true
  ```

  - 동적 상속 : extends 키워드는 클래스뿐만 아니라 생성자 함수를 상속받아 클래스를 확장할 수도 있다. 단, extends 키워드 앞에는 반드시 클래스가 와야 한다. extends 키워드 다음에는 클래스뿐만이 아니라 [[Construct]] 내부 메서드를 갖는 함수 객체로 평가될 수 있는 모든 표현식을 사용할 수 있다. 이를 통해 동적으로 상속받을 대상을 결정할 수 있다.

    ```jsx
    function Base1() {}
    class Base2 {}

    let condition = true;

    //조건에 따라 동적으로 상속 대상을 결정하는 서브클래스
    class Derived extends (condition ? Base1 : Base2) {}

    const derived = new Derived();
    console.log(derived);
    console.log(derived instanceof Base1); //true
    console.log(derived instanceof Base2); //false
    ```

  - super 키워드

    - `super를 호출`하면 수퍼클래스의 constructor를 호출한다.

      ```jsx
      class Base {
        constructor(a, b) {
          this.a = a;
          this.b = b;
        }
      }

      class Derived extends Base {
        constructor(a, b, c) {
          super(a, b);
          this.c = c;
        }
      }

      const derived = new Derived(1, 2, 3);
      console.log(derived);
      ```

      - super 호출 시 주의사항
        1. 서브클래스에서 constructor를 생략하지 않는 경우 서브클래스의 constructor에서는 반드시 super을 호출해야 한다.
        2. 서브클래스의 constructor에서 super를 호출하기 전에는 this를 참조할 수 없다.
        3. super는 반드시 서브클래스의 constructor에서만 호출한다. 서브클래스가 아닌 클래스의 constructor나 함수에서 super를 호출하면 에러가 발생한다.

    - `super를 참조`하면 수퍼클래스의 메서드를 호출할 수 있다.

      - 서브클래스의 프로토타입 메서드 내에서 super.sayHi는 수퍼클래스의 프로토타입 메서드 sayHi를 가리킨다.

        ```jsx
        //수퍼 클래스
        class Base {
          constructor(name) {
            this.name = name;
          }
          sayHi() {
            return `Hi! ${this.name}`;
          }
        }

        //서브클래스
        class Derived extends Base {
          sayHi() {
            //super.sayHi는 수퍼클래스의 프로토타입 메서드를 가리킨다.
            return `${super.sayHi()}. how are you doing?`;
          }
        }

        const derived = new Derived("Marco");
        console.log(derived.sayHi()); //"Hi! Marco. how are you doing?"
        ```

[3.2 분량 시작]

## 프로퍼티

### 인스턴스 프로퍼티

- 인스턴스 프로퍼티는 constructor 내부에서 정의해야 한다.
- constructor 내부의 this에는 이미 빈 객체(=인스턴스)가 바인딩되어 있다.
- constructor 내부에서 인스턴스 프로퍼티(=this.이름)를 추가하면, 빈 객체(=인스턴스)에 프로퍼티가 추가되어 인스턴스가 `초기화`된다.
- constructor 내부에서 this에 추가한 프로퍼티는 인스턴스의 프로퍼티가 되며, 인스턴스의 프로퍼티는 언제나 `public`하다.

### 접근자 프로퍼티

- 접근자 프로퍼티는 자체적으로는 값을 갖지 않고, 다른 데이터 프로퍼티의 값을 읽거나 저장할 때 사용하는 `접근자 함수(getter함수, setter함수)`로 구성된 프로퍼티다.
  - getter는 인스턴스 프로퍼티에 접근할 때 사용한다.
  - setter는 인스턴스 프로퍼티에 값을 할당할 때 사용한다.
    - setter는 단 하나의 값만 할당받기 때문에 단 하나의 매개변수만 선언할 수 있다.

```jsx
class Person {
  constructor(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  set fullName(name) {
    // setter는 매개변수를 하나만 받을 수 있다.
    [this.firstName, this.lastName] = name.split("");
  }
}
```

- 클래스의 메서드는 기본적으로 프로토타입 메서드가 된다. 클래스 내부의 접근자 프로퍼티도 마찬가지로 프로토타입의 프로퍼티다.

- setter 및 getter 메서드를 사용해서 클래스 내에 값을 설정하거나 가져올 수 있다.

```
class Person {
  constructor(name) {
    this.name = name;
  }
  set nicknameFunc(value) {
    this.nickname = value;
    console.log("Set complete");
  }
  get nicknameFunc() {
    console.log(`Your nickname is ${this.nickname}`);
  }
}

const marco = new Person("Marco");
marco.nicknameFunc = "Porco";
marco.nicknameFunc;
```

### private 프로퍼티

- ES2019`에서 해시 `#`prefix가 추가되어`private class 필드`를 선언할 수 있게 되었다.
  - https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Classes/Private_class_fields
  - `private class 필드`를 `접근자 프로퍼티`와 함께 사용할 수 있다.
- `private 필드`는 클래스 내부에서만 참조할 수 있다. 접근자 프로퍼티를 통해 간접적으로 접근하는 방법만 유효하다.
- `private 필드`는 반드시 클래스 몸체에 정의해야 한다(constructor 내부 아님). `private 필드`를 constructor에 정의하면 에러가 난다.
- static private 필드도 가능하다. `static #num = 10`

클래스는 일차적으로 자바스크립트의 기존 `프로토타입 기반 상속`에 대한 문법적 설탕(Syntax Sugar)이다. 클래스 문법이 자바스크립트에 새로운 객체 지향 상속 모델을 도입하는 것은 아니다.

## 클래스 생성

- 클래스에 접근하기 전에 클래스를 선언하지 않으면 ReferenceError가 발생한다.

  - 클래스를 만드는 방법 2가지

    1. 클래스 선언

       ```jsx
       class Person {}
       ```

    2. 클래스 표현식

       ```jsx
       cont person = class Person  {
       }
       ```

- 생성자 메서드를 추가한 것을 제외하면 프로토타입 방식과 큰 차이가 없다. 생성자는 하나만 추가해야 한다.

  - 기존의 프로토타입 방식

    - 프로토타입은 하나의 객체이며, 사용자가 생성한 모든 함수는 새로운 빈 객체를 가리키는 `prototype 프로퍼티`를 가진다. 프로토타입 객체는 객체 리터럴이나 Object() 생성자로 만든 객체와 거의 비슷하다.

    ```jsx
    function Person(name, age) {
      this.name = name;
      this.age = age;
    }

    Person.prototype.greet = function () {
      console.log(`Hi, my name is ${this.name} and I'm ${this.age} years old`);
    };

    const marco = new Person("Marco", 100);
    marco.greet();
    //Hi, my name is Marco and I'm 100 years old
    ```

  - 클래스 방식(프로토타입 방식과 동일하게 작동한다)

    ```jsx
    class Person {
      constructor(name, age) {
        this.name = name;
        this.age = age;
      }
      greet() {
        console.log(
          `Hi, my name is ${this.name} and I'm ${this.age} years old`
        );
      }
    }

    const marco = new Person("Marco", 100);
    marco.greet();
    //Hi, my name is Marco and I'm 100 years old
    ```

### (클래스를 마치며 심화) new 바인딩

- 자바스크립트에서 new는 의미상 클래스 지향적인 기능과 아무 상관이 없다.
- 자바스크립트에서 '생성자'는 앞에 new 연산자가 있을 때 호출되는 일반 함수에 불과하다.
  - 클래스에 붙은 것도 아니고 클래스 인스턴스화 기능도 없다.
  - 심지어 특별한 형태의 함수도 아니다.
  - 단지 new를 사용하여 호출할 때 자동으로 붙들려 실행되는 평범한 함수다.
- 함수 앞에 new를 붙여 생성자 호출을 하면 다음과 같은 일들이 저절로 일어난다.
  1. 새 객체가 툭 만들어진다.
  2. 새로 생성된 객체의 [[prototpye]]이 연결된다.
  3. 새로 생성된 객체는 해당 함수 호출 시 this로 바인딩된다.
  4. 이 함수가 자신의 또 다른 객체를 반환하지 않는 한 new와 함께 호출된 함수는 자동으로 새로 생성된 객체를 반환한다.
  ```jsx
  function foo(a) {
    this.a = a;
  }
  const bar = new foo(2);
  console.log(bar.a);
  ```
  - 앞에 new를 붙여 foo()를 호출했고 새로 생성된 객체는 foo 호출 시 this에 바인딩된다. 따라서 결국 new는 함수 호출 시 this를 새 객체와 바인딩 하는 방법이며 이것이 'new 바인딩'이다.
