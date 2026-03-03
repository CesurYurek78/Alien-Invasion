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
