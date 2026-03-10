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

