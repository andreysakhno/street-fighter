var L = Object.defineProperty;
var K = (t, e, i) => (e in t ? L(t, e, { enumerable: !0, configurable: !0, writable: !0, value: i }) : (t[e] = i));
var E = (t, e, i) => (K(t, typeof e != 'symbol' ? e + '' : e, i), i),
    b = (t, e, i) => {
        if (!e.has(t)) throw TypeError('Cannot ' + i);
    };
var l = (t, e, i) => (b(t, e, 'read from private field'), i ? i.call(t) : e.get(t)),
    u = (t, e, i) => {
        if (e.has(t)) throw TypeError('Cannot add the same private member more than once');
        e instanceof WeakSet ? e.add(t) : e.set(t, i);
    },
    w = (t, e, i, n) => (b(t, e, 'write to private field'), n ? n.call(t, i) : e.set(t, i), i);
(function () {
    const e = document.createElement('link').relList;
    if (e && e.supports && e.supports('modulepreload')) return;
    for (const a of document.querySelectorAll('link[rel="modulepreload"]')) n(a);
    new MutationObserver(a => {
        for (const s of a)
            if (s.type === 'childList')
                for (const c of s.addedNodes) c.tagName === 'LINK' && c.rel === 'modulepreload' && n(c);
    }).observe(document, { childList: !0, subtree: !0 });
    function i(a) {
        const s = {};
        return (
            a.integrity && (s.integrity = a.integrity),
            a.referrerPolicy && (s.referrerPolicy = a.referrerPolicy),
            a.crossOrigin === 'use-credentials'
                ? (s.credentials = 'include')
                : a.crossOrigin === 'anonymous'
                ? (s.credentials = 'omit')
                : (s.credentials = 'same-origin'),
            s
        );
    }
    function n(a) {
        if (a.ep) return;
        a.ep = !0;
        const s = i(a);
        fetch(a.href, s);
    }
})();
function r({ tagName: t, className: e, attributes: i = {} }) {
    const n = document.createElement(t);
    if (e) {
        const a = e.split(' ').filter(Boolean);
        n.classList.add(...a);
    }
    return Object.keys(i).forEach(a => n.setAttribute(a, i[a])), n;
}
function A(t) {
    const { source: e, name: i } = t;
    return r({ tagName: 'img', className: 'fighter-preview___img', attributes: { src: e, title: i, alt: i } });
}
function M(t, e) {
    const i = r({ tagName: 'div', className: `fighter-preview___characteristic ${t}` });
    return (i.textContent = e), i;
}
function x(t) {
    const { name: e, _id: i, source: n, ...a } = t,
        s = r({ tagName: 'div', className: 'fighter-preview___info' }),
        c = r({ tagName: 'h3', className: 'fighter-preview__name' });
    c.textContent = e;
    const m = r({ tagName: 'div', className: 'fighter-preview__characteristics' }),
        g = Object.entries(a).map(([o, T]) => M(o, T));
    return m.append(...g), s.append(c, m), s;
}
function k(t, e) {
    const n = r({
        tagName: 'div',
        className: `fighter-preview___root ${e === 'right' ? 'fighter-preview___right' : 'fighter-preview___left'}`
    });
    if (t) {
        const a = A(t),
            s = x(t);
        n.append(a, s);
    } else n.textContent = 'Choose an opponent';
    return n;
}
const d = {
    PlayerOneAttack: 'KeyA',
    PlayerOneBlock: 'KeyD',
    PlayerTwoAttack: 'KeyJ',
    PlayerTwoBlock: 'KeyL',
    PlayerOneCriticalHitCombination: ['KeyQ', 'KeyW', 'KeyE'],
    PlayerTwoCriticalHitCombination: ['KeyU', 'KeyI', 'KeyO']
};
var y, h;
class B {
    constructor(e, i = 'left') {
        u(this, y, 1e4);
        u(this, h, { hit: 'hit', block: 'block', criticalHit: 'critical-hit' });
        (this.name = e.name),
            (this.health = e.health),
            (this.attack = e.attack),
            (this.defense = e.defense),
            (this.initialHealth = this.health),
            (this.isBlock = !1),
            (this.criticalHitPossibility = !0),
            (this.fighterElement = document.querySelector(`.arena___${i}-fighter`)),
            (this.healthBarElement = document.getElementById(`${i}-fighter-indicator`)),
            (this.criticalHitBoardElement = null),
            this.createCriticalHitBoardElement(i);
    }
    createCriticalHitBoardElement() {
        (this.criticalHitBoardElement = r({ tagName: 'div', className: 'arena___fighter-critical-hit-board' })),
            (this.criticalHitBoardElement.textContent = '⚡'),
            this.healthBarElement.closest('.arena___health-indicator').after(this.criticalHitBoardElement);
    }
    causeDamage(e) {
        (this.health -= e), this.updateHealthBar();
    }
    updateHealthBar() {
        const e = Math.max(0, (this.health * 100) / this.initialHealth);
        this.healthBarElement.style.width = `${e}%`;
    }
    putBlock() {
        (this.isBlock = !0), this.showAction(l(this, h).block);
    }
    removeBlock() {
        (this.isBlock = !1), this.hideAction(l(this, h).block);
    }
    doHit(e, i) {
        this.showAction(l(this, h).hit),
            e.isBlock || e.causeDamage(i),
            setTimeout(() => {
                this.hideAction(l(this, h).hit);
            }, 300);
    }
    doCriticalAttack(e) {
        if (this.isBlock || !this.criticalHitPossibility) return;
        this.showAction(l(this, h).criticalHit);
        const i = 2 * this.attack;
        e.causeDamage(i),
            this.disableCriticalHit(),
            setTimeout(() => {
                this.hideAction(l(this, h).criticalHit);
            }, 300);
    }
    disableCriticalHit() {
        (this.criticalHitPossibility = !1), this.restoreCriticalHit();
    }
    restoreCriticalHit() {
        let e = l(this, y) / 1e3;
        const i = () => {
            (this.criticalHitBoardElement.textContent = e),
                e > 0
                    ? setTimeout(i, 1e3)
                    : ((this.criticalHitPossibility = !0), (this.criticalHitBoardElement.textContent = '⚡')),
                (e -= 1);
        };
        i();
    }
    showAction(e) {
        this.fighterElement.classList.add(e);
    }
    hideAction(e) {
        this.fighterElement.classList.remove(e);
    }
    hideAllActions() {
        Object.values(l(this, h)).forEach(e => {
            this.fighterElement.classList.remove(e);
        });
    }
}
(y = new WeakMap()), (h = new WeakMap());
function I(t, e) {
    const i = t + Math.random() * (e - t);
    return Math.round(i * 100) / 100;
}
function S(t) {
    const e = I(1, 2);
    return t.attack * e;
}
function $(t) {
    const e = I(1, 2);
    return t.defense * e;
}
function C(t, e) {
    const i = S(t) - $(e);
    return i > 0 ? i : 0;
}
async function D(t, e) {
    return new Promise(i => {
        const n = new B(t, 'left'),
            a = new B(e, 'right'),
            s = new Set();
        document.addEventListener('keydown', c => {
            const m = Object.values(d).flat();
            if (c.repeat || !m.some(o => o === c.code)) return;
            const g = c.code;
            if ((s.add(g), g === d.PlayerOneAttack)) {
                if (n.isBlock) return;
                const o = C(n, a);
                n.doHit(a, o);
            }
            if (g === d.PlayerTwoAttack) {
                if (a.isBlock) return;
                const o = C(a, n);
                a.doHit(n, o);
            }
            g === d.PlayerOneBlock && n.putBlock(),
                g === d.PlayerTwoBlock && a.putBlock(),
                d.PlayerOneCriticalHitCombination.every(o => s.has(o)) && n.doCriticalAttack(a),
                d.PlayerTwoCriticalHitCombination.every(o => s.has(o)) && a.doCriticalAttack(n),
                n.health <= 0 && i(e),
                a.health <= 0 && i(t);
        }),
            document.addEventListener('keyup', c => {
                const m = c.code;
                m === d.PlayerOneBlock && n.removeBlock(), m === d.PlayerTwoBlock && a.removeBlock(), s.delete(m);
            });
    });
}
function j() {
    return document.getElementById('root');
}
function q() {
    const t = document.getElementsByClassName('modal-layer')[0];
    t == null || t.remove();
}
function R(t, e) {
    const i = r({ tagName: 'div', className: 'modal-header' }),
        n = r({ tagName: 'span' }),
        a = r({ tagName: 'div', className: 'close-btn' });
    (n.innerText = t), (a.innerText = '×');
    const s = () => {
        q(), e();
    };
    return a.addEventListener('click', s), i.append(n, a), i;
}
function G({ title: t, bodyElement: e, onClose: i }) {
    const n = r({ tagName: 'div', className: 'modal-layer' }),
        a = r({ tagName: 'div', className: 'modal-root' }),
        s = R(t, i);
    return a.append(s, e), n.append(a), n;
}
function J({ title: t, bodyElement: e, onClose: i = () => {} }) {
    const n = j(),
        a = G({ title: t, bodyElement: e, onClose: i });
    n.append(a);
}
function W(t) {
    const { source: e, name: i } = t;
    return r({ tagName: 'img', className: 'modal-fighter-image', attributes: { src: e, title: i, alt: i } });
}
function Y(t) {
    const { name: e } = t,
        i = r({ tagName: 'div', className: 'modal-body' }),
        n = W(t);
    i.append(n),
        J({
            title: e,
            bodyElement: i,
            onClose: () => {
                window.location.reload();
            }
        });
}
function H(t, e) {
    const i = A(t),
        a = r({
            tagName: 'div',
            className: `arena___fighter ${e === 'right' ? 'arena___right-fighter' : 'arena___left-fighter'}`
        });
    return a.append(i), a;
}
function Z(t, e) {
    const i = r({ tagName: 'div', className: 'arena___battlefield' }),
        n = H(t, 'left'),
        a = H(e, 'right');
    return i.append(n, a), i;
}
function F(t, e) {
    const { name: i } = t,
        n = r({ tagName: 'div', className: 'arena___fighter-indicator' }),
        a = r({ tagName: 'span', className: 'arena___fighter-name' }),
        s = r({ tagName: 'div', className: 'arena___health-indicator' }),
        c = r({ tagName: 'div', className: 'arena___health-bar', attributes: { id: `${e}-fighter-indicator` } });
    return (a.innerText = i), s.append(c), n.append(a, s), n;
}
function Q(t, e) {
    const i = r({ tagName: 'div', className: 'arena___fight-status' }),
        n = r({ tagName: 'div', className: 'arena___versus-sign' }),
        a = F(t, 'left'),
        s = F(e, 'right');
    return i.append(a, n, s), i;
}
function U(t) {
    const e = r({ tagName: 'div', className: 'arena___root' }),
        i = Q(...t),
        n = Z(...t);
    return e.append(i, n), e;
}
function V(t) {
    const e = document.getElementById('root'),
        i = U(t);
    (e.innerHTML = ''),
        e.append(i),
        D(...t)
            .then(n => {
                Y(n);
            })
            .catch(n => {
                console.warn(n);
            });
}
const z = './assets/versus-768a076e.png',
    X = [
        { _id: '1', name: 'Ryu', source: 'https://media.giphy.com/media/kdHa4JvihB2gM/giphy.gif' },
        {
            _id: '2',
            name: 'Dhalsim',
            source: 'https://i.pinimg.com/originals/c0/53/f2/c053f2bce4d2375fee8741acfb35d44d.gif'
        },
        { _id: '3', name: 'Guile', source: 'https://66.media.tumblr.com/tumblr_lq8g3548bC1qd0wh3o1_400.gif' },
        { _id: '4', name: 'Zangief', source: 'https://media1.giphy.com/media/nlbIvY9K0jfAA/source.gif' },
        {
            _id: '5',
            name: 'Ken',
            source: 'https://i.pinimg.com/originals/46/4b/36/464b36a7aecd988e3c51e56a823dbedc.gif'
        },
        { _id: '6', name: 'Bison', source: 'http://www.fightersgeneration.com/np5/char/ssf2hd/bison-hdstance.gif' }
    ],
    ee = [
        {
            _id: '1',
            name: 'Ryu',
            health: 45,
            attack: 4,
            defense: 3,
            source: 'https://media.giphy.com/media/kdHa4JvihB2gM/giphy.gif'
        },
        {
            _id: '2',
            name: 'Dhalsim',
            health: 60,
            attack: 3,
            defense: 1,
            source: 'https://i.pinimg.com/originals/c0/53/f2/c053f2bce4d2375fee8741acfb35d44d.gif'
        },
        {
            _id: '3',
            name: 'Guile',
            health: 45,
            attack: 4,
            defense: 3,
            source: 'https://66.media.tumblr.com/tumblr_lq8g3548bC1qd0wh3o1_400.gif'
        },
        {
            _id: '4',
            name: 'Zangief',
            health: 60,
            attack: 4,
            defense: 1,
            source: 'https://media1.giphy.com/media/nlbIvY9K0jfAA/source.gif'
        },
        {
            _id: '5',
            name: 'Ken',
            health: 45,
            attack: 3,
            defense: 4,
            source: 'https://i.pinimg.com/originals/46/4b/36/464b36a7aecd988e3c51e56a823dbedc.gif'
        },
        {
            _id: '6',
            name: 'Bison',
            health: 45,
            attack: 5,
            defense: 4,
            source: 'http://www.fightersgeneration.com/np5/char/ssf2hd/bison-hdstance.gif'
        }
    ];
function te(t) {
    const e = t.lastIndexOf('/'),
        i = t.lastIndexOf('.json'),
        n = t.substring(e + 1, i);
    return ee.find(a => a._id === n);
}
async function ie(t) {
    const e = t === 'fighters.json' ? X : te(t);
    return new Promise((i, n) => {
        setTimeout(() => (e ? i(e) : n(Error('Failed to load'))), 500);
    });
}
async function P(t, e = 'GET') {
    return ie(t);
}
var v, _;
class ae {
    constructor() {
        u(this, v, 'fighters.json');
        u(this, _, '');
    }
    get detailsEndpoint() {
        return l(this, _);
    }
    set detailsEndpoint(e) {
        w(this, _, `details/fighter/${e}.json`);
    }
    async getFighters() {
        try {
            return await P(l(this, v));
        } catch (e) {
            throw e;
        }
    }
    async getFighterDetails(e) {
        this.detailsEndpoint = e;
        try {
            return await P(this.detailsEndpoint);
        } catch (i) {
            throw i;
        }
    }
}
(v = new WeakMap()), (_ = new WeakMap());
const O = new ae(),
    N = new Map();
async function ne(t) {
    if (N.has(t)) return N.get(t);
    let e;
    try {
        return (e = await O.getFighterDetails(t)), N.set(t, e), e;
    } catch (i) {
        console.warn(i);
    }
    return e;
}
function se(t) {
    V(t);
}
function re(t) {
    const e = t.filter(Boolean).length === 2,
        i = () => se(t),
        n = r({ tagName: 'div', className: 'preview-container___versus-block' }),
        a = r({ tagName: 'img', className: 'preview-container___versus-img', attributes: { src: z } }),
        c = r({ tagName: 'button', className: `preview-container___fight-btn ${e ? '' : 'disabled'}` });
    return c.addEventListener('click', i, !1), (c.innerText = 'Fight'), n.append(a, c), n;
}
function ce(t) {
    const e = document.querySelector('.preview-container___root'),
        [i, n] = t,
        a = k(i, 'left'),
        s = k(n, 'right'),
        c = re(t);
    (e.innerHTML = ''), e.append(a, c, s);
}
function oe() {
    let t = [];
    return async (e, i) => {
        const n = await ne(i),
            [a, s] = t;
        (t = [a ?? n, a ? s ?? n : s]), ce(t);
    };
}
function le(t) {
    const { source: e, name: i } = t;
    return r({ tagName: 'img', className: 'fighter___fighter-image', attributes: { src: e, title: i, alt: i } });
}
function he(t, e) {
    const i = r({ tagName: 'div', className: 'fighters___fighter' }),
        n = le(t),
        a = s => e(s, t._id);
    return i.append(n), i.addEventListener('click', a, !1), i;
}
function me(t) {
    const e = oe(),
        i = r({ tagName: 'div', className: 'fighters___root' }),
        n = r({ tagName: 'div', className: 'preview-container___root' }),
        a = r({ tagName: 'div', className: 'fighters___list' }),
        s = t.map(c => he(c, e));
    return a.append(...s), i.append(n, a), i;
}
const f = class {
    static async startApp() {
        try {
            f.loadingElement.style.visibility = 'visible';
            const e = await O.getFighters(),
                i = me(e);
            f.rootElement.appendChild(i);
        } catch (e) {
            console.warn(e), (f.rootElement.innerText = 'Failed to load data');
        } finally {
            f.loadingElement.style.visibility = 'hidden';
        }
    }
};
let p = f;
E(p, 'rootElement', document.getElementById('root')),
    E(p, 'loadingElement', document.getElementById('loading-overlay'));
p.startApp();
