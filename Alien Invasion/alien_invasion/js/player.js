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

// Schiffsmodelle als Array (muss nach den Funktionen definiert werden)
const SHIP_MODELS = [drawShipModel0, drawShipModel1, drawShipModel2, drawShipModel3];

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

