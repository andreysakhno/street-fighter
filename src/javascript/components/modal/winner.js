import showModal from './modal';
import { createFighterImage } from '../fighterPreview';

export default function showWinnerModal(fighter) {
    const { name: title } = fighter;

    const bodyElement = createFighterImage(fighter);

    const onClose = () => {
        window.location.reload();
    };

    showModal({ title, bodyElement, onClose });
}
