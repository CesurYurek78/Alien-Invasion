// ========== GLOBALE VARIABLEN ==========
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const livesCountElement = document.getElementById('livesCount');
const lifeIconsContainer = document.getElementById('lifeIconsContainer');
const shieldIcon = document.getElementById('shieldIcon');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreElement = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');
const menuButton = document.getElementById('menuButton');
const gameInfo = document.getElementById('gameInfo');

// Menü-Elemente
const menuOverlay = document.getElementById('menuOverlay');
const controlsScreen = document.getElementById('controlsScreen');
const storyScreen = document.getElementById('storyScreen');
const aliensBookScreen = document.getElementById('aliensBookScreen');
const shopScreen = document.getElementById('shopScreen');
const startOption = document.getElementById('startOption');
const shopOption = document.getElementById('shopOption');
const controlsOption = document.getElementById('controlsOption');
const storyOption = document.getElementById('storyOption');
const bookOption = document.getElementById('bookOption');
const extraOption = document.getElementById('extraOption');

// Shop-Elemente
const shopPoints = document.getElementById('shopPoints');
const fireRateLevelSpan = document.getElementById('fireRateLevel');
const extraLivesLevelSpan = document.getElementById('extraLivesLevel');
const colorLevelSpan = document.getElementById('colorLevel');
const modelLevelSpan = document.getElementById('modelLevel');
const fireRatePriceSpan = document.getElementById('fireRatePrice');
const extraLivesPriceSpan = document.getElementById('extraLivesPrice');
const shieldPriceSpan = document.getElementById('shieldPrice');
const colorPriceSpan = document.getElementById('colorPrice');
const modelPriceSpan = document.getElementById('modelPrice');
const buyFireRate = document.getElementById('buyFireRate');
const buyExtraLives = document.getElementById('buyExtraLives');
const buyShield = document.getElementById('buyShield');
const buyColor = document.getElementById('buyColor');
const buyModel = document.getElementById('buyModel');
const prevColor = document.getElementById('prevColor');
const nextColor = document.getElementById('nextColor');
const currentColorDisplay = document.getElementById('currentColorDisplay');
const prevModel = document.getElementById('prevModel');
const nextModel = document.getElementById('nextModel');
const currentModelDisplay = document.getElementById('currentModelDisplay');

// Fresh Reset
const freshResetBtn = document.getElementById('freshResetBtn');
const freshResetDialog = document.getElementById('freshResetDialog');
const freshResetYes = document.getElementById('freshResetYes');
const freshResetNo = document.getElementById('freshResetNo');

// Pause & Revive
const pauseScreen = document.getElementById('pauseScreen');
const resumeOption = document.getElementById('resumeOption');
const mainMenuOption = document.getElementById('mainMenuOption');
const reviveScreen = document.getElementById('reviveScreen');
const reviveYes = document.getElementById('reviveYes');
const reviveNo = document.getElementById('reviveNo');
const currentPointsSpan = document.getElementById('currentPoints');
const confirmDialog = document.getElementById('confirmDialog');
const confirmYes = document.getElementById('confirmYes');
const confirmNo = document.getElementById('confirmNo');

// Level Complete & Game Won
const levelCompleteScreen = document.getElementById('levelCompleteScreen');
const gameWonScreen = document.getElementById('gameWonScreen');
const levelMessage = document.getElementById('levelMessage');
const nextLevelBtn = document.getElementById('nextLevelBtn');
const levelMenuBtn = document.getElementById('levelMenuBtn');
const gameWonMenuBtn = document.getElementById('gameWonMenuBtn');

// Endboss besiegt Screen
const bossDefeatedScreen = document.getElementById('bossDefeatedScreen');
const bossDefeatedMenuBtn = document.getElementById('bossDefeatedMenuBtn');

// Canvas für Sachbuch
const bookBlueCanvas = document.getElementById('bookAlienBlue');
const bookPurpleCanvas = document.getElementById('bookAlienPurple');
const bookYellowCanvas = document.getElementById('bookAlienYellow');
const bookBossCanvas = document.getElementById('bookAlienBoss');
const bookUfoCanvas = document.getElementById('bookAlienUFO');
const bookRedCanvas = document.getElementById('bookAlienRed');
const bookWhiteCanvas = document.getElementById('bookAlienWhite');
const bookKrakenCanvas = document.getElementById('bookAlienKraken');

// ========== PERSISTENTER SPIELERSTATUS (localStorage) ==========
let playerData = {
    points: 0,
    upgrades: {
        fireRate: 0,      // Stufe 0-5
        extraLives: 0,     // Stufe 0-3 (maximale Leben erhöhen)
        shield: false,     // hat man einen Schild? (einmalig)
        color: 0,          // freigeschaltete Farbstufe (0 = erste Farbe)
        model: 0           // freigeschaltete Modellstufe (0 = erstes Modell)
    },
    // Aktuell ausgewählte Farbe/Modell (kann ≤ upgrades.color bzw. upgrades.model sein)
    currentColor: 0,
    currentModel: 0,
    extraUnlocked: false
};

// Preise
const PRICES = {
    fireRate: [500, 800, 1200, 1800, 2500], // Stufe 1-5
    extraLives: [1000, 2000, 3000],
    shield: 2000,
    color: [300, 300, 300, 300, 300], // 5 Farben
    model: [800, 1200, 2000] // 3 Modelle
};

// Maximale Stufen
const MAX_FIRE_RATE = 5;
const MAX_EXTRA_LIVES = 3;
const MAX_COLOR = 5;
const MAX_MODEL = 3;

// Liste der Schiffsfarben
const SHIP_COLORS = ['#0f0', '#0ff', '#f0f', '#ff0', '#f90', '#f00'];
// Liste der Schiffsmodelle (Zeichenfunktionen)
// SHIP_MODELS wird in player.js definiert (nach den drawShipModel-Funktionen)

// Maximale Level (jetzt 8)
const MAX_LEVELS = 8;

// Lade gespeicherte Daten
