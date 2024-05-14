import createElement from '../helpers/domHelper';

class FightingFighter {
    #criticalStrikeInterval = 10_000;

    #actionsStyles = {
        hit: 'hit',
        block: 'block',
        criticalHit: 'critical-hit'
    };

    constructor(fighter, position = 'left') {
        this.name = fighter.name;
        this.health = fighter.health;
        this.attack = fighter.attack;
        this.defense = fighter.defense;

        this.initialHealth = this.health;
        this.isBlock = false;
        this.criticalHitPossibility = true;

        this.fighterElement = document.querySelector(`.arena___${position}-fighter`);
        this.healthBarElement = document.getElementById(`${position}-fighter-indicator`);

        this.criticalHitBoardElement = null;
        this.createCriticalHitBoardElement(position);
    }

    createCriticalHitBoardElement() {
        this.criticalHitBoardElement = createElement({
            tagName: 'div',
            className: `arena___fighter-critical-hit-board`
        });
        this.criticalHitBoardElement.textContent = '⚡';
        this.healthBarElement.closest('.arena___health-indicator').after(this.criticalHitBoardElement);
    }

    causeDamage(damage) {
        this.health -= damage;
        this.updateHealthBar();
    }

    updateHealthBar() {
        const healthPercentage = Math.max(0, (this.health * 100) / this.initialHealth);
        this.healthBarElement.style.width = `${healthPercentage}%`;
    }

    putBlock() {
        this.isBlock = true;
        this.showAction(this.#actionsStyles.block);
    }

    removeBlock() {
        this.isBlock = false;
        this.hideAction(this.#actionsStyles.block);
    }

    doHit(opponent, damage) {
        this.showAction(this.#actionsStyles.hit);
        if (!opponent.isBlock) {
            opponent.causeDamage(damage);
        }

        setTimeout(() => {
            this.hideAction(this.#actionsStyles.hit);
        }, 300);
    }

    doCriticalAttack(opponent) {
        if (this.isBlock || !this.criticalHitPossibility) {
            return;
        }

        this.showAction(this.#actionsStyles.criticalHit);

        const damage = 2 * this.attack;
        opponent.causeDamage(damage);

        this.disableCriticalHit();

        setTimeout(() => {
            this.hideAction(this.#actionsStyles.criticalHit);
        }, 300);
    }

    disableCriticalHit() {
        this.criticalHitPossibility = false;
        this.restoreCriticalHit();
    }

    restoreCriticalHit() {
        let remainingTime = this.#criticalStrikeInterval / 1000;
        const go = () => {
            this.criticalHitBoardElement.textContent = remainingTime;
            if (remainingTime > 0) {
                setTimeout(go, 1000);
            } else {
                this.criticalHitPossibility = true;
                this.criticalHitBoardElement.textContent = '⚡';
            }
            remainingTime -= 1;
        };
        go();
    }

    showAction(action) {
        this.fighterElement.classList.add(action);
    }

    hideAction(action) {
        this.fighterElement.classList.remove(action);
    }

    hideAllActions() {
        Object.values(this.#actionsStyles).forEach(className => {
            this.fighterElement.classList.remove(className);
        });
    }
}

export default FightingFighter;
