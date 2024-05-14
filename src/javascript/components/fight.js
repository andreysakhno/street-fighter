import controls from '../../constants/controls';
import FightingFighter from './fightingFighter';

function getRandomNumber(min, max) {
    const random = min + Math.random() * (max - min);
    return Math.round(random * 100) / 100;
}

export function getHitPower(fighter) {
    const criticalHitChance = getRandomNumber(1, 2);
    return fighter.attack * criticalHitChance;
}

export function getBlockPower(fighter) {
    const dodgeChance = getRandomNumber(1, 2);
    return fighter.defense * dodgeChance;
}

export function getDamage(attacker, defender) {
    const damage = getHitPower(attacker) - getBlockPower(defender);
    return damage > 0 ? damage : 0;
}

export async function fight(firstFighter, secondFighter) {
    return new Promise(resolve => {
        const firstFightingFighter = new FightingFighter(firstFighter, 'left');
        const secondFightingFighter = new FightingFighter(secondFighter, 'right');

        const pressedKeys = new Set();

        document.addEventListener('keydown', event => {
            const controlKeys = Object.values(controls).flat();
            if (event.repeat || !controlKeys.some(key => key === event.code)) {
                return;
            }

            const key = event.code;
            pressedKeys.add(key);

            if (key === controls.PlayerOneAttack) {
                if (firstFightingFighter.isBlock) {
                    return;
                }
                const damage = getDamage(firstFightingFighter, secondFightingFighter);
                firstFightingFighter.doHit(secondFightingFighter, damage);
            }

            if (key === controls.PlayerTwoAttack) {
                if (secondFightingFighter.isBlock) {
                    return;
                }
                const damage = getDamage(secondFightingFighter, firstFightingFighter);
                secondFightingFighter.doHit(firstFightingFighter, damage);
            }

            if (key === controls.PlayerOneBlock) {
                firstFightingFighter.putBlock();
            }

            if (key === controls.PlayerTwoBlock) {
                secondFightingFighter.putBlock();
            }

            if (controls.PlayerOneCriticalHitCombination.every(code => pressedKeys.has(code))) {
                firstFightingFighter.doCriticalAttack(secondFightingFighter);
            }

            if (controls.PlayerTwoCriticalHitCombination.every(code => pressedKeys.has(code))) {
                secondFightingFighter.doCriticalAttack(firstFightingFighter);
            }

            if (firstFightingFighter.health <= 0) {
                resolve(secondFighter);
            }

            if (secondFightingFighter.health <= 0) {
                resolve(firstFighter);
            }
        });

        document.addEventListener('keyup', event => {
            const key = event.code;

            if (key === controls.PlayerOneBlock) {
                firstFightingFighter.removeBlock();
            }

            if (key === controls.PlayerTwoBlock) {
                secondFightingFighter.removeBlock();
            }

            pressedKeys.delete(key);
        });
    });
}
