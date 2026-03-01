import { Modal } from '../../../shared/ui/modal';

interface Props {
  image: string | null;
  onClose: () => void;
}

export const PassportPreviewModal = ({ image, onClose }: Props) => {
  return (
    <Modal isOpen={!!image} onClose={onClose}>
      <img
        src={image ?? ''}
        alt="passport zoom"
        style={{
          maxWidth: '100%',
          maxHeight: '80vh',
          borderRadius: '1.2rem',
        }}
      />
    </Modal>
  );
};