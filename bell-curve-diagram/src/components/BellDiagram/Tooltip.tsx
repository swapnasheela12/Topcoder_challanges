// "use client";

// import React, { useEffect, useRef, useState } from "react";

// import { Item } from "../../types/BellTypes";
// import styles from "./Tooltip.module.scss";

// interface TooltipProps {
//   x: number;
//   y: number;
//   absoluteX: number;
//   absoluteY: number;
//   item: Item;
//   direction: "left" | "right";
//   onClose: () => void;
//   onMouseEnter: () => void;  // ✅ Added
//   onMouseLeave: () => void;  // ✅ Added
// }

// const Tooltip: React.FC<TooltipProps> = ({
//   x,
//   y,
//   absoluteX,
//   absoluteY,
//   item,
//   direction,
//   onClose,
//   onMouseEnter,
//   onMouseLeave
// }) => {

//   const tooltipRef = useRef<HTMLDivElement>(null);
//   const [position, setPosition] = useState<{ top: number; left: number }>({ top: y, left: x });

//   useEffect(() => {
//     if (!tooltipRef.current) return;

//     const tooltipWidth = 290;
//     const tooltipHeight = tooltipRef.current.offsetHeight;
//     const padding = 20;

//     const container = tooltipRef.current.parentElement;
//     const containerRect = container?.getBoundingClientRect();
//     if (!containerRect) return;

//     let top = absoluteY - containerRect.top - tooltipHeight / 2;
//     let left;

//     if (direction === "right") {
//       left = absoluteX - containerRect.left + padding;
//     } else {
//       left = absoluteX - containerRect.left - tooltipWidth - padding;
//     }

//     // Clamp vertical position inside parent
//     top = Math.max(padding, Math.min(top, containerRect.height - tooltipHeight - padding));

//     setPosition({ top, left });
//   }, [absoluteX, absoluteY, direction]);

//   return (
//     <div
//       ref={tooltipRef}
//       className={`${styles.tooltip} ${styles[direction]}`}
//       style={{ top: position.top, left: position.left, width: 290 }}
//       onMouseEnter={onMouseEnter}
//       onMouseLeave={onMouseLeave}
//       onClick={onClose}
//     >
//       <div className={styles.header}>{item.toolTipTitle}</div>
//       <div className={styles.description}>{item.toolTipText}</div>
//       <ul className={styles.linkList}>
//         {item.links.map((link, index) => (
//           <li key={index} className={styles.linkItem}>
//             <span className={styles.index}>{String(index + 1).padStart(2, "0")}.</span>
//             <div className={styles.linkContent}>
//               <div className={styles.linkRow}>
//                 <a href={link.url} target="_blank" rel="noopener noreferrer" className={styles.linkText}>
//                   {link.text}
//                 </a>
//                 <a href={link.url} target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
//                   <img src="/img/share_icon.png" alt="Open" className={styles.iconImage} />
//                 </a>
//               </div>
//               <div className={styles.linkDesc}>{link.desc}</div>
//             </div>
//           </li>
//         ))}
//       </ul>

//     </div>
//   );
// };

// export default Tooltip;


"use client";

import React, { useEffect, useRef, useState } from "react";

import { Item } from "../../types/BellTypes";
import styles from "./Tooltip.module.scss";

interface TooltipProps {
  x: number;
  y: number;
  absoluteX: number;
  absoluteY: number;
  item: Item;
  direction: "left" | "right" | "top";
  arrowOffset?: number;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const Tooltip: React.FC<TooltipProps> = ({
  x,
  y,
  absoluteX,
  absoluteY,
  item,
  direction,
  arrowOffset = 0,
  onClose,
  onMouseEnter,
  onMouseLeave
}) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: y, left: x });

  useEffect(() => {
    if (!tooltipRef.current || !tooltipRef.current.parentElement) return;

    const tooltipWidth = 290;
    const tooltipHeight = tooltipRef.current.offsetHeight;
    const padding = 20;

    const containerRect = tooltipRef.current.parentElement.getBoundingClientRect();

    let top = 0;
    let left = 0;

    if (direction === "right") {
      left = absoluteX - containerRect.left + padding;
      top = absoluteY - containerRect.top - tooltipHeight / 2;
    } else if (direction === "left") {
      left = absoluteX - containerRect.left - tooltipWidth - padding;
      top = absoluteY - containerRect.top - tooltipHeight / 2;
    } else if (direction === "top") {
      top = 40;
      left = absoluteX - containerRect.left - tooltipWidth / 2;
  
  // Optional: clamp if near edges to avoid overflow
  left = Math.max(10, Math.min(left, containerRect.width - tooltipWidth - 10));
    }

    setPosition({ top, left });
  }, [absoluteX, absoluteY, direction]);

  return (
    <div
      ref={tooltipRef}
      className={`${styles.tooltip} ${styles[direction]}`}
      style={{
        top: position.top,
        left: position.left,
        width: 290,
        ...(direction === 'top' ? { '--arrow-offset': `${arrowOffset}px` } as React.CSSProperties : {})
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClose}
    >
      <div className={styles.header}>{item.toolTipTitle}</div>
      <div className={styles.description}>{item.toolTipText}</div>
      <ul className={styles.linkList}>
        {item.links.map((link, index) => (
          <li key={index} className={styles.linkItem}>
            <span className={styles.index}>{String(index + 1).padStart(2, "0")}.</span>
            <div className={styles.linkContent}>
              <div className={styles.linkRow}>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className={styles.linkText}>
                  {link.text}
                </a>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
                  <img src="/img/share_icon.png" alt="Open" className={styles.iconImage} />
                </a>
              </div>
              <div className={styles.linkDesc}>{link.desc}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tooltip;
