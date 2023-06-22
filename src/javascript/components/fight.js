import controls from '../../constants/controls';
import FightingFighter from './fightingFighter';
/*
// Integer random
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * max) + min;
}
*/

// Float random
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
            /*
             * If the key is being held down such that it is automatically repeating
             * or the pressed key is not control key leave the method
             */
            const controlKeys = Object.values(controls).flat();
            if (event.repeat || !controlKeys.some(key => key === event.code)) {
                return;
            }

            const key = event.code;

            // For checking of multiple key presses add pressed key code to Set
            pressedKeys.add(key);

            // If the first fighter simple hit
            if (key === controls.PlayerOneAttack) {
                if (firstFightingFighter.isBlock) {
                    return;
                }
                const damage = getDamage(firstFightingFighter, secondFightingFighter);
                firstFightingFighter.doHit(secondFightingFighter, damage);
            }

            // If the second fighter simple hit
            if (key === controls.PlayerTwoAttack) {
                if (secondFightingFighter.isBlock) {
                    return;
                }
                const damage = getDamage(secondFightingFighter, firstFightingFighter);
                secondFightingFighter.doHit(firstFightingFighter, damage);
            }

            // If the first fighter placed a block
            if (key === controls.PlayerOneBlock) {
                firstFightingFighter.putBlock();
            }

            // If the second fighter placed a block
            if (key === controls.PlayerTwoBlock) {
                secondFightingFighter.putBlock();
            }

            // If the first fighter critical hit
            if (controls.PlayerOneCriticalHitCombination.every(code => pressedKeys.has(code))) {
                firstFightingFighter.doCriticalAttack(secondFightingFighter);
            }

            // If the second fighter critical hit
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
