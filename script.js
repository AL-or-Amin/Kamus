let playerDL = 20; // Default DL
let playerBET = 2; // Default BET
let isSpinning = false;

// Map untuk angka asli
const originalNumbers = {
  1: 1, 18: 9, 4: 4, 5: 5, 6: 6, 8: 8, 11: 2, 12: 3, 15: 6, 16: 7, 22: 4, 14: 5, 23: 5, 24: 6, 25: 7, 34: 7, 31: 4, 35: 8, 26: 8, 29: 1, 27: 9, 10: 1, 7: 7, 13: 4, 
  36: 9, 19: 0, 0: 0, 28: 0, 20: 2, 32: 5, 17: 8, 2: 2, 777: 777
};

function calculateValue(number) {
  return originalNumbers[number] || 0; // Default ke 0 jika tidak ditemukan
}

function updateDLDisplay() {
  const dlDisplay = document.getElementById("dl-display");
  if (dlDisplay) dlDisplay.innerText = playerDL;
}

function placeBet() {
  const betInput = parseInt(prompt("Masukkan taruhan anda (min: 1, max: 10 DL):", playerBET));
  if (isNaN(betInput) || betInput < 1 || betInput > 10) {
    alert("Invalid BET. Masukkan angka antara 1 sampai 10.");
  } else {
    playerBET = betInput;
    alert(`Your BET is set to ${playerBET} DL. 
    
    -Pencet OKE 2Kali-`);
  }
}

function toggleInfo() {
  const infoPopup = document.getElementById("info-popup");
  if (infoPopup) {
    infoPopup.classList.toggle("active");
  } else {
    console.error("Popup element not found.");
  }
}

// Tambahkan event listener untuk memastikan tombol terhubung
document.addEventListener("DOMContentLoaded", () => {
  const infoButton = document.getElementById("info-button");
  const closeButton = document.getElementById("close-info");

  if (infoButton) {
    infoButton.addEventListener("click", toggleInfo);
  } else {
    console.error("Info button not found.");
  }

  if (closeButton) {
    closeButton.addEventListener("click", toggleInfo);
  } else {
    console.error("Close button not found.");
  }
});

function spin() {
  if (isSpinning || playerDL < playerBET) return;

  isSpinning = true;
  playerDL -= playerBET;
  updateDLDisplay();

  const rouletteWheel = document.getElementById("roulette-wheel");
  if (rouletteWheel) rouletteWheel.style.animation = "spin-animation 3s ease-out";

  setTimeout(() => {
    if (rouletteWheel) rouletteWheel.style.animation = "";

    // Generate angka random untuk player dan admin
    const availableNumbers = Object.keys(originalNumbers).map(Number);
    const playerNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
    const adminNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];

    const playerValue = calculateValue(playerNumber);
    const adminValue = calculateValue(adminNumber);

    const playerResult = document.getElementById("player-result");
    const adminResult = document.getElementById("admin-result");

    if (playerResult) {
      playerResult.innerText = `You spun wheel got '${playerNumber}' (${playerValue})`;
      playerResult.style.border = "4px solid"; // Tambahkan border default
    }

    if (adminResult) {
      adminResult.innerText = `Admin spun wheel got '${adminNumber}' (${adminValue})`;
      adminResult.style.border = "4px solid"; // Tambahkan border default
    }

    // Logika menang/kalah
    if ([19, 28, 0].includes(adminNumber)) {
      // Admin mendapatkan angka 0 -> Player auto kalah
      if (playerResult) playerResult.style.borderColor = "red";
    } else if ([19, 28, 0].includes(playerNumber)) {
      // Player mendapatkan angka 0 -> DL dikalikan 3
      playerDL += playerBET * 3;
      if (playerResult) playerResult.style.borderColor = "#00FF00";
    } else if ([777].includes(playerNumber)) {
      playerDL += playerBET * 10;
      if (playerResult) playerResult.style.borderColor = "#FF00FF";
      // Player menang
      playerDL += playerBET * 2;
      if (playerResult) playerResult.style.borderColor = "green";
    } else {
      // Player kalah
      if (playerResult) playerResult.style.borderColor = "red";
    }

    updateDLDisplay();
    isSpinning = false;
  }, 3000);
}

// Initial setup to ensure buttons work correctly
document.addEventListener("DOMContentLoaded", () => {
  const spinButton = document.getElementById("spin-button");
  const betButton = document.getElementById("bet-button");
  const infoButton = document.querySelector(".info-button");

  if (spinButton) spinButton.addEventListener("click", spin);
  if (betButton) betButton.addEventListener("click", placeBet);
  if (infoButton) infoButton.addEventListener("click", toggleInfo);

  // Initialize DL display
  updateDLDisplay();
});