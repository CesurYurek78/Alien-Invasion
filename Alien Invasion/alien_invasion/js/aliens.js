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
