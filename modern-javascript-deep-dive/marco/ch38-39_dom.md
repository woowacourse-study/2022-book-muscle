# 모던 자바스크립트 Deep Dive

- 정리 : Marco
- 본 책 외에 다른 책이나 외부 자료 등도 공부 목적으로 함께 참조하였습니다.

## 38장. 브라우저의 렌더링 과정

- 파싱 : Parsing(구문 분석 syntax analysis)은 프로그래밍 언언의 문법에 맞게 작성된 텍스트 문서를 읽어 들여 실행하기 위해 텍스트 문서의 문자열을 토큰(토큰이란 문법적 의미를 가지며, 문법적으로 더는 나눌 수 없는 코드의 기본요소를 뜻함)으로 분해하고, 토큰에 문법적 의미와 구조를 반영하여 트리 구조의 자료구조인 파스 트리를 생성하는 일련의 과정을 말한다.
- 렌더링 : 렌더링은 HTML, CSS 자바스크립트로 작성된 문서를 파싱하여 브라우저에 시각적으로 출력하는 것을 말한다.
- 브라우저는 다음과 같은 과정을 거쳐 렌더링을 수행한다.

  1. 브라우저는 HTML, CSS, 자바스크립트, 이미지, 폰트 파일 등 렌더링에 필요한 리소스를 `요청`하고 서버로부터 `응답`을 받는다.
  2. 브라우저의 렌더링 엔진은 서버로부터 응답된 `HTML`과 `CSS`를 `파싱`하여 브라우저가 이해할 수 있는 자료구조인 `DOM`(Document Object Model)과 `CSSOM`(CSS Object Model)을 `생성`하고 이들을 결합하여 `렌더 트리`를 생성한다.
  3. 브라우저의 자바스크립트 엔진은 서버로부터 응답된 자바스크립트를 파싱하여 `AST(Abstract Syntax Tree)`를 생성하고 `바이트코드`(인터프리터가 실행할 수 있는 중간코드)로 변환하여 실행한다. 이때 자바스크립트는 DOM API를 통해 DOM이나 CSSOM을 변경할 수 있다. 변경된 DOM과 CSSOM은 다시 렌더 트리로 결합된다.
  4. 렌더 트리를 기반으로 HTML 요소의 레이아웃(위치와 크기)를 계산하고 브라우저 화면에 HTML 요소를 페인팅한다.

- `DOM`은 HTML 문서의 계층적 구조와 정보를 표현하며 이를 제어할 수 있는 API, 즉 프로퍼티와 메서드를 제공하는 트리 자료구조다.
- `HTML 요소(Element)` 는 HTML 문서를 구성하는 개별적인 요소를 의미한다.
  ```jsx
  <div class='greeting'>Hello</div>
  ```
  - <div>는 start tag
  - class는 atrribute name
  - greeting은 arrtibute value
  - hello는 contents
  - </div>는 end tag
- 이들은 요소 노드, 어트리뷰트 노드, 텍스트 노드이다.
- 노드 객체들로 구성된 트리 자료구조를 `DOM`이라 한다. 노드 객체의 트리로 구조화되어 있기 때문에 DOM을 `DOM 트리`라고 부르기도 한다.

## 노드

- 문서 노드
  - `문서 노드`는 DOM 트리의 최상위에 존재하는 루트 노드로서 document 전체를 가리킨다.
  - HTML 문서당 docuemnt 객체는 유일하다.
  - 문서노드(document 객체)는 DOM 트리의 루트 노드이므로 DOM 트리의 노드들에 접근하기 위한 진입점 역할을 담당한다.
- 요소 노드
  - `요소 노드`는 HTML 요소를 가리키는 객체다.
- 어트리뷰트 노드
  - 어트리뷰트 노드는 어트리뷰트가 지정된 HTML 요소의 요소 노드와 형제 관계를 갖는다.
  - 어트리뷰트트 노드는 부모 노드와 연결되어 있지 않고, 형제 노드인 요소 노드에만 연결되어 있다.
  - 어트리뷰터 노드에 접근하려면 먼저 형제 노드인 요소 노드에 접근해야 한다.
- 텍스트 노드
  - 텍스트 노드는 HTML 요소의 텍스트를 가리키는 객체다.
  - 텍스트 노드는 요소 노드의 자식 노드이다. 또한 자식 노드를 가질 수 없는 leaf node(최종단)이다.
  - 텍스트 노드에 접근하려면 먼저 부모 노드인 요소 노드에 접근해야 한다.
- 이상의 노드들을 포함하여 총 12개의 노드 타입이 존재한다.

## 노드 객체의 상속 구조

- DOM을 구성하는 노드 객체는 ECMAScript 사양에 정의된 표준 빌트인 객체가 아니라 브라우저 환경에서 추가적으로 제공하는 호스트 객체다.
- 상속 구조를 갖는다

```jsx
Object - EventTarget - Node - Document - HTMLDocument
														- Element - HTMLElement - HTMLHtmlelement, HTMLHeadElement...
														- Attr
														- CharacterData - Text, Comment
```

- 위처럼 모든 노드 객체는 Object, EventTarget, Node 인터페이스를 상속받는다.
- 노드 객체의 상속 구조는 개발자 도구의 Elements 패널 우측의 Properties 패널에서 확인할 수 있다.
- DOM은 HTML 문서의 계층적 구조와 정보를 표현하는 것은 물론 노드 객체의 종류, 즉 노드 타입에 따라 필요한 기능을 프로퍼티와 메서드의 집합인 DOM API로 제공한다. 이 DOM API를 통해 HTML의 구조나 내용 또는 스타일 등을 동적으로 조작할 수 있다.

## 요소 노드 취득

- HTML의 구조나 내용 또는 스타일 등을 동적으로 조작하려면 먼저 요소 노드를 취득해야 한다.
- id를 이용한 요소 노드 취득
  - getElementById 메서드
- 태그 이름을 이용한 요소 노드 취득
  - getElementsByTagName
    - 인수로 전달한 태그 이름을 갖는 모든 요소 노드들을 탐색하여 반환한다.
    - 반환된 값은 DOM 컬렉션 객체인 HTML Collection 객체이고, 유사 배열 객체이면서 이터러블이다.
  ```jsx
  // 모든 요소 노드를 탐색하여 반환한다.
  const $all = document.getElementsByTagName("*");
  ```
- class를 이용한 요소 노드 취득
  - getElementsByClassName 메서드
    - 인수로 전달한 class 어트리뷰트 값(이하 class 값)을 갖는 모든 요소 노드들을 탐색하여 반환한다.
- CSS 선택자를 이용한 요소 노드 취득

  - querySelector 메서드는 인수로 전달한 CSS 선택자를 만족시키는 하나의 요소 노드를 탐색하여 반환한다.
  - querySelectorAll 메서드는 여러 개의 요소 노드 객체를 갖는 DOM 컬렉션 객체인 NodeList 객체를 반환한다.

  ```css
  /* 전체 선택자: 모든 요소를 선택 */
  * {
    ...;
  }

  /* 어트리뷰트 선택자: input 요소 중에 type 어트리뷰트 값이 'text'인 요소를 모두 선택 */
  input[type="text"] {
    ...;
  }

  /* 후손 선택자: div 요소의 후손 요소 중 p 요소를 모두 선택 */
  div p {
    ...;
  }

  /* 자식 선택자: div 요소의 자식 요소 중 p 요소를 모두 선택 */
  div > p {
    ...;
  }

  /* 인접 형제 선택자: p 요소의 형제 요소 중에 p 요소 바로 뒤에 위치하는 ul 요소를 선택 */
  p + ul {
    ...;
  }

  /* 일반 형제 선택자: p 요소의 형제 요소 중에 p 요소 뒤에 위치하는 ul 요소를 모두 선택 */
  p ~ ul {
    ...;
  }

  /* 가상 클래스 선택자 : hover 상태인 a요소를 모두 선택 */
  a:hover {
    ...;
  }

  /* 가상 요소 선택자: p 요소의 콘텐츠의 앞에 위치하는 공간을 선택 
   일반적으로 content 프로퍼티와 함께 사용된다. */
  p::before {
    ...;
  }
  ```

### 특정 요소 노드를 취득할 수 있는지 확인

- Element.prototype.matches 메서드는 인수로 전달한 CSS 선택자를 통해 특정 요소 노드를 취득할 수 있는지 확인한다.
- 이 메서드는 이벤트 위임을 사용할 때 유용하다.

## HTMLCollection vs NodeList

### 두 객체의 공통점

- 둘 다 DOM API가 여러 개의 결과값을 반환하기 위한 DOM 컬렉션 객체이다.
- 또한, 둘 다 유사 배열 객체이면서 이터러블이다.
  - 따라서 둘 다 `for ...of` 문으로 순회할 수 있다.
  - `Array.from` 메서드나 `스프레드 연산자`를 사용하여 배열로 만들 수 있다.
- item() 메서드는 두 객체에 모두 있는 메서드다. 첫 번째 인자로 받는 index 값에 해당하는 아이템을 반환한다.

### HTMLCollection

- getElementsByTagName, getElementsByClassName 메서드를 통해 반환된다.
- `children` 프로퍼티를 통해 반환된다.
- Live 객체이다.(객체가 스스로 실시간 노드 객체의 상태 변경을 반영한다)
  - Live 객체라는 특성 때문에, 반복문을 순회하다가 부작용이 발생할 수 있다.
    - 이에 대한 해결책은 `for 문을 역방향으로 순회` 하거나 `while 문을 사용하여 객체에 노드 객체가 남아 있지 않을 때까지 무한 반복하는 방법등으로 회피`할 수도 있다.
    - 더 간단한 해결책은 부작용의 원인인 `HTMLCollection` 객체를 사용하지 않고, 배열로 변환하는 것이다. 그러면 유용한 배열의 고차함수(forEach, map, filter, reduce 등)을 사용할 수 있다. 또는 `querySelectorAll` 메서드를 사용하여 `NodeList` 객체를 반환받아 사용할 수도 있다.
- forEach() 메서드를 갖고 있지 않다.(배열로 만들어야 사용 가능)
- 객체의 각 요소에는 배열의 인덱스로 접근하거나, 객체의 속성에 접근하듯이 `.[속성명]`의 방식으로 접근할 수도 있다.
- HTMLCollection 객체에만 있는 메서드로는 namedItem()가 있다. 요소의 `name` 어트리뷰트의 값이 있는 경우에 이 메서드를 이용하여, namedItem()의 첫 번째 인자가 `name` 어트리뷰트의 값과 일치하는 요소를 반환한다.

### NodeList

- `querySelectorAll` 메서드를 통해 반환된다.
- `childNodes` 프로퍼티를 통해 반환된다.
- 대부분 Non-live 객체이다(노드가 변경되어도 그 상태를 반영하지 않는다).
  - 다만, `childNodes` 프로퍼티는 live 객체이므로 주의가 필요하다.
- forEach(), entries(), keys(), values() 메서드를 갖고 있다.(이외에 배열의 고차함수는 배열로 변환해야 사용 가능)

### 결론

이처럼 HTMLCollection이나 NodeList 객체는 예상과 다르게 동작할 때가 있어 다루기 까다롭고 실수할 수 있다. 또한, 각 객체마다 메서드를 어느 정도 제공하기는 하지만, `배열`의 고차함수(forEach, map, filter, reduce 등)만큼 다양한 기능을 제공하진 않는다.

그러므로 노드 객체의 상태 변경과 상관없이 안전하게 DOM 컬렉션을 사용하고 유용한 고차함수를 사용하려면, HTMLCollection이나 NodeList 객체를 `배열`로 변환하여 사용하는 것이 좋다.

- `Array.from 메서드`나 `스프레드 연산자`를 사용하여 간단히 배열로 변환할 수 있다.

## 자식노드 탐색

- Node.prototype.childNodes
  - 자식 노드를 모두 탐색하여 DOM 컬렉션 객체인 `NodeList`에 담아 반환한다. `childNodes` 프로퍼티가 반환한 NodeList에는 요소 노드뿐만 아니라 텍스트 노드도 포함되어 있을 수 있다.
- Element.prototype.children
  - 자식 노드 중에서 요소 노드만 모두 탐색하여 DOM 컬렉션 객체인 ` HTMLCollection`` 에 담아 반환한다.  `children`프로퍼티가 반환하는`HTMLCollection` 에는 텍스트 노드가 포함되지 않는다.
- `firstChild`와 `firstElementChild` 프로퍼티의 차이는 `firstChild`는 텍스트 노드와 요소 노드를 반환할 수 있는데, `firstElementChild`는 오직 요소 노드만 반환한다는 것이다.(lastChild와 lastElementChild도 마찬가지이다)

### 자식노드 존재 확인

- Node.prototype.hasChildNodes 메서드 → boolean

### 요소 노드의 텍스트 노드 탐색

- firstChild

### 부모 노드 탐색

- Node.prototype.parentNode 프로퍼티

### 형제 노드 탐색

부모 노드가 같은 형제 요소 노드 중에서

- Node.prototype.previousSibling
- Node.prototype.nextSibling
  - 요소 노드나 텍스트 노드 반환
- Element.prototype.previousElementSibling
- Element.prototype.nextElementSibling
  - 요소 노드만 반환

## 노드 정보 취득

- nodeType
  - 노드 객체의 종류, 노드 타입을 나타내는 상수 반환한다.
- nodeName
  - 노드의 이름을 문자열로 반환한다.

## 요소 노드의 텍스트 조작

### nodeValue

- Node.prototype.nodeValue
- nodeValue 프로퍼티는 참조와 할당 모두 가능하다.
- 텍스트 노드에 nodeValue 프로퍼티를 참조해야 텍스트 값을 반환한다.

### textContent

- Node.prototype.textContent
- 참조와 할당 모두 가능하다.
- 이 프로퍼티를 참조하면 요소 노드의 콘텐츠 영역(시작 태그와 종료 태그 사이) 내의 텍스트를 모두 반환한다. childNodes 프로퍼티가 반환한 모든 노드들의 텍스트 노드 값(텍스트)를 모두 반환하며, 이때 HTML 마크업은 무시된다.
- 요소 노드의 textContent 프로퍼티에 문자열을 할당하면 요소 노드의 모든 자식 노드가 제거되고 할당한 문자열이 텍스트로 추가된다. 이때 할당한 문자열에 HTML 마크업이 있더라도 문자열 그대로 인식되어 텍스트로 취급된다. 즉, HTML 마크업이 파싱되지 않는다(HTML태그가 문자열처럼 그냥 텍스트로 렌더링된다는 뜻).
- textContent 프로퍼티와 유사한 동작을 하는 innerText프로퍼티가 있으나, innerText 프로퍼티는 CSS에 순종적(예를 들어 visibility:hidden; 로 지정된 요소 노드의 텍스트는 반환 안 함)이며 textContent 프로퍼티보다 느리기 때문에 사용하지 않는 것이 좋다.

## DOM 조작

- DOM 조작은 새 노드를 생성하여 DOM에 추가하거나 기존 노드를 삭제 또는 교체하는 것을 말한다.
- 리플로우와 리페인트가 발생하여 성능에 영향을 준다.
- 성능 최적화를 위해 DOM 조작은 주의해서 다뤄야 한다.

### innerHTML

- innerHTML 프로퍼티는 HTML마크업이 포함된 문자열을 그대로 반환한다.
- innerHTML에 문자열 할당 시, 요소 노드의 모든 자식 노드가 `제거` 되고 할당한 문자열에 포함되어 있는 HTML 마크업이 `파싱`되어 요소 노드의 자식 노드로 `DOM에 반영` 된다.
- 단점
  1.  사용자로부터 입력받은 데이터를 innerHTML 프로퍼티에 할당하는 것은 `크로스 사이트 스크립팅 공격(XSS)` 에 취약하므로 위험하다.
      - HTML 새니티제이션은 이러한 공격을 예방하기 위해 잠재적 위험을 제거하는 기능을 말한다. `DOMPurify 라이브러리`를 사용할 수 있다. `DOMPurify` 는 다음과 같이 잠재적 위험을 내포한 HTML 마크업을 새니티제이션(살균)하여 잠재적 위험을 제거한다.
  ```css
  DOMPurify.sanitize('<img src="x" onerror="alert(document.cookie)">');
  ```
  1. 유지되어도 좋은 기존의 자식 노드까지 모두 제거하고 다시 처음부터 새롭게 자식 노드를 생성하여 DOM에 반영하는데, 이는 효율적이지 않다.
  2. 새로운 요소를 삽입할 때 삽입될 위치를 지정할 수 없다.

### insertAdjacentHTML 메서드

- 기존 요소를 제거하지 않으면서 위치를 지정해 새로운 요소를 삽입한다.
  - 기존 요소에 영향을 주지 않기 때문에 innerHTML보다는 효율적이고 빠르다.
- 단, insertAdjacentHTML 메서드도 HTML 마크업 문자열을 파싱하므로 크로스 사이트 스크립팅 공격에 취약하다.

### 노드 생성과 추가

DOM은 노드를 직접 생성/삽입/삭제/치환 하는 메서드도 제공한다.

### 요소 노드 생성

- document.createElement(태그네임)

### 텍스트 노드 생성

- document.createTextNode(텍스트)

### 요소 노드를 DOM에 추가

- 노드.appendChild(childNode)

### DocumentFragment

- DocumentFragment 노드는 문서, 요소, 어트리뷰트, 텍스트 노드와 같은 노드 객체의 일종으로, 부모 노드가 없어서 `기존 DOM과는 별도로 존재`한다는 특징이 있다.
- 자식 노드들의 부모 노드로서 별도의 서브 DOM을 구성하여 기존 DOM에 추가하기 위한 용도로 사용한다.
- DocumentFragment 노드에 자식 노드를 추가하여도 기존 DOM에는 어떠한 변경도 발생하지 않는다.
- 또한 DocumentFragment 노드를 DOM에 추가하면 자신(DocumentFragment)은 제거되고 자신의 자식 노드만 DOM에 추가된다.
- `document.creatDocumentFragment()` 로 DocumentFragment 노드를 생성하고, 생성한 노드를 DocumentFragment 노드의 마지막 자식 노드로 추가(`appendChild`)하고, 그 DocumentFragment 노드를 기존 DOM에 추가하는 방식으로 사용한다.
- 이때 실제로 DOM 변경이 발생하는 것은 한 번뿐이며 리플로우와 리페인트도 한 번만 실행된다. 따라서 여러 개의 요소 노드를 DOM에 추가하는 경우 DocumentFragment 노드를 사용하는 것디 더 `효율적` 이다.

## 노드 삽입

- 마지막 노드로 추가
  - Node.prototype.appendChild(newNode)
- 지정한 위치에 노드 삽입
  - Node.prototype.insertBefore(newNode, childNode) 메서드는 첫 번째 인수로 전달받은 노드를 `두 번째 인수로 전달받은 노드 앞`에 삽입한다.
    - 두 번째 인수로 전달받은 노드는 반드시 insertBefore 메서드를 호출한 노드의 자식 노드이어야 한다.

### 노드 복사

- Node.prototype.cloneNode() 메서드는 노드의 사본을 생성하여 반환한다.
  - 매개변수 deep에 true를 인수로 전달하면 노드를 깊은 복사하여 모든 자손 노드가 포함된 사본을 생성한다.
  - false가 인수로 전달되거나 생략하면, 노드를 얕은 복사하여 노드 자신만의 사본을 생성한다. 얕은 복사로 생성된 요소 노드는 자손 노드를 복사하지 않으므로 텍스트 노드도 없다.

### 노드 교체

- Node.prototype.replaceChild(newChild, oldChild)
  - 두 번째 인수로 전달받은 노드는 반드시 메서드를 호출한 노드의 자식 노드이어야 한다.

### 노드 삭제

- Node.prototype.removeChild(child)
  - 인수로 전달받은 노드는 반드시 메서드를 호출한 노드의 자식 노드이어야 한다.

## 어트리뷰트

- HTML 문서의 구성 요소인 HTML 요소는 여러 개의 어트리뷰트를 가질 수 있다.
- HTML 요소의 동작을 제어하기 위한 추가 정보를 제공한다.
- HTML 문서가 파싱될 때 HTML 요소의 어트리뷰트는 어트리뷰트 노드로 변환되어 요소 노드의 형제 노드로 추가된다. 이때 HTML 어트리뷰트당 하나의 어트리뷰트 노드가 생성된다.
  - 이때 모든 어트리뷰트 노드의 참조는 유사 배열 객체이자 이터러블인 `NamedNodeMap` 객체에 담겨서 요소 노드의 `attributes 프로퍼티`에 저장된다.
- HTML 어트리뷰트의 역할은 HTML 요소의 초기 상태를 지정하는 것이다. 즉, HTML 어트리뷰트 값은 HTML 요소의 초기 상태를 의미하며 이는 변하지 않는다.

### HTML 어트리뷰트 조작

- Element.prototype.setAttribute(attributeName, attributeValue) 메서드
  - Element의 attributeName에 대한 attributeValue 변경
- Element.prototype.getAttribute(attributeName) 메서드
- Element.prototype.hasAttribute(attributeName) 메서드
- Element.prototype.removeAttribute(attributeName) 메서드

### HTML 어트리뷰트 vs DOM 프로퍼티

- 요소 노드 객체에는 HTML 어트리뷰트에 대응하는 프로퍼티(이하 DOM 프로퍼티)가 존재한다. 이 DOM 프로퍼티들은 HTLM 어트리뷰트 값을 초기값으로 가지고 있다. (ex, id, type, value 프로퍼티)
- HTML 어트리뷰트는 왜 DOM에서도 중복 관리되고 있을까?
- 요소 노드는 초기 상태와 최신 상태라는 2개의 상태를 관리해야 한다.
  - 요소 노드의 `초기 상태`는 `어트리뷰트 노드`가 관리한다.
    - 초기 상태는 왜 기억해야 하는가? 초기 상태 값을 관리하지 않으면 웹페이지를 처음 표시하거나 새로고침할 때 초기 상태를 표시할 수 없다.
  - 요소 노드의 `최신 상태`는 `DOM 프로퍼티`가 관리한다.

## data 어트리뷰트와 dataset 프로퍼티

- data 어트리뷰트의 값은 HTMLElement.dataset 프로퍼티로 취득할 수 있다.
