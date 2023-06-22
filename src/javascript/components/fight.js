import controls from '../../constants/controls';
// eslint-disable-next-line import/no-cycle
import Gong from './gong';

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

export async function fight(firstFighter, secondFighter) {
    return new Promise(resolve => {
        // resolve the promise with the winner when fight is over
        const gong = new Gong(firstFighter, secondFighter, controls);
        gong.fight()
            .then(winner => {
                resolve(winner);
            })
            .catch(error => {
                console.warn('Fighting error:', error);
            });
    });
}
