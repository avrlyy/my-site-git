const yearEl = document.querySelector('#year');
yearEl.textContent = new Date().getFullYear();

const themeBtn = document.querySelector('#theme-toggle');

themeBtn.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');

    const isDark = document.documentElement.classList.contains('dark');
    themeBtn.textContent = isDark ? '☀️' : '🌙';
    themeBtn.setAttribute('aria-label', isDark ? 'Переключить светлую тему' : 'Переключить темную тему');
});

const form = document.querySelector('form');
const statusMsg = document.querySelector('#form-status');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.querySelector('#name').value.trim();

    statusMsg.textContent = `Спасибо, ${name}! Сообщение отправлено.`;
    statusMsg.classList.add('visible');

    form.reset();
});

const upBtn = document.querySelector('#to-top');

window.addEventListener('scroll', () => {
    upBtn.classList.toggle('visible', window.scrollY > 400);
});

upBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* =========================================================
   ВЕРСИЯ ДЛЯ СЛАБОВИДЯЩИХ
   ========================================================= */

(function initA11y() {
    const html = document.documentElement;
    const panel = document.getElementById('a11y-panel');
    const toggleBtn = document.getElementById('a11y-toggle');
    const closeBtn = document.getElementById('a11y-close');

    if (!panel || !toggleBtn) return;

    const STORAGE_KEY = 'a11y-settings';

    const defaults = {
        enabled: false,
        font: 0,
        contrast: false,
        spacing: false,
        noImages: false,
        sans: false
    };

    let state = { ...defaults };

    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (saved && typeof saved === 'object') {
            state = { ...defaults, ...saved };
        }
    } catch (e) { /* ignore */ }

    function applyState() {
        panel.hidden = !state.enabled;
        toggleBtn.setAttribute('aria-pressed', String(state.enabled));
        toggleBtn.setAttribute(
            'aria-label',
            state.enabled
                ? 'Отключить версию для слабовидящих'
                : 'Включить версию для слабовидящих'
        );
        toggleBtn.textContent = state.enabled ? '👁‍🗨' : '👁';

        html.classList.remove('a11y-font-1', 'a11y-font-2', 'a11y-font-3');
        if (state.font > 0) {
            html.classList.add('a11y-font-' + Math.min(state.font, 3));
        }

        html.classList.toggle('a11y-contrast', state.contrast);
        html.classList.toggle('a11y-spacing', state.spacing);
        html.classList.toggle('a11y-no-images', state.noImages);
        html.classList.toggle('a11y-sans', state.sans);

        panel.querySelectorAll('[data-a11y]').forEach(btn => {
            const key = btn.dataset.a11y;
            if (key === 'font-down' || key === 'font-up' || key === 'font-reset' || key === 'reset') return;
            const map = {
                contrast: 'contrast',
                spacing: 'spacing',
                images: 'noImages',
                sans: 'sans'
            };
            const stateKey = map[key];
            if (stateKey) {
                btn.setAttribute('aria-pressed', String(!!state[stateKey]));
            }
        });

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) { /* ignore */ }
    }

    toggleBtn.addEventListener('click', () => {
        state.enabled = !state.enabled;
        applyState();
        if (state.enabled) {
            const h2 = panel.querySelector('h2');
            if (h2) {
                h2.setAttribute('tabindex', '-1');
                h2.focus();
            }
        } else {
            toggleBtn.focus();
        }
    });

    closeBtn.addEventListener('click', () => {
        state.enabled = false;
        applyState();
        toggleBtn.focus();
    });

    panel.addEventListener('click', (event) => {
        const btn = event.target.closest('[data-a11y]');
        if (!btn) return;

        const action = btn.dataset.a11y;

        switch (action) {
            case 'font-down':
                state.font = Math.max(0, state.font - 1);
                break;
            case 'font-up':
                state.font = Math.min(3, state.font + 1);
                break;
            case 'font-reset':
                state.font = 0;
                break;
            case 'contrast':
                state.contrast = !state.contrast;
                break;
            case 'spacing':
                state.spacing = !state.spacing;
                break;
            case 'images':
                state.noImages = !state.noImages;
                break;
            case 'sans':
                state.sans = !state.sans;
                break;
            case 'reset':
                state = { ...defaults, enabled: true };
                break;
            default:
                return;
        }

        applyState();

        const messages = {
            'font-down': 'Шрифт уменьшен',
            'font-up': 'Шрифт увеличен',
            'font-reset': 'Размер шрифта сброшен',
            contrast: state.contrast ? 'Чёрно-белый режим включён' : 'Чёрно-белый режим выключен',
            spacing: state.spacing ? 'Увеличенные интервалы включены' : 'Увеличенные интервалы выключены',
            images: state.noImages ? 'Изображения скрыты' : 'Изображения показаны',
            sans: state.sans ? 'Шрифт без засечек включён' : 'Шрифт без засечек выключен',
            reset: 'Настройки сброшены'
        };
        announce(messages[action] || '');
    });

    document.addEventListener('keydown', (event) => {
        if (event.altKey && (event.key === 'v' || event.key === 'V' || event.key === 'м' || event.key === 'М')) {
            event.preventDefault();
            state.enabled = !state.enabled;
            applyState();
        }
        if (event.key === 'Escape' && state.enabled) {
            state.enabled = false;
            applyState();
            toggleBtn.focus();
        }
    });

    let liveRegion = document.getElementById('a11y-live');
    if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'a11y-live';
        liveRegion.setAttribute('role', 'status');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.cssText =
            'position:absolute;width:1px;height:1px;padding:0;margin:-1px;' +
            'overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0;';
        document.body.appendChild(liveRegion);
    }

    function announce(text) {
        if (!text) return;
        liveRegion.textContent = '';
        window.setTimeout(() => { liveRegion.textContent = text; }, 50);
    }

    applyState();
})();