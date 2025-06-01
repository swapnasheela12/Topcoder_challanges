// import { Item } from '../../types/BellTypes';
// import React from 'react';
// import styles from './Modal.module.scss';

// interface ModalProps {
//   item: Item;
//   onClose: () => void;
// }

// const Modal: React.FC<ModalProps> = ({ item, onClose }) => {
//   return (
//     <div className={styles.modalOverlay} onClick={onClose}>
//       <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
//         <button className={styles.closeButton} onClick={onClose}>×</button>
//         <h2>{item.toolTipTitle}</h2>
//         <p>{item.toolTipText}</p>
//         <ul>
//           {item.links.map((link, index) => (
//             <li key={index}>
//               <span>{String(index + 1).padStart(2, '0')}.</span>
//               <a href={link.url} target="_blank" rel="noopener noreferrer">{link.text}</a>
//               <p>{link.desc}</p>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Modal;

import { Item } from '@/types/BellTypes';
import React from 'react';
import styles from './Modal.module.scss';

interface ModalProps {
  item: Item;
  title: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ item, title, onClose }) => {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <h2>{title}</h2>
        <h4>{item.toolTipTitle}</h4>
        <p>{item.toolTipText}</p>
      </div>
    </div>
  );
};

export default Modal;
