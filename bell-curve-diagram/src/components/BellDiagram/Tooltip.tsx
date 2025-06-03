import React, { useEffect, useRef, useState } from "react";

import { Item } from "../../types/BellTypes";
import styles from "./Tooltip.module.scss";

interface TooltipProps {
  x: number;
  y: number;
  absoluteX: number;
  absoluteY: number;
  item: Item;
  onClose: () => void;
}

const Tooltip: React.FC<TooltipProps> = ({ x, y, absoluteX, absoluteY, item, onClose }) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: y, left: x });

  useEffect(() => {
    if (!tooltipRef.current) return;

    const tooltipWidth = 290;
    const tooltipHeight = tooltipRef.current.offsetHeight;
    const padding = 20;

    // ✅ Get parent container dimensions
    const container = tooltipRef.current.parentElement;
    const containerRect = container?.getBoundingClientRect();

    if (!containerRect) return;

    let top = absoluteY - containerRect.top + padding;
    let left = absoluteX - containerRect.left + padding;

    // Flip vertically inside parent
    if (absoluteY + tooltipHeight + padding > containerRect.bottom) {
      top = absoluteY - containerRect.top - tooltipHeight - padding;
    }

    // Flip horizontally inside parent
    if (absoluteX + tooltipWidth + padding > containerRect.right) {
      left = absoluteX - containerRect.left - tooltipWidth - padding;
    }

    // Always stay inside parent (safe zone clamp)
    top = Math.max(padding, Math.min(top, containerRect.height - tooltipHeight - padding));
    left = Math.max(padding, Math.min(left, containerRect.width - tooltipWidth - padding));

    setPosition({ top, left });
  }, [absoluteX, absoluteY]);

  return (
    <div
      ref={tooltipRef}
      className={styles.tooltip}
      style={{ top: position.top, left: position.left, width: 290 }}
      onClick={onClose}
    >
      <div className={styles.header}>{item.toolTipTitle}</div>
      <div className={styles.description}>{item.toolTipText}</div>
      <ul className={styles.linkList}>
        {item.links.map((link, index) => (
          <li key={index} className={styles.linkItem}>
            <span className={styles.index}>{String(index + 1).padStart(2, "0")}.</span>
            <div className={styles.linkContent}>
              <a href={link.url} target="_blank" rel="noopener noreferrer" className={styles.linkText}>
                {link.text}
              </a>
              <div className={styles.linkDesc}>{link.desc}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tooltip;
