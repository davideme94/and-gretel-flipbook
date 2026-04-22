const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");
const book = document.getElementById("book");
const pageIndicator = document.getElementById("pageIndicator");
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

function updateBookTransform() {
  if (currentLocation === 1) {
    book.style.transform = "translateX(0%)";
  } else if (currentLocation === numOfSheets + 1) {
    book.style.transform = "translateX(0%)";
  } else {
    book.style.transform = "translateX(12%)";
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

applyInitialStackOrder();
updateBookTransform();
updateIndicator();
updateButtons();
