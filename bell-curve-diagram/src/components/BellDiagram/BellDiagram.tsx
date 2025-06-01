



// "use client";

// import * as d3 from 'd3';

// import { BellData, Item } from '../../types/BellTypes';
// import React, { useEffect, useRef, useState } from 'react';

// import Modal from '../../components/Modal/Modal';
// import mockData from '../../data/mockData.json';
// import styles from './BellDiagram.module.scss';

// const BellDiagram: React.FC = () => {
//   const svgRef = useRef<SVGSVGElement | null>(null);
//   const data: BellData = mockData;
//   const [modalItem, setModalItem] = useState<{ item: Item; category: string } | null>(null);

//   useEffect(() => {
//     if (!svgRef.current) return;
//     const svg = d3.select(svgRef.current);
//     svg.selectAll("*").remove();

//     const width = 1200;
//     const height = 600;
//     const bellWidth = 120;
//     const categories = Object.keys(data);
//     const total = categories.length;
//     const spacing = width / (total + 1);
//     const bellLayer = svg.append("g");

//     categories.forEach((cat, i) => {
//       const categoryData = data[cat];
//       const bellHeight = 300 - i * 10;
//       const x = spacing * (i + 1);

//       const bellData = [
//         [x - bellWidth, height],
//         [x - bellWidth / 2, height - bellHeight],
//         [x, height - bellHeight - 50],
//         [x + bellWidth / 2, height - bellHeight],
//         [x + bellWidth, height],
//       ];

//       const path = d3.line().curve(d3.curveBasis);

//       const bellPath = bellLayer.append("path")
//         .attr("d", path(bellData as [number, number][]))
//         .attr("fill", categoryData.color)
//         .attr("stroke", "#fff")
//         .attr("stroke-width", 2)
//         .attr("opacity", 0)
//         .style("cursor", "pointer")
//         .on("click", () => {
//           setModalItem({ item: categoryData.items[0], category: cat });
//         });

//       bellPath.transition().duration(800).attr("opacity", 1);

//       // Title
//       bellLayer.append("text")
//         .attr("x", x)
//         .attr("y", height - bellHeight - 70)
//         .attr("text-anchor", "middle")
//         .attr("fill", "#000")
//         .attr("font-size", 18)
//         .text(cat);

//       // Icon
//       bellLayer.append("image")
//         .attr("href", categoryData.icon)
//         .attr("x", x - 20)
//         .attr("y", height - bellHeight - 40)
//         .attr("width", 40)
//         .attr("height", 40);

//       // Subcategories inside bell
//       categoryData.items.forEach((item, j) => {
//         bellLayer.append("text")
//           .attr("x", x)
//           .attr("y", height - bellHeight + 20 + j * 20)
//           .attr("text-anchor", "middle")
//           .attr("font-size", 12)
//           .attr("fill", "#000")
//           .text(item.title);
//       });
//     });

//   }, [data]);

//   return (
//     <div className={styles.container}>
//       <svg ref={svgRef} width="100%" height="600" />
//       {modalItem && (
//         <Modal
//           item={modalItem.item}
//           title={modalItem.category}
//           onClose={() => setModalItem(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default BellDiagram;


// "use client";

// import * as d3 from 'd3';

// import { BellData, Item } from '../../types/BellTypes';
// import React, { useEffect, useRef } from 'react';

// import mockData from '../../data/mockData.json';
// import styles from './BellDiagram.module.scss';

// const BellDiagram: React.FC = () => {
//   const svgRef = useRef<SVGSVGElement | null>(null);
//   const data: BellData = mockData;

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

//       const group = bellLayer.append("g");

//       const bellPath = group.append("path")
//         .attr("d", path(bellData as [number, number][]))
//         .attr("fill", categoryData.color)
//         .attr("stroke", "#fff")
//         .attr("stroke-width", 2)
//         .attr("opacity", 0)
//         .style("cursor", "pointer")
//         .on("mouseover", () => {
//           // Clear any previous texts
//           group.selectAll(".subcategory-text").remove();

//           const items = categoryData.items;
//           const startY = height - bellHeight - 50;
//           const textGroup = group.append("g");

//           items.forEach((item, index) => {
//             textGroup.append("text")
//               .attr("class", "subcategory-text")
//               .attr("x", x)
//               .attr("y", startY + index * 20)
//               .attr("text-anchor", "middle")
//               .attr("fill", "#000")
//               .attr("font-size", 14)
//               .text(`• ${item.title}`);
//           });
//         })
//         .on("mouseout", () => {
//           group.selectAll(".subcategory-text").remove();
//         });

//       bellPath.transition().duration(800).attr("opacity", 1);

//       // Add bell label (title)
//       bellLayer.append("text")
//         .attr("x", x)
//         .attr("y", height - bellHeight - 70)
//         .attr("text-anchor", "middle")
//         .attr("fill", categoryData.textColor)
//         .attr("font-size", 16)
//         .attr("font-weight", "bold")
//         .text(cat);
//     });
//   }, [data]);

//   return (
//     <div className={styles.container}>
//       <svg ref={svgRef} width="100%" height="500" />
//     </div>
//   );
// };

// export default BellDiagram;



"use client";

import * as d3 from 'd3';

import { BellData, Item } from '../../types/BellTypes';
import React, { useEffect, useRef } from 'react';

import mockData from '../../data/mockData.json';
import styles from './BellDiagram.module.scss';

const BellDiagram: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const data: BellData = mockData;

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 1000;
    const height = 500;
    const bellWidth = 120;
    const bellHeight = 300; // SAME HEIGHT FOR ALL BELLS
    const categories = Object.keys(data);
    const total = categories.length;
    const spacing = width / (total + 1);
    const bellLayer = svg.append("g");

    categories.forEach((cat, i) => {
      const categoryData = data[cat];
      const x = spacing * (i + 1);

      const bellData = [
        [x - bellWidth, height],
        [x - bellWidth / 2, height - bellHeight],
        [x, height - bellHeight - 50],
        [x + bellWidth / 2, height - bellHeight],
        [x + bellWidth, height],
      ];

      const path = d3.line().curve(d3.curveBasis);
      const group = bellLayer.append("g");

      const bellPath = group.append("path")
        .attr("d", path(bellData as [number, number][]))
        .attr("fill", categoryData.color)
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .attr("opacity", 0)
        .style("cursor", "pointer")
        .on("mouseover", () => {
          group.selectAll(".subcategory-text").remove();

          const items = categoryData.items;
          const startY = height - bellHeight - 30 - items.length * 10;

          items.forEach((item, index) => {
            group.append("text")
              .attr("class", "subcategory-text")
              .attr("x", x)
              .attr("y", startY + index * 20)
              .attr("text-anchor", "middle")
              .attr("fill", "#000")
              .attr("font-size", 14)
              .text(`• ${item.title}`);
          });
        })
        .on("mouseout", () => {
          group.selectAll(".subcategory-text").remove();
        });

      bellPath.transition().duration(800).attr("opacity", 1);

      // Bell Label
      bellLayer.append("text")
        .attr("x", x)
        .attr("y", height - bellHeight - 70)
        .attr("text-anchor", "middle")
        .attr("fill", categoryData.textColor)
        .attr("font-size", 16)
        .attr("font-weight", "bold")
        .text(cat);
    });
  }, [data]);

  return (
    <div className={styles.container}>
      <svg ref={svgRef} width="100%" height="500" />
    </div>
  );
};

export default BellDiagram;
