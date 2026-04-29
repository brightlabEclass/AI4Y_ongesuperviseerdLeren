// canvas ophalen en tekencontext maken
const myCanvas = document.getElementById("myCanvas");
const ctx = myCanvas.getContext("2d");

const firstButton = document.getElementById("first-button");
const secondButton = document.getElementById("second-button");

let message = null;

const showMessage = (text) => {
  message = { text };
  drawImages();

  setTimeout(() => {
    message = null;
    drawImages();
  }, 5000);
};

// functie om random locatie te genereren
const randomLocation = (coord) => {
  if (coord === "x") return Math.random() * (myCanvas.width - 100);
  if (coord === "y") return Math.random() * (myCanvas.height - 100);
};

// lijst met basic figuren
const basicFiguresData = [
  { name: "tv", src: "images/tv.png" },
  { name: "tennisbal", src: "images/tennisbal.png" },
  { name: "sinaasappel", src: "images/sinaasappel.png" },
  { name: "peer", src: "images/peer.png" },
  { name: "muziek", src: "images/muziek.png" },
  { name: "bowlingbal", src: "images/bowlingbal.png" },
  { name: "bosbes", src: "images/bosbes.png" },
  { name: "boek", src: "images/boek.png" },
  { name: "basketbal", src: "images/basketbal.png" },
];

// lijst met extra figuren
const extraFiguresData = [
  { name: "kiwi", src: "images/kiwi.png" },
  { name: "druiven", src: "images/druiven.png" },
  { name: "appel", src: "images/appel.png" },
];

// globale array voor alle getekende figuren
let figures = [];
let extraAdded = false;
let basicAdded = false;

// functie om afbeeldingen te tekenen
const drawImages = () => {
  ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);

  figures.forEach((figure) => {
    let scale = 2.75;

    if (figure.name === "bosbes") scale = 1.5;

    ctx.drawImage(
      figure.img,
      figure.x,
      figure.y,
      figure.width / scale,
      figure.height / scale,
    );
  });

  // draw message if it exists
  if (message) {
    ctx.font = "bold 50px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ff6487";
    ctx.fillText(message.text, myCanvas.width / 2, myCanvas.height / 2);
  }
};

// drag & drop variabelen
let isDragging = false;
let dragFigure = null;
let offsetX = 0;
let offsetY = 0;

myCanvas.addEventListener("mousedown", (event) => {
  myCanvas.style.cursor = "pointer";

  const rect = myCanvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  for (let i = figures.length - 1; i >= 0; i--) {
    const f = figures[i];

    let scale = 2.75;

    if (f.name === "bosbes") scale = 1.5;

    if (
      mouseX >= f.x &&
      mouseX <= f.x + f.width / scale &&
      mouseY >= f.y &&
      mouseY <= f.y + f.height / scale
    ) {
      isDragging = true;
      dragFigure = f;
      figures.splice(i, 1);
      figures.push(f);
      offsetX = mouseX - f.x;
      offsetY = mouseY - f.y;
      drawImages();
      break;
    }
  }
});

myCanvas.addEventListener("mousemove", (event) => {
  if (!isDragging || !dragFigure) return;

  const rect = myCanvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  let newX = mouseX - offsetX;
  let newY = mouseY - offsetY;

  const figureWidth = dragFigure.width / 2.75;
  const figureHeight = dragFigure.height / 2.75;

  newX = Math.max(0, Math.min(newX, myCanvas.width - figureWidth));
  newY = Math.max(0, Math.min(newY, myCanvas.height - figureHeight));

  dragFigure.x = newX;
  dragFigure.y = newY;

  drawImages();
});

myCanvas.addEventListener("mouseup", () => {
  myCanvas.style.cursor = "auto";
  isDragging = false;
  dragFigure = null;
});

myCanvas.addEventListener("mouseleave", () => {
  isDragging = false;
  dragFigure = null;
});

// Eerste knop: laad en teken de basic afbeeldingen
firstButton.addEventListener("click", () => {
  if (basicAdded) {
    // verwijder basic figuren
    figures = figures.filter(
      (figure) => !basicFiguresData.some((basic) => basic.name === figure.name),
    );

    basicAdded = false;
    drawImages();
    return;
  }

  basicAdded = true;

  showMessage("Orden deze figuren!");

  const basicFigures = basicFiguresData.map((figure) => {
    const img = new Image();
    img.src = figure.src;

    return {
      ...figure,
      img: img,
      width: 150,
      height: 150,
      x: randomLocation("x"),
      y: randomLocation("y"),
    };
  });

  figures = [...figures, ...basicFigures];

  let imagesLoaded = 0;
  basicFigures.forEach((figure) => {
    figure.img.onload = () => {
      imagesLoaded++;
      if (imagesLoaded === basicFigures.length) {
        drawImages();
      }
    };
  });
});

// Tweede knop: voeg de extra afbeeldingen toe
secondButton.addEventListener("click", () => {
  if (extraAdded) {
    // verwijder extra figuren
    figures = figures.filter(
      (figure) => !extraFiguresData.some((extra) => extra.name === figure.name),
    );

    extraAdded = false;
    drawImages();
    return;
  }

  extraAdded = true;

  showMessage("Extra data!");

  const extraFigures = extraFiguresData.map((figure) => {
    const img = new Image();
    img.src = figure.src;
    return {
      ...figure,
      img: img,
      width: 150,
      height: 150,
      x: randomLocation("x"),
      y: Math.random() * 50,
    };
  });

  figures = [...figures, ...extraFigures];

  let imagesLoaded = 0;
  extraFigures.forEach((figure) => {
    figure.img.onload = () => {
      imagesLoaded++;
      if (imagesLoaded === extraFigures.length) {
        drawImages();
      }
    };
  });
});
