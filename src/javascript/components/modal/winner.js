import showModal from './modal';

export default function showWinnerModal(fighter) {
    const { name: title, fighterElement } = fighter;
    const bodyElement = fighterElement.firstElementChild.cloneNode(true);
    const onClose = () => {
        window.location.reload();
    };

    showModal({ title, bodyElement, onClose });
}
