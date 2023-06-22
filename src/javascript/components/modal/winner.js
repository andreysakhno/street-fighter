import showModal from './modal';
import createElement from '../../helpers/domHelper';

function createImage(fighter) {
    const { source, name } = fighter;
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
    const imgElement = createElement({
        tagName: 'img',
        className: 'modal-fighter-image',
        attributes
    });

    return imgElement;
}

export default function showWinnerModal(fighter) {
    const { name: title } = fighter;

    const bodyElement = createElement({ tagName: 'div', className: 'modal-body' });
    const imageElement = createImage(fighter);
    bodyElement.append(imageElement);

    const onClose = () => {
        window.location.reload();
    };

    showModal({ title, bodyElement, onClose });
}
