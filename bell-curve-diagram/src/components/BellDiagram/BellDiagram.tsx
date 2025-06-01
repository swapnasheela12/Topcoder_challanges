// "use client";

// import * as d3 from 'd3';

// import { BellData, Item } from '@/types/BellTypes';
// import React, { useEffect, useRef, useState } from 'react';

// import Tooltip from './Tooltip';
// import mockData from '@/data/mockData.json';
// import styles from './BellDiagram.module.scss';

// const BellDiagram: React.FC = () => {
//   const svgRef = useRef<SVGSVGElement | null>(null);
//   const data: BellData = mockData;
//   const [tooltip, setTooltip] = useState<{ item: Item; x: number; y: number } | null>(null);

//   useEffect(() => {
//     if (!svgRef.current) return;
//     const svg = d3.select(svgRef.current);
//     svg.selectAll("*").remove();

//     const width = 900;
//     const height = 500;
//     const bellWidth = 120;
//     const categories = Object.keys(data);
//     const total = categories.length;
//     const spacing = width / (total + 1);
//     const bellLayer = svg.append("g");

//     categories.forEach((cat, i) => {
//       const categoryData = data[cat];
//       const bellHeight = 300 - i * 20;
//       const x = spacing * (i + 1);

//       const bellData = [
//         [x - bellWidth, height],
//         [x - bellWidth / 2, height - bellHeight],
//         [x, height - bellHeight - 50],
//         [x + bellWidth / 2, height - bellHeight],
//         [x + bellWidth, height],
//       ];

//       const path = d3.line().curve(d3.curveBasis);
//       let hideTimeout: NodeJS.Timeout | null = null;

//       bellLayer.append("path")
//         .attr("d", path(bellData as [number, number][]))
//         .attr("fill", categoryData.color)
//         .attr("stroke", "#fff")
//         .attr("stroke-width", 2)
//         .style("cursor", "pointer")
//         .on("mouseover", (event) => {
//           if (hideTimeout) clearTimeout(hideTimeout);
//           const item = categoryData.items[0];
//           setTooltip({ item, x: event.pageX, y: event.pageY - 50 });
//         })
//         .on("mouseout", () => {
//           hideTimeout = setTimeout(() => setTooltip(null), 200);  // 200ms delay
//         });


//       // Bell label
//       bellLayer.append("text")
//         .attr("x", x)
//         .attr("y", height - bellHeight - 70)
//         .attr("text-anchor", "middle")
//         .attr("fill", categoryData.textColor)
//         .attr("font-size", 16)
//         .text(cat);

//       // Sub-categories clickable circles
//       categoryData.items.forEach((item, j) => {
//         const cx = x;
//         const cy = height - bellHeight - 120 - j * 50;

//         bellLayer.append("circle")
//           .attr("cx", cx)
//           .attr("cy", cy)
//           .attr("r", 20)
//           .attr("fill", "#fff")
//           .attr("stroke", "#000");

//         bellLayer.append("text")
//           .attr("x", cx)
//           .attr("y", cy + 5)
//           .attr("text-anchor", "middle")
//           .attr("font-size", 12)
//           .text(item.title);
//       });
//     });

//   }, [data]);

//   return (
//     <div className={styles.container}>
//       <svg ref={svgRef} width="100%" height="500" />
//       {tooltip && <Tooltip item={tooltip.item} position={{ x: tooltip.x, y: tooltip.y }} />}
//     </div>
//   );
// };

// export default BellDiagram;




"use client";

import * as d3 from 'd3';

import { BellData, Item } from '@/types/BellTypes';
import React, { useEffect, useRef, useState } from 'react';

import Modal from '../../components/Modal/Modal';
import Tooltip from './Tooltip';
import mockData from '../../data/mockData.json';
import styles from './BellDiagram.module.scss';

const BellDiagram: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const data: BellData = mockData;
  const [tooltip, setTooltip] = useState<{ item: Item; x: number; y: number } | null>(null);
  const [modalItem, setModalItem] = useState<Item | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 900;
    const height = 500;
    const bellWidth = 120;
    const categories = Object.keys(data);
    const total = categories.length;
    const spacing = width / (total + 1);
    const bellLayer = svg.append("g");

    // Inside categories.forEach(...)
    categories.forEach((cat, i) => {
      const categoryData = data[cat];
      const bellHeight = 300 - i * 20;
      const x = spacing * (i + 1);

      const bellData = [
        [x - bellWidth, height],
        [x - bellWidth / 2, height - bellHeight],
        [x, height - bellHeight - 50],
        [x + bellWidth / 2, height - bellHeight],
        [x + bellWidth, height],
      ];

      const path = d3.line().curve(d3.curveBasis);

      // Animate bell drawing
      // Animate bell drawing
      const bellPath = bellLayer.append("path")
        .attr("d", path(bellData as [number, number][]))
        .attr("fill", categoryData.color)
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .attr("opacity", 0)
        .on("mouseover", (event) => {
          if (!isMobile) {
            const firstItem = categoryData.items[0];  // Pick first sub-category as example
            setTooltip({ item: firstItem, x: event.pageX, y: event.pageY - 50 });
          }
        })
        .on("mouseout", () => {
          if (!isMobile) {
            setTooltip(null);
          }
        })
        .on("click", () => {
          if (isMobile) {
            const firstItem = categoryData.items[0];
            setModalItem(firstItem);
          }
        });


      bellPath.transition().duration(800).attr("opacity", 1);

      // Add bell label
      bellLayer.append("text")
        .attr("x", x)
        .attr("y", height - bellHeight - 70)
        .attr("text-anchor", "middle")
        .attr("fill", categoryData.textColor)
        .attr("font-size", 16)
        .text(cat);

      // ✅ Add icon on top
      bellLayer.append("image")
        .attr("href", categoryData.icon)
        .attr("x", x - 30)
        .attr("y", height - bellHeight - 130)
        .attr("width", 60)
        .attr("height", 60);

      // Sub-categories clickable circles
      categoryData.items.forEach((item, j) => {
        const cx = x;
        const cy = height - bellHeight - 120 - j * 50;

        bellLayer.append("circle")
          .attr("cx", cx)
          .attr("cy", cy)
          .attr("r", 20)
          .attr("fill", "#fff")
          .attr("stroke", "#000");

        bellLayer.append("text")
          .attr("x", cx)
          .attr("y", cy + 5)
          .attr("text-anchor", "middle")
          .attr("font-size", 12)
          .text(item.title);
      });
    });


  }, [data, isMobile]);

  return (
    <div className={styles.container}>
      <svg ref={svgRef} width="100%" height="500" />
      {!isMobile && tooltip && <Tooltip item={tooltip.item} position={{ x: tooltip.x, y: tooltip.y }} />}
      {isMobile && modalItem && <Modal item={modalItem} onClose={() => setModalItem(null)} />}
    </div>
  );
};

export default BellDiagram;
