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
    
