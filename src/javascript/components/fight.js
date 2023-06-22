import controls from '../../constants/controls';
import FightingFighter from './fightingFighter';

/*
function getRandomInteger(min, max) {
    return Math.floor(Math.random() * max) + min;
}
*/

function getRandomFloat(min, max) {
    const random = min + Math.random() * (max - min);
    return Math.round(random * 100) / 100;
}

export function getHitPower(fighter) {
    const criticalHitChance = getRandomFloat(1, 2);
    return fighter.attack * criticalHitChance;
}

export function getBlockPower(fighter) {
    const dodgeChance = getRandomFloat(1, 2);
    return fighter.defense * dodgeChance;
}

export function getDamage(attacker, defender) {
    return getHitPower(attacker) - getBlockPower(defender);
}

function doAttack(attacker, defender, criticalAtack = false) {
    if (criticalAtack) {
        attacker.doCriticalHit(defender);
        return;
    }

    const damage = defender.isInBlock ? 0 : getDamage(attacker, defender);
    attacker.doHit(defender, damage);
}

function isCriticalHitCombinationPressed(criticalHitCombination, pressedKeys) {
    return criticalHitCombination.every(code => pressedKeys.has(code));
}

function handleKeyDown(event, firstFighter, secondFighter, pressedKeys) {
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

    // If the first fighter placed a block
    if (key === controls.PlayerOneBlock) {
        firstFighter.putBlock();
    }
    // If the second fighter placed a block
    if (key === controls.PlayerTwoBlock) {
        secondFighter.putBlock();
    }
    // If the first fighter simple hit
    if (key === controls.PlayerOneAttack) {
        doAttack(firstFighter, secondFighter);
    }
    // If the second fighter simple hit
    if (key === controls.PlayerTwoAttack) {
        doAttack(secondFighter, firstFighter);
    }
    // If the first fighter critical hit
    const firstFighterCriticalHitCombination = controls.PlayerOneCriticalHitCombination;
    if (isCriticalHitCombinationPressed(firstFighterCriticalHitCombination, pressedKeys)) {
        doAttack(firstFighter, secondFighter, true);
    }
    // If the second fighter critical hit
    const secondFighterCriticalHitCombination = controls.PlayerTwoCriticalHitCombination;
    if (isCriticalHitCombinationPressed(secondFighterCriticalHitCombination, pressedKeys)) {
        doAttack(secondFighter, firstFighter, true);
    }
}

function handleKeyUp(event, firstFighter, secondFighter, pressedKeys) {
    const key = event.code;

    if (key === controls.PlayerOneBlock) {
        firstFighter.removeBlock();
    }
    if (key === controls.PlayerTwoBlock) {
        secondFighter.removeBlock();
    }

    pressedKeys.delete(key);
}

export async function fight(firstFighter, secondFighter) {
    return new Promise(resolve => {
        const firstFightingFighter = new FightingFighter(firstFighter, 'left');
        const secondFightingFighter = new FightingFighter(secondFighter, 'right');

        const pressedKeys = new Set();

        document.addEventListener('keydown', event => {
            handleKeyDown(event, firstFightingFighter, secondFightingFighter, pressedKeys);

            if (firstFightingFighter.currentHealth <= 0) {
                resolve(secondFightingFighter);
            }
            if (secondFightingFighter.currentHealth <= 0) {
                resolve(firstFightingFighter);
            }
        });

        document.addEventListener('keyup', event => {
            handleKeyUp(event, firstFightingFighter, secondFightingFighter, pressedKeys);
        });
    });
}
