  // ========== SOUND-MANAGER (synthetische Sounds mit Web Audio API) ==========
        const Sound = (function() {
            let audioCtx = null;
            let musicInterval = null;
            let musicGain = null;
            let musicPlaying = false;
            
            // Noten für die Hintergrundmusik (C-Dur Arpeggio)
            const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
            let noteIndex = 0;
            
            // Initialisierung beim ersten Klick (wegen Browser-Richtlinien)
            function initAudio() {
                if (audioCtx) return;
                try {
                    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                    // Master-Gain für Musik
                    musicGain = audioCtx.createGain();
                    musicGain.gain.value = 0.03; // Leise
                    musicGain.connect(audioCtx.destination);
                } catch (e) {
                    console.warn("Web Audio API nicht unterstützt");
                }
            }
            
            // Hintergrundmusik starten
            function startMusic() {
                if (!audioCtx || musicPlaying) return;
                if (audioCtx.state === 'suspended') {
                    audioCtx.resume();
                }
                musicPlaying = true;
                
                // Musik-Loop mit setInterval (einfach, aber nicht perfekt synchron)
                musicInterval = setInterval(() => {
                    if (!musicPlaying || !audioCtx) return;
                    
                    const now = audioCtx.currentTime;
                    const osc = audioCtx.createOscillator();
                    const gainNode = audioCtx.createGain();
                    
                    osc.type = 'square'; // 8-Bit Sound
                    osc.frequency.value = notes[noteIndex];
                    
                    gainNode.gain.setValueAtTime(0.05, now);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
                    
                    osc.connect(gainNode);
                    gainNode.connect(musicGain);
                    
                    osc.start(now);
                    osc.stop(now + 0.2);
                    
                    noteIndex = (noteIndex + 1) % notes.length;
                }, 300); // Alle 300 ms eine Note
            }
            
            function stopMusic() {
                if (musicInterval) {
                    clearInterval(musicInterval);
                    musicInterval = null;
                }
                musicPlaying = false;
            }
            
            // Hilfsfunktion für einfache Töne
            function playTone(freq, duration, type = 'sine', volume = 0.1) {
                if (!audioCtx) return;
                const now = audioCtx.currentTime;
                const osc = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();
                osc.type = type;
                osc.frequency.value = freq;
                gainNode.gain.setValueAtTime(volume, now);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
                osc.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + duration);
            }
            
            // Rauschen für Explosionen
            function playNoise(duration, volume = 0.1) {
                if (!audioCtx) return;
                const bufferSize = audioCtx.sampleRate * duration;
                const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
                const whiteNoise = audioCtx.createBufferSource();
                whiteNoise.buffer = buffer;
                const gainNode = audioCtx.createGain();
                gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
                whiteNoise.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                whiteNoise.start();
                whiteNoise.stop(audioCtx.currentTime + duration);
            }
            
            // Öffentliche Methoden
            return {
                init: function() {
                    initAudio();
                },
                startMusic: function() {
                    initAudio();
                    startMusic();
                },
                stopMusic: function() {
                    stopMusic();
                },
                playerShoot: function() {
                    initAudio();
                    playTone(800, 0.1, 'sine', 0.05);
                },
                alienShoot: function() {
                    initAudio();
                    playTone(400, 0.15, 'triangle', 0.04);
                },
                explosion: function() {
                    initAudio();
                    playNoise(0.2, 0.1);
                },
                playerHit: function() {
                    initAudio();
                    playTone(150, 0.2, 'sawtooth', 0.1);
                },
                gameOver: function() {
                    initAudio();
                    playTone(300, 0.2, 'sawtooth', 0.1);
                    setTimeout(() => playTone(250, 0.2, 'sawtooth', 0.1), 200);
                    setTimeout(() => playTone(200, 0.3, 'sawtooth', 0.1), 400);
                },
                levelComplete: function() {
                    initAudio();
                    playTone(300, 0.15, 'sine', 0.1);
                    setTimeout(() => playTone(400, 0.15, 'sine', 0.1), 150);
                    setTimeout(() => playTone(500, 0.2, 'sine', 0.1), 300);
                },
                victory: function() {
                    initAudio();
                    playTone(400, 0.2, 'sine', 0.1);
                    setTimeout(() => playTone(500, 0.2, 'sine', 0.1), 200);
                    setTimeout(() => playTone(600, 0.3, 'sine', 0.1), 400);
                    setTimeout(() => playTone(800, 0.5, 'sine', 0.1), 700);
                },
                ufoAppear: function() {
                    initAudio();
                    playTone(600, 0.5, 'triangle', 0.03);
                }
            };
        })();

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

        // ========== WEISSES ALIEN MIT 3 AUGEN (für Level 7) ==========
        class WhiteAlien {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.width = 40;
                this.height = 30;
                this.speed = 1.8;
                this.direction = 1;
                this.animationStep = 0;
                this.color = '#fff';
                this.points = 150;
                this.health = 5;
                this.shootChance = 0.003;
            }

            draw() {
                ctx.fillStyle = this.color;
                this.animationStep = (this.animationStep + 0.05) % 2;
                
                ctx.fillRect(this.x + 8, this.y, 24, 6);
                ctx.fillRect(this.x + 4, this.y + 6, 32, 8);
                ctx.fillRect(this.x, this.y + 14, 40, 8);
                ctx.fillRect(this.x + 4, this.y + 22, 32, 8);
                
                ctx.fillStyle = '#000';
                let eye1X = this.x + 12;
                let eye1Y = this.y + 12;
                let offset1 = getEyeOffset(this.x, this.y, eye1X, eye1Y, 2);
                ctx.beginPath();
                ctx.arc(eye1X + offset1.dx, eye1Y + offset1.dy, 2, 0, Math.PI*2);
                ctx.fill();
                let eye2X = this.x + 20;
                let eye2Y = this.y + 12;
                let offset2 = getEyeOffset(this.x, this.y, eye2X, eye2Y, 2);
                ctx.beginPath();
                ctx.arc(eye2X + offset2.dx, eye2Y + offset2.dy, 2, 0, Math.PI*2);
                ctx.fill();
                let eye3X = this.x + 28;
                let eye3Y = this.y + 12;
                let offset3 = getEyeOffset(this.x, this.y, eye3X, eye3Y, 2);
                ctx.beginPath();
                ctx.arc(eye3X + offset3.dx, eye3Y + offset3.dy, 2, 0, Math.PI*2);
                ctx.fill();
            }

            update() {
                this.x += this.speed * this.direction;
            }

            dropDown() {
                this.y += 80;
                this.direction *= -1;
                this.speed += 0.15;
            }

            shoot() {
                if (Math.random() < this.shootChance) {
                    Sound.alienShoot();
                    return new Bullet(this.x + this.width/2 - 2, this.y + this.height, 5, '#fff');
                }
                return null;
            }
        }

        // ========== ROTES EINAUGE (für Level 6,7,8) ==========
        class RedAlien {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.width = 40;
                this.height = 30;
                this.speed = 2.0;
                this.direction = 1;
                this.animationStep = 0;
                this.color = '#f00';
                this.points = 100;
                this.health = 4;
                this.shootChance = 0.003;
            }

            draw() {
                ctx.fillStyle = this.color;
                this.animationStep = (this.animationStep + 0.05) % 2;
                
                ctx.fillRect(this.x + 8, this.y, 24, 6);
                ctx.fillRect(this.x + 4, this.y + 6, 32, 8);
                ctx.fillRect(this.x, this.y + 14, 40, 8);
                ctx.fillRect(this.x + 4, this.y + 22, 32, 8);
                
                ctx.fillStyle = '#fff';
                ctx.beginPath();
                ctx.arc(this.x + 20, this.y + 12, 6, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = '#000';
                let eyeCenterX = this.x + 20;
                let eyeCenterY = this.y + 12;
                let offset = getEyeOffset(this.x, this.y, eyeCenterX, eyeCenterY, 3);
                ctx.beginPath();
                ctx.arc(eyeCenterX + offset.dx, eyeCenterY + offset.dy, 3, 0, Math.PI * 2);
                ctx.fill();
            }

            update() {
                this.x += this.speed * this.direction;
            }

            dropDown() {
                this.y += 80;
                this.direction *= -1;
                this.speed += 0.15;
            }

            shoot() {
                if (Math.random() < this.shootChance) {
                    Sound.alienShoot();
                    return new Bullet(this.x + this.width/2 - 2, this.y + this.height, 5, '#f00');
                }
                return null;
            }
        }

        // ========== KRAKEN-BOSS (für Level 8) ==========
        class KrakenBoss {
            constructor() {
                this.width = 200;
                this.height = 160;
                this.x = canvas.width / 2 - this.width / 2;
                this.y = 80;
                this.speed = 2.5;
                this.direction = 1;
                this.health = 160;
                this.points = 5000;
                this.shootChance = 0.05;
                this.animationStep = 0;
            }

            draw() {
                this.animationStep = (this.animationStep + 0.02) % 2;
                
                const darkBlue = '#00008B';
                const darkerBlue = '#000066';
                
                ctx.fillStyle = darkBlue;
                ctx.fillRect(this.x + 50, this.y, 100, 20);
                ctx.fillRect(this.x + 30, this.y + 20, 140, 20);
                ctx.fillRect(this.x + 10, this.y + 40, 180, 30);
                ctx.fillRect(this.x, this.y + 70, 200, 30);
                
                ctx.fillStyle = darkerBlue;
                ctx.fillRect(this.x - 10, this.y + 50, 10, 50);
                ctx.fillRect(this.x + this.width, this.y + 50, 10, 50);
                
                ctx.fillStyle = '#fff';
                ctx.fillRect(this.x + 40, this.y + 45, 20, 20);
                ctx.fillRect(this.x + 90, this.y + 45, 20, 20);
                ctx.fillRect(this.x + 140, this.y + 45, 20, 20);
                
                let leftEyeX = this.x + 50;
                let leftEyeY = this.y + 55;
                let midEyeX = this.x + 100;
                let midEyeY = this.y + 55;
                let rightEyeX = this.x + 150;
                let rightEyeY = this.y + 55;
                let offset = getEyeOffset(this.x, this.y, leftEyeX, leftEyeY, 5);
                
                ctx.fillStyle = '#000';
                ctx.fillRect(leftEyeX - 5 + offset.dx, leftEyeY - 5 + offset.dy, 10, 10);
                ctx.fillRect(midEyeX - 5 + offset.dx, midEyeY - 5 + offset.dy, 10, 10);
                ctx.fillRect(rightEyeX - 5 + offset.dx, rightEyeY - 5 + offset.dy, 10, 10);
                
                ctx.fillStyle = '#006400';
                ctx.fillRect(this.x + 20, this.y + 110, 20, 30);
                ctx.fillRect(this.x + 60, this.y + 110, 20, 35);
                ctx.fillRect(this.x + 100, this.y + 110, 20, 25);
                ctx.fillRect(this.x + 140, this.y + 110, 20, 30);
                
                ctx.fillStyle = '#0f0';
                ctx.fillRect(this.x, this.y - 25, this.width * (this.health / 160), 10);
                ctx.strokeStyle = '#fff';
                ctx.strokeRect(this.x, this.y - 25, this.width, 10);
            }

            update() {
                this.x += this.speed * this.direction;
                if (this.x <= 0 || this.x >= canvas.width - this.width) {
                    this.direction *= -1;
                }
            }

            shoot() {
                if (Math.random() < this.shootChance) {
                    Sound.alienShoot();
                    return new KrakenBullet(this.x + this.width/2 - 7, this.y + this.height, 7);
                }
                return null;
            }
        }

        // ---- Kraken-Geschoss (grün) ----
        class KrakenBullet {
            constructor(x, y, speed) {
                this.x = x;
                this.y = y;
                this.width = 12;
                this.height = 28;
                this.speed = speed;
                this.color = '#0f0';
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#0f0';
                ctx.fillRect(this.x, this.y, this.width, this.height);
                ctx.shadowBlur = 0;
            }

            update() {
                this.y += this.speed;
            }

            isOffScreen() {
                return this.y > canvas.height;
            }
        }

        // ========== BOSS-KLASSE (original) ==========
        class Boss {
            constructor() {
                this.width = 180;
                this.height = 140;
                this.x = canvas.width / 2 - this.width / 2;
                this.y = 100;
                this.speed = 2.5;
                this.direction = 1;
                this.health = 60;
                this.points = 2500;
                this.shootChance = 0.04;
                this.animationStep = 0;
            }

            draw() {
                this.animationStep = (this.animationStep + 0.02) % 2;
                
                const darkRed = '#8B0000';
                const darkerRed = '#5A0000';
                
                ctx.fillStyle = darkRed;
                ctx.fillRect(this.x + 50, this.y, 80, 15);
                ctx.fillRect(this.x + 30, this.y + 15, 120, 15);
                ctx.fillRect(this.x + 10, this.y + 30, 160, 20);
                ctx.fillRect(this.x, this.y + 50, 180, 20);
                
                ctx.fillStyle = darkerRed;
                ctx.fillRect(this.x - 10, this.y + 40, 10, 40);
                ctx.fillRect(this.x + this.width, this.y + 40, 10, 40);
                
                ctx.fillRect(this.x + 20, this.y + 70, 30, 10);
                ctx.fillRect(this.x + 70, this.y + 70, 40, 10);
                ctx.fillRect(this.x + 130, this.y + 70, 30, 10);
                
                ctx.fillStyle = '#fff';
                ctx.fillRect(this.x + 40, this.y + 35, 30, 25);
                ctx.fillRect(this.x + 110, this.y + 35, 30, 25);
                
                let leftEyeCenterX = this.x + 55;
                let leftEyeCenterY = this.y + 47.5;
                let rightEyeCenterX = this.x + 125;
                let rightEyeCenterY = this.y + 47.5;
                let offset = getEyeOffset(this.x, this.y, leftEyeCenterX, leftEyeCenterY, 8);
                
                ctx.fillStyle = '#f00';
                ctx.fillRect(leftEyeCenterX - 7.5 + offset.dx, leftEyeCenterY - 5 + offset.dy, 15, 10);
                ctx.fillRect(rightEyeCenterX - 7.5 + offset.dx, rightEyeCenterY - 5 + offset.dy, 15, 10);
                
                ctx.fillStyle = '#4A0000';
                ctx.fillRect(this.x + 30, this.y + 25, 50, 5);
                ctx.fillRect(this.x + 100, this.y + 25, 50, 5);
                
                ctx.fillStyle = '#ffffe0';
                for (let i = 0; i < 6; i++) {
                    ctx.fillRect(this.x + 30 + i*25, this.y + 85, 10, 10);
                }
                for (let i = 0; i < 5; i++) {
                    ctx.fillRect(this.x + 45 + i*25, this.y + 100, 10, 10);
                }
                
                ctx.fillStyle = '#a52a2a';
                ctx.fillRect(this.x + 5, this.y + 110, 15, 20);
                ctx.fillRect(this.x + 40, this.y + 110, 15, 25);
                ctx.fillRect(this.x + 75, this.y + 110, 15, 15);
                ctx.fillRect(this.x + 110, this.y + 110, 15, 30);
                ctx.fillRect(this.x + 145, this.y + 110, 15, 20);
                
                ctx.fillStyle = darkRed;
                ctx.fillRect(this.x - 15, this.y + 60, 5, 10);
                ctx.fillRect(this.x - 20, this.y + 70, 5, 10);
                ctx.fillRect(this.x - 15, this.y + 80, 5, 10);
                ctx.fillRect(this.x + this.width + 10, this.y + 60, 5, 10);
                ctx.fillRect(this.x + this.width + 15, this.y + 70, 5, 10);
                ctx.fillRect(this.x + this.width + 10, this.y + 80, 5, 10);
                
                ctx.fillStyle = '#b8860b';
                ctx.fillRect(this.x + 70, this.y - 10, 10, 10);
                ctx.fillRect(this.x + 100, this.y - 10, 10, 10);
                ctx.fillStyle = '#ffd700';
                ctx.beginPath();
                ctx.arc(this.x + 75, this.y - 15, 5, 0, Math.PI*2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(this.x + 105, this.y - 15, 5, 0, Math.PI*2);
                ctx.fill();
                
                ctx.fillStyle = '#f00';
                ctx.fillRect(this.x, this.y - 25, this.width * (this.health / 60), 10);
                ctx.strokeStyle = '#fff';
                ctx.strokeRect(this.x, this.y - 25, this.width, 10);
            }

            update() {
                this.x += this.speed * this.direction;
                if (this.x <= 0 || this.x >= canvas.width - this.width) {
                    this.direction *= -1;
                }
            }

            shoot() {
                if (Math.random() < this.shootChance) {
                    Sound.alienShoot();
                    return new BossBullet(this.x + this.width/2 - 7, this.y + this.height, 7);
                }
                return null;
            }
        }

        // ---- Boss-Geschoss ----
        class BossBullet {
            constructor(x, y, speed) {
                this.x = x;
                this.y = y;
                this.width = 12;
                this.height = 28;
                this.speed = speed;
                this.color = '#FF4500';
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 20;
                ctx.shadowColor = '#f00';
                ctx.fillRect(this.x, this.y, this.width, this.height);
                ctx.shadowBlur = 0;
            }

            update() {
                this.y += this.speed;
            }

            isOffScreen() {
                return this.y > canvas.height;
            }
        }

        // ---- Normale Alien-Klassen (blau, lila, gelb) ----
        class Alien {
            constructor(x, y, type) {
                this.x = x;
                this.y = y;
                this.type = type; // 0 = blau, 1 = lila, 2 = gelb
                this.width = 40;
                this.height = 30;
                this.speed = 1.5;
                this.direction = 1;
                this.animationStep = 0;
                this.colors = ['#0ff', '#f0f', '#ff0'];
                this.color = this.colors[type];
                this.points = [30, 20, 10][type];
                this.health = (type === 1) ? 1 : 2;
                this.shootChance = (type === 2) ? 0.004 : 0.002;
            }

            draw() {
                ctx.fillStyle = this.color;
                this.animationStep = (this.animationStep + 0.05) % 2;
                
                const baseX = this.x;
                const baseY = this.y;
                
                switch(this.type) {
                    case 0: // Krake (blau)
                        ctx.fillRect(baseX + 8, baseY, 24, 6);
                        ctx.fillRect(baseX + 4, baseY + 6, 32, 8);
                        ctx.fillRect(baseX, baseY + 14, 40, 8);
                        
                        ctx.fillStyle = '#fff';
                        ctx.fillRect(baseX + 10, baseY + 8, 6, 6);
                        ctx.fillRect(baseX + 24, baseY + 8, 6, 6);
                        
                        ctx.fillStyle = '#000';
                        {
                            let offset1 = getEyeOffset(this.x, this.y, baseX + 13, baseY + 11, 2);
                            let offset2 = getEyeOffset(this.x, this.y, baseX + 27, baseY + 11, 2);
                            ctx.fillRect(baseX + 12 + offset1.dx, baseY + 10 + offset1.dy, 2, 2);
                            ctx.fillRect(baseX + 26 + offset2.dx, baseY + 10 + offset2.dy, 2, 2);
                        }
                        
                        ctx.fillStyle = this.color;
                        ctx.fillRect(baseX + 8, baseY + 22, 4, 4);
                        ctx.fillRect(baseX + 16, baseY + 22, 4, 4);
                        ctx.fillRect(baseX + 24, baseY + 22, 4, 4);
                        ctx.fillRect(baseX + 32, baseY + 22, 4, 4);
                        break;
                        
                    case 1: // Krabbe (lila)
                        ctx.fillRect(baseX + 2, baseY + 4, 36, 8);
                        ctx.fillRect(baseX, baseY + 12, 40, 10);
                        
                        ctx.fillStyle = '#fff';
                        ctx.beginPath();
                        ctx.arc(baseX + 12, baseY + 8, 4, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.beginPath();
                        ctx.arc(baseX + 28, baseY + 8, 4, 0, Math.PI * 2);
                        ctx.fill();
                        
                        ctx.fillStyle = '#000';
                        {
                            let offset1 = getEyeOffset(this.x, this.y, baseX + 12, baseY + 8, 2);
                            let offset2 = getEyeOffset(this.x, this.y, baseX + 28, baseY + 8, 2);
                            ctx.beginPath();
                            ctx.arc(baseX + 12 + offset1.dx, baseY + 8 + offset1.dy, 2, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.beginPath();
                            ctx.arc(baseX + 28 + offset2.dx, baseY + 8 + offset2.dy, 2, 0, Math.PI * 2);
                            ctx.fill();
                        }
                        
                        ctx.fillStyle = this.color;
                        ctx.fillRect(baseX - 4, baseY + 16, 6, 6);
                        ctx.fillRect(baseX + 38, baseY + 16, 6, 6);
                        break;
                        
                    case 2: // Tintenfisch (gelb)
                        ctx.fillRect(baseX + 8, baseY, 24, 8);
                        ctx.fillRect(baseX + 4, baseY + 8, 32, 10);
                        ctx.fillRect(baseX, baseY + 18, 40, 8);
                        
                        ctx.fillStyle = '#fff';
                        ctx.fillRect(baseX + 10, baseY + 5, 6, 6);
                        ctx.fillRect(baseX + 24, baseY + 5, 6, 6);
                        
                        ctx.fillStyle = '#000';
                        {
                            let offset1 = getEyeOffset(this.x, this.y, baseX + 13, baseY + 8, 2);
                            let offset2 = getEyeOffset(this.x, this.y, baseX + 27, baseY + 8, 2);
                            ctx.fillRect(baseX + 12 + offset1.dx, baseY + 7 + offset1.dy, 2, 2);
                            ctx.fillRect(baseX + 26 + offset2.dx, baseY + 7 + offset2.dy, 2, 2);
                        }
                        
                        ctx.fillStyle = this.color;
                        ctx.fillRect(baseX + 8, baseY + 26, 4, 4);
                        ctx.fillRect(baseX + 16, baseY + 26, 4, 4);
                        ctx.fillRect(baseX + 24, baseY + 26, 4, 4);
                        ctx.fillRect(baseX + 32, baseY + 26, 4, 4);
                        break;
                }
            }

            update() {
                this.x += this.speed * this.direction;
            }

            dropDown() {
                this.y += 80;
                this.direction *= -1;
                this.speed += 0.15;
            }

            shoot() {
                if (Math.random() < this.shootChance) {
                    Sound.alienShoot();
                    return new Bullet(this.x + this.width/2 - 2, this.y + this.height, 4, '#f00');
                }
                return null;
            }
        }

        // ---- Normales Geschoss ----
        class Bullet {
            constructor(x, y, speed, color) {
                this.x = x;
                this.y = y;
                this.width = 4;
                this.height = 10;
                this.speed = speed;
                this.color = color;
            }

            draw() {
                ctx.fillStyle = this.color;
                if (this.color === '#ff0') {
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = '#ff0';
                    ctx.fillRect(this.x, this.y, this.width, this.height);
                    ctx.shadowBlur = 0;
                } else {
                    ctx.fillRect(this.x, this.y, this.width, this.height);
                }
            }

            update() {
                this.y += this.speed;
            }

            isOffScreen() {
                return this.y < 0 || this.y > canvas.height;
            }
        }

        // ---- UFO ----
        class UFO {
            constructor() {
                this.x = -60;
                this.y = 40;
                this.width = 60;
                this.height = 25;
                this.speed = 2;
                this.points = Math.floor(Math.random() * 200) + 100;
                this.active = true;
                Sound.ufoAppear();
            }

            draw() {
                ctx.fillStyle = '#fff';
                ctx.beginPath();
                ctx.ellipse(this.x + 30, this.y + 12, 30, 12, 0, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = '#f0f';
                ctx.beginPath();
                ctx.ellipse(this.x + 30, this.y + 8, 20, 8, 0, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = '#0ff';
                ctx.beginPath();
                ctx.ellipse(this.x + 30, this.y + 5, 12, 5, 0, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = '#000';
                ctx.font = 'bold 12px "Courier New"';
                ctx.fillText(this.points, this.x + 20, this.y + 15);
            }

            update() {
                this.x += this.speed;
                if (this.x > canvas.width + 60) {
                    this.active = false;
                }
            }
        }

        // ---- Hindernis ----
        class Barrier {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.blocks = [];
                this.createBlocks();
            }

            createBlocks() {
                const pattern = [
                    [1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,0,0,0,0,1,1,1],
                    [1,1,0,0,0,0,0,0,1,1],
                    [1,0,0,0,0,0,0,0,0,1]
                ];
                
                for (let row = 0; row < pattern.length; row++) {
                    for (let col = 0; col < pattern[row].length; col++) {
                        if (pattern[row][col] === 1) {
                            this.blocks.push({
                                x: this.x + col * 8,
                                y: this.y + row * 8,
                                active: true
                            });
                        }
                    }
                }
            }

            draw() {
                ctx.fillStyle = '#0a4';
                for (const block of this.blocks) {
                    if (block.active) {
                        ctx.fillRect(block.x, block.y, 7, 7);
                    }
                }
            }

            checkCollision(bullet) {
                for (const block of this.blocks) {
                    if (block.active &&
                        bullet.x < block.x + 8 &&
                        bullet.x + bullet.width > block.x &&
                        bullet.y < block.y + 8 &&
                        bullet.y + bullet.height > block.y) {
                        block.active = false;
                        return true;
                    }
                }
                return false;
            }
        }

        // ---- Explosion ----
        class Explosion {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.particles = [];
                for (let i = 0; i < 8; i++) {
                    this.particles.push({
                        x: x,
                        y: y,
                        vx: (Math.random() - 0.5) * 4,
                        vy: (Math.random() - 0.5) * 4,
                        life: 20
                    });
                }
                Sound.explosion();
            }

            update() {
                for (let i = this.particles.length - 1; i >= 0; i--) {
                    const p = this.particles[i];
                    p.x += p.vx;
                    p.y += p.vy;
                    p.life--;
                    
                    if (p.life <= 0) {
                        this.particles.splice(i, 1);
                    }
                }
            }

            draw() {
                for (const p of this.particles) {
                    ctx.fillStyle = `rgba(255, ${200 - p.life * 10}, 0, ${p.life / 20})`;
                    ctx.fillRect(p.x, p.y, 3, 3);
                }
            }

            isActive() {
                return this.particles.length > 0;
            }
        }

        // ---- Stern (mit Level-abhängiger Farbe) ----
        class Star {
            constructor() {
                this.reset();
            }
            
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2;
                this.twinkle = Math.random() * 0.5 + 0.5;
                if (level >= 6 && level <= 8) {
                    this.color = `rgba(255, ${Math.floor(100 + Math.random()*155)}, 100, ${this.twinkle})`;
                } else {
                    this.color = `rgba(255,255,255,${this.twinkle})`;
                }
            }
            
            draw() {
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x, this.y, this.size, this.size);
            }
        }

        // ---- Schiffsmodelle ----
        function drawShipModel0(x, y, width, height, color) {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(x + width/2, y);
            ctx.lineTo(x + width - 5, y + 15);
            ctx.lineTo(x + width - 5, y + 30);
            ctx.lineTo(x + width, y + 30);
            ctx.lineTo(x + width, y + 40);
            ctx.lineTo(x + width - 10, y + 40);
            ctx.lineTo(x + width - 10, y + 50);
            ctx.lineTo(x + 10, y + 50);
            ctx.lineTo(x + 10, y + 40);
            ctx.lineTo(x, y + 40);
            ctx.lineTo(x, y + 30);
            ctx.lineTo(x + 5, y + 30);
            ctx.lineTo(x + 5, y + 15);
            ctx.closePath();
            ctx.fill();
        }

        function drawShipModel1(x, y, width, height, color) {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(x + width/2, y);
            ctx.lineTo(x + width - 5, y + 20);
            ctx.lineTo(x + width - 5, y + 30);
            ctx.lineTo(x + width, y + 30);
            ctx.lineTo(x + width, y + 45);
            ctx.lineTo(x + width - 15, y + 45);
            ctx.lineTo(x + width - 15, y + 50);
            ctx.lineTo(x + 15, y + 50);
            ctx.lineTo(x + 15, y + 45);
            ctx.lineTo(x, y + 45);
            ctx.lineTo(x, y + 30);
            ctx.lineTo(x + 5, y + 30);
            ctx.lineTo(x + 5, y + 20);
            ctx.closePath();
            ctx.fill();
        }

        function drawShipModel2(x, y, width, height, color) {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(x + width/2, y);
            ctx.lineTo(x + width - 5, y + 10);
            ctx.lineTo(x + width - 5, y + 30);
            ctx.lineTo(x + width, y + 30);
            ctx.lineTo(x + width, y + 45);
            ctx.lineTo(x + width - 10, y + 45);
            ctx.lineTo(x + width - 10, y + 50);
            ctx.lineTo(x + 10, y + 50);
            ctx.lineTo(x + 10, y + 45);
            ctx.lineTo(x, y + 45);
            ctx.lineTo(x, y + 30);
            ctx.lineTo(x + 5, y + 30);
            ctx.lineTo(x + 5, y + 10);
            ctx.closePath();
            ctx.fill();
        }

        function drawShipModel3(x, y, width, height, color) {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(x + width/2, y);
            ctx.lineTo(x + width, y + 15);
            ctx.lineTo(x + width, y + 35);
            ctx.lineTo(x + width - 15, y + 35);
            ctx.lineTo(x + width - 15, y + 50);
            ctx.lineTo(x + 15, y + 50);
            ctx.lineTo(x + 15, y + 35);
            ctx.lineTo(x, y + 35);
            ctx.lineTo(x, y + 15);
            ctx.closePath();
            ctx.fill();
        }

        // ---- Spieler (mit Upgrades) ----
        class Player {
            constructor() {
                this.width = 40;
                this.height = 50;
                this.x = canvas.width / 2 - this.width / 2;
                this.y = canvas.height - 70;
                this.speed = 5;
                this.lives = 3 + playerData.upgrades.extraLives;
                this.maxLives = 3 + playerData.upgrades.extraLives;
                this.shootCooldown = 0;
                this.hitTimer = 0;
                this.color = SHIP_COLORS[playerData.currentColor] || '#0f0';
                this.model = playerData.currentModel;
            }

            draw() {
                if (playerData.upgrades.shield && this.hitTimer === 0) {
                    ctx.strokeStyle = '#0ff';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width, 0, Math.PI * 2);
                    ctx.stroke();
                }

                let drawFunc = SHIP_MODELS[this.model] || drawShipModel0;
                drawFunc(this.x, this.y, this.width, this.height, this.hitTimer > 0 ? '#f00' : this.color);
                
                ctx.fillStyle = '#0ff';
                ctx.beginPath();
                ctx.arc(this.x + this.width/2, this.y + 25, 8, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = '#000';
                ctx.beginPath();
                ctx.arc(this.x + this.width/2 - 3, this.y + 22, 2, 0, Math.PI * 2);
                ctx.fill();

                if (this.shootCooldown > 10) {
                    ctx.fillStyle = '#f90';
                    ctx.beginPath();
                    ctx.moveTo(this.x + this.width/2 - 5, this.y + 50);
                    ctx.lineTo(this.x + this.width/2, this.y + 60);
                    ctx.lineTo(this.x + this.width/2 + 5, this.y + 50);
                    ctx.closePath();
                    ctx.fill();
                }
            }

            update() {
                if (keys['ArrowLeft'] && this.x > 0) this.x -= this.speed;
                if (keys['ArrowRight'] && this.x < canvas.width - this.width) this.x += this.speed;
                if (this.shootCooldown > 0) this.shootCooldown--;
                if (this.hitTimer > 0) this.hitTimer--;
            }

            shoot() {
                let cooldownBase = 15 - playerData.upgrades.fireRate * 2;
                if (cooldownBase < 5) cooldownBase = 5;
                if (this.shootCooldown <= 0) {
                    this.shootCooldown = cooldownBase;
                    Sound.playerShoot();
                    return new Bullet(this.x + this.width/2 - 2, this.y - 5, -8, '#ff0');
                }
                return null;
            }

            hit() {
                if (playerData.upgrades.shield) {
                    playerData.upgrades.shield = false;
                    savePlayerData();
                    updateShopUI();
                    shieldIcon.style.display = 'none';
                    return false;
                } else {
                    this.lives--;
                    if (this.lives < 0) this.lives = 0;
                    this.hitTimer = 10;
                    Sound.playerHit();
                    return true;
                }
            }
        }

        // ========== FUNKTIONEN FÜR SACHBUCH-ZEICHNUNG ==========
        function drawAlienStatic(ctx, type, color) {
            ctx.fillStyle = color;
            switch(type) {
                case 0: // blau
                    ctx.fillRect(8, 0, 24, 6);
                    ctx.fillRect(4, 6, 32, 8);
                    ctx.fillRect(0, 14, 40, 8);
                    ctx.fillStyle = '#fff';
                    ctx.fillRect(10, 8, 6, 6);
                    ctx.fillRect(24, 8, 6, 6);
                    ctx.fillStyle = '#000';
                    ctx.fillRect(12, 10, 2, 2);
                    ctx.fillRect(26, 10, 2, 2);
                    ctx.fillStyle = color;
                    ctx.fillRect(8, 22, 4, 4);
                    ctx.fillRect(16, 22, 4, 4);
                    ctx.fillRect(24, 22, 4, 4);
                    ctx.fillRect(32, 22, 4, 4);
                    break;
                case 1: // lila
                    ctx.fillRect(2, 4, 36, 8);
                    ctx.fillRect(0, 12, 40, 10);
                    ctx.fillStyle = '#fff';
                    ctx.beginPath();
                    ctx.arc(12, 8, 4, 0, Math.PI*2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(28, 8, 4, 0, Math.PI*2);
                    ctx.fill();
                    ctx.fillStyle = '#000';
                    ctx.beginPath();
                    ctx.arc(12, 8, 2, 0, Math.PI*2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(28, 8, 2, 0, Math.PI*2);
                    ctx.fill();
                    ctx.fillStyle = color;
                    ctx.fillRect(-4, 16, 6, 6);
                    ctx.fillRect(38, 16, 6, 6);
                    break;
                case 2: // gelb
                    ctx.fillRect(8, 0, 24, 8);
                    ctx.fillRect(4, 8, 32, 10);
                    ctx.fillRect(0, 18, 40, 8);
                    ctx.fillStyle = '#fff';
                    ctx.fillRect(10, 5, 6, 6);
                    ctx.fillRect(24, 5, 6, 6);
                    ctx.fillStyle = '#000';
                    ctx.fillRect(12, 7, 2, 2);
                    ctx.fillRect(26, 7, 2, 2);
                    ctx.fillStyle = color;
                    ctx.fillRect(8, 26, 4, 4);
                    ctx.fillRect(16, 26, 4, 4);
                    ctx.fillRect(24, 26, 4, 4);
                    ctx.fillRect(32, 26, 4, 4);
                    break;
            }
        }

        function drawBossStatic(ctx) {
            ctx.fillStyle = '#8B0000';
            ctx.fillRect(10, 0, 60, 10);
            ctx.fillRect(5, 10, 70, 10);
            ctx.fillRect(0, 20, 80, 15);
            ctx.fillStyle = '#fff';
            ctx.fillRect(20, 10, 15, 10);
            ctx.fillRect(45, 10, 15, 10);
            ctx.fillStyle = '#f00';
            ctx.fillRect(22, 15, 11, 5);
            ctx.fillRect(47, 15, 11, 5);
            ctx.fillStyle = '#ffffe0';
            for (let i = 0; i < 4; i++) {
                ctx.fillRect(10 + i*15, 30, 8, 8);
            }
            ctx.fillStyle = '#a52a2a';
            ctx.fillRect(5, 40, 10, 10);
            ctx.fillRect(25, 40, 10, 10);
            ctx.fillRect(45, 40, 10, 10);
            ctx.fillRect(65, 40, 10, 10);
        }

        function drawUFOStatic(ctx) {
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.ellipse(50, 30, 30, 12, 0, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = '#f0f';
            ctx.beginPath();
            ctx.ellipse(50, 20, 20, 8, 0, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = '#0ff';
            ctx.beginPath();
            ctx.ellipse(50, 15, 12, 5, 0, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = '#000';
            ctx.font = 'bold 10px "Courier New"';
            ctx.fillText('???', 40, 40);
        }

        function drawRedAlienStatic(ctx) {
            ctx.fillStyle = '#f00';
            ctx.fillRect(8, 0, 24, 6);
            ctx.fillRect(4, 6, 32, 8);
            ctx.fillRect(0, 14, 40, 8);
            ctx.fillRect(4, 22, 32, 8);
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(20, 10, 6, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(20, 10, 3, 0, Math.PI*2);
            ctx.fill();
        }

        function drawWhiteAlienStatic(ctx) {
            ctx.fillStyle = '#fff';
            ctx.fillRect(8, 0, 24, 6);
            ctx.fillRect(4, 6, 32, 8);
            ctx.fillRect(0, 14, 40, 8);
            ctx.fillRect(4, 22, 32, 8);
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(12, 10, 2, 0, Math.PI*2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(20, 10, 2, 0, Math.PI*2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(28, 10, 2, 0, Math.PI*2);
            ctx.fill();
        }

        function drawKrakenStatic(ctx) {
            ctx.fillStyle = '#00008B';
            ctx.fillRect(10, 0, 60, 10);
            ctx.fillRect(5, 10, 70, 10);
            ctx.fillRect(0, 20, 80, 15);
            ctx.fillStyle = '#fff';
            ctx.fillRect(15, 15, 10, 10);
            ctx.fillRect(35, 15, 10, 10);
            ctx.fillRect(55, 15, 10, 10);
            ctx.fillStyle = '#000';
            ctx.fillRect(18, 18, 5, 5);
            ctx.fillRect(38, 18, 5, 5);
            ctx.fillRect(58, 18, 5, 5);
            ctx.fillStyle = '#006400';
            ctx.fillRect(10, 35, 15, 15);
            ctx.fillRect(30, 35, 15, 20);
            ctx.fillRect(50, 35, 15, 15);
        }

        function drawBookAliens() {
            const ctxBlue = bookBlueCanvas.getContext('2d');
            ctxBlue.clearRect(0, 0, 100, 100);
            ctxBlue.save();
            ctxBlue.translate(30, 35);
            drawAlienStatic(ctxBlue, 0, '#0ff');
            ctxBlue.restore();

            const ctxPurple = bookPurpleCanvas.getContext('2d');
            ctxPurple.clearRect(0, 0, 100, 100);
            ctxPurple.save();
            ctxPurple.translate(30, 35);
            drawAlienStatic(ctxPurple, 1, '#f0f');
            ctxPurple.restore();

            const ctxYellow = bookYellowCanvas.getContext('2d');
            ctxYellow.clearRect(0, 0, 100, 100);
            ctxYellow.save();
            ctxYellow.translate(30, 35);
            drawAlienStatic(ctxYellow, 2, '#ff0');
            ctxYellow.restore();

            const ctxBoss = bookBossCanvas.getContext('2d');
            ctxBoss.clearRect(0, 0, 100, 100);
            ctxBoss.save();
            ctxBoss.translate(10, 15);
            drawBossStatic(ctxBoss);
            ctxBoss.restore();

            const ctxUfo = bookUfoCanvas.getContext('2d');
            ctxUfo.clearRect(0, 0, 100, 100);
            drawUFOStatic(ctxUfo);

            const ctxRed = bookRedCanvas.getContext('2d');
            ctxRed.clearRect(0, 0, 100, 100);
            ctxRed.save();
            ctxRed.translate(30, 35);
            drawRedAlienStatic(ctxRed);
            ctxRed.restore();

            const ctxWhite = bookWhiteCanvas.getContext('2d');
            ctxWhite.clearRect(0, 0, 100, 100);
            ctxWhite.save();
            ctxWhite.translate(30, 35);
            drawWhiteAlienStatic(ctxWhite);
            ctxWhite.restore();

            const ctxKraken = bookKrakenCanvas.getContext('2d');
            ctxKraken.clearRect(0, 0, 100, 100);
            ctxKraken.save();
            ctxKraken.translate(10, 15);
            drawKrakenStatic(ctxKraken);
            ctxKraken.restore();
        }

        // ========== SPIELVARIABLEN ==========
        let player;
        let aliens = [];
        let playerBullets = [];
        let alienBullets = [];
        let barriers = [];
        let explosions = [];
        let stars = [];
        let ufo = null;
        let keys = {};
        let level = 1;
        let gameOver = false;
        let levelComplete = false;
        let gameWon = false;
        let alienMoveCounter = 0;
        let alienMoveDelay = 30;
        let ufoSpawnTimer = 0;
        let lastTime = 0;
        let animationId;
        let gameActive = false;
        
        // Pause-Zustand
        let paused = false;
        let pauseSelectedOption = 0;
        const pauseOptions = [resumeOption, mainMenuOption];
        
        // Bestätigungsdialog
        let confirmActive = false;
        let confirmSelectedOption = 0;
        const confirmOptions = [confirmYes, confirmNo];
        
        // Revive-Zustand
        let reviveActive = false;
        let reviveSelectedOption = 0;
        const reviveOptions = [reviveYes, reviveNo];
        const REVIVE_COST = 5000;
        
        // Fresh Reset Dialog
        let freshResetActive = false;
        let freshResetSelectedOption = 0;
        const freshResetOptions = [freshResetYes, freshResetNo];
        
        // Menü-Zustand (jetzt 6 Optionen)
        let selectedOption = 0;
        const menuOptions = [startOption, shopOption, controlsOption, storyOption, bookOption, extraOption].filter(opt => opt !== null);

        // ========== FUNKTIONEN ==========
        function showStory() {
            menuOverlay.style.display = 'none';
            storyScreen.style.display = 'flex';
            Sound.stopMusic();
        }
        function hideStory() {
            storyScreen.style.display = 'none';
            menuOverlay.style.display = 'flex';
        }
        function showControls() {
            menuOverlay.style.display = 'none';
            controlsScreen.style.display = 'flex';
            Sound.stopMusic();
        }
        function hideControls() {
            controlsScreen.style.display = 'none';
            menuOverlay.style.display = 'flex';
        }
        
        function showAliensBook() {
            menuOverlay.style.display = 'none';
            aliensBookScreen.style.display = 'flex';
            drawBookAliens();
            Sound.stopMusic();
        }
        function hideAliensBook() {
            aliensBookScreen.style.display = 'none';
            menuOverlay.style.display = 'flex';
        }
        
        function showShop() {
            menuOverlay.style.display = 'none';
            shopScreen.style.display = 'flex';
            updateShopUI();
            Sound.stopMusic();
        }
        function hideShop() {
            shopScreen.style.display = 'none';
            menuOverlay.style.display = 'flex';
            freshResetDialog.style.display = 'none';
        }
        
        function startGame(levelToStart = 1) {
            Sound.init();
            Sound.startMusic();
            level = levelToStart;
            menuOverlay.style.display = 'none';
            gameInfo.style.display = 'flex';
            gameActive = true;
            initGame();
            updateLifeIcons();
        }
        
        function returnToMenu() {
            Sound.stopMusic();
            gameActive = false;
            paused = false;
            gameInfo.style.display = 'none';
            menuOverlay.style.display = 'flex';
            gameOverScreen.style.display = 'none';
            levelCompleteScreen.style.display = 'none';
            gameWonScreen.style.display = 'none';
            pauseScreen.style.display = 'none';
            reviveScreen.style.display = 'none';
            confirmDialog.style.display = 'none';
            bossDefeatedScreen.style.display = 'none';
            freshResetDialog.style.display = 'none';
            confirmActive = false;
            reviveActive = false;
            freshResetActive = false;
            extraOption.style.display = playerData.extraUnlocked ? 'block' : 'none';
            level = 1;
        }
        
        function goToNextLevel() {
            level++;
            levelComplete = false;
            levelCompleteScreen.style.display = 'none';
            initGame();
        }
        
        function showLevelComplete() {
            levelComplete = true;
            const remaining = (level >= 8) ? 0 : (MAX_LEVELS - level);
            levelMessage.textContent = `Du hast Level ${level} geschafft! Noch ${remaining} Level übrig.`;
            levelCompleteScreen.style.display = 'flex';
            Sound.stopMusic();
            Sound.levelComplete();
        }
        
        function showGameWon() {
            gameWon = true;
            gameWonScreen.style.display = 'flex';
            Sound.stopMusic();
            Sound.victory();
        }

        function initGame() {
            player = new Player();
            aliens = [];
            
            if (level === 1) {
                for (let row = 0; row < 2; row++)
                    for (let col = 0; col < 10; col++)
                        aliens.push(new Alien(col * 50 + 50, row * 40 + 50, 1));
            } else if (level === 2) {
                for (let col = 0; col < 10; col++) aliens.push(new Alien(col * 50 + 50, 50, 0));
                for (let col = 0; col < 10; col++) aliens.push(new Alien(col * 50 + 50, 90, 1));
            } else if (level === 3) {
                for (let col = 0; col < 10; col++) aliens.push(new Alien(col * 50 + 50, 50, 2));
                for (let col = 0; col < 10; col++) aliens.push(new Alien(col * 50 + 50, 90, 0));
                for (let col = 0; col < 10; col++) aliens.push(new Alien(col * 50 + 50, 130, 1));
            } else if (level === 4) {
                for (let col = 0; col < 10; col++) aliens.push(new Alien(col * 50 + 50, 50, 2));
                for (let col = 0; col < 10; col++) aliens.push(new Alien(col * 50 + 50, 90, 0));
                for (let col = 0; col < 10; col++) aliens.push(new Alien(col * 50 + 50, 130, 1));
                for (let col = 0; col < 10; col++) aliens.push(new Alien(col * 50 + 50, 170, 1));
            } else if (level === 5) {
                aliens.push(new Boss());
            } else if (level === 6) {
                for (let row = 0; row < 3; row++) {
                    for (let col = 0; col < 10; col++) {
                        aliens.push(new RedAlien(col * 50 + 50, row * 40 + 50));
                    }
                }
            } else if (level === 7) {
                for (let row = 0; row < 2; row++) {
                    for (let col = 0; col < 10; col++) {
                        aliens.push(new WhiteAlien(col * 50 + 50, row * 40 + 50));
                    }
                }
                for (let row = 2; row < 4; row++) {
                    for (let col = 0; col < 10; col++) {
                        aliens.push(new RedAlien(col * 50 + 50, row * 40 + 50));
                    }
                }
            } else if (level === 8) {
                aliens.push(new KrakenBoss());
            }
            
            barriers = [];
            for (let i = 0; i < 4; i++) barriers.push(new Barrier(i * 180 + 100, canvas.height - 150));
            
            stars = [];
            for (let i = 0; i < 100; i++) stars.push(new Star());
            
            playerBullets = [];
            alienBullets = [];
            explosions = [];
            ufo = null;
            alienMoveCounter = 0;
            alienMoveDelay = Math.max(15, 30 - (level * 2));
            ufoSpawnTimer = 0;
            gameOver = false;
            levelComplete = false;
            gameWon = false;
            
            scoreElement.textContent = playerData.points;
            levelElement.textContent = level;
            updateLifeIcons();
        }

        function resetGame() {
            level = 1;
            initGame();
            gameOverScreen.style.display = 'none';
            Sound.startMusic();
        }

        function checkCollisions() {
            for (let i = playerBullets.length - 1; i >= 0; i--) {
                const bullet = playerBullets[i];
                for (let j = aliens.length - 1; j >= 0; j--) {
                    const alien = aliens[j];
                    if (bullet.x < alien.x + alien.width &&
                        bullet.x + bullet.width > alien.x &&
                        bullet.y < alien.y + alien.height &&
                        bullet.y + bullet.height > alien.y) {
                        
                        explosions.push(new Explosion(alien.x + alien.width/2, alien.y + alien.height/2));
                        if (alien.health !== undefined) alien.health--;
                        else alien.health = 0;
                        playerBullets.splice(i, 1);
                        if (alien.health <= 0) {
                            addPoints(alien.points || 2500);
                            aliens.splice(j, 1);
                        }
                        break;
                    }
                }
            }
            
            if (ufo && ufo.active) {
                for (let i = playerBullets.length - 1; i >= 0; i--) {
                    const bullet = playerBullets[i];
                    if (bullet.x < ufo.x + ufo.width &&
                        bullet.x + bullet.width > ufo.x &&
                        bullet.y < ufo.y + ufo.height &&
                        bullet.y + bullet.height > ufo.y) {
                        
                        explosions.push(new Explosion(ufo.x + ufo.width/2, ufo.y + ufo.height/2));
                        addPoints(ufo.points);
                        if (player.lives < player.maxLives) {
                            player.lives++;
                            updateLifeIcons();
                        }
                        playerBullets.splice(i, 1);
                        ufo.active = false;
                        ufo = null;
                        break;
                    }
                }
            }
            
            for (let i = alienBullets.length - 1; i >= 0; i--) {
                const bullet = alienBullets[i];
                if (bullet.x < player.x + player.width &&
                    bullet.x + bullet.width > player.x &&
                    bullet.y < player.y + player.height &&
                    bullet.y + bullet.height > player.y) {
                    
                    explosions.push(new Explosion(player.x + player.width/2, player.y + player.height/2));
                    let lostLife = player.hit();
                    if (lostLife) {
                        updateLifeIcons();
                        if (player.lives <= 0) {
                            gameOver = true;
                            showReviveScreen();
                        }
                    }
                    alienBullets.splice(i, 1);
                    break;
                }
            }
            
            barriers.forEach(barrier => {
                for (let i = playerBullets.length - 1; i >= 0; i--) {
                    if (barrier.checkCollision(playerBullets[i])) {
                        playerBullets.splice(i, 1);
                        break;
                    }
                }
                for (let i = alienBullets.length - 1; i >= 0; i--) {
                    if (barrier.checkCollision(alienBullets[i])) {
                        alienBullets.splice(i, 1);
                        break;
                    }
                }
            });
            
            for (const alien of aliens) {
                if (!(alien instanceof Boss) && !(alien instanceof KrakenBoss) && alien.y + alien.height >= player.y) {
                    gameOver = true;
                    showReviveScreen();
                    break;
                }
            }
            
            if (aliens.length === 0 && !gameOver) {
                if (level === 5) {
                    playerData.extraUnlocked = true;
                    savePlayerData();
                    gameActive = false;
                    bossDefeatedScreen.style.display = 'flex';
                    Sound.stopMusic();
                    Sound.victory();
                } else if (level === 8) {
                    showGameWon();
                } else {
                    showLevelComplete();
                }
            }
        }

        function showReviveScreen() {
            Sound.stopMusic();
            if (playerData.points >= REVIVE_COST) {
                reviveActive = true;
                reviveSelectedOption = 0;
                reviveYes.classList.add('selected');
                reviveNo.classList.remove('selected');
                currentPointsSpan.textContent = playerData.points;
                reviveScreen.style.display = 'flex';
            } else {
                finalScoreElement.textContent = `Punkte: ${playerData.points}`;
                gameOverScreen.style.display = 'block';
                Sound.gameOver();
            }
        }

        function updateAliens() {
            if (level === 5 || level === 8) {
                if (aliens.length > 0) {
                    const boss = aliens[0];
                    boss.update();
                    const bullet = boss.shoot();
                    if (bullet) alienBullets.push(bullet);
                }
            } else {
                alienMoveCounter++;
                let moveDown = false;
                for (const alien of aliens) {
                    if (alien.x <= 0 || alien.x >= canvas.width - alien.width) {
                        moveDown = true;
                        break;
                    }
                }
                if (alienMoveCounter >= alienMoveDelay) {
                    alienMoveCounter = 0;
                    for (const alien of aliens) {
                        if (moveDown) alien.dropDown();
                        else alien.update();
                    }
                }
                for (const alien of aliens) {
                    const bullet = alien.shoot();
                    if (bullet) alienBullets.push(bullet);
                }
            }
        }

        // ========== TASTATUR- UND MAUSSTEUERUNG ==========
        window.addEventListener('keydown', (e) => {
            // Fresh Reset Dialog
            if (freshResetDialog.style.display === 'flex') {
                if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    freshResetOptions[freshResetSelectedOption].classList.remove('selected');
                    freshResetSelectedOption = e.key === 'ArrowLeft' ? 0 : 1;
                    freshResetOptions[freshResetSelectedOption].classList.add('selected');
                }
                if (e.key === ' ') {
                    e.preventDefault();
                    if (freshResetSelectedOption === 0) {
                        freshReset();
                        freshResetDialog.style.display = 'none';
                    } else {
                        freshResetDialog.style.display = 'none';
                    }
                }
                if (e.key === 'Escape') {
                    e.preventDefault();
                    freshResetDialog.style.display = 'none';
                }
                return;
            }
            
            if (confirmActive) {
                if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    confirmOptions[confirmSelectedOption].classList.remove('selected');
                    confirmSelectedOption = e.key === 'ArrowLeft' ? 0 : 1;
                    confirmOptions[confirmSelectedOption].classList.add('selected');
                }
                if (e.key === ' ') {
                    e.preventDefault();
                    if (confirmSelectedOption === 0) {
                        confirmActive = false;
                        confirmDialog.style.display = 'none';
                        pauseScreen.style.display = 'none';
                        paused = false;
                        returnToMenu();
                    } else {
                        confirmActive = false;
                        confirmDialog.style.display = 'none';
                    }
                }
                if (e.key === 'Escape') {
                    e.preventDefault();
                    confirmActive = false;
                    confirmDialog.style.display = 'none';
                }
                return;
            }
            
            if (reviveActive) {
                if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    reviveOptions[reviveSelectedOption].classList.remove('selected');
                    reviveSelectedOption = e.key === 'ArrowLeft' ? 0 : 1;
                    reviveOptions[reviveSelectedOption].classList.add('selected');
                }
                if (e.key === ' ') {
                    e.preventDefault();
                    if (reviveSelectedOption === 0) {
                        if (spendPoints(REVIVE_COST)) {
                            reviveActive = false;
                            reviveScreen.style.display = 'none';
                            player.lives = 1;
                            player.hitTimer = 0;
                            updateLifeIcons();
                            gameOver = false;
                            Sound.startMusic();
                        } else {
                            reviveActive = false;
                            reviveScreen.style.display = 'none';
                            gameOverScreen.style.display = 'block';
                        }
                    } else {
                        reviveActive = false;
                        reviveScreen.style.display = 'none';
                        gameOverScreen.style.display = 'block';
                    }
                }
                if (e.key === 'Escape') {
                    e.preventDefault();
                    reviveActive = false;
                    reviveScreen.style.display = 'none';
                    gameOverScreen.style.display = 'block';
                }
                return;
            }
            
            if (paused && gameActive && !gameOver && !levelComplete && !gameWon) {
                if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    pauseOptions[pauseSelectedOption].classList.remove('selected');
                    pauseSelectedOption = (pauseSelectedOption + (e.key === 'ArrowUp' ? -1 : 1) + pauseOptions.length) % pauseOptions.length;
                    pauseOptions[pauseSelectedOption].classList.add('selected');
                }
                if (e.key === ' ') {
                    e.preventDefault();
                    if (pauseSelectedOption === 0) {
                        paused = false;
                        pauseScreen.style.display = 'none';
                        Sound.startMusic();
                    } else {
                        confirmActive = true;
                        confirmSelectedOption = 0;
                        confirmYes.classList.add('selected');
                        confirmNo.classList.remove('selected');
                        confirmDialog.style.display = 'flex';
                    }
                }
                if (e.key === 'Escape') {
                    e.preventDefault();
                    paused = false;
                    pauseScreen.style.display = 'none';
                    Sound.startMusic();
                }
                return;
            }
            
            if (menuOverlay.style.display !== 'none') {
                if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    menuOptions[selectedOption].classList.remove('selected');
                    selectedOption = (selectedOption + (e.key === 'ArrowUp' ? -1 : 1) + menuOptions.length) % menuOptions.length;
                    menuOptions[selectedOption].classList.add('selected');
                }
                if (e.key === ' ') {
                    e.preventDefault();
                    if (selectedOption === 0) startGame(1);
                    else if (selectedOption === 1) showShop();
                    else if (selectedOption === 2) showControls();
                    else if (selectedOption === 3) showStory();
                    else if (selectedOption === 4) showAliensBook();
                    else if (selectedOption === 5 && playerData.extraUnlocked) startGame(6);
                }
            }
            
            if (storyScreen.style.display === 'flex' && e.key === 'Escape') hideStory();
            if (controlsScreen.style.display === 'flex' && e.key === 'Escape') hideControls();
            if (aliensBookScreen.style.display === 'flex' && e.key === 'Escape') hideAliensBook();
            if (shopScreen.style.display === 'flex' && e.key === 'Escape') hideShop();
            if (bossDefeatedScreen.style.display === 'flex' && e.key === 'Escape') {
                bossDefeatedScreen.style.display = 'none';
                returnToMenu();
            }
            
            if (gameActive && !gameOver && !levelComplete && !gameWon && !paused && e.key === 'Escape') {
                e.preventDefault();
                paused = true;
                pauseScreen.style.display = 'flex';
                Sound.stopMusic();
                pauseOptions.forEach(opt => opt.classList.remove('selected'));
                pauseSelectedOption = 0;
                pauseOptions[0].classList.add('selected');
            }
            
            if (gameActive && !paused && !gameOver && !levelComplete && !gameWon) {
                keys[e.key] = true;
            } else {
                keys[e.key] = true;
            }
            
            if ((e.key === 'r' || e.key === 'R') && gameOver) resetGame();
        });

        window.addEventListener('keyup', (e) => {
            keys[e.key] = false;
        });

        // Maussteuerung für Menüs
        startOption.addEventListener('click', () => startGame(1));
        shopOption.addEventListener('click', showShop);
        controlsOption.addEventListener('click', showControls);
        storyOption.addEventListener('click', showStory);
        bookOption.addEventListener('click', showAliensBook);
        extraOption.addEventListener('click', () => startGame(6));

        resumeOption.addEventListener('click', () => {
            if (paused) {
                paused = false;
                pauseScreen.style.display = 'none';
                Sound.startMusic();
            }
        });
        mainMenuOption.addEventListener('click', () => {
            if (paused) {
                confirmActive = true;
                confirmSelectedOption = 0;
                confirmYes.classList.add('selected');
                confirmNo.classList.remove('selected');
                confirmDialog.style.display = 'flex';
            }
        });

        confirmYes.addEventListener('click', () => {
            if (confirmActive) {
                confirmActive = false;
                confirmDialog.style.display = 'none';
                pauseScreen.style.display = 'none';
                paused = false;
                returnToMenu();
            }
        });
        confirmNo.addEventListener('click', () => {
            if (confirmActive) {
                confirmActive = false;
                confirmDialog.style.display = 'none';
            }
        });

        reviveYes.addEventListener('click', () => {
            if (reviveActive) {
                if (spendPoints(REVIVE_COST)) {
                    reviveActive = false;
                    reviveScreen.style.display = 'none';
                    player.lives = 1;
                    player.hitTimer = 0;
                    updateLifeIcons();
                    gameOver = false;
                    Sound.startMusic();
                } else {
                    reviveActive = false;
                    reviveScreen.style.display = 'none';
                    gameOverScreen.style.display = 'block';
                }
            }
        });
        reviveNo.addEventListener('click', () => {
            if (reviveActive) {
                reviveActive = false;
                reviveScreen.style.display = 'none';
                gameOverScreen.style.display = 'block';
            }
        });

        nextLevelBtn.addEventListener('click', goToNextLevel);
        levelMenuBtn.addEventListener('click', returnToMenu);
        gameWonMenuBtn.addEventListener('click', returnToMenu);
        restartButton.addEventListener('click', () => resetGame());
        menuButton.addEventListener('click', returnToMenu);
        bossDefeatedMenuBtn.addEventListener('click', () => {
            bossDefeatedScreen.style.display = 'none';
            returnToMenu();
        });

        // ========== SPIELSTART ==========
        loadPlayerData();
        extraOption.style.display = playerData.extraUnlocked ? 'block' : 'none';

        // ========== SPIELSCHLEIFE ==========
        function gameLoop(timestamp) {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            stars.forEach(star => {
                star.draw();
            });

            // ===== GRÜNE RANDLINIEN =====
            ctx.strokeStyle = '#0f0';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, canvas.height);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(canvas.width, 0);
            ctx.lineTo(canvas.width, canvas.height);
            ctx.stroke();
            
            if (gameActive && !paused && !gameOver && !levelComplete && !gameWon) {
                player.update();
                updateAliens();
                
                if (keys[' ']) {
                    const bullet = player.shoot();
                    if (bullet) playerBullets.push(bullet);
                }
                
                ufoSpawnTimer++;
                if (ufoSpawnTimer > 600 && !ufo) {
                    ufo = new UFO();
                    ufoSpawnTimer = 0;
                }
                if (ufo && ufo.active) {
                    ufo.update();
                    if (!ufo.active) ufo = null;
                }
                
                for (let i = playerBullets.length - 1; i >= 0; i--) {
                    playerBullets[i].update();
                    if (playerBullets[i].isOffScreen()) playerBullets.splice(i, 1);
                }
                for (let i = alienBullets.length - 1; i >= 0; i--) {
                    alienBullets[i].update();
                    if (alienBullets[i].isOffScreen()) alienBullets.splice(i, 1);
                }
                
                checkCollisions();
            }
            
            for (let i = explosions.length - 1; i >= 0; i--) {
                explosions[i].update();
                explosions[i].draw();
                if (!explosions[i].isActive()) explosions.splice(i, 1);
            }
            
            barriers.forEach(barrier => barrier.draw());
            aliens.forEach(alien => alien.draw());
            if (ufo && ufo.active) ufo.draw();
            playerBullets.forEach(bullet => bullet.draw());
            alienBullets.forEach(bullet => bullet.draw());
            if (player) player.draw();
            
            animationId = requestAnimationFrame(gameLoop);
        }

        animationId = requestAnimationFrame(gameLoop);
    
