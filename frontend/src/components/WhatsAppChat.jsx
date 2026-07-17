import { FaWhatsapp } from 'react-icons/fa';
import './WhatsAppChat.css';

const WHATSAPP_NUMBER = '250795407244';
const DEFAULT_MESSAGE = "Hello,%20I'd%20like%20to%20place%20an%20order.";

const WhatsAppChat = () => {
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const url = isMobile
    ? `whatsapp://send?phone=${WHATSAPP_NUMBER}&text=${DEFAULT_MESSAGE}`
    : `https://web.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${DEFAULT_MESSAGE}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="wa-float"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="wa-icon" />
    </a>
  );
};

export default WhatsAppChat;
