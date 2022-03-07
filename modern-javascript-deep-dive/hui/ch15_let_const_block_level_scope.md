## var 키워드로 선언한 변수의 문제점

ES5까지는 var 키워드가 유일한 변수 선언 방법이었다. 그리고 여기에는 많은 문제가 있었다.

1.변수 중복 선언 허용

var 변수는 중복 선언이 가능하다.

```jsx
var x = 1;
var y = 1;

var x = 100;
var y;
console.log(x); //100
console.log(y); //1
```

위 예제의 var x, y는 중복 선언 되었다. 이처럼 var 키워드로 중복선언이 되면, 초기화 문의 유무에 따라 동작이 달라진다. 초기화문이 있는 변수 선언문은 var 키워드가 없는 것 처럼 동작하고, 초기화문이 없는 변수 선언문은 무시된다. 이때 에러는 발생하지 않는다. 이를 코드로 옮기면 다음과 같다.

```jsx
var x = 1;
var y = 1;

x = 100;
//초기화문이 없기 때문에 var y;는 무시 됨
console.log(x); // 100
console.log(y); // 1
```

1. 함수 레벨 스코프

   var 키워드로 선언한 변수는 오로지 함수의 코드 블록만을 지역 스코프로 인정한다. 따라서 함수 외부에서 var 키워드로 선언한 변수는 코드 블록 내에서 선언해도 모두 전역 변수가 된다.

   ```jsx
   var x = 1;
   if (true) {
     var x = 10;
     //위 코드는 초기화문이 있기 때문에 다음과 같다.
     // x = 10;
   }
   console.log(x); // 10
   ```

2. 변수 호이스팅

   var 키워드로 변수를 선언하면 호이스팅이 일어나, 변수 선언문 이전에도 참조할 수 있다. 단, 할당문 이전에 변수를 참조하면 언제나 undefined를 반환한다.

## let 키워드

이러한 var의 문제점을 보완하기 위해 ES6에서 let과 const 키워드를 도입했다. 우선 let에 대해 살펴보자.

1. 변수 중복 선언 금지

   let은 var와 다르게 변수 중복 선언이 안된다. 만약 let 키워드로 이름이 같은 변수를 중복 선언하면 SyntaxError가 발생한다.

   ```jsx
   var foo = 456;
   let bar = 123;
   let bar = 456; // SyntaxError, bar has already been declared
   ```

2. 블록 레벨 스코프

   var와는 다르게 let은 모든 코드 블록을 지역 스코프로 인정하는 블록 레벨 스코프를 따른다.

   ```jsx
   let foo = 1; // 전역 변수
   {
     let foo = 2; //지역 변수
     let bar = 3; //지역 변수
   }
   console.log(foo); //1
   console.log(bar); //ReferenceError
   ```

3. 변수 호이스팅

   var 키워드로 선언한 변수와 달리 let 키워드로 선언한 변수는 변수 호이스팅이 발생하지 않는 것처럼 동작한다.

   ```jsx
   console.log(foo); //ReferenceError
   let foo;
   ```

   var 키워드로 선언한 변수는 런타임 이전에 자바스크립트 엔진에 의해 암묵적으로 `선언 단계`와 `초기화 단계` 가 한번에 진행된다. 즉 선언 단계에서 스코프에 변수 식별자를 등록하고, 바로 undefined로 변수를 초기화한다. 때문에 변수 할당문 이전에도 참조할 수 있었던 것이다.

   그러나 let 키워드 변수는 선언 단계와 초기화 단계가 분리되어 진행된다. 선언 단계가 먼저 실행이 되고, 이후 런타임에 `변수 선언문` (**변수 할당문 아님**)에 도달했을 때 초기화 단계가 실행된다.

   let 변수는 스코프의 시작 지점부터 초기화 단계 시작 지점(변수 선언문)까지 변수를 참조할 수 없다. 이 구간은 `일시적 사각지대(TDZ)`라고 부른다.

   ```jsx
   console.log(foo); // Reference Error;

   let foo;
   console.log(foo); // undefined

   foo = 1;
   console.log(foo); // 1
   ```

   결국 let은 변수 호이스팅이 발생하지 않는 것 처럼 보이지만, 그렇지 않다.

   ```jsx
   let foo = 1; //전역 변수
   {
     console.log(foo); //ReferenceError
     let foo = 2; // 지역 변수
   }
   ```

   let 키워드로 선언한 변수의 경우 변수 호이스팅이 발생하지 않는다면 위 예제는 전역 변수 foo의 값을 출력해야 한다. 하지만 let 키워드로 선언한 변수가 호이스팅이 발생하기 때문에 ReferenceError가 발생했다.

   자바스크립트는 ES6에서 도입된 let, const를 포함해 모든 선언을 호이스팅한다. 단 let, const, class를 사용한 선언문은 호이스팅이 발생하지 않는 것 처럼 동작한다.

   1. 전역 객체와 let

      var로 선언한 전역 변수와 전역 함수, 그리고 키워드가 없는 암묵적 전역은 전역 객체 window의 프로퍼티가 된다. 전역 객체의 프로퍼티를 참조할 때 window를 생략할 수 있다.

      ```jsx
      var x = 1;
      y = 2;
      function foo() {}

      console.log(window.x); //1
      console.log(window.y); // 2
      console.log(window.foo); //function foo(){}

      let z = 1;
      console.log(window.z); //undefined
      console.log(z); //1
      ```

      그러나 let 프로퍼티는 그렇지 않다. 즉 window.z와 같이 접근할 수 없다.

   ### const 키워드

   const 키워드는 상수를 선언하기 위해 사용한다. 하지만 반드시 상수만을 위해 사용하지는 않는다. 이에 대해서는 또~~ 나중에 알아보기로 한다.

   const 키워드의 특징은 let 키워드와 대부분 동일하므로 다른 점을 중심으로 살펴보자.

   1. 선언과 초기화

      ```jsx
      //안됨
      const foo; //SyntaxError
      foo = 1;

      //선언과 동시에 초기화
      const foo = 1;
      ```

      const 키워드로 선언한 변수는 반드시 선언과 동시에 초기화해야 한다.

      const 키워드로 선언한 변수는 let 키워드로 선언한 변수와 마찬가지로 블록 레벨 스코프를 가지며, 변수 호이스팅이 발생하지 않는 것처럼 동작한다.

   2. 재할당 금지

      const 키워드로 선언한 변수는 재할당이 금지된다.

   3. 상수

      변수의 상대 개념인 상수는 `재할당이 금지된 변수`를 말한다. 상수도 값을 저장하기 위한 메모리 공간이 필요하므로 변수라고 할 수 있다. 단 상수는 변수와 다르게 재할당이 금지된다.

      상수는 상태 유지와 가독성, 유지보수의 편의를 위해 적극적으로 사용해야 한다.

      ```jsx
      // 세전 가격
      let preTaxPrice = 100;

      // 세후 가격
      let afterTaxPrice = preTaxPrice + preTaxPrice * 0.1;
      console.log(afterTaxPrice); // 110;

      // 0.1이 어떤 의미인지 알기 어려워 코드 이해가 쉽지 않다.
      //-----------------------
      const TAX_RATE = 0.1;
      let preTaxPrice = 100;

      // 세후 가격
      let afterTaxPrice = preTaxPrice + preTaxPrice * TAX_RATE;
      console.log(afterTaxPrice); // 110;

      //세율임을 나타냈기 때문에 가독성이 좋아졌다.
      ```

   4. const 키워드와 객체

      **const 키워드로 선언된 변수에 객체를 할당한 경우 값을 변경할 수 있다**. 변경 불가능한 값인 원시 값은 재할당 없이 변경(교체)할 수 있는 방법이 없지만, 변**경 가능한 값인 객체는 재할당 없이도 직접 변경이 가능**하기 때문이다.

      ```jsx
      const person = {
        name: 'Lee',
      };

      person.name = 'Kim';

      console.log(person); // {name:'Kim'}
      ```

      const 키워드는 재할당을 금지할 뿐 불변을 의미하지는 않는다. 다시 말해 프로퍼티 동적 생성, 삭제, 프로퍼티 값의 변경을 통해 객체를 변경하는 것은 가능하다. 이 때 객체가 변경되더라도 변수에 할당된 참조 값은 변경되지 않는다.

### var vs let vs const

변수 선언에는 기본적으로 const를 사용하고 let은 재할당이 필요한 경우에 한정해 사용하는 것이 좋다. ES6를 사용한다면 var는 사용하지 않는다. let을 사용하게 되면 최대한 스코프를 좁게 한다. 변수를 선언할 때는 일단 const를 사용하자. 반드시 재할당이 필요하다면 그때 let 키워드로 변경해도 결코 늦지 않다.
