const validKeyPress = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
const keysToEmojiMapping = {
  ArrowUp: "⬆️",
  ArrowDown: "⬇️",
  ArrowLeft: "⬅️",
  ArrowRight: "➡️", // Corrected arrow for Right
};
const sounds = {
  baseURL: "./assets/sounds/",
  validKey: "keypress_1.mp3",
  invalidKey: "invalidkey_1.mp3",
  stageClear: "stageclear_1.mp3",
  timeout: "timeout.mp3",
  lose: "gameover.mp3",
};

let score = 0;
let isProcessing = false; // Flag to prevent keypress during the delay
let startTime = Date.now();
let isGameOver = false;
console.log(startTime);

const checkTimeOver = async () => {
  let timeout = false;
  let timer = setInterval(() => {
    const currTime = Date.now();
    if (currTime >= startTime + 54000 && !timeout) {
      console.log({ timeout });
      playSound(sounds.timeout);
      timeout = true;
    }
    if (currTime >= startTime + 60000) {
      playSound(sounds.lose);

      console.log(currTime);
      isGameOver = true;
      clearInterval(timer);
    }
    console.log(isGameOver);
  }, 2000);
};

checkTimeOver();

window.onload = () => {
  const panel = document.querySelector(".panel");
  const scoresTarget = document.querySelector(".scores");
  let [pattern, patternNodes] = generateAndRenderNewPattern(panel);
  renderScores(scoresTarget, score);

  let currIndex = 0;

  document.addEventListener("keydown", (e) => {
    if (isProcessing || isGameOver) return; // Ignore keypresses during processing

    const { key } = e;

    if (key === pattern[currIndex]) {
      playSound(sounds.validKey);
      patternNodes[currIndex].style.backgroundColor = "#94ffd8";
      currIndex++;
    } else {
      playSound(sounds.invalidKey);

      score = Math.max(score - 1, 0);
      renderScores(scoresTarget, score);
      patternNodes[currIndex].style.backgroundColor = "#ff76ce";

      // Prevent further keypresses during the delay
      isProcessing = true;

      // Add a delay before resetting the pattern to show the red background
      setTimeout(() => {
        currIndex = 0;
        [pattern, patternNodes] = generateAndRenderNewPattern(panel);
        isProcessing = false; // Re-enable keypresses after processing
      }, 500); // 500ms delay before generating a new pattern
      return; // Exit early to wait for the timeout
    }

    if (currIndex >= pattern.length) {
      playSound(sounds.stageClear);

      score++;
      renderScores(scoresTarget, score);
      isProcessing = true;

      // Add a delay before resetting the pattern to show the red background
      setTimeout(() => {
        currIndex = 0;
        [pattern, patternNodes] = generateAndRenderNewPattern(panel);
        isProcessing = false; // Re-enable keypresses after processing
      }, 500); // 500ms delay before generating a new pattern
      return; // Exit early to wait for the timeout
    }
  });
};

const generatePattern = () =>
  Array.from(
    { length: 5 },
    () => validKeyPress[getRandomNumber(0, validKeyPress.length)]
  );

const getRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min) + min);

const renderPattern = (pattern, target) => {
  const patternNodes = pattern.map((key) => {
    const arrowNode = document.createElement("div");
    arrowNode.classList.add("arrow");
    arrowNode.textContent = keysToEmojiMapping[key];
    return arrowNode;
  });

  target.textContent = "";
  target.append(...patternNodes);
  return patternNodes;
};

const generateAndRenderNewPattern = (target) => {
  const pattern = generatePattern();
  const patternNodes = renderPattern(pattern, target);
  return [pattern, patternNodes];
};

const renderScores = (target, scores) => {
  target.textContent = scores;
};

function playSound(soundType) {
  const audio = new Audio(sounds.baseURL + soundType);
  audio.play();
}
