import createElement from '../helpers/domHelper';

class FighterOnStage {
    #criticalStrikeInterval = 10000; // 10 seconds in milliseconds

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

        this.currentHealth = this.health;
        this.isInBlock = false;
        this.criticalHitPossibility = true;

        this.fighterElement = document.querySelector(`.arena___${position}-fighter`);
        this.healthBarElement = document.getElementById(`${position}-fighter-indicator`);

        this.criticalHitBoardElement = null;
        this.createCriticalHitBoardElement(position);
    }

    //---------------------------------------------------------------------------------------------
    // Initial rendering
    //---------------------------------------------------------------------------------------------

    createCriticalHitBoardElement() {
        this.criticalHitBoardElement = createElement({
            tagName: 'div',
            className: `arena___fighter-critical-hit-board`
        });
        this.criticalHitBoardElement.textContent = '⚡';
        this.healthBarElement.closest('.arena___health-indicator').after(this.criticalHitBoardElement);
    }

    //---------------------------------------------------------------------------------------------
    // Damage
    //---------------------------------------------------------------------------------------------

    causeDamage(damage) {
        if (damage > 0) {
            this.currentHealth -= damage;
            this.updateHealthBar();
        }
    }

    updateHealthBar() {
        const healthPercentage = Math.max(0, (this.currentHealth * 100) / this.health);
        this.healthBarElement.style.width = `${healthPercentage}%`;
    }

    //---------------------------------------------------------------------------------------------
    // Block functionality
    //---------------------------------------------------------------------------------------------
    putBlock() {
        this.isInBlock = true;
        // Add class .block to fighter element
        this.showAction(this.#actionsStyles.block);
    }

    removeBlock() {
        this.isInBlock = false;
        // Remove class .block to fighter element
        this.hideAction(this.#actionsStyles.block);
    }

    //---------------------------------------------------------------------------------------------
    // Simple hit functionality
    //---------------------------------------------------------------------------------------------

    doHit(opponent, damage) {
        // You cann't hit if you are in a block
        if (this.isInBlock) return;

        // Add class .hit to fighter element
        this.showAction(this.#actionsStyles.hit);

        // Sametimes the block power is higher than the hit power, therefore the damage is negative
        opponent.causeDamage(damage);

        setTimeout(() => {
            this.hideAction(this.#actionsStyles.hit);
        }, 300);
    }

    //---------------------------------------------------------------------------------------------
    // Critical hit functionality
    //---------------------------------------------------------------------------------------------

    doCriticalHit(opponent) {
        // You cann't do critical hit if you are in a block or until the critical hit possibility is restored
        if (this.isInBlock || !this.criticalHitPossibility) {
            return;
        }

        this.showAction(this.#actionsStyles.criticalHit);

        const damage = 2 * this.attack;
        opponent.causeDamage(damage);

        // Disable critical hit for 10 seconds
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

    // Actions
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

export default FighterOnStage;
