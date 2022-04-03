let panel;
let start;
let frames = 0;

const create = () => {
  const div = document.createElement("div");

  div.style.position = "fixed";
  div.style.left = "0px";
  div.style.top = "0px";
  div.style.width = "50px";
  div.style.height = "50px";
  div.style.backgroundColor = "black";
  div.style.color = "white";

  return div;
};

const tick = () => {
  frames++;
  const now = window.performance.now();
  if (now >= start + 1000) {
    // 1초 지나면 텍스트 넣어줌. (모니터 주사율이 60hz일 때 60프레임이 나오면 정상, 1프레임당 16ms면 정상인거 겠죠 ㅋㅋ?)
    // 1프레임이란 현재 렌더링 사이클과 다음 렌더링 사이클 사이
    panel.innerText = frames;
    frames = 0;
    start = now;
  }
  window.requestAnimationFrame(tick);
};

const init = (parent = document.body) => {
  panel = create();

  window.requestAnimationFrame(() => {
    start = window.performance.now();
    parent.appendChild(panel);
    tick();
  });
};

init();
