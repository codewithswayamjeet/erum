import { motion } from 'framer-motion';

const WhatsAppButton = () => {
  const phoneNumber = '919727614129'; // India country code + number
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <svg
        viewBox="0 0 32 32"
        className="w-7 h-7 fill-white"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16.002 3C8.832 3 3 8.832 3 16.002c0 2.487.658 4.91 1.91 7.043L3 29l6.192-1.868A12.93 12.93 0 0016.002 29C23.17 29 29 23.168 29 16.002 29 8.832 23.17 3 16.002 3zm0 23.636a10.58 10.58 0 01-5.587-1.592l-.4-.237-3.677 1.108 1.07-3.563-.26-.414a10.56 10.56 0 01-1.626-5.636c0-5.847 4.758-10.606 10.606-10.606 5.847 0 10.606 4.759 10.606 10.606 0 5.848-4.76 10.607-10.607 10.607zm5.82-7.94c-.319-.16-1.886-.93-2.178-1.037-.292-.106-.505-.16-.718.16-.212.318-.824 1.037-.01 1.25-.186.213-.718.931-.878.931-.16-.213-.584-.213-.904-.373-.319-.16-1.346-.496-2.564-1.583-.948-.846-1.588-1.89-1.774-2.21-.186-.318-.02-.49.14-.649.144-.143.319-.373.478-.559.16-.186.213-.319.319-.531.106-.213.053-.399-.027-.559-.08-.16-.718-1.73-.984-2.367-.259-.623-.522-.538-.718-.548-.186-.01-.399-.012-.612-.012-.213 0-.559.08-.851.399-.292.319-1.117 1.09-1.117 2.66 0 1.57 1.143 3.087 1.302 3.3.16.213 2.25 3.437 5.454 4.82.762.328 1.357.524 1.82.67.765.244 1.462.21 2.013.127.614-.092 1.886-.77 2.152-1.514.266-.745.266-1.383.186-1.515-.08-.133-.292-.213-.611-.373z" />
      </svg>
    </motion.a>
  );
};

export default WhatsAppButton;
