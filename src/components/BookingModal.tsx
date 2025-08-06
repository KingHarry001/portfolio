// components/BookingModal.tsx
import { PopupModal } from "react-calendly";

type BookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const BookingModal = ({ isOpen, onClose }: BookingModalProps) => {
  if (!isOpen) return null;

  return (
    <PopupModal
      url="https://calendly.com/your-username/free-consultation"
      rootElement={document.getElementById("root")!}
      onModalClose={onClose}
      open={isOpen}
    />
  );
};

export default BookingModal;
