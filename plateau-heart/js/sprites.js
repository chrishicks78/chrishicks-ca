/* ==========================================================================
   PLATEAU HEART — Sprite Generation System
   Christendo 24 — 24-bit procedural pixel art engine
   Power Baby Productions — 2026
   ========================================================================== */

const SpriteEngine = (() => {
    // 24-bit palette — richer than 16-bit SNES, more stylized than PS1
    const PALETTES = {
        skin: ['#f5d6b8', '#e8c49a', '#d4a574', '#b8834a', '#8b6332', '#5c3d1e', '#3d2810', '#f0c8a0', '#c99568', '#a67040'],
        hair: ['#1a1a2e', '#2d1b00', '#6b3a1f', '#c45c2a', '#e8c170', '#f5f0e0', '#cc3333', '#3366cc', '#9b59b6', '#39ff14',
               '#ff69b4', '#00d4ff', '#ff6b35', '#556b2f', '#8b4513', '#daa520'],
        eyes: ['#2d1b00', '#1a5276', '#1e8449', '#7d3c98', '#c0392b', '#e74c3c', '#00d4ff', '#ff6b35'],
        outfit_primary: [
            '#e94560', '#003da5', '#ff6b35', '#39ff14', '#9b59b6', '#f5c518',
            '#00d4ff', '#c8102e', '#2ecc71', '#e67e22', '#1abc9c', '#e74c3c',
            '#3498db', '#f39c12', '#8e44ad', '#d35400', '#16a085', '#c0392b',
            '#2980b9', '#27ae60'
        ],
        outfit_secondary: [
            '#1a1a2e', '#2c3e50', '#34495e', '#fff', '#f5f0e0', '#222',
            '#444', '#003366', '#660033', '#003300'
        ]
    };

    // Character body types
    const BODY_TYPES = ['slim', 'average', 'stocky', 'tall', 'short'];

    // Hair styles (drawn procedurally)
    const HAIR_STYLES = [
        'short', 'spiky', 'long', 'ponytail', 'mohawk', 'bald', 'afro',
        'bob', 'braids', 'messy', 'slicked', 'curly', 'buzz', 'dreads',
        'pigtails', 'undercut', 'topknot', 'bangs', 'wavy', 'shaved_sides'
    ];

    // Outfit styles
    const OUTFIT_STYLES = [
        'casual', 'winter_coat', 'hoodie', 'leather_jacket', 'flannel',
        'suit', 'dress', 'tank_top', 'jersey', 'denim_jacket',
        'parka', 'vest', 'turtleneck', 'bomber', 'cardigan',
        'overalls', 'tracksuit', 'chef_coat', 'apron', 'uniform'
    ];

    // Accessories
    const ACCESSORIES = [
        'none', 'glasses', 'sunglasses', 'toque', 'beret', 'cap',
        'scarf', 'bandana', 'earrings', 'necklace', 'headband',
        'mask', 'cigarette', 'coffee_cup', 'backpack', 'tattoo'
    ];

    function seededRandom(seed) {
        let s = seed;
        return function() {
            s = (s * 1103515245 + 12345) & 0x7fffffff;
            return s / 0x7fffffff;
        };
    }

    function pickFrom(arr, rng) {
        return arr[Math.floor(rng() * arr.length)];
    }

    function hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return { r, g, b };
    }

    function rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(c => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, '0')).join('');
    }

    function darken(hex, amount) {
        const c = hexToRgb(hex);
        return rgbToHex(c.r * (1 - amount), c.g * (1 - amount), c.b * (1 - amount));
    }

    function lighten(hex, amount) {
        const c = hexToRgb(hex);
        return rgbToHex(c.r + (255 - c.r) * amount, c.g + (255 - c.g) * amount, c.b + (255 - c.b) * amount);
    }

    // Generate a character sprite at given size
    // Returns an offscreen canvas
    function generateCharacterSprite(charDef, frameWidth = 48, frameHeight = 64) {
        const canvas = document.createElement('canvas');
        canvas.width = frameWidth;
        canvas.height = frameHeight;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        const skin = charDef.skinColor;
        const skinDark = darken(skin, 0.15);
        const hair = charDef.hairColor;
        const hairDark = darken(hair, 0.2);
        const outfitA = charDef.outfitPrimary;
        const outfitB = charDef.outfitSecondary;
        const outfitDark = darken(outfitA, 0.2);

        const px = (x, y, color) => {
            ctx.fillStyle = color;
            ctx.fillRect(x, y, 1, 1);
        };

        const rect = (x, y, w, h, color) => {
            ctx.fillStyle = color;
            ctx.fillRect(x, y, w, h);
        };

        // Scale factor based on body type
        let bodyW = 12, bodyH = 16, headSize = 10, legH = 14;
        switch (charDef.bodyType) {
            case 'slim': bodyW = 10; break;
            case 'stocky': bodyW = 14; bodyH = 14; headSize = 11; break;
            case 'tall': bodyH = 18; legH = 16; break;
            case 'short': bodyH = 12; legH = 10; headSize = 11; break;
        }

        const cx = Math.floor(frameWidth / 2);
        const baseY = frameHeight - 2;

        // Feet / shoes
        rect(cx - 5, baseY - 3, 4, 3, '#333');
        rect(cx + 1, baseY - 3, 4, 3, '#333');

        // Legs
        rect(cx - 4, baseY - 3 - legH, 3, legH, charDef.pantsColor || '#2c3e50');
        rect(cx + 1, baseY - 3 - legH, 3, legH, charDef.pantsColor || '#2c3e50');

        // Body / torso
        const torsoY = baseY - 3 - legH - bodyH;
        rect(cx - Math.floor(bodyW / 2), torsoY, bodyW, bodyH, outfitA);
        // Outfit detail stripe
        rect(cx - 1, torsoY + 2, 2, bodyH - 4, outfitB);

        // Arms
        rect(cx - Math.floor(bodyW / 2) - 3, torsoY + 2, 3, bodyH - 4, outfitA);
        rect(cx + Math.floor(bodyW / 2), torsoY + 2, 3, bodyH - 4, outfitA);
        // Hands
        rect(cx - Math.floor(bodyW / 2) - 3, torsoY + bodyH - 3, 3, 3, skin);
        rect(cx + Math.floor(bodyW / 2), torsoY + bodyH - 3, 3, 3, skin);

        // Neck
        rect(cx - 2, torsoY - 3, 4, 3, skin);

        // Head
        const headY = torsoY - 3 - headSize;
        rect(cx - Math.floor(headSize / 2), headY, headSize, headSize, skin);

        // Eyes
        const eyeY = headY + Math.floor(headSize * 0.35);
        px(cx - 2, eyeY, charDef.eyeColor);
        px(cx - 2, eyeY + 1, '#fff');
        px(cx + 2, eyeY, charDef.eyeColor);
        px(cx + 2, eyeY + 1, '#fff');

        // Mouth
        px(cx - 1, headY + Math.floor(headSize * 0.7), skinDark);
        px(cx, headY + Math.floor(headSize * 0.7), skinDark);
        px(cx + 1, headY + Math.floor(headSize * 0.7), skinDark);

        // Hair
        drawHair(ctx, charDef.hairStyle, cx, headY, headSize, hair, hairDark, px, rect);

        // Accessories
        drawAccessory(ctx, charDef.accessory, cx, headY, headSize, eyeY, charDef, px, rect);

        return canvas;
    }

    function drawHair(ctx, style, cx, headY, headSize, hair, hairDark, px, rect) {
        const hs = Math.floor(headSize / 2);
        switch (style) {
            case 'short':
                rect(cx - hs, headY - 2, headSize, 4, hair);
                rect(cx - hs - 1, headY, 1, 3, hair);
                rect(cx + hs, headY, 1, 3, hair);
                break;
            case 'spiky':
                rect(cx - hs, headY - 2, headSize, 3, hair);
                for (let i = 0; i < headSize; i += 2) {
                    rect(cx - hs + i, headY - 4 - (i % 3), 2, 3, hair);
                }
                break;
            case 'long':
                rect(cx - hs - 1, headY - 2, headSize + 2, 3, hair);
                rect(cx - hs - 2, headY, 2, headSize + 6, hair);
                rect(cx + hs, headY, 2, headSize + 6, hair);
                break;
            case 'ponytail':
                rect(cx - hs, headY - 2, headSize, 3, hair);
                rect(cx + hs - 1, headY + 1, 4, 2, hair);
                rect(cx + hs + 1, headY + 3, 3, 8, hair);
                break;
            case 'mohawk':
                rect(cx - 1, headY - 6, 3, 6, hair);
                rect(cx - 2, headY - 4, 5, 2, hairDark);
                break;
            case 'bald':
                rect(cx - hs, headY - 1, headSize, 2, hairDark);
                break;
            case 'afro':
                rect(cx - hs - 3, headY - 5, headSize + 6, headSize + 3, hair);
                break;
            case 'bob':
                rect(cx - hs - 1, headY - 2, headSize + 2, 3, hair);
                rect(cx - hs - 2, headY, 2, Math.floor(headSize * 0.7), hair);
                rect(cx + hs, headY, 2, Math.floor(headSize * 0.7), hair);
                break;
            case 'braids':
                rect(cx - hs, headY - 2, headSize, 3, hair);
                rect(cx - hs - 1, headY, 2, headSize + 8, hair);
                rect(cx + hs - 1, headY, 2, headSize + 8, hair);
                break;
            case 'messy':
                rect(cx - hs - 1, headY - 3, headSize + 2, 4, hair);
                for (let i = 0; i < 5; i++) {
                    px(cx - hs + i * 2 + (i % 2), headY - 4 - (i % 2), hair);
                }
                break;
            case 'slicked':
                rect(cx - hs, headY - 1, headSize, 3, hair);
                rect(cx + hs - 2, headY + 1, 4, 2, hairDark);
                break;
            case 'curly':
                rect(cx - hs - 1, headY - 3, headSize + 2, 4, hair);
                for (let i = 0; i < headSize + 2; i += 2) {
                    px(cx - hs - 1 + i, headY - 4, hair);
                }
                rect(cx - hs - 2, headY, 2, 4, hair);
                rect(cx + hs, headY, 2, 4, hair);
                break;
            case 'buzz':
                rect(cx - hs, headY - 1, headSize, 2, hairDark);
                break;
            case 'dreads':
                rect(cx - hs, headY - 2, headSize, 3, hair);
                for (let i = 0; i < 6; i++) {
                    const dx = cx - hs - 1 + i * 2;
                    rect(dx, headY + 1, 2, headSize + 4 + (i % 3) * 2, hair);
                }
                break;
            case 'pigtails':
                rect(cx - hs, headY - 2, headSize, 3, hair);
                rect(cx - hs - 3, headY + 1, 3, 8, hair);
                rect(cx + hs, headY + 1, 3, 8, hair);
                break;
            case 'undercut':
                rect(cx - hs, headY - 3, headSize, 3, hair);
                rect(cx - hs, headY - 1, Math.floor(headSize / 2), 2, hairDark);
                break;
            case 'topknot':
                rect(cx - 2, headY - 6, 4, 5, hair);
                rect(cx - 1, headY - 7, 2, 2, hair);
                break;
            case 'bangs':
                rect(cx - hs - 1, headY - 2, headSize + 2, 4, hair);
                rect(cx - hs, headY + 2, headSize, 2, hair);
                break;
            case 'wavy':
                rect(cx - hs - 1, headY - 2, headSize + 2, 3, hair);
                for (let i = 0; i < headSize + 4; i += 3) {
                    rect(cx - hs - 2 + i, headY + (i % 2), 2, headSize - 2, hair);
                }
                break;
            case 'shaved_sides':
                rect(cx - 2, headY - 3, 5, 4, hair);
                rect(cx - hs, headY - 1, 2, 2, hairDark);
                rect(cx + hs - 2, headY - 1, 2, 2, hairDark);
                break;
        }
    }

    function drawAccessory(ctx, accessory, cx, headY, headSize, eyeY, charDef, px, rect) {
        const hs = Math.floor(headSize / 2);
        switch (accessory) {
            case 'glasses':
                rect(cx - 4, eyeY - 1, 3, 3, '#333');
                rect(cx + 1, eyeY - 1, 3, 3, '#333');
                px(cx - 1, eyeY, '#333');
                px(cx, eyeY, '#333');
                break;
            case 'sunglasses':
                rect(cx - 4, eyeY - 1, 3, 3, '#111');
                rect(cx + 1, eyeY - 1, 3, 3, '#111');
                px(cx - 1, eyeY, '#222');
                px(cx, eyeY, '#222');
                break;
            case 'toque':
                rect(cx - hs - 1, headY - 5, headSize + 2, 5, '#c8102e');
                rect(cx - hs, headY - 6, headSize, 2, '#c8102e');
                rect(cx - 1, headY - 7, 2, 2, '#c8102e');
                break;
            case 'beret':
                rect(cx - hs - 2, headY - 3, headSize + 3, 3, '#2c3e50');
                rect(cx - hs, headY - 4, headSize - 2, 2, '#2c3e50');
                break;
            case 'cap':
                rect(cx - hs - 2, headY - 2, headSize + 4, 3, charDef.outfitPrimary);
                rect(cx - hs - 4, headY, 4, 2, charDef.outfitPrimary);
                break;
            case 'scarf':
                rect(cx - hs - 1, headY + headSize - 2, headSize + 2, 4, '#e94560');
                rect(cx - hs - 2, headY + headSize, 3, 6, '#e94560');
                break;
            case 'bandana':
                rect(cx - hs - 1, headY - 1, headSize + 2, 3, '#e94560');
                break;
            case 'earrings':
                px(cx - hs - 1, headY + Math.floor(headSize * 0.5), '#f5c518');
                px(cx + hs, headY + Math.floor(headSize * 0.5), '#f5c518');
                break;
            case 'headband':
                rect(cx - hs - 1, headY + 1, headSize + 2, 2, charDef.outfitPrimary);
                break;
            case 'mask':
                rect(cx - 3, headY + Math.floor(headSize * 0.5), 6, 4, '#eee');
                break;
            case 'tattoo':
                px(cx - hs, headY + Math.floor(headSize * 0.4), '#336');
                px(cx - hs - 1, headY + Math.floor(headSize * 0.5), '#336');
                break;
        }
    }

    // Generate a full sprite sheet with animation frames
    // frames: idle(2), walk(4), punch(3), kick(2), hurt(2), special(3)
    function generateSpriteSheet(charDef, frameW = 48, frameH = 64) {
        const frameCount = 16;
        const canvas = document.createElement('canvas');
        canvas.width = frameW * frameCount;
        canvas.height = frameH;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        for (let i = 0; i < frameCount; i++) {
            const frameCanvas = generateCharacterSprite(charDef, frameW, frameH);
            // Apply simple animation transforms
            ctx.save();
            ctx.translate(i * frameW, 0);

            if (i < 2) {
                // Idle: slight bob
                ctx.translate(0, i === 1 ? -1 : 0);
            } else if (i < 6) {
                // Walk: leg movement simulated by offset
                ctx.translate(0, (i % 2 === 0) ? -1 : 1);
            } else if (i < 9) {
                // Punch: arm extension
                ctx.translate(i === 8 ? 2 : 0, 0);
            } else if (i < 11) {
                // Kick: lean
                ctx.translate(i === 10 ? 3 : 0, -1);
            } else if (i < 13) {
                // Hurt: recoil
                ctx.translate(i === 12 ? -2 : -1, 1);
            } else {
                // Special: glow effect
                ctx.globalAlpha = 0.9;
            }

            ctx.drawImage(frameCanvas, 0, 0);
            ctx.restore();
        }

        return canvas;
    }

    // Generate a portrait (larger, more detailed) for dialog scenes
    function generatePortrait(charDef, size = 120) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        // Draw character sprite scaled up into portrait frame
        const sprite = generateCharacterSprite(charDef, 48, 64);

        // Background gradient
        const grad = ctx.createLinearGradient(0, 0, 0, size);
        grad.addColorStop(0, darken(charDef.outfitPrimary, 0.6));
        grad.addColorStop(1, darken(charDef.outfitPrimary, 0.8));
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);

        // Draw sprite centered, cropped to head/upper body
        ctx.drawImage(sprite, 8, 0, 32, 40, 10, 10, size - 20, (size - 20) * (40 / 32));

        // Border
        ctx.strokeStyle = charDef.outfitPrimary;
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, size - 2, size - 2);

        return canvas;
    }

    // Generate background tile
    function generateTile(type, size = 16) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        switch (type) {
            case 'sidewalk':
                ctx.fillStyle = '#b0a899';
                ctx.fillRect(0, 0, size, size);
                ctx.fillStyle = '#a09889';
                ctx.fillRect(0, size - 1, size, 1);
                ctx.fillRect(size - 1, 0, 1, size);
                break;
            case 'brick':
                ctx.fillStyle = '#8b4513';
                ctx.fillRect(0, 0, size, size);
                ctx.fillStyle = '#7a3b0f';
                ctx.fillRect(0, Math.floor(size / 2), size, 1);
                ctx.fillRect(Math.floor(size / 2), 0, 1, Math.floor(size / 2));
                ctx.fillRect(0, Math.floor(size / 2), 1, Math.floor(size / 2));
                break;
            case 'road':
                ctx.fillStyle = '#3a3a3a';
                ctx.fillRect(0, 0, size, size);
                ctx.fillStyle = '#333';
                ctx.fillRect(0, 0, size, 1);
                break;
            case 'grass':
                ctx.fillStyle = '#3a7a2a';
                ctx.fillRect(0, 0, size, size);
                ctx.fillStyle = '#4a8a3a';
                ctx.fillRect(2, 3, 1, 2);
                ctx.fillRect(8, 7, 1, 2);
                ctx.fillRect(13, 2, 1, 2);
                break;
            case 'snow':
                ctx.fillStyle = '#e8e8f0';
                ctx.fillRect(0, 0, size, size);
                ctx.fillStyle = '#d8d8e0';
                ctx.fillRect(3, 5, 2, 1);
                ctx.fillRect(10, 11, 2, 1);
                break;
            case 'wood':
                ctx.fillStyle = '#8B6914';
                ctx.fillRect(0, 0, size, size);
                ctx.fillStyle = '#7a5a10';
                for (let y = 0; y < size; y += 4) {
                    ctx.fillRect(0, y, size, 1);
                }
                break;
        }
        return canvas;
    }

    // Generate item sprite
    function generateItem(type, size = 16) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        switch (type) {
            case 'poutine': // Health restore
                ctx.fillStyle = '#c8a040';
                ctx.fillRect(3, 8, 10, 6);
                ctx.fillStyle = '#8b4513';
                ctx.fillRect(4, 5, 8, 4);
                ctx.fillStyle = '#f5c518';
                ctx.fillRect(5, 6, 2, 2);
                ctx.fillRect(8, 7, 2, 2);
                break;
            case 'bagel': // Small heal
                ctx.fillStyle = '#d4a050';
                ctx.beginPath();
                ctx.arc(8, 8, 5, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#c49040';
                ctx.beginPath();
                ctx.arc(8, 8, 2, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'smoked_meat': // Big heal
                ctx.fillStyle = '#8b2020';
                ctx.fillRect(3, 4, 10, 8);
                ctx.fillStyle = '#d4a070';
                ctx.fillRect(3, 4, 10, 2);
                ctx.fillStyle = '#6b1515';
                ctx.fillRect(5, 6, 6, 4);
                break;
            case 'coffee': // SP restore
                ctx.fillStyle = '#fff';
                ctx.fillRect(5, 4, 6, 8);
                ctx.fillStyle = '#6b3a1f';
                ctx.fillRect(6, 5, 4, 5);
                ctx.fillStyle = '#ddd';
                ctx.fillRect(11, 6, 2, 3);
                break;
            case 'coin':
                ctx.fillStyle = '#f5c518';
                ctx.beginPath();
                ctx.arc(8, 8, 5, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#d4a010';
                ctx.fillRect(7, 4, 2, 8);
                break;
        }
        return canvas;
    }

    return {
        PALETTES,
        BODY_TYPES,
        HAIR_STYLES,
        OUTFIT_STYLES,
        ACCESSORIES,
        seededRandom,
        pickFrom,
        darken,
        lighten,
        hexToRgb,
        rgbToHex,
        generateCharacterSprite,
        generateSpriteSheet,
        generatePortrait,
        generateTile,
        generateItem
    };
})();
