/* ==========================================================================
   PLATEAU HEART — Game Engine
   Christendo 24 — Main game loop, state management, rendering pipeline
   Power Baby Productions — 2026
   ========================================================================== */

const Engine = (() => {
    // Game states
    const STATE = {
        BOOT: 'boot',
        TITLE: 'title',
        DIALOG: 'dialog',
        COMBAT: 'combat',
        PAUSE: 'pause',
        SHOP: 'shop',
        GAME_OVER: 'game_over',
        CHAPTER_INTRO: 'chapter_intro',
        CHAPTER_COMPLETE: 'chapter_complete'
    };

    let currentState = STATE.BOOT;
    let previousState = null;
    let canvas, ctx;
    let titleCanvas, titleCtx;
    let lastTime = 0;
    let deltaTime = 0;
    let gameTime = 0;
    let scrollX = 0;
    let currentChapter = 0;
    let spriteCache = {};
    let isRunning = false;
    let bootProgress = 0;
    let titleAnimTimer = 0;

    // Save data
    let saveData = {
        chapter: 0,
        level: 1,
        hp: 100,
        sp: 50,
        score: 0,
        coins: 0,
        xp: 0,
        completedChapters: []
    };

    // Music system — loads user's tracks from /music/ folder
    const Music = (() => {
        let currentTrack = null;
        let audioCtx = null;
        let masterGain = null;
        let musicVolume = 0.7;
        let sfxVolume = 0.8;
        let isMuted = false;

        // Track mapping — user places their music files here
        const TRACK_MAP = {
            'boot': 'music/boot.mp3',
            'title': 'music/title.mp3',
            'plateau_theme': 'music/ch1_plateau.mp3',
            'mile_end_theme': 'music/ch2_mile_end.mp3',
            'old_montreal_theme': 'music/ch3_old_montreal.mp3',
            'mont_royal_theme': 'music/ch4_mont_royal.mp3',
            'st_henri_theme': 'music/ch5_st_henri.mp3',
            'jean_talon_theme': 'music/ch6_jean_talon.mp3',
            'chinatown_theme': 'music/ch7_chinatown.mp3',
            'parc_ex_theme': 'music/ch8_parc_ex.mp3',
            'hochelaga_theme': 'music/ch9_hochelaga.mp3',
            'verdun_theme': 'music/ch10_verdun.mp3',
            'boss': 'music/boss.mp3',
            'dialog': 'music/dialog.mp3',
            'victory': 'music/victory.mp3',
            'game_over': 'music/game_over.mp3',
            'shop': 'music/shop.mp3'
        };

        function init() {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            masterGain = audioCtx.createGain();
            masterGain.connect(audioCtx.destination);
            masterGain.gain.value = musicVolume;
        }

        async function play(trackName, loop = true) {
            if (!audioCtx) init();
            if (audioCtx.state === 'suspended') await audioCtx.resume();

            stop();

            const url = TRACK_MAP[trackName];
            if (!url) {
                // No track mapped — play procedural placeholder
                playProceduralBeat(trackName);
                return;
            }

            try {
                const response = await fetch(url);
                const buffer = await audioCtx.decodeAudioData(await response.arrayBuffer());
                currentTrack = audioCtx.createBufferSource();
                currentTrack.buffer = buffer;
                currentTrack.loop = loop;
                currentTrack.connect(masterGain);
                currentTrack.start();
            } catch {
                // File not found — use procedural placeholder
                playProceduralBeat(trackName);
            }
        }

        // Procedural 8-bit style placeholder music
        function playProceduralBeat(trackName) {
            if (!audioCtx) init();

            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(masterGain);

            // Different vibes per track type
            const isTitle = trackName === 'title' || trackName === 'boot';
            const isBoss = trackName === 'boss';
            const freq = isTitle ? 220 : isBoss ? 150 : 330;

            osc.type = 'square';
            osc.frequency.value = freq;
            gain.gain.value = 0.05;

            // Simple arpeggio pattern
            const notes = isTitle
                ? [220, 277, 330, 440, 330, 277]
                : isBoss
                ? [150, 180, 200, 150, 120, 150]
                : [330, 392, 440, 523, 440, 392];

            let noteIndex = 0;
            const interval = setInterval(() => {
                if (currentTrack !== osc) {
                    clearInterval(interval);
                    return;
                }
                osc.frequency.value = notes[noteIndex % notes.length];
                noteIndex++;
            }, 250);

            osc.start();
            currentTrack = osc;

            // Auto-fade after a bit for non-looping
            setTimeout(() => {
                gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 2);
            }, 30000);
        }

        function stop() {
            if (currentTrack) {
                try { currentTrack.stop(); } catch {}
                currentTrack = null;
            }
        }

        function setVolume(v) {
            musicVolume = v;
            if (masterGain) masterGain.gain.value = isMuted ? 0 : v;
        }

        function toggleMute() {
            isMuted = !isMuted;
            if (masterGain) masterGain.gain.value = isMuted ? 0 : musicVolume;
            return isMuted;
        }

        // Simple SFX using Web Audio
        function playSFX(type) {
            if (!audioCtx || isMuted) return;

            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            gain.gain.value = sfxVolume * 0.15;

            switch (type) {
                case 'hit':
                    osc.type = 'square';
                    osc.frequency.value = 200;
                    osc.frequency.linearRampToValueAtTime(80, audioCtx.currentTime + 0.1);
                    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.1);
                    break;
                case 'punch':
                    osc.type = 'sawtooth';
                    osc.frequency.value = 150;
                    osc.frequency.linearRampToValueAtTime(60, audioCtx.currentTime + 0.08);
                    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.08);
                    break;
                case 'special':
                    osc.type = 'sine';
                    osc.frequency.value = 440;
                    osc.frequency.linearRampToValueAtTime(880, audioCtx.currentTime + 0.3);
                    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.4);
                    break;
                case 'coin':
                    osc.type = 'square';
                    osc.frequency.value = 800;
                    osc.frequency.linearRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
                    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.15);
                    break;
                case 'heal':
                    osc.type = 'sine';
                    osc.frequency.value = 523;
                    osc.frequency.linearRampToValueAtTime(784, audioCtx.currentTime + 0.2);
                    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);
                    break;
                case 'levelup':
                    osc.type = 'square';
                    osc.frequency.value = 440;
                    osc.frequency.setValueAtTime(554, audioCtx.currentTime + 0.15);
                    osc.frequency.setValueAtTime(659, audioCtx.currentTime + 0.3);
                    osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.45);
                    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.6);
                    break;
                case 'menu_select':
                    osc.type = 'square';
                    osc.frequency.value = 600;
                    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.05);
                    break;
                case 'objection':
                    osc.type = 'sawtooth';
                    osc.frequency.value = 300;
                    osc.frequency.linearRampToValueAtTime(600, audioCtx.currentTime + 0.15);
                    gain.gain.value = sfxVolume * 0.2;
                    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);
                    break;
                case 'damage':
                    osc.type = 'sawtooth';
                    osc.frequency.value = 100;
                    osc.frequency.linearRampToValueAtTime(50, audioCtx.currentTime + 0.15);
                    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.2);
                    break;
                default:
                    osc.type = 'square';
                    osc.frequency.value = 440;
                    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.1);
            }

            osc.start();
            osc.stop(audioCtx.currentTime + 1);
        }

        return { init, play, stop, setVolume, toggleMute, playSFX, TRACK_MAP };
    })();

    // ========================================================================
    // BOOT SEQUENCE
    // ========================================================================
    function runBoot() {
        const bootScreen = document.getElementById('boot-screen');
        const progressBar = document.querySelector('.boot-progress-bar');
        const statusEl = document.querySelector('.boot-status');

        const bootMessages = [
            'Initializing Christendo 24...',
            'Loading 24-bit color engine...',
            'Scanning cartridge: PLATEAU HEART...',
            'Power Baby Productions presents...',
            'Loading Montreal map data...',
            'Generating 100 characters...',
            'Loading combat system...',
            'Preparing dialog engine...',
            'Ready!'
        ];

        let step = 0;
        const bootInterval = setInterval(() => {
            step++;
            const progress = (step / bootMessages.length) * 100;
            progressBar.style.width = progress + '%';
            statusEl.textContent = bootMessages[Math.min(step - 1, bootMessages.length - 1)];

            if (step >= bootMessages.length) {
                clearInterval(bootInterval);
                setTimeout(() => {
                    bootScreen.classList.add('hidden');
                    showTitle();
                }, 600);
            }
        }, 400);
    }

    // ========================================================================
    // TITLE SCREEN
    // ========================================================================
    function showTitle() {
        currentState = STATE.TITLE;
        const titleScreen = document.getElementById('title-screen');
        titleScreen.classList.remove('hidden');
        titleCanvas = document.getElementById('title-canvas');
        titleCtx = titleCanvas.getContext('2d');

        // Render title background — Montreal skyline at sunset
        renderTitleBackground();

        // Check for save data
        const saved = localStorage.getItem('plateau_heart_save');
        const continueBtn = document.getElementById('btn-continue');
        if (saved) {
            continueBtn.style.opacity = '1';
            continueBtn.disabled = false;
        } else {
            continueBtn.style.opacity = '0.3';
            continueBtn.disabled = true;
        }

        Music.play('title');
    }

    function renderTitleBackground() {
        if (!titleCtx) return;
        const w = titleCanvas.width;
        const h = titleCanvas.height;

        // Sunset gradient
        const grad = titleCtx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#1a0a2e');
        grad.addColorStop(0.3, '#e94560');
        grad.addColorStop(0.5, '#ff7b54');
        grad.addColorStop(0.7, '#ffb26b');
        grad.addColorStop(1, '#2a1a3e');
        titleCtx.fillStyle = grad;
        titleCtx.fillRect(0, 0, w, h);

        // Mont-Royal silhouette
        titleCtx.fillStyle = '#1a0a2e';
        titleCtx.beginPath();
        titleCtx.moveTo(0, h * 0.6);
        titleCtx.quadraticCurveTo(w * 0.3, h * 0.35, w * 0.5, h * 0.45);
        titleCtx.quadraticCurveTo(w * 0.7, h * 0.38, w, h * 0.55);
        titleCtx.lineTo(w, h);
        titleCtx.lineTo(0, h);
        titleCtx.fill();

        // Cross on top of Mont-Royal
        titleCtx.fillStyle = '#f5c518';
        const crossX = w * 0.42;
        const crossY = h * 0.37;
        titleCtx.fillRect(crossX - 1, crossY - 8, 3, 16);
        titleCtx.fillRect(crossX - 5, crossY - 4, 11, 3);
        // Glow
        titleCtx.shadowColor = '#f5c518';
        titleCtx.shadowBlur = 10;
        titleCtx.fillRect(crossX - 1, crossY - 8, 3, 16);
        titleCtx.shadowBlur = 0;

        // City skyline
        titleCtx.fillStyle = '#0d0520';
        const buildings = [
            { x: 50, w: 30, h: 80 },
            { x: 90, w: 25, h: 60 },
            { x: 120, w: 40, h: 100 },
            { x: 170, w: 20, h: 70 },
            { x: 200, w: 35, h: 120 },  // Place Ville Marie
            { x: 240, w: 25, h: 90 },
            { x: 280, w: 30, h: 75 },
            { x: 320, w: 45, h: 110 },
            { x: 380, w: 20, h: 65 },
            { x: 410, w: 35, h: 95 },
            { x: 460, w: 25, h: 80 },
            { x: 500, w: 40, h: 130 },  // 1000 de la Gauchetière
            { x: 550, w: 30, h: 70 },
            { x: 590, w: 25, h: 85 },
            { x: 630, w: 35, h: 105 },
            { x: 680, w: 20, h: 60 },
            { x: 710, w: 30, h: 90 },
        ];

        const groundY = h * 0.65;
        buildings.forEach(b => {
            titleCtx.fillRect(b.x, groundY - b.h, b.w, b.h + 50);
            // Windows
            titleCtx.fillStyle = '#f5c51830';
            for (let wy = groundY - b.h + 5; wy < groundY; wy += 8) {
                for (let wx = b.x + 3; wx < b.x + b.w - 3; wx += 6) {
                    if (Math.random() > 0.4) {
                        titleCtx.fillRect(wx, wy, 3, 4);
                    }
                }
            }
            titleCtx.fillStyle = '#0d0520';
        });

        // Stars
        titleCtx.fillStyle = '#fff';
        for (let i = 0; i < 60; i++) {
            const sx = Math.random() * w;
            const sy = Math.random() * h * 0.35;
            const ss = Math.random() > 0.9 ? 2 : 1;
            titleCtx.fillRect(sx, sy, ss, ss);
        }

        // Olympic Stadium silhouette (far right)
        titleCtx.fillStyle = '#0d0520';
        titleCtx.beginPath();
        titleCtx.moveTo(w - 80, groundY);
        titleCtx.quadraticCurveTo(w - 60, groundY - 50, w - 40, groundY - 70);
        titleCtx.lineTo(w - 35, groundY - 30);
        titleCtx.quadraticCurveTo(w - 20, groundY - 20, w - 10, groundY);
        titleCtx.fill();
        // Tower
        titleCtx.fillRect(w - 45, groundY - 100, 4, 70);
    }

    // ========================================================================
    // GAME STATE MANAGEMENT
    // ========================================================================
    function setState(newState) {
        previousState = currentState;
        currentState = newState;

        // Hide all screens
        document.getElementById('title-screen').classList.add('hidden');
        document.getElementById('game-screen').classList.add('hidden');
        document.getElementById('dialog-screen').classList.add('hidden');
        document.getElementById('pause-screen').classList.add('hidden');

        switch (newState) {
            case STATE.TITLE:
                document.getElementById('title-screen').classList.remove('hidden');
                break;
            case STATE.COMBAT:
                document.getElementById('game-screen').classList.remove('hidden');
                break;
            case STATE.DIALOG:
                document.getElementById('dialog-screen').classList.remove('hidden');
                break;
            case STATE.PAUSE:
                document.getElementById('game-screen').classList.remove('hidden');
                document.getElementById('pause-screen').classList.remove('hidden');
                break;
            case STATE.CHAPTER_INTRO:
                document.getElementById('dialog-screen').classList.remove('hidden');
                break;
        }
    }

    // ========================================================================
    // START NEW GAME
    // ========================================================================
    function newGame() {
        Music.playSFX('menu_select');
        currentChapter = 0;
        scrollX = 0;

        saveData = {
            chapter: 0,
            level: 1,
            hp: 100,
            sp: 50,
            score: 0,
            coins: 0,
            xp: 0,
            completedChapters: []
        };

        // Initialize combat
        if (typeof Combat !== 'undefined') {
            Combat.init();
        }

        // Start chapter intro
        startChapter(0);
    }

    function continueGame() {
        const saved = localStorage.getItem('plateau_heart_save');
        if (!saved) return;

        Music.playSFX('menu_select');
        saveData = JSON.parse(saved);
        currentChapter = saveData.chapter;

        if (typeof Combat !== 'undefined') {
            Combat.init();
            const p = Combat.getPlayer();
            p.level = saveData.level;
            p.hp = saveData.hp;
            p.maxHp = saveData.hp;
            p.sp = saveData.sp;
            p.score = saveData.score;
            p.coins = saveData.coins;
            p.xp = saveData.xp;
        }

        startChapter(currentChapter);
    }

    function saveGame() {
        if (typeof Combat !== 'undefined') {
            const p = Combat.getPlayer();
            saveData.level = p.level;
            saveData.hp = p.hp;
            saveData.sp = p.sp;
            saveData.score = p.score;
            saveData.coins = p.coins;
            saveData.xp = p.xp;
        }
        saveData.chapter = currentChapter;
        localStorage.setItem('plateau_heart_save', JSON.stringify(saveData));
        Music.playSFX('heal');
    }

    // ========================================================================
    // CHAPTER MANAGEMENT
    // ========================================================================
    function startChapter(chapterIndex) {
        currentChapter = chapterIndex;
        scrollX = 0;

        // Show chapter intro dialog
        if (typeof Dialog !== 'undefined' && Dialog.CHAPTER_SCRIPTS) {
            const script = Dialog.CHAPTER_SCRIPTS[chapterIndex];
            if (script) {
                setState(STATE.CHAPTER_INTRO);
                Dialog.showChapterIntro(
                    chapterIndex + 1,
                    typeof World !== 'undefined' ? World.CHAPTERS[chapterIndex].name : 'Chapter ' + (chapterIndex + 1),
                    typeof World !== 'undefined' ? World.CHAPTERS[chapterIndex].subtitle : ''
                );
                // After intro, start dialog then combat
                setTimeout(() => {
                    Dialog.startDialog(script, () => {
                        startCombatPhase(chapterIndex);
                    });
                }, 3000);
                return;
            }
        }

        startCombatPhase(chapterIndex);
    }

    function startCombatPhase(chapterIndex) {
        setState(STATE.COMBAT);
        canvas = document.getElementById('game-canvas');
        ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        // Resize canvas to window
        resizeCanvas();

        // Play chapter music
        if (typeof World !== 'undefined' && World.CHAPTERS[chapterIndex]) {
            Music.play(World.CHAPTERS[chapterIndex].music || 'plateau_theme');
        }

        // Show area name
        const areaName = document.getElementById('area-name');
        if (typeof World !== 'undefined' && World.CHAPTERS[chapterIndex]) {
            areaName.textContent = World.CHAPTERS[chapterIndex].name.toUpperCase();
        }
        areaName.classList.remove('hidden');
        setTimeout(() => areaName.classList.add('hidden'), 3000);

        // Spawn initial enemies
        if (typeof Combat !== 'undefined' && typeof World !== 'undefined') {
            const spawns = World.getSpawnPoints(chapterIndex);
            if (spawns && spawns.length > 0) {
                Combat.spawnWave(spawns[0]);
            } else {
                // Default spawns
                Combat.spawnEnemy('thug', 500, 340);
                Combat.spawnEnemy('thug', 600, 340);
                Combat.spawnEnemy('hipster', 700, 340);
            }
        }

        if (!isRunning) {
            isRunning = true;
            requestAnimationFrame(gameLoop);
        }
    }

    // ========================================================================
    // MAIN GAME LOOP
    // ========================================================================
    function gameLoop(timestamp) {
        if (!isRunning) return;

        deltaTime = Math.min((timestamp - lastTime) / 1000, 0.05); // cap at 50ms
        lastTime = timestamp;
        gameTime += deltaTime;

        if (currentState === STATE.COMBAT) {
            update(deltaTime);
            render();
        }

        requestAnimationFrame(gameLoop);
    }

    function update(dt) {
        if (typeof Combat === 'undefined') return;

        Combat.update(dt);

        const player = Combat.getPlayer();

        // Camera follow player
        const targetScrollX = player.x - canvas.width / 3;
        const chapterWidth = typeof World !== 'undefined' && World.CHAPTERS[currentChapter]
            ? World.CHAPTERS[currentChapter].width
            : 3840;
        scrollX += (targetScrollX - scrollX) * 5 * dt;
        scrollX = Math.max(0, Math.min(scrollX, chapterWidth - canvas.width));

        // Update HUD
        updateHUD(player);

        // Check if all enemies defeated → advance or trigger dialog
        const enemies = Combat.getEnemies();
        if (enemies.length === 0 && player.x > chapterWidth - 200) {
            completeChapter();
        }
    }

    function render() {
        if (!ctx) return;

        const w = canvas.width;
        const h = canvas.height;

        // Clear
        ctx.clearRect(0, 0, w, h);

        // Background layers
        if (typeof World !== 'undefined') {
            World.renderBackground(ctx, currentChapter, scrollX, 0, w, h);
            World.renderProps(ctx, currentChapter, scrollX, w, h);
        } else {
            // Fallback background
            renderFallbackBackground(w, h);
        }

        // Combat entities
        if (typeof Combat !== 'undefined') {
            Combat.render(ctx, scrollX);
        }

        // Foreground / weather
        if (typeof World !== 'undefined') {
            World.renderForeground(ctx, currentChapter, scrollX, w, h);
            World.renderWeather(ctx, currentChapter, gameTime, w, h);
        }
    }

    function renderFallbackBackground(w, h) {
        // Simple gradient sky
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#4a90d9');
        grad.addColorStop(0.6, '#87ceeb');
        grad.addColorStop(1, '#b0a899');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Ground
        ctx.fillStyle = '#b0a899';
        ctx.fillRect(0, 340, w, h - 340);

        // Simple buildings
        ctx.fillStyle = '#cc4444';
        for (let bx = -scrollX % 200; bx < w; bx += 200) {
            const bh = 80 + Math.sin(bx * 0.01) * 40;
            ctx.fillRect(bx, 340 - bh, 60, bh);
            // Windows
            ctx.fillStyle = '#f5c51880';
            for (let wy = 340 - bh + 8; wy < 340; wy += 12) {
                ctx.fillRect(bx + 8, wy, 6, 8);
                ctx.fillRect(bx + 22, wy, 6, 8);
                ctx.fillRect(bx + 36, wy, 6, 8);
            }
            ctx.fillStyle = '#cc4444';
        }
    }

    function updateHUD(player) {
        const hpFill = document.getElementById('hp-fill');
        const spFill = document.getElementById('sp-fill');
        const scoreVal = document.getElementById('score-value');
        const coinsVal = document.getElementById('coins-value');
        const levelVal = document.getElementById('player-level');
        const comboDisplay = document.getElementById('combo-display');
        const comboCount = document.getElementById('combo-count');

        if (hpFill) hpFill.style.width = (player.hp / player.maxHp * 100) + '%';
        if (spFill) spFill.style.width = (player.sp / player.maxSp * 100) + '%';
        if (scoreVal) scoreVal.textContent = player.score;
        if (coinsVal) coinsVal.textContent = player.coins;
        if (levelVal) levelVal.textContent = player.level;

        if (comboDisplay && comboCount) {
            if (player.combo > 1) {
                comboDisplay.classList.remove('hidden');
                comboCount.textContent = player.combo;
            } else {
                comboDisplay.classList.add('hidden');
            }
        }
    }

    function completeChapter() {
        saveData.completedChapters.push(currentChapter);
        saveGame();

        if (typeof Dialog !== 'undefined') {
            Dialog.showChapterComplete({
                chapter: currentChapter + 1,
                score: typeof Combat !== 'undefined' ? Combat.getPlayer().score : 0,
                level: typeof Combat !== 'undefined' ? Combat.getPlayer().level : 1
            });
        }

        setTimeout(() => {
            if (currentChapter < 9) {
                startChapter(currentChapter + 1);
            } else {
                // Game complete!
                showTitle();
            }
        }, 5000);
    }

    // ========================================================================
    // PAUSE
    // ========================================================================
    function togglePause() {
        if (currentState === STATE.COMBAT) {
            setState(STATE.PAUSE);
            const player = typeof Combat !== 'undefined' ? Combat.getPlayer() : saveData;
            document.getElementById('pause-chapter').textContent = currentChapter + 1;
            document.getElementById('pause-level').textContent = player.level;
            document.getElementById('pause-hp').textContent = Math.floor(player.hp);
            document.getElementById('pause-maxhp').textContent = player.maxHp;
            document.getElementById('pause-score').textContent = player.score;
        } else if (currentState === STATE.PAUSE) {
            setState(STATE.COMBAT);
        }
    }

    // ========================================================================
    // CANVAS RESIZE
    // ========================================================================
    function resizeCanvas() {
        if (!canvas) return;
        // Maintain 16:9 aspect ratio, scale to fit
        const aspect = 768 / 432;
        let w = window.innerWidth;
        let h = window.innerHeight;

        if (w / h > aspect) {
            w = h * aspect;
        } else {
            h = w / aspect;
        }

        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
    }

    // ========================================================================
    // INPUT SETUP
    // ========================================================================
    function setupInput() {
        document.addEventListener('keydown', (e) => {
            if (typeof Combat !== 'undefined') {
                Combat.keys[e.code] = true;
            }

            switch (e.code) {
                case 'Escape':
                    if (currentState === STATE.COMBAT || currentState === STATE.PAUSE) {
                        togglePause();
                    }
                    break;
                case 'Space':
                case 'Enter':
                    if (currentState === STATE.DIALOG || currentState === STATE.CHAPTER_INTRO) {
                        if (typeof Dialog !== 'undefined') Dialog.advanceLine();
                    }
                    break;
            }
        });

        document.addEventListener('keyup', (e) => {
            if (typeof Combat !== 'undefined') {
                Combat.keys[e.code] = false;
            }
        });

        // Touch support for mobile
        let touchStartX = 0, touchStartY = 0;
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            if (currentState === STATE.DIALOG || currentState === STATE.CHAPTER_INTRO) {
                if (typeof Dialog !== 'undefined') Dialog.advanceLine();
            }
        });
    }

    // ========================================================================
    // BUTTON SETUP
    // ========================================================================
    function setupButtons() {
        document.getElementById('btn-new-game').addEventListener('click', () => newGame());
        document.getElementById('btn-continue').addEventListener('click', () => continueGame());
        document.getElementById('btn-options').addEventListener('click', () => {
            Music.toggleMute();
            Music.playSFX('menu_select');
        });
        document.getElementById('btn-resume').addEventListener('click', () => togglePause());
        document.getElementById('btn-save').addEventListener('click', () => {
            saveGame();
            Music.playSFX('heal');
        });
        document.getElementById('btn-quit').addEventListener('click', () => {
            saveGame();
            isRunning = false;
            Music.stop();
            showTitle();
        });

        // Dialog advance on click
        const dialogBox = document.getElementById('dialog-box');
        if (dialogBox) {
            dialogBox.addEventListener('click', () => {
                if (currentState === STATE.DIALOG || currentState === STATE.CHAPTER_INTRO) {
                    if (typeof Dialog !== 'undefined') Dialog.advanceLine();
                }
            });
        }
    }

    // ========================================================================
    // INITIALIZATION
    // ========================================================================
    function init() {
        setupInput();
        setupButtons();
        window.addEventListener('resize', resizeCanvas);

        // Initialize sub-systems
        if (typeof Dialog !== 'undefined') Dialog.init();
        if (typeof Combat !== 'undefined') Combat.init();

        // Run boot sequence
        runBoot();
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return {
        STATE,
        Music,
        setState,
        newGame,
        continueGame,
        saveGame,
        startChapter,
        togglePause,
        getCurrentChapter: () => currentChapter,
        getScrollX: () => scrollX,
        getGameTime: () => gameTime,
        getSaveData: () => saveData
    };
})();
