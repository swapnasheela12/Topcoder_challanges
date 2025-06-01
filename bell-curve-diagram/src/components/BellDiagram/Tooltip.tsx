import { Item } from '../../types/BellTypes';
import React from 'react';
import styles from './BellDiagram.module.scss';

interface TooltipProps {
  item: Item;
  position: { x: number; y: number };
}

const Tooltip: React.FC<TooltipProps> = ({ item, position }) => {
  return (
    <div
      className={styles.tooltip}
      style={{
        top: position.y,
        left: position.x
      }}
    >
      <h4>{item.toolTipTitle}</h4>
      <p>{item.toolTipText}</p>
      <ul>
        {item.links.map((link, index) => (
          <li key={index}>
            <span>{String(index + 1).padStart(2, '0')}.</span>
            <a href={link.url} target="_blank" rel="noopener noreferrer">{link.text}</a>
            <p>{link.desc}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tooltip;
