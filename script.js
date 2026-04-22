const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");
const book = document.getElementById("book");
const pageIndicator = document.getElementById("pageIndicator");
const bookScene = document.querySelector(".book-scene");
const sheets = Array.from(document.querySelectorAll(".sheet"));

const positionLabels = {
  1: "Front Cover",
  2: "Title Page / Page 1",
  3: "Page 2 / Page 3",
  4: "Page 4 / Page 5",
  5: "Page 6 / Back Matter",
  6: "Back Cover"
};

const numOfSheets = sheets.length;
let currentLocation = 1;

function isMobileView() {
  return window.matchMedia("(max-width: 768px)").matches;
}

function applyInitialStackOrder() {
  sheets.forEach((sheet, index) => {
    sheet.style.zIndex = String(numOfSheets - index);
  });
}

function updateIndicator() {
  pageIndicator.textContent = positionLabels[currentLocation] || "Flipbook";
}

function updateButtons() {
  prevBtn.disabled = currentLocation === 1;
  nextBtn.disabled = currentLocation === numOfSheets + 1;
}

function getDesktopOpenShift() {
  return Math.round(book.getBoundingClientRect().width * 0.5);
}

function updateBookTransform() {
  if (isMobileView()) {
    book.style.transform = "translateX(0px)";
    return;
  }

  if (currentLocation === 1 || currentLocation === numOfSheets + 1) {
    book.style.transform = "translateX(0px)";
  } else {
    book.style.transform = `translateX(${getDesktopOpenShift()}px)`;
  }
}

function flipSheet(sheet) {
  sheet.classList.add("flipped");
  sheet.style.zIndex = String(currentLocation);
}

function unflipSheet(sheet) {
  sheet.classList.remove("flipped");
  sheet.style.zIndex = String(numOfSheets - currentLocation + 2);
}

function goNext() {
  if (currentLocation > numOfSheets) return;

  const sheet = sheets[currentLocation - 1];
  flipSheet(sheet);
  currentLocation += 1;

  updateBookTransform();
  updateIndicator();
  updateButtons();
}

function goPrev() {
  if (currentLocation <= 1) return;

  const sheet = sheets[currentLocation - 2];
  unflipSheet(sheet);
  currentLocation -= 1;

  updateBookTransform();
  updateIndicator();
  updateButtons();
}

function restartBook() {
  currentLocation = 1;

  sheets.forEach((sheet, index) => {
    sheet.classList.remove("flipped");
    sheet.style.zIndex = String(numOfSheets - index);
  });

  updateBookTransform();
  updateIndicator();
  updateButtons();
}

prevBtn.addEventListener("click", goPrev);
nextBtn.addEventListener("click", goNext);
restartBtn.addEventListener("click", restartBook);

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    goNext();
  }

  if (event.key === "ArrowLeft") {
    goPrev();
  }

  if (event.key.toLowerCase() === "r") {
    restartBook();
  }
});

/* Swipe en celular */
let touchStartX = 0;
let touchEndX = 0;
const swipeThreshold = 50;

function handleSwipeGesture() {
  const diff = touchEndX - touchStartX;

  if (Math.abs(diff) < swipeThreshold) return;

  if (diff < 0) {
    goNext();
  } else {
    goPrev();
  }
}

if (bookScene) {
  bookScene.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.changedTouches[0].clientX;
    },
    { passive: true }
  );

  bookScene.addEventListener(
    "touchend",
    (event) => {
      touchEndX = event.changedTouches[0].clientX;
      handleSwipeGesture();
    },
    { passive: true }
  );
}

window.addEventListener("resize", updateBookTransform);

applyInitialStackOrder();
updateBookTransform();
updateIndicator();
updateButtons();