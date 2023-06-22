import showModal from './modal';

export default function showWinnerModal(fighter) {
    const { name: title, fighterElement } = fighter;
    const bodyElement = fighterElement.cloneNode(true);
    showModal({ title, bodyElement });
}
