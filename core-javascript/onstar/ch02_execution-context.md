## 01 실행 컨텍스트란?

실행 컨텍스트(execution context)는 실행할 코드를 제공할 환경 정보들을 모아놓은 객체이다.
자바스크립트는 어떤 실행 컨텍스트가 활성화되는 시점에 해당 역할들을 수행한다.

- 선언된 변수를 위로 끌어올린다. (호이스팅)
- 외부 환경 정보를 구성한다. (LexicalEnvironment, VariableEnvironment)
- this 값을 설정한다. (ThisBinding)

<img src="https://images.velog.io/images/cks3066/post/b4d46184-7da6-4d27-98df-f502f72fa6af/IMG_0255.PNG" width="600">

위 그림은 실행 컨텍스트가 쌓이는 콜 스택의 모습이며 하나의 실행 컨텍스트가 가지고 있는 정보들의 내용이며 챕터를 진행하며 좀 더 자세히 알아보도록 한다.

## 02 VariableEnvironment

VariableEnvironment에 담기는 내용은 LexicalEnvironment와 같지만 최초 실행의 스냅샷을 유지한다는 점이 다르다. 실행 컨텍스트를 생성할 때 VariableEnvironment에 정보를 먼저 담은 다음, 이를 그대로 복사해서 LexicalEnvironment를 만들고 이후에는 LexicalEnvironment를 주로 사용하게 된다.(데이터 변경 등)

VaiableEnvironment와 LexicalEnvironment는 environmentRecord(레코드) 와outerEnvironmentReference(아우터)로 구성되어있다.

## 03 LexicalEnvironment

‘어휘적 환경', ‘정적 환경', ‘사전적인 환경' - LexicalEnvironment를 이해하는데 본인에게 편한 해석으로 이해한 뒤, 원어 그대로를 사용하는 것을 추천한다. (VariableEnvironment - ‘변수환경' 도 마찬가지)

### environmentRecord

environmentRecord(레코드) 에는 현재 컨텍스트와 관련된 코드의 식별자 정보들이 저장된다.

현재 컨텍스트 내에서 변수 a, 함수 b 등을 선언했다면 그에 대한 a,b 식별자가 레코드에 저장되는 것이다.

이렇게 실행 컨텍스트가 생성될때 이미 레코드에 식별자가 저장되어있는 현상은 흔히 ‘선언부 끌어올림'으로 알고있는 ‘호이스팅'과도 연관이 있는데, 해당 실행 컨텍스트의 코드들이 실행되기 전부터 선언부에 따라 식별자들을 미리 저장해둔 레코드의 동작을 우리가 흔히 이해하기 쉽도록 선언부를 코드 상단으로 끌어올린다는 개념으로 간주하는 것이다. (자바스크립트 엔진이 실제로 끌어올리지는 않지만 편의성 끌어올린 것으로 간주)

### 함수 선언문 vs 함수 표현식

```js
function a() {} // 함수 선언문

var b = function () {}; // 함수 표현식
```

함수 선언문은 함수 자체의 식별자가 실행 컨텍스트 레코드에 미리 저장되고 함수 표현식은 선언부의 변수가 레코드에 저장된다. 즉, a 라는 식별자를 가진 function이 호이스팅되고 var 로 선언된 변수라는 정보만 가진 b 가 호이스팅되는 것이다.

이 호이스팅의 과정에서 큰 차이가 발생하는데, 아래 예제를 보며 이해할 수 있다.

```js
a(); // a : function
b(); // b : undefined

function a() {} // 함수 선언문

var b = function () {}; // 함수 표현식
```

위 코드는 `Error: b is not function` 이라는 에러를 보여주겠지만, a 는 함수 자체로서 실행되었고 b 는 undefined 라는 값을 가지고있어 함수 자체로 실행될 수 없는 것이다. (var 변수는 호이스팅과 함께 undefiend가 할당됨)

이와 같은 특성때문에 협업 및 많은 작업이 수행된 코드에서 함수 선언문으로만 함수를 생성하다보면 중첩적인 함수 네이밍을 사용될 수도 있고 그때 예측할 수 없는 상황이 발생할 수 있다. `따라서 함수 선언문 보다는 함수 표현식을 사용하는 편이 이러한 예측불가능성을 방지할 수 있는 방법이라 할 수 있다.`
(애초에 전역적으로 메소드를 만드는 것이 위험하기때문에 가급적 지역적으로 만들 것)

### 스코프, 스코프 체인, outerEnvironmentReference

`스코프`란 '식별자에 대한 유효범위'이다.
어떤 경계(function, block) A의 외부에서 선언한 변수는 A의 외부뿐 아니라 A의 내부에서도 접근이 가능하지만, A의 내부에서 선언한 변수는 오직 A의 내부에서만 접근할 수 있다.
이러한 '식별자의 유효범위'를 안에서 바깥으로 차례로 검색해나가는 것을 `스코프 체인`이라한다.

outerEnvironmentReference는 현재 호출된 함수가 '선언될 당시'의 LexicalEnvironment를 참조한다.
a라는 식별자를 가진 변수를 어떤 함수 내부에서 접근하는 상황이라고 생각한다면, 함수가 실행됨에 따라 활성화된 실행 컨텍스트의 environmentRecord에서 a를 검색하고, 발견하지 못한다면 outerEnvironmentReference가 참조하고 있는 외부의 LexicalEnvironment에 접근하여 environmentRecord에서 a 를 검색할 것이고, 해당 식별자가 존재한다면 할당된 값을 사용하게 될 것이고, 이 LexicalEnvironment에서도 발견하지 못한다면, 이 과정을 반복해 결국 전역 컨텍스트까지 탐색하게 될 것이다.

스코프 체인 상에 있는 변수라고 해서 무조건 접근이 가능한 것이 아니라 가장 가까운 LexicalEnvironment 부터 탐색하기 때문에 발견이 된 순간 더 외부에 있는 변수엔 접근할 수 없을 것이다. 이를 변수 은닉화라고한다.

- 크롬,파이어폭스등 브라우저에서 스코프 체인과 this 정보를 직접 눈으로 따라가보며 확인해보길 추천한다.

## 04 this

실행 컨텍스트의 thisBinding에는 this로 지정된 객체가 저장된다. 실행 컨텍스트 활성화 당시 this가 지정되지 않은 경우 this에는 전역 객체가 저장된다. 함수를 호출하는 방법에 따라 this에 저장되는 대상이 다른데, 3장에서 더 자세히 살펴본다.

## 05 정리

- 실행 컨텍스트 : 실행할 코드에 제공할 환경 정보들을 모하놓은 객체
  실행 컨텍스트 객체는 활성화 되는 시점에 VariableEnvironment, LexicalEnvironment, ThisBing의 세가지 정보를 수집함
- VariableEnvironment와 LexicalEnvironment는 실행 컨텍스트가 생성될 때 동일한 내용으로 구성되지만 LexicalEnvironment는 함수 실행 중 변경 사항이 반영되고 VariableEnvironment는 초기 상태를 유지한다.
- VariableEnvironment와 LexicalEnvironment는 environmentRecord와 outerEnvironment로 구성돼 있다.
- environmentRecord : 매개변수명, 변수의 식별자, 선언한 함수의 함수명들을 수집한다.
- outerEnvironment : 직전 컨텍스트의 LexicalEnvironment 정보를 참조한다.
- 호이스팅은 environmentRecord의 수집 과정을 추상화한 개념으로, '선언부에 있는 정보'를 수집하는 environment의 동작과 '선언부 끌어올림'을 연결해서 이해하자.
- 함수 선언문은 함수 호이스팅의 대상으로 함수 표현식과 차이가 발생한다.
- 스코프 : 변수의 유혀범위
- 안전한 코드 구성을 위해 가급적 전역변수의 사용은 최소화하는 것이 좋다.
