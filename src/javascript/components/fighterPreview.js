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

    const infoElement = createElement({ tagName: 'div', className: 'fighter-preview___info' });
    const nameElement = createElement({ tagName: 'h3', className: 'fighter-preview__name' });
    nameElement.textContent = name;

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

    if (fighter) {
        const imageElement = createFighterImage(fighter);
        const infoElement = createFigtherInfo(fighter);
        fighterElement.append(imageElement, infoElement);
    } else {
        fighterElement.textContent = 'Choose an opponent';
    }

    return fighterElement;
}
