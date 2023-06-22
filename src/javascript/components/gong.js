// eslint-disable-next-line import/no-cycle
import { getDamage } from './fight';
import FighterOnStage from './fighterOnStage';

class Gong {
    #isFighting = false;

    #pressedKeys = new Set();

    constructor(firstFighter, secondFighter, controls) {
        this.firstFighter = new FighterOnStage(firstFighter, 'left');
        this.secondFighter = new FighterOnStage(secondFighter, 'right');
        this.controls = controls;
        this.winner = null;
    }

    handleKeyDown(event) {
        /*
         * If game is finished or the key is being held down such that it is automatically repeating
         * or the pressed key is not control key leave the method
         */
        const controlKeys = Object.values(this.controls).flat();
        if (!this.#isFighting || event.repeat || !controlKeys.some(key => key === event.code)) {
            return;
        }

        const key = event.code;

        // For checking of multiple key presses add pressed key code to Set
        this.#pressedKeys.add(key);
        // If the first fighter placed a block
        if (key === this.controls.PlayerOneBlock) {
            this.firstFighter.putBlock();
        }
        // If the second fighter placed a block
        if (key === this.controls.PlayerTwoBlock) {
            this.secondFighter.putBlock();
        }
        // If the first fighter simple hit
        if (key === this.controls.PlayerOneAttack) {
            this.attack(this.firstFighter, this.secondFighter);
        }
        // If the second fighter simple hit
        if (key === this.controls.PlayerTwoAttack) {
            this.attack(this.secondFighter, this.firstFighter);
        }
        // If the first fighter critical hit
        const firstFighterCriticalHitCombination = this.controls.PlayerOneCriticalHitCombination;
        if (this.isCriticalHitCombinationPressed(firstFighterCriticalHitCombination)) {
            this.attack(this.firstFighter, this.secondFighter, true);
        }
        // If the second fighter critical hit
        const secondFighterCriticalHitCombination = this.controls.PlayerTwoCriticalHitCombination;
        if (this.isCriticalHitCombinationPressed(secondFighterCriticalHitCombination)) {
            this.attack(this.secondFighter, this.firstFighter, true);
        }
        // If the health of at least one of the fighters is < 0, the battle is over
        this.checkHasWinner();
    }

    handleKeyUp(event) {
        const key = event.code;

        if (key === this.controls.PlayerOneBlock) {
            this.firstFighter.removeBlock();
        }
        if (key === this.controls.PlayerTwoBlock) {
            this.secondFighter.removeBlock();
        }

        this.#pressedKeys.delete(key);
    }

    // eslint-disable-next-line class-methods-use-this
    attack(attacker, defender, criticalAtack = false) {
        if (criticalAtack) {
            attacker.doCriticalHit(defender);
            return;
        }

        const damage = defender.isInBlock ? 0 : getDamage(attacker, defender);
        attacker.doHit(defender, damage);
    }

    isCriticalHitCombinationPressed(criticalHitCombination) {
        return criticalHitCombination.every(code => this.#pressedKeys.has(code));
    }

    checkHasWinner() {
        if (this.firstFighter.currentHealth <= 0) {
            this.#isFighting = false;
            this.winner = this.secondFighter;
        }
        if (this.secondFighter.currentHealth <= 0) {
            this.#isFighting = false;
            this.winner = this.firstFighter;
        }
    }

    fight() {
        return new Promise(resolve => {
            this.#isFighting = true;

            document.addEventListener('keydown', this.handleKeyDown.bind(this));
            document.addEventListener('keyup', this.handleKeyUp.bind(this));

            /*
             * The recursive function fightLoop() is used to check the conditions of the fight ending after each time interval (1 second).
             * If the condition is met, the resolve() method is called with the winner and the recursive call is terminated.
             */
            const fightLoop = () => {
                if (this.winner) {
                    resolve(this.winner);
                    return;
                }
                setTimeout(fightLoop, 1000);
            };

            fightLoop();
        });
    }
}

export default Gong;
