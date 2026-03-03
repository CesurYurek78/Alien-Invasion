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
        const SHIP_MODELS = [drawShipModel0, drawShipModel1, drawShipModel2, drawShipModel3];
        
        // Maximale Level (jetzt 8)
        const MAX_LEVELS = 8;
        
        // Lade gespeicherte Daten
        function loadPlayerData() {
            const saved = localStorage.getItem('alienInvasion');
            if (saved) {
                try {
                    const data = JSON.parse(saved);
                    playerData = data;
                    if (playerData.currentColor === undefined) playerData.currentColor = 0;
                    if (playerData.currentModel === undefined) playerData.currentModel = 0;
                    if (playerData.extraUnlocked === undefined) playerData.extraUnlocked = false;
                } catch (e) {
                    console.warn('Fehler beim Laden, verwende Standarddaten');
                }
            }
            updateShopUI();
            updateLifeIcons();
            // Extra Levels Option nur anzeigen, wenn freigeschaltet
            extraOption.style.display = playerData.extraUnlocked ? 'block' : 'none';
        }
        
        // Speichere Daten
        function savePlayerData() {
            localStorage.setItem('alienInvasion', JSON.stringify(playerData));
            extraOption.style.display = playerData.extraUnlocked ? 'block' : 'none';
        }
        
        // Punkte hinzufügen (im Spiel)
        function addPoints(amount) {
            playerData.points += amount;
            if (playerData.points > 400000) playerData.points = 400000; // Max
            scoreElement.textContent = playerData.points;
            savePlayerData();
        }
        
        // Punkte ausgeben (nur wenn genug vorhanden)
        function spendPoints(amount) {
            if (playerData.points >= amount) {
                playerData.points -= amount;
                savePlayerData();
                updateShopUI();
                return true;
            }
            return false;
        }
        
        // Fresh Reset: alles zurücksetzen
        function freshReset() {
            playerData = {
                points: 0,
                upgrades: {
                    fireRate: 0,
                    extraLives: 0,
                    shield: false,
                    color: 0,
                    model: 0
                },
                currentColor: 0,
                currentModel: 0,
                extraUnlocked: false
            };
            savePlayerData();
            updateShopUI();
            if (gameActive && player) {
                player.maxLives = 3;
                player.lives = 3;
                player.color = SHIP_COLORS[0];
                player.model = 0;
                playerData.upgrades.shield = false;
                updateLifeIcons();
            }
            extraOption.style.display = 'none';
        }
        
        // Lebenssymbole aktualisieren
        function updateLifeIcons() {
            if (!gameActive) return;
            const maxLives = 3 + playerData.upgrades.extraLives;
            const currentLives = player ? player.lives : maxLives;
            lifeIconsContainer.innerHTML = '';
            for (let i = 0; i < maxLives; i++) {
                const icon = document.createElement('div');
                icon.className = 'life-icon';
                icon.style.opacity = i < currentLives ? '1' : '0.2';
                lifeIconsContainer.appendChild(icon);
            }
            livesCountElement.textContent = currentLives;
            shieldIcon.style.display = playerData.upgrades.shield ? 'inline-block' : 'none';
        }
        
        // Shop-UI aktualisieren
        function updateShopUI() {
            shopPoints.textContent = playerData.points;
            
            // Feuerrate
            fireRateLevelSpan.textContent = playerData.upgrades.fireRate;
            let fireRatePrice = playerData.upgrades.fireRate < MAX_FIRE_RATE ? PRICES.fireRate[playerData.upgrades.fireRate] : 'MAX';
            fireRatePriceSpan.textContent = fireRatePrice;
            buyFireRate.disabled = playerData.upgrades.fireRate >= MAX_FIRE_RATE || playerData.points < fireRatePrice;
            buyFireRate.classList.toggle('disabled', buyFireRate.disabled);
            
            // Extra Leben
            extraLivesLevelSpan.textContent = playerData.upgrades.extraLives;
            let extraLivesPrice = playerData.upgrades.extraLives < MAX_EXTRA_LIVES ? PRICES.extraLives[playerData.upgrades.extraLives] : 'MAX';
            extraLivesPriceSpan.textContent = extraLivesPrice;
            buyExtraLives.disabled = playerData.upgrades.extraLives >= MAX_EXTRA_LIVES || playerData.points < extraLivesPrice;
            buyExtraLives.classList.toggle('disabled', buyExtraLives.disabled);
            
            // Schild
            let shieldActive = playerData.upgrades.shield;
            shieldPriceSpan.textContent = shieldActive ? 'AKTIV' : PRICES.shield;
            buyShield.disabled = shieldActive || playerData.points < PRICES.shield;
            buyShield.classList.toggle('disabled', buyShield.disabled);
            
            // Farbe
            colorLevelSpan.textContent = playerData.upgrades.color;
            let colorPrice = playerData.upgrades.color < MAX_COLOR ? PRICES.color[playerData.upgrades.color] : 'MAX';
            colorPriceSpan.textContent = colorPrice;
            buyColor.disabled = playerData.upgrades.color >= MAX_COLOR || playerData.points < colorPrice;
            buyColor.classList.toggle('disabled', buyColor.disabled);
            prevColor.disabled = playerData.currentColor <= 0;
            nextColor.disabled = playerData.currentColor >= playerData.upgrades.color;
            currentColorDisplay.textContent = playerData.currentColor + 1;
            
            // Modell
            modelLevelSpan.textContent = playerData.upgrades.model;
            let modelPrice = playerData.upgrades.model < MAX_MODEL ? PRICES.model[playerData.upgrades.model] : 'MAX';
            modelPriceSpan.textContent = modelPrice;
            buyModel.disabled = playerData.upgrades.model >= MAX_MODEL || playerData.points < modelPrice;
            buyModel.classList.toggle('disabled', buyModel.disabled);
            prevModel.disabled = playerData.currentModel <= 0;
            nextModel.disabled = playerData.currentModel >= playerData.upgrades.model;
            currentModelDisplay.textContent = playerData.currentModel + 1;
            
            // Fresh Reset Button ist immer aktiv
        }
        
        // ========== KAUF-FUNKTIONEN ==========
        buyFireRate.addEventListener('click', () => {
            let stufe = playerData.upgrades.fireRate;
            if (stufe < MAX_FIRE_RATE && spendPoints(PRICES.fireRate[stufe])) {
                playerData.upgrades.fireRate++;
                savePlayerData();
                updateShopUI();
            }
        });
        
        buyExtraLives.addEventListener('click', () => {
            let stufe = playerData.upgrades.extraLives;
            if (stufe < MAX_EXTRA_LIVES && spendPoints(PRICES.extraLives[stufe])) {
                playerData.upgrades.extraLives++;
                savePlayerData();
                updateShopUI();
                if (gameActive && player) {
                    player.maxLives = 3 + playerData.upgrades.extraLives;
                    updateLifeIcons();
                }
            }
        });
        
        buyShield.addEventListener('click', () => {
            if (!playerData.upgrades.shield && spendPoints(PRICES.shield)) {
                playerData.upgrades.shield = true;
                savePlayerData();
                updateShopUI();
                if (gameActive) shieldIcon.style.display = 'inline-block';
            }
        });
        
        buyColor.addEventListener('click', () => {
            let stufe = playerData.upgrades.color;
            if (stufe < MAX_COLOR && spendPoints(PRICES.color[stufe])) {
                playerData.upgrades.color++;
                savePlayerData();
                updateShopUI();
            }
        });
        
        buyModel.addEventListener('click', () => {
            let stufe = playerData.upgrades.model;
            if (stufe < MAX_MODEL && spendPoints(PRICES.model[stufe])) {
                playerData.upgrades.model++;
                savePlayerData();
                updateShopUI();
            }
        });
        
        prevColor.addEventListener('click', () => {
            if (playerData.currentColor > 0) {
                playerData.currentColor--;
                savePlayerData();
                updateShopUI();
                if (gameActive && player) player.color = SHIP_COLORS[playerData.currentColor];
            }
        });
        nextColor.addEventListener('click', () => {
            if (playerData.currentColor < playerData.upgrades.color) {
                playerData.currentColor++;
                savePlayerData();
                updateShopUI();
                if (gameActive && player) player.color = SHIP_COLORS[playerData.currentColor];
            }
        });
        prevModel.addEventListener('click', () => {
            if (playerData.currentModel > 0) {
                playerData.currentModel--;
                savePlayerData();
                updateShopUI();
                if (gameActive && player) player.model = playerData.currentModel;
            }
        });
        nextModel.addEventListener('click', () => {
            if (playerData.currentModel < playerData.upgrades.model) {
                playerData.currentModel++;
                savePlayerData();
                updateShopUI();
                if (gameActive && player) player.model = playerData.currentModel;
            }
        });
        
        // Fresh Reset
        freshResetBtn.addEventListener('click', () => {
            freshResetDialog.style.display = 'flex';
            freshResetYes.classList.add('selected');
            freshResetNo.classList.remove('selected');
        });
        
        // Fresh Reset JA/NEIN
        freshResetYes.addEventListener('click', () => {
            freshReset();
            freshResetDialog.style.display = 'none';
        });
        freshResetNo.addEventListener('click', () => {
            freshResetDialog.style.display = 'none';
        });
        
        // ========== HILFSFUNKTION FÜR AUGEN ==========
        function getEyeOffset(alienX, alienY, eyeCenterX, eyeCenterY, maxOffset) {
            if (!player) return { dx: 0, dy: 0 };
            let dx = player.x + player.width/2 - eyeCenterX;
            let dy = player.y + player.height/2 - eyeCenterY;
            let len = Math.sqrt(dx*dx + dy*dy);
            if (len < 0.1) return { dx: 0, dy: 0 };
            let factor = Math.min(maxOffset / len, 1);
            return { dx: dx * factor, dy: dy * factor };
        }
