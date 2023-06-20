import createElement from '../helpers/domHelper';

export function createFighterImage(fighter) {
    const { source, name } = fighter;
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
    const imgElement = createElement({
        tagName: 'img',
        className: 'fighter-preview___img',
        attributes
    });

    return imgElement;
}

function createFighterCharacteristicElement(characteristicName, characteristicValue) {
    const propertyElement = createElement({
        tagName: 'div',
        className: `fighter-preview___characteristic ${characteristicName}`
    });
    propertyElement.textContent = characteristicValue;
    return propertyElement;
}

function createFigtherInfo(fighter) {
    const { name, _id, source, ...characteristics } = fighter;

    // Create info container, in which will be added header with fighter name and element with fighter's characteristics: health, attack, defense
    const infoElement = createElement({ tagName: 'div', className: 'fighter-preview___info' });

    // Create header element with fighter name
    const nameElement = createElement({ tagName: 'h3', className: 'fighter-preview__name' });
    nameElement.textContent = name;

    // Create characteristics container, and add into it all fighter's characteristics: health, attack, defense
    const characteristicsContainer = createElement({ tagName: 'div', className: 'fighter-preview__characteristics' });
    const characteristicsElements = Object.entries(characteristics).map(([key, value]) =>
        createFighterCharacteristicElement(key, value)
    );
    characteristicsContainer.append(...characteristicsElements);

    infoElement.append(nameElement, characteristicsContainer);
    return infoElement;
}

export function createFighterPreview(fighter, position) {
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName}`
    });

    // If only the left fighter is selected, the right fighter will be undefined. Therefore, to avoid further errors, the necessary check for undefined
    if (fighter) {
        const imageElement = createFighterImage(fighter);
        const infoElement = createFigtherInfo(fighter);
        fighterElement.append(imageElement, infoElement);
    } else {
        fighterElement.textContent = 'Choose an opponent';
    }

    return fighterElement;
}
