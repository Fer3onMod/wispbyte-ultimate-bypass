// ==UserScript==
// @name         Wispbyte Ultimate Bypass (Ad Bypass, Ad Blocker, RAM Boost)
// @name:ar      Wispbyte Ultimate Bypass (تجاوز الإعلانات، حظر الإعلانات، زيادة الرام)
// @name:es      Wispbyte Ultimate Bypass (Saltar anuncios, Bloqueador de anuncios, Boost de RAM)
// @name:pt-BR   Wispbyte Ultimate Bypass (Pular anúncios, Bloqueador de anúncios, Boost de RAM)
// @name:fr      Wispbyte Ultimate Bypass (Contournement de pub, Bloqueur de pub, Boost RAM)
// @name:de      Wispbyte Ultimate Bypass (Werbung überspringen, Werbeblocker, RAM-Boost)
// @name:ru      Wispbyte Ultimate Bypass (обход рекламы, блокировщик рекламы, буст RAM)
// @name:tr      Wispbyte Ultimate Bypass (Reklam Atlatma, Reklam Engelleyici, RAM Artırma)
// @name:id      Wispbyte Ultimate Bypass (Lewati Iklan, Pemblokir Iklan, Penambah RAM)
// @namespace    http://tampermonkey.net/
// @version      26.9
// @license      MIT
// @description        ⚡ Wispbyte Ad Bypass [START / +100 MiB RAM boost] + built-in ad/pop-up blocker, by Fer3on_Mod.
// @description:ar     ⚡ تجاوز إعلانات Wispbyte [تشغيل تلقائي / زيادة +100 ميجا رام] مع حظر إعلانات وبوب-أب مدمج، بواسطة Fer3on_Mod.
// @description:es     ⚡ Bypass de anuncios de Wispbyte [INICIO / +100 MiB de RAM] con bloqueador de anuncios y pop-ups integrado, por Fer3on_Mod.
// @description:pt-BR  ⚡ Bypass de anúncios do Wispbyte [INÍCIO / +100 MiB de RAM] com bloqueador de anúncios e pop-ups integrado, por Fer3on_Mod.
// @description:fr     ⚡ Contournement des pubs Wispbyte [DÉMARRAGE / +100 Mio de RAM] avec bloqueur de pubs et pop-ups intégré, par Fer3on_Mod.
// @description:de     ⚡ Wispbyte-Werbe-Bypass [START / +100 MiB RAM-Boost] mit integriertem Werbe-/Pop-up-Blocker, von Fer3on_Mod.
// @description:ru     ⚡ Обход рекламы Wispbyte [СТАРТ / +100 МиБ RAM] со встроенным блокировщиком рекламы и всплывающих окон, от Fer3on_Mod.
// @description:tr     ⚡ Wispbyte reklam atlatma [BAŞLAT / +100 MiB RAM artışı], dahili reklam/pop-up engelleyici ile, Fer3on_Mod tarafından.
// @description:id     ⚡ Bypass iklan Wispbyte [MULAI / +100 MiB RAM] dengan pemblokir iklan/pop-up bawaan, oleh Fer3on_Mod.
// @author       Fer3on_Mod
// @match        https://wispbyte.com/client/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/594672/Wispbyte%20Ultimate%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/594672/Wispbyte%20Ultimate%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    try {
        (function () {
            const isBlockedUrl = (u) => {
                try { return new URL(u, location.href).pathname.includes('disable-adblocker'); }
                catch (e) { return false; }
            };

            ['pushState', 'replaceState'].forEach((fn) => {
                const orig = history[fn];
                history[fn] = function (state, title, url) {
                    if (url && isBlockedUrl(url)) return;
                    return orig.apply(this, arguments);
                };
            });

            if (window.navigation && navigation.addEventListener) {
                navigation.addEventListener('navigate', (e) => {
                    if (e.cancelable && isBlockedUrl(e.destination.url)) e.preventDefault();
                });
            }

            const escapeIfBlocked = () => {
                if (isBlockedUrl(location.href)) location.replace('/client/');
            };
            escapeIfBlocked();
            setInterval(escapeIfBlocked, 500);


            if (!location.pathname.includes('venatus-reward-demo-prod')) {
                if (!window.adsbygoogle) window.adsbygoogle = { loaded: true, push() {} };
                const bait = document.createElement('div');
                bait.className = 'adsbox ad-banner pub_300x250 textAd';
                bait.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;';
                (document.body || document.documentElement).appendChild(bait);
            }
        })();
    } catch (err) { console.warn('[Fer guard]', err); }

        const isRewardPage = location.pathname.includes('venatus-reward-demo-prod');



    const getSiteFavicon = () => {
        const faviconLink = document.querySelector("link[rel*='icon']") || document.querySelector("link[rel*='shortcut icon']");
        return faviconLink ? faviconLink.href : 'https://wispbyte.com/favicon.ico';
    };

    const ICON_CANDIDATES = [
        getSiteFavicon(),
        'https://wispbyte.com/client/assets/wispbyte_blue.svg',
        'https://wispbyte.com/favicon.ico'
    ];
    function buildIconImg(alt, extraAttrs = '') {
        const list = JSON.stringify(ICON_CANDIDATES).replace(/"/g, '&quot;');
        return `<img src="${ICON_CANDIDATES[0]}" alt="${alt}" ${extraAttrs} data-fer-icons='${list}' data-fer-idx="0" onerror="var l=JSON.parse(this.getAttribute('data-fer-icons').replace(/&quot;/g,String.fromCharCode(34)));var i=parseInt(this.getAttribute('data-fer-idx'),10)+1;if(i<l.length){this.setAttribute('data-fer-idx',i);this.src=l[i];}else{this.style.display='none';}">`;
    }

    const getStats = () => {
        try {
            return JSON.parse(localStorage.getItem('fer_stats')) || { successes: 0, timeSaved: 0, fails: 0 };
        } catch (e) {
            return { successes: 0, timeSaved: 0, fails: 0 };
        }
    };

    const getTodayKey = () => {
        const d = new Date();
        return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    };

    const checkDailyReset = () => {
        try {
            const today = getTodayKey();
            const lastDay = localStorage.getItem('fer_stats_reset_day');
            if (!lastDay) {
                localStorage.setItem('fer_stats_reset_day', today);
                return false;
            }
            if (lastDay !== today) {
                localStorage.setItem('fer_stats', JSON.stringify({ successes: 0, timeSaved: 0, fails: 0 }));
                localStorage.setItem('fer_stats_reset_day', today);
                return true;
            }
        } catch (e) {}
        return false;
    };

    checkDailyReset();

    const updateStats = (key, val) => {
        checkDailyReset();
        let stats = getStats();
        stats[key] = (stats[key] || 0) + val;
        localStorage.setItem('fer_stats', JSON.stringify(stats));
    };

    const AD_BLOCK_KEY = 'fer_adblock_enabled';
    const AD_BLOCK_CLASS = 'fer-adblock-on';
    const isAdBlockOn = () => localStorage.getItem(AD_BLOCK_KEY) !== '0';

    const adBlockStyle = document.createElement('style');
    adBlockStyle.id = 'fer-adblock-style';
    adBlockStyle.textContent = `
        html.${AD_BLOCK_CLASS} .wisp-ad-slot,
        html.${AD_BLOCK_CLASS} .slot-note,
        html.${AD_BLOCK_CLASS} ins.adsbygoogle,
        html.${AD_BLOCK_CLASS} iframe[src*="doubleclick"],
        html.${AD_BLOCK_CLASS} iframe[src*="googlesyndication"],
        html.${AD_BLOCK_CLASS} iframe[src*="googleadservices"],
        html.${AD_BLOCK_CLASS} iframe[src*="adnxs"],
        html.${AD_BLOCK_CLASS} iframe[id^="google_ads_iframe"],
        html.${AD_BLOCK_CLASS} div[id^="google_ads_iframe_"],
        html.${AD_BLOCK_CLASS} div[id*="horizontalsticky"],
        html.${AD_BLOCK_CLASS} div[id*="verticalsticky"],
        html.${AD_BLOCK_CLASS} span[style*="z-index: 2147483646"] {
            display: none !important;
        }

        /* Collapse the dedicated ad rail entirely so the console goes
           back to its natural full-width layout, exactly as if the
           page never reserved a column for an ad there. */
        html.${AD_BLOCK_CLASS} .srv-lrail {
            display: none !important;
        }
        html.${AD_BLOCK_CLASS} .srv-body.has-lrail {
            display: block !important;
        }

        /* Dashboard's billboard / leaderboard / video / skyscraper ads
           all carry .wisp-ad-slot already (handled above) and sit
           inside normal flow or a mixed sidebar (.dash__aside) that
           also holds real widgets (Wisp FM, social links) — so hiding
           just the ad slot already lets everything reclaim its space
           naturally with no extra frame to flatten there. */

        /* Login/signup pages: hide the promo branding panel
           (.left-wrapper.auth-brand) entirely. We don't know this
           panel's sibling/parent class names ahead of time, so :has()
           finds whichever container holds it as a direct child and
           flattens it to a single block column — same trick as the
           console's ad rail, but it works on any page layout without
           needing to hardcode that page's wrapper class. */
        html.${AD_BLOCK_CLASS} .left-wrapper.auth-brand {
            display: none !important;
        }
        html.${AD_BLOCK_CLASS} *:has(> .left-wrapper.auth-brand) {
            display: block !important;
            grid-template-columns: 1fr !important;
        }
    `;
    document.documentElement.appendChild(adBlockStyle);

    function setAdOpenGuard(on) {
        if (on) {
            if (!window.__ferOriginalOpen) window.__ferOriginalOpen = window.open;
            window.open = function() { return null; };
        } else if (window.__ferOriginalOpen) {
            window.open = window.__ferOriginalOpen;
            window.__ferOriginalOpen = null;
        }
    }

    function applyAdBlockState(on) {
        document.documentElement.classList.toggle(AD_BLOCK_CLASS, on);
        setAdOpenGuard(on);
    }

    applyAdBlockState(isAdBlockOn());

    function playSuccessSound() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const now = ctx.currentTime;
            const frequencies = [523.25, 659.25, 783.99, 1046.50];
            frequencies.forEach((freq, index) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now + (index * 0.08));

                gain.gain.setValueAtTime(0, now + (index * 0.08));
                gain.gain.linearRampToValueAtTime(0.12, now + (index * 0.08) + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, now + (index * 0.08) + 0.3);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(now + (index * 0.08));
                osc.stop(now + (index * 0.08) + 0.35);
            });
        } catch (e) {}
    }

    function playErrorSound() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const now = ctx.currentTime;
            for (let i = 0; i < 2; i++) {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(300, now + (i * 0.15));
                osc.frequency.linearRampToValueAtTime(150, now + (i * 0.15) + 0.12);

                gain.gain.setValueAtTime(0.15, now + (i * 0.15));
                gain.gain.exponentialRampToValueAtTime(0.001, now + (i * 0.15) + 0.13);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(now + (i * 0.15));
                osc.stop(now + (i * 0.15) + 0.14);
            }
        } catch (e) {}
    }

    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
        @keyframes fer-fadein {
            from { transform: scale(0.92) translateY(10px); opacity: 0; }
            to { transform: scale(1) translateY(0); opacity: 1; }
        }
        #fer-backdrop {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(8, 8, 12, 0.8); backdrop-filter: blur(8px);
            z-index: 999998;
        }
        #fer-box {
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: #111115; color: #fff; padding: 22px 26px;
            border-radius: 18px; border: 1px solid rgba(200, 20, 30, 0.4);
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.85), 0 0 20px rgba(200, 20, 30, 0.15);
            z-index: 999999; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            width: 320px; text-align: center;
            animation: fer-fadein 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        #fer-box h3 { margin: 0 0 10px 0; font-size: 18px; color: #ff4d4f; display: flex; justify-content: space-between; align-items: center; }
        #fer-box h3 span { font-size: 10px; background: rgba(255,77,79,0.1); padding: 3px 8px; border-radius: 6px; color: #ff4d4f; border: 1px solid rgba(255,77,79,0.2); }
        #fer-box p { margin: 0 0 14px 0; font-size: 13px; color: #aaa; line-height: 1.5; }
        #fer-progress-bar { width: 100%; height: 6px; background: #1c1c22; border-radius: 4px; overflow: hidden; margin-bottom: 12px; }
        #fer-progress-fill { width: 0%; height: 100%; background: linear-gradient(90deg, #c8141e, #ff4d4f); transition: width 0.3s ease; }
        #fer-btn { background: #c8141e; color: white; border: none; padding: 10px 16px; font-size: 12px; border-radius: 8px; cursor: pointer; font-weight: bold; display: none; width: 100%; margin-top: 8px; transition: 0.2s; }
        #fer-btn:hover { background: #e01622; transform: translateY(-1px); }

        #fer-control-toggle {
            position: fixed; bottom: 20px; right: 20px; background: #151518; color: #fff;
            width: 46px; height: 46px; border-radius: 14px; border: 1px solid #2a2a30; z-index: 999999;
            cursor: pointer; box-shadow: 0 8px 24px rgba(0,0,0,0.6);
            display: flex; align-items: center; justify-content: center; transition: all 0.2s;
        }
        #fer-control-toggle:hover { transform: scale(1.06); border-color: #ff4d4f; box-shadow: 0 0 15px rgba(255,77,79,0.3); }
        #fer-control-toggle img { width: 22px; height: 22px; object-fit: contain; }

        #fer-modal {
            position: fixed; bottom: 76px; right: 20px;
            background: #111114; color: #fff; padding: 18px; border-radius: 18px;
            border: 1px solid #23232a; z-index: 1000000; width: 290px; display: none;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            box-shadow: 0 25px 60px rgba(0,0,0,0.9); text-align: left;
            user-select: none; animation: fer-fadein 0.2s ease;
        }
        #fer-modal-header {
            display: flex; justify-content: space-between; align-items: center;
            border-bottom: 1px solid #1e1e24; padding-bottom: 12px; margin-bottom: 14px;
            cursor: move;
        }
        .fer-brand-group { display: flex; align-items: center; gap: 8px; pointer-events: none; }
        .fer-brand-group img { width: 22px; height: 22px; object-fit: contain; }
        .fer-brand-title { font-size: 14px; font-weight: 700; color: #fff; }
        .fer-ver-badge { font-size: 9px; background: rgba(200, 20, 30, 0.15); color: #ff4d4f; padding: 2px 6px; border-radius: 5px; border: 1px solid rgba(200, 20, 30, 0.3); font-weight: 700; }

        #fer-modal-x {
            background: #1a1a20; border: 1px solid #2a2a33; color: #888; width: 26px; height: 26px;
            border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 13px; transition: all 0.2s;
        }
        #fer-modal-x:hover { background: #c8141e; color: #fff; border-color: #c8141e; }

        .fer-onyx-card {
            background: #17171c; border: 1px solid #22222a; border-radius: 12px; padding: 12px; margin-bottom: 10px;
        }
        .fer-card-label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.8px; color: #777; margin-bottom: 4px; font-weight: 700; }

        .fer-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
        .fer-sub-card { background: #17171c; border: 1px solid #22222a; border-radius: 12px; padding: 10px; text-align: center; }
        .fer-sub-card span { display: block; font-size: 16px; font-weight: bold; color: #52c41a; margin-top: 2px; }

        .fer-modal-footer-row { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; padding-top: 10px; border-top: 1px solid #1e1e24; }
        .fer-status-indicator { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #aaa; }
        .fer-dot { width: 8px; height: 8px; background: #52c41a; border-radius: 50%; box-shadow: 0 0 8px #52c41a; display: inline-block; }
        .fer-dot.cooldown { background: #ff4d4f; box-shadow: 0 0 8px #ff4d4f; }

        .fer-dev-sign { text-align: center; font-size: 10px; color: #444; margin-top: 10px; }
        .fer-dev-sign strong { color: #ff4d4f; }
    `;
    document.head.appendChild(styleElement);

    function formatTimeEnglish(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        let parts = [];
        if (hours > 0) parts.push(`${hours}h`);
        if (minutes > 0 || hours > 0) parts.push(`${minutes}m`);
        parts.push(`${seconds}s`);
        return parts.join(' ');
    }

    const siteFavicon = getSiteFavicon();

    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'fer-control-toggle';
    toggleBtn.title = 'Fer3on_Mod Pro Menu';
    toggleBtn.innerHTML = buildIconImg("Icon");
    document.body.appendChild(toggleBtn);

    const stats = getStats();
    const modal = document.createElement('div');
    modal.id = 'fer-modal';
    modal.innerHTML = `
        <div id="fer-modal-header">
            <div class="fer-brand-group">
                ${buildIconImg("Logo")}
                <span class="fer-brand-title">WispByte</span>
                <span class="fer-ver-badge">Bypass</span>
            </div>
            <button id="fer-modal-x">&times;</button>
        </div>

        <div class="fer-onyx-card" id="fer-cooldown-card" style="display:none;">
            <div class="fer-card-label">Active Cooldown</div>
            <div style="font-size:14px; color:#ff4d4f; font-weight:bold;" id="fer-menu-cd-time">0s</div>
        </div>

        <div class="fer-grid-2">
            <div class="fer-sub-card">
                <div class="fer-card-label">Successes</div>
                <span id="fer-stat-succ">${stats.successes}</span>
            </div>
            <div class="fer-sub-card">
                <div class="fer-card-label">Time Saved</div>
                <span id="fer-stat-time" style="color:#ff4d4f;">${stats.timeSaved}s</span>
            </div>
        </div>

        <div class="fer-onyx-card" id="fer-adblock-card" style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
            <div>
                <div class="fer-card-label">Ad / Pop-up Blocker</div>
                <div style="font-size:12px; color:#aaa;" id="fer-adblock-status">On</div>
            </div>
            <button id="fer-adblock-toggle" style="background:#1c1c22; border:1px solid #2a2a30; color:#fff; font-size:11px; font-weight:bold; padding:6px 12px; border-radius:8px; cursor:pointer;">Disable</button>
        </div>

        <div class="fer-modal-footer-row">
            <div class="fer-status-indicator">
                <span class="fer-dot" id="fer-status-dot"></span>
                <span id="fer-status-label">Ready</span>
            </div>
        </div>

        <div class="fer-dev-sign">
            Dev: <strong>Fer3on_Mod</strong>
        </div>
    `;
    document.body.appendChild(modal);

    let isDragging = false, startX, startY, initialX, initialY;
    const modalHeader = document.getElementById('fer-modal-header');

    modalHeader.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        const rect = modal.getBoundingClientRect();
        initialX = rect.left;
        initialY = rect.top;
        modal.style.top = initialY + 'px';
        modal.style.left = initialX + 'px';
        modal.style.bottom = 'auto';
        modal.style.right = 'auto';
        modal.style.transform = 'none';
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        modal.style.left = (initialX + dx) + 'px';
        modal.style.top = (initialY + dy) + 'px';
    });

    document.addEventListener('mouseup', () => { isDragging = false; });

    const closeModal = () => { modal.style.display = 'none'; };
    toggleBtn.addEventListener('click', () => {
        modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
    });
    document.getElementById('fer-modal-x').addEventListener('click', closeModal);

    const adBlockToggleBtn = document.getElementById('fer-adblock-toggle');
    const adBlockStatusLabel = document.getElementById('fer-adblock-status');
    function refreshAdBlockUI() {
        const on = isAdBlockOn();
        if (adBlockStatusLabel) {
            adBlockStatusLabel.textContent = on ? 'On' : 'Off';
            adBlockStatusLabel.style.color = on ? '#52c41a' : '#ff4d4f';
        }
        if (adBlockToggleBtn) adBlockToggleBtn.textContent = on ? 'Disable' : 'Enable';
    }
    refreshAdBlockUI();
    if (adBlockToggleBtn) {
        adBlockToggleBtn.addEventListener('click', () => {
            const nowOn = !isAdBlockOn();
            localStorage.setItem(AD_BLOCK_KEY, nowOn ? '1' : '0');
            applyAdBlockState(nowOn);
            refreshAdBlockUI();
        });
    }

    const cooldownCard = document.getElementById('fer-cooldown-card');
    const menuCdTime = document.getElementById('fer-menu-cd-time');
    const statusDot = document.getElementById('fer-status-dot');
    const statusLabel = document.getElementById('fer-status-label');

    function checkGlobalCooldown() {
        if (checkDailyReset()) {
            const succEl = document.getElementById('fer-stat-succ');
            const timeEl = document.getElementById('fer-stat-time');
            if (succEl) succEl.textContent = '0';
            if (timeEl) timeEl.textContent = '0s';
        }

        const coolEnd = localStorage.getItem('fer_cooldown_end');
        if (!coolEnd) {
            if (cooldownCard) cooldownCard.style.display = 'none';
            if (statusDot) statusDot.classList.remove('cooldown');
            if (statusLabel) statusLabel.textContent = 'Ready';
            return;
        }

        const now = Date.now();
        const remaining = Math.floor((parseInt(coolEnd) - now) / 1000);

        if (remaining > 0) {
            if (cooldownCard) cooldownCard.style.display = 'block';
            if (menuCdTime) menuCdTime.textContent = formatTimeEnglish(remaining);
            if (statusDot) statusDot.classList.add('cooldown');
            if (statusLabel) statusLabel.textContent = 'Cooldown Active';
        } else {
            localStorage.removeItem('fer_cooldown_end');
            if (cooldownCard) cooldownCard.style.display = 'none';
            if (statusDot) statusDot.classList.remove('cooldown');
            if (statusLabel) statusLabel.textContent = 'Ready';

            playSuccessSound();

            if (isRewardPage) {
                location.reload();
            }
        }
    }

    setInterval(checkGlobalCooldown, 1000);

    if (!isRewardPage) return;

    const backdrop = document.createElement('div');
    backdrop.id = 'fer-backdrop';
    document.body.appendChild(backdrop);

    const box = document.createElement('div');
    box.id = 'fer-box';
    box.innerHTML = `
        <h3>Fer3on Bypass ⚡ <span>V26.7 Pro</span></h3>
        <p id="fer-status">Initializing parameters...</p>
        <div id="fer-progress-bar"><div id="fer-progress-fill"></div></div>
        <button id="fer-btn">Retry Manually</button>
    `;
    document.body.appendChild(box);

    const statusEl = document.getElementById('fer-status');
    const fillEl = document.getElementById('fer-progress-fill');
    const btnEl = document.getElementById('fer-btn');

    btnEl.addEventListener('click', () => {
        btnEl.style.display = 'none';
        startBypassSequence();
    });

    function updateUI(msg, color = '#c8141e', progressPercent = 0) {
        if (statusEl) statusEl.innerHTML = msg;
        if (fillEl) fillEl.style.width = progressPercent + '%';
        box.style.borderColor = color;
        box.querySelector('h3').style.color = color;
    }

    const params = new URLSearchParams(window.location.search);
    const returnUrl = params.get('return') || '';
    const purpose = params.get('purpose') || '';
        const serverId = params.get('serverId') || '';
    const isRamBoost = (purpose === 'ram_boost');


    function getValidReturnUrl() {
        if (!returnUrl) return null;
        try {
            const parsed = new URL(returnUrl, location.origin);
            if (parsed.origin !== location.origin) return null;
            return parsed;
        } catch (e) {
            return null;
        }
    }

    function executeServerRequest(attempt = 0) {
        let endpoint = '';
        let successParam = '';

        if (isRamBoost) {
            if (!serverId) {
                updateUI('Error: Missing Server ID!', '#ff4d4f', 100);
                btnEl.style.display = 'block';

                return;
            }
            endpoint = `/client/api/server/${encodeURIComponent(serverId)}/memory-boost/claim`;
            successParam = 'ramBoostDone';
        } else {
            endpoint = '/client/api/server/start-captcha/rewarded';
            successParam = 'rewardDone';
        }

        updateUI(`Sending claim request... (${attempt + 1})`, '#faad14', 85);

        fetch(endpoint, {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        })
        .then(async res => {
            let data = {};
            try { data = await res.json(); } catch (e) {}

            if (res.ok) {
                updateStats('successes', 1);
                updateStats('timeSaved', 8);
                localStorage.removeItem('fer_fails');
                updateUI('Success! Redirecting...', '#52c41a', 100);

                playSuccessSound();

                const backUrl = getValidReturnUrl();
                if (backUrl) {
                    backUrl.searchParams.set(successParam, '1');
                    setTimeout(() => window.location.assign(backUrl.toString()), 1200);
                } else {
                    setTimeout(() => window.close(), 1200);
                }
                return;
            }

            if (res.status === 429) {
                let waitSec = data.retryAfterSeconds || 60;
                let currentFails = (JSON.parse(localStorage.getItem('fer_fails')) || 0) + 1;
                localStorage.setItem('fer_fails', currentFails);

                playErrorSound();

                if (currentFails > 5) {
                    updateUI(`🚫 Max Retries Reached (5x).<br>Paused for safety.`, '#ff4d4f', 100);
                    btnEl.style.display = 'block';


                    return;
                }

                const endTime = Date.now() + (waitSec * 1000);
                localStorage.setItem('fer_cooldown_end', endTime);

                updateUI(`🚫 Rate Limited!<br>Cooldown active. Check menu timer.`, '#ff4d4f', 100);
                btnEl.style.display = 'block';



                const cooldownInterval = setInterval(() => {
                    const currentRem = Math.floor((endTime - Date.now()) / 1000);
                    if (currentRem <= 0) {
                        clearInterval(cooldownInterval);
                        localStorage.removeItem('fer_cooldown_end');
                        updateUI('✅ Cooldown ended! Retrying...', '#52c41a', 100);
                        playSuccessSound();
                        setTimeout(() => executeServerRequest(0), 1000);
                    }
                }, 1000);

            } else {
                const errMsg = data.message || res.statusText || 'Error';
                updateUI(`Failed (${res.status}): ${errMsg}`, '#ff4d4f', 100);
                btnEl.style.display = 'block';

                playErrorSound();
                updateStats('fails', 1);


            }
        })
                .catch(() => {
            updateUI('Network error occurred.', '#ff4d4f', 100);
            btnEl.style.display = 'block';
            playErrorSound();
            updateStats('fails', 1);


        });
    }

    function startBypassSequence() {
        let totalSeconds = Math.floor(Math.random() * (9 - 6 + 1)) + 6;
        let currentSec = 0;

        updateUI(`⚡ <strong>Fast Anti-Rate Limit</strong><br>Processing (${totalSeconds}s)...`, '#1890ff', 15);

        const timer = setInterval(() => {
            currentSec++;
            let percent = Math.floor((currentSec / totalSeconds) * 80);

            if (currentSec < totalSeconds) {
                updateUI(`⚡ <strong>Fast Anti-Rate Limit</strong><br>Waiting... (${totalSeconds - currentSec}s)`, '#1890ff', percent);
            } else {
                clearInterval(timer);
                updateUI('Connecting to server...', '#52c41a', 90);
                setTimeout(() => executeServerRequest(0), 300);
            }
        }, 1000);
    }

    setTimeout(startBypassSequence, 400);

})();
