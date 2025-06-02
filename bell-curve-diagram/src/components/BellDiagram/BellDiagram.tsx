
// "use client";

// import * as d3 from 'd3';

// import { BellData, Item } from '../../types/BellTypes';
// import React, { useEffect, useRef, useState } from 'react';

// import mockData from '../../data/mockData.json';
// import styles from './BellDiagram.module.scss';

// const wrapText = (textElement: d3.Selection<SVGTextElement, unknown, null, undefined>, text: string, width: number) => {
//   const words = text.split(/\s+/);
//   let line: string[] = [];
//   let lineNumber = 0;
//   const lineHeight = 1.1;

//   const y = +textElement.attr("y");
//   const x = +textElement.attr("x");
//   const dy = 0;

//   textElement.text(null);

//   let tspan = textElement.append("tspan")
//     .attr("x", x)
//     .attr("y", y)
//     .attr("dy", `${dy}em`);

//   for (let i = 0; i < words.length; i++) {
//     line.push(words[i]);
//     tspan.text(line.join(" "));

//     if (tspan.node()!.getComputedTextLength() > width) {
//       line.pop();
//       tspan.text(line.join(" "));
//       line = [words[i]];
//       tspan = textElement.append("tspan")
//         .attr("x", x)
//         .attr("y", y)
//         .attr("dy", `${++lineNumber * lineHeight}em`)
//         .text(words[i]);
//     }
//   }
// };

// const BellDiagram: React.FC = () => {
//   const svgRef = useRef<SVGSVGElement | null>(null);
//   const data: BellData = mockData;
//   const [isMobile, setIsMobile] = useState<boolean>(false);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   useEffect(() => {
//     if (!svgRef.current) return;
//     const svg = d3.select(svgRef.current);
//     svg.selectAll("*").remove();

//     // 👇👇 Dynamic dimensions depending on device
//     const width = isMobile ? 360 : 1000;
//     const height = isMobile ? 400 : 500;
//     const bellWidth = isMobile ? 60 : 120;
//     const bellHeight = isMobile ? 220 : 400;

//     const categories = Object.keys(data);
//     const total = categories.length;
//     const spacing = width / (total + 1);
//     const bellLayer = svg.append("g");

//     categories.forEach((cat, i) => {
//       const categoryData = data[cat];
//       const x = spacing * (i + 1);

//       const bellData = [
//         [x - bellWidth * 0.65, height],
//         [x - bellWidth * 0.5, height - bellHeight * 0.1],
//         [x - bellWidth * 0.4, height - bellHeight * 0.4],
//         [x - bellWidth * 0.2, height - bellHeight * 0.7],
//         [x, height - bellHeight * 0.72],
//         [x + bellWidth * 0.2, height - bellHeight * 0.7],
//         [x + bellWidth * 0.4, height - bellHeight * 0.4],
//         [x + bellWidth * 0.5, height - bellHeight * 0.1],
//         [x + bellWidth * 0.65, height]
//       ];

//       const path = d3.line().curve(d3.curveBasis);
//       const group = bellLayer.append("g");

//       const bellPath = group.append("path")
//         .attr("d", path(bellData as [number, number][]))
//         .attr("fill", categoryData.color)
//         .attr("fill-opacity", 0.6)
//         .attr("stroke", "#fff")
//         .attr("stroke-width", 2)
//         .attr("opacity", 0)
//         .style("cursor", "pointer");

//       const showSubcategories = () => {
//         group.selectAll(".subcategory-text").remove();
//         const items = categoryData.items;
//         const startY = height - bellHeight + 30;
//         const textX = x - bellWidth / 2 + 5;
//         const maxTextWidth = bellWidth - 10;

//         items.forEach((item, index) => {
//           const textGroup = group.append("text")
//             .attr("class", "subcategory-text")
//             .attr("x", textX)
//             .attr("y", startY + index * 30)
//             .attr("text-anchor", "start")
//             .attr("fill", "#000")
//             .attr("font-size", isMobile ? 10 : 14);

//           wrapText(textGroup, `• ${item.title}`, maxTextWidth);
//         });
//       };

//       if (isMobile) {
//         bellPath.on("click", () => {
//           const alreadyShown = group.selectAll(".subcategory-text").size() > 0;
//           group.selectAll(".subcategory-text").remove();
//           if (!alreadyShown) showSubcategories();
//         });
//       } else {
//         bellPath
//           .on("mouseover", () => showSubcategories())
//           .on("mouseout", () => group.selectAll(".subcategory-text").remove());
//       }

//       bellPath.transition().duration(800).attr("opacity", 1);

//       bellLayer.append("text")
//         .attr("x", x)
//         .attr("y", height - bellHeight - 50)
//         .attr("text-anchor", "middle")
//         .attr("fill", categoryData.textColor)
//         .attr("font-size", isMobile ? 12 : 16)
//         .attr("font-weight", "bold")
//         .text(cat);
//     });

//     // 👉 Always set svg width and height explicitly for D3
//     svg.attr("width", width).attr("height", height);

//   }, [data, isMobile]);

//   return (
//     <div className={styles.container}>
//       <svg ref={svgRef} />
//     </div>
//   );
// };

// export default BellDiagram;






// "use client";

// import * as d3 from 'd3';

// import { BellData, Item } from '../../types/BellTypes';
// import React, { useEffect, useRef, useState } from 'react';

// import mockData from '../../data/mockData.json';
// import styles from './BellDiagram.module.scss';

// const wrapText = (textElement: d3.Selection<SVGTextElement, unknown, null, undefined>, text: string, width: number) => {
//   const words = text.split(/\s+/);
//   let line: string[] = [];
//   let lineNumber = 0;
//   const lineHeight = 1.1;

//   const y = +textElement.attr("y");
//   const x = +textElement.attr("x");
//   const dy = 0;

//   textElement.text(null);

//   let tspan = textElement.append("tspan")
//     .attr("x", x)
//     .attr("y", y)
//     .attr("dy", `${dy}em`);

//   for (let i = 0; i < words.length; i++) {
//     line.push(words[i]);
//     tspan.text(line.join(" "));

//     if (tspan.node()!.getComputedTextLength() > width) {
//       line.pop();
//       tspan.text(line.join(" "));
//       line = [words[i]];
//       tspan = textElement.append("tspan")
//         .attr("x", x)
//         .attr("y", y)
//         .attr("dy", `${++lineNumber * lineHeight}em`)
//         .text(words[i]);
//     }
//   }
// };

// const BellDiagram: React.FC = () => {
//   const svgRef = useRef<SVGSVGElement | null>(null);
//   const data: BellData = mockData;
//   const [isMobile, setIsMobile] = useState<boolean>(false);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   useEffect(() => {
//     if (!svgRef.current) return;
//     const svg = d3.select(svgRef.current);
//     svg.selectAll("*").remove();

//     const width = isMobile ? 360 : 1000;
//     const height = isMobile ? 400 : 500;
//     const bellWidth = isMobile ? 60 : 120;
//     const bellHeight = isMobile ? 220 : 400;
//     const growFactor = 1.2; // scale on hover

//     const categories = Object.keys(data);
//     const total = categories.length;
//     const spacing = width / (total + 1);
//     const bellLayer = svg.append("g");

//     const createBellData = (x: number, bellW: number, bellH: number) => [
//       [x - bellW * 0.65, height],
//       [x - bellW * 0.5, height - bellH * 0.1],
//       [x - bellW * 0.4, height - bellH * 0.4],
//       [x - bellW * 0.2, height - bellH * 0.7],
//       [x, height - bellH * 0.72],
//       [x + bellW * 0.2, height - bellH * 0.7],
//       [x + bellW * 0.4, height - bellH * 0.4],
//       [x + bellW * 0.5, height - bellH * 0.1],
//       [x + bellW * 0.65, height]
//     ];

//     categories.forEach((cat, i) => {
//       const categoryData = data[cat];
//       const x = spacing * (i + 1);
//       const group = bellLayer.append("g");

//       const bellPath = group.append("path")
//         .attr("d", d3.line().curve(d3.curveBasis)(createBellData(x, bellWidth, bellHeight) as [number, number][]))
//         .attr("fill", categoryData.color)
//         .attr("fill-opacity", 0.6)
//         .attr("stroke", "#fff")
//         .attr("stroke-width", 2)
//         .attr("opacity", 0)
//         .style("cursor", "pointer");

//       const showSubcategories = (currentBellH: number) => {
//         group.selectAll(".subcategory-text").remove();
//         const items = categoryData.items;
//         const startY = height - currentBellH + 40;
//         const textX = x - bellWidth / 2 + 10;
//         const maxTextWidth = bellWidth - 20;

//         items.forEach((item, index) => {
//           const textGroup = group.append("text")
//             .attr("class", "subcategory-text")
//             .attr("x", textX)
//             .attr("y", startY + index * 30)
//             .attr("text-anchor", "start")
//             .attr("fill", "#000")
//             .attr("font-size", isMobile ? 10 : 14);

//           wrapText(textGroup, `• ${item.title}`, maxTextWidth);
//         });
//       };

//       const growBell = () => {
//         const newBellH = bellHeight * growFactor;
//         const newD = d3.line().curve(d3.curveBasis)(createBellData(x, bellWidth, newBellH) as [number, number][]);
//         bellPath.transition().duration(300).attr("d", newD);
//         showSubcategories(newBellH);
//       };

//       const shrinkBell = () => {
//         const originalD = d3.line().curve(d3.curveBasis)(createBellData(x, bellWidth, bellHeight) as [number, number][]);
//         bellPath.transition().duration(300).attr("d", originalD);
//         group.selectAll(".subcategory-text").remove();
//       };

//       if (isMobile) {
//         bellPath.on("click", () => {
//           const shown = group.selectAll(".subcategory-text").size() > 0;
//           if (shown) {
//             shrinkBell();
//           } else {
//             growBell();
//           }
//         });
//       } else {
//         bellPath
//           .on("mouseover", () => growBell())
//           .on("mouseout", () => shrinkBell());
//       }

//       bellPath.transition().duration(800).attr("opacity", 1);

//       bellLayer.append("text")
//         .attr("x", x)
//         .attr("y", height - bellHeight - 50)
//         .attr("text-anchor", "middle")
//         .attr("fill", categoryData.textColor)
//         .attr("font-size", isMobile ? 12 : 16)
//         .attr("font-weight", "bold")
//         .text(cat);
//     });

//     svg.attr("width", width).attr("height", height);
//   }, [data, isMobile]);

//   return (
//     <div className={styles.container}>
//       <svg ref={svgRef} />
//     </div>
//   );
// };

// export default BellDiagram;







// "use client";

// import * as d3 from "d3";

// import { BellData, Item } from "../../types/BellTypes";
// import React, { useEffect, useRef, useState } from "react";

// import mockData from "../../data/mockData.json";
// import styles from "./BellDiagram.module.scss";

// // Text wrapping function stays same
// const wrapText = (
//   textElement: d3.Selection<SVGTextElement, unknown, null, undefined>,
//   text: string,
//   width: number
// ) => {
//   const words = text.split(/\s+/);
//   let line: string[] = [];
//   let lineNumber = 0;
//   const lineHeight = 1.1;
//   const y = +textElement.attr("y");
//   const x = +textElement.attr("x");
//   const dy = 0;

//   textElement.text(null);

//   let tspan = textElement
//     .append("tspan")
//     .attr("x", x)
//     .attr("y", y)
//     .attr("dy", `${dy}em`);

//   for (let i = 0; i < words.length; i++) {
//     line.push(words[i]);
//     tspan.text(line.join(" "));

//     if (tspan.node()!.getComputedTextLength() > width) {
//       line.pop();
//       tspan.text(line.join(" "));
//       line = [words[i]];
//       tspan = textElement
//         .append("tspan")
//         .attr("x", x)
//         .attr("y", y)
//         .attr("dy", `${++lineNumber * lineHeight}em`)
//         .text(words[i]);
//     }
//   }
// };

// const BellDiagram: React.FC = () => {
//   const svgRef = useRef<SVGSVGElement | null>(null);
//   const data: BellData = mockData;
//   const [isMobile, setIsMobile] = useState<boolean>(false);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     if (!svgRef.current) return;
//     const svg = d3.select(svgRef.current);
//     svg.selectAll("*").remove();

//     const width = isMobile ? 360 : 1000;
//     const height = isMobile ? 400 : 500;
//     const bellWidth = isMobile ? 60 : 120;
//     const bellHeight = isMobile ? 220 : 400;
//     const growFactor = 1.2;

//     const categories = Object.keys(data);
//     const total = categories.length;
//     const spacing = width / (total + 1);
//     const bellLayer = svg.append("g");

//     // Create bell shape relative to (0,0)
//     const createBellData = (bellW: number, bellH: number) => [
//       [-bellW * 0.65, 0],
//       [-bellW * 0.5, -bellH * 0.1],
//       [-bellW * 0.4, -bellH * 0.4],
//       [-bellW * 0.2, -bellH * 0.7],
//       [0, -bellH * 0.72],
//       [bellW * 0.2, -bellH * 0.7],
//       [bellW * 0.4, -bellH * 0.4],
//       [bellW * 0.5, -bellH * 0.1],
//       [bellW * 0.65, 0],
//     ];

//     categories.forEach((cat, i) => {
//       const categoryData = data[cat];
//       const x = spacing * (i + 1);

//       const group = bellLayer
//         .append("g")
//         .attr("transform", `translate(${x}, ${height}) scale(1)`);

//       const bellData = createBellData(bellWidth, bellHeight);

//       const bellPath = group
//         .append("path")
//         .attr("d", d3.line().curve(d3.curveBasis)(bellData as [number, number][]))
//         .attr("fill", categoryData.color)
//         .attr("fill-opacity", 0.6)
//         .attr("stroke", "#fff")
//         .attr("stroke-width", 2)
//         .attr("opacity", 0)
//         .style("cursor", "pointer");

//       const showSubcategories = () => {
//         group.selectAll(".subcategory-text").remove();
//         const items = categoryData.items;
//         const startY = -bellHeight + 40;
//         const textX = -bellWidth / 2 + 10;
//         const maxTextWidth = bellWidth - 20;

//         items.forEach((item, index) => {
//           const textGroup = group
//             .append("text")
//             .attr("class", "subcategory-text")
//             .attr("x", textX)
//             .attr("y", startY + index * 30)
//             .attr("text-anchor", "start")
//             .attr("fill", "#000")
//             .attr("font-size", isMobile ? 10 : 14);

//           wrapText(textGroup, `• ${item.title}`, maxTextWidth);
//         });
//       };

//       const growBell = () => {
//         group
//           .transition()
//           .duration(300)
//           .attr("transform", `translate(${x}, ${height}) scale(${growFactor})`);
//         showSubcategories();
//       };

//       const shrinkBell = () => {
//         group
//           .transition()
//           .duration(300)
//           .attr("transform", `translate(${x}, ${height}) scale(1)`);
//         group.selectAll(".subcategory-text").remove();
//       };

//       if (isMobile) {
//         bellPath.on("click", () => {
//           const shown = group.selectAll(".subcategory-text").size() > 0;
//           if (shown) {
//             shrinkBell();
//           } else {
//             growBell();
//           }
//         });
//       } else {
//         bellPath
//           .on("mouseover", () => growBell())
//           .on("mouseout", () => shrinkBell());
//       }

//       bellPath.transition().duration(800).attr("opacity", 1);

//       bellLayer
//         .append("text")
//         .attr("x", x)
//         .attr("y", height - bellHeight - 50)
//         .attr("text-anchor", "middle")
//         .attr("fill", categoryData.textColor)
//         .attr("font-size", isMobile ? 12 : 16)
//         .attr("font-weight", "bold")
//         .text(cat);
//     });

//     svg.attr("width", width).attr("height", height);
//   }, [data, isMobile]);

//   return (
//     <div className={styles.container}>
//       <svg ref={svgRef} />
//     </div>
//   );
// };

// export default BellDiagram;







// "use client";

// import * as d3 from "d3";

// import React, { useEffect, useRef, useState } from "react";

// import { BellData } from "../../types/BellTypes";
// import mockData from "../../data/mockData.json";
// import styles from "./BellDiagram.module.scss";

// const wrapText = (
//   textElement: d3.Selection<SVGTextElement, unknown, null, undefined>,
//   text: string,
//   width: number
// ) => {
//   const words = text.split(/\s+/);
//   let line: string[] = [];
//   let lineNumber = 0;
//   const lineHeight = 1.1;
//   const y = +textElement.attr("y");
//   const x = +textElement.attr("x");

//   textElement.text(null);
//   let tspan = textElement.append("tspan").attr("x", x).attr("y", y).attr("dy", `0em`);

//   for (let i = 0; i < words.length; i++) {
//     line.push(words[i]);
//     tspan.text(line.join(" "));

//     if (tspan.node()!.getComputedTextLength() > width) {
//       line.pop();
//       tspan.text(line.join(" "));
//       line = [words[i]];
//       tspan = textElement
//         .append("tspan")
//         .attr("x", x)
//         .attr("y", y)
//         .attr("dy", `${++lineNumber * lineHeight}em`)
//         .text(words[i]);
//     }
//   }
// };

// const BellDiagram: React.FC = () => {
//   const svgRef = useRef<SVGSVGElement | null>(null);
//   const data: BellData = mockData;
//   const [isMobile, setIsMobile] = useState<boolean>(false);

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 768);
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     if (!svgRef.current) return;
//     const svg = d3.select(svgRef.current);
//     svg.selectAll("*").remove();

//     const width = isMobile ? 360 : 1000;
//     const height = isMobile ? 400 : 500;
//     const bellWidth = isMobile ? 60 : 120;
//     const bellHeight = isMobile ? 220 : 400;
//     const growFactor = 1.15;
//     const categories = Object.keys(data);
//     const spacing = width / (categories.length + 1);
//     const bellLayer = svg.append("g");

//     const createBellData = (bellW: number, bellH: number) => [
//       [-bellW * 0.65, 0],
//       [-bellW * 0.5, -bellH * 0.1],
//       [-bellW * 0.4, -bellH * 0.4],
//       [-bellW * 0.2, -bellH * 0.7],
//       [0, -bellH * 0.72],
//       [bellW * 0.2, -bellH * 0.7],
//       [bellW * 0.4, -bellH * 0.4],
//       [bellW * 0.5, -bellH * 0.1],
//       [bellW * 0.65, 0],
//     ];

//     categories.forEach((cat, i) => {
//       const categoryData = data[cat];
//       const x = spacing * (i + 1);
//       const group = bellLayer.append("g").attr("transform", `translate(${x}, ${height})`);

//       const bellData = createBellData(bellWidth, bellHeight);

//       const bellPath = group
//         .append("path")
//         .attr("d", d3.line().curve(d3.curveBasis)(bellData as [number, number][]))
//         .attr("fill", categoryData.color)
//         .attr("fill-opacity", 0.8)
//         .attr("stroke", "#fff")
//         .attr("stroke-width", 2)
//         .attr("filter", "drop-shadow(0px 0px 0px rgba(0,0,0,0))")
//         .style("cursor", "pointer")
//         .attr("opacity", 0);

//       const textGroup = group.append("g").attr("class", "subcategory-text").style("opacity", 0);

//       const items = categoryData.items;
//       const startY = -bellHeight * 0.45;
//       const textX = 0;
//       const maxTextWidth = bellWidth - 20;

//       items.forEach((item, index) => {
//         const text = textGroup
//           .append("text")
//           .attr("x", textX)
//           .attr("y", startY + index * 22)
//           .attr("text-anchor", "middle")
//           .attr("fill", "#000")
//           .attr("font-size", isMobile ? 10 : 14);
//         wrapText(text, `• ${item.title}`, maxTextWidth);
//       });

//       const growBell = () => {
//         group
//           .transition().duration(300)
//           .attr("transform", `translate(${x}, ${height}) scale(${growFactor})`);
//         textGroup.transition().duration(300).style("opacity", 1);
//         bellPath
//           .transition()
//           .duration(300)
//           .attr("filter", "drop-shadow(4px 4px 8px rgba(0,0,0,0.4))");
//       };

//       const shrinkBell = () => {
//         group
//           .transition().duration(300)
//           .attr("transform", `translate(${x}, ${height}) scale(1)`);
//         textGroup.transition().duration(300).style("opacity", 0);
//         bellPath
//           .transition()
//           .duration(300)
//           .attr("filter", "drop-shadow(0px 0px 0px rgba(0,0,0,0))");
//       };

//       if (isMobile) {
//         bellPath.on("click", () => {
//           const shown = +textGroup.style("opacity") === 1;
//           shown ? shrinkBell() : growBell();
//         });
//       } else {
//         bellPath.on("mouseover", growBell).on("mouseout", shrinkBell);
//       }

//       // Smooth bell fade-in animation
//       bellPath.transition().duration(800).attr("opacity", 1);

//       // Category label below each bell
//       bellLayer.append("text")
//         .attr("x", x)
//         .attr("y", height - bellHeight - 50)
//         .attr("text-anchor", "middle")
//         .attr("fill", categoryData.textColor)
//         .attr("font-size", isMobile ? 12 : 16)
//         .attr("font-weight", "bold")
//         .text(cat);
//     });

//     svg.attr("width", width).attr("height", height);
//   }, [data, isMobile]);

//   return (
//     <div className={styles.container}>
//       <svg ref={svgRef} />
//     </div>
//   );
// };

// export default BellDiagram;





// "use client";

// import * as d3 from "d3";

// import React, { useEffect, useRef, useState } from "react";

// import { BellData } from "../../types/BellTypes";
// import Tooltip from "./Tooltip"; // import Tooltip component
// import mockData from "../../data/mockData.json";
// import styles from "./BellDiagram.module.scss";

// const wrapText = (
//   textElement: d3.Selection<SVGTextElement, unknown, null, undefined>,
//   text: string,
//   width: number
// ) => {
//   const words = text.split(/\s+/);
//   let line: string[] = [];
//   let lineNumber = 0;
//   const lineHeight = 1.1;
//   const y = +textElement.attr("y");
//   const x = +textElement.attr("x");
//   textElement.text(null);
//   let tspan = textElement.append("tspan").attr("x", x).attr("y", y).attr("dy", `0em`);

//   for (let i = 0; i < words.length; i++) {
//     line.push(words[i]);
//     tspan.text(line.join(" "));

//     if (tspan.node()!.getComputedTextLength() > width) {
//       line.pop();
//       tspan.text(line.join(" "));
//       line = [words[i]];
//       tspan = textElement
//         .append("tspan")
//         .attr("x", x)
//         .attr("y", y)
//         .attr("dy", `${++lineNumber * lineHeight}em`)
//         .text(words[i]);
//     }
//   }
// };

// const BellDiagram: React.FC = () => {
//   const svgRef = useRef<SVGSVGElement | null>(null);
//   const data: BellData = mockData;
//   const [tooltip, setTooltip] = useState<{ x: number; y: number; label: string } | null>(null);
//   const [isMobile, setIsMobile] = useState<boolean>(false);

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 768);
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     if (!svgRef.current) return;
//     const svg = d3.select(svgRef.current);
//     svg.selectAll("*").remove();

//     const width = isMobile ? 360 : 1000;
//     const height = isMobile ? 400 : 500;
//     const bellWidth = isMobile ? 60 : 120;
//     const bellHeight = isMobile ? 220 : 400;
//     const growFactor = 1.15;
//     const categories = Object.keys(data);
//     const spacing = width / (categories.length + 1);
//     const bellLayer = svg.append("g");

//     const createBellData = (bellW: number, bellH: number) => [
//       [-bellW * 0.65, 0],
//       [-bellW * 0.5, -bellH * 0.1],
//       [-bellW * 0.4, -bellH * 0.4],
//       [-bellW * 0.2, -bellH * 0.7],
//       [0, -bellH * 0.72],
//       [bellW * 0.2, -bellH * 0.7],
//       [bellW * 0.4, -bellH * 0.4],
//       [bellW * 0.5, -bellH * 0.1],
//       [bellW * 0.65, 0],
//     ];

//     categories.forEach((cat, i) => {
//       const categoryData = data[cat];
//       const x = spacing * (i + 1);
//       const group = bellLayer.append("g").attr("transform", `translate(${x}, ${height})`);
//       const bellData = createBellData(bellWidth, bellHeight);

//       const bellPath = group
//         .append("path")
//         .attr("d", d3.line().curve(d3.curveBasis)(bellData as [number, number][]))
//         .attr("fill", categoryData.color)
//         .attr("fill-opacity", 0.8)
//         .attr("stroke", "#fff")
//         .attr("stroke-width", 2)
//         .attr("filter", "drop-shadow(0px 0px 0px rgba(0,0,0,0))")
//         .style("cursor", "pointer")
//         .attr("opacity", 0);

//       const textGroup = group.append("g").attr("class", "subcategory-text").style("opacity", 0);
//       const items = categoryData.items;
//       const startY = -bellHeight * 0.45;
//       const textX = 0;
//       const maxTextWidth = bellWidth - 20;

//       items.forEach((item, index) => {
//         const text = textGroup
//           .append("text")
//           .attr("x", textX)
//           .attr("y", startY + index * 22)
//           .attr("text-anchor", "middle")
//           .attr("fill", "#000")
//           .attr("font-size", isMobile ? 10 : 14);
//         wrapText(text, `• ${item.title}`, maxTextWidth);
//       });

//       const growBell = () => {
//         group.transition().duration(300).attr("transform", `translate(${x}, ${height}) scale(${growFactor})`);
//         textGroup.transition().duration(300).style("opacity", 1);
//         bellPath.transition().duration(300).attr("filter", "drop-shadow(4px 4px 8px rgba(0,0,0,0.4))");
//       };

//       const shrinkBell = () => {
//         group.transition().duration(300).attr("transform", `translate(${x}, ${height}) scale(1)`);
//         textGroup.transition().duration(300).style("opacity", 0);
//         bellPath.transition().duration(300).attr("filter", "drop-shadow(0px 0px 0px rgba(0,0,0,0))");
//       };

//       bellPath
//         .on("mouseover", growBell)
//         .on("mouseout", shrinkBell)
//         .on("click", (event: any) => {
//           const [mouseX, mouseY] = d3.pointer(event);
//           setTooltip({ x: mouseX + x, y: mouseY + height, label: cat });
//         });

//       bellPath.transition().duration(800).attr("opacity", 1);

//       bellLayer.append("text")
//         .attr("x", x)
//         .attr("y", height - bellHeight - 50)
//         .attr("text-anchor", "middle")
//         .attr("fill", categoryData.textColor)
//         .attr("font-size", isMobile ? 12 : 16)
//         .attr("font-weight", "bold")
//         .text(cat);
//     });

//     svg.attr("width", width).attr("height", height);
//   }, [data, isMobile]);

//   return (
//     <div className={styles.container}>
//       <svg ref={svgRef} />
//       {tooltip && (
//         <Tooltip
//           x={tooltip.x}
//           y={tooltip.y}
//           label={tooltip.label}
//           onClose={() => setTooltip(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default BellDiagram;





// "use client";

// import * as d3 from "d3";

// import { BellData, Item } from "../../types/BellTypes";
// import React, { useEffect, useRef, useState } from "react";

// import Tooltip from "./Tooltip";
// import mockData from "../../data/mockData.json";
// import styles from "./BellDiagram.module.scss";

// const wrapText = (
//   textElement: d3.Selection<SVGTextElement, unknown, null, undefined>,
//   text: string,
//   width: number
// ) => {
//   const words = text.split(/\s+/);
//   let line: string[] = [];
//   let lineNumber = 0;
//   const lineHeight = 1.1;
//   const y = +textElement.attr("y");
//   const x = +textElement.attr("x");
//   textElement.text(null);
//   let tspan = textElement.append("tspan").attr("x", x).attr("y", y).attr("dy", `0em`);
//   for (let i = 0; i < words.length; i++) {
//     line.push(words[i]);
//     tspan.text(line.join(" "));
//     if (tspan.node()!.getComputedTextLength() > width) {
//       line.pop();
//       tspan.text(line.join(" "));
//       line = [words[i]];
//       tspan = textElement
//         .append("tspan")
//         .attr("x", x)
//         .attr("y", y)
//         .attr("dy", `${++lineNumber * lineHeight}em`)
//         .text(words[i]);
//     }
//   }
// };

// const BellDiagram: React.FC = () => {
//   const svgRef = useRef<SVGSVGElement | null>(null);
//   const data: BellData = mockData;
//   const [tooltip, setTooltip] = useState<{ x: number; y: number; item: Item } | null>(null);
//   const [isMobile, setIsMobile] = useState<boolean>(false);

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 768);
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     if (!svgRef.current) return;
//     const svg = d3.select(svgRef.current);
//     svg.selectAll("*").remove();

//     const width = isMobile ? 360 : 1200;
//     const height = isMobile ? 400 : 500;
//     const bellWidth = isMobile ? 60 : 120;
//     const bellHeight = isMobile ? 220 : 400;
//     const growFactor = 1.15;
//     const categories = Object.keys(data);
//     const spacing = width / (categories.length + 1);
//     const bellLayer = svg.append("g");

//     const createBellData = (bellW: number, bellH: number) => [
//       [-bellW * 0.65, 0],
//       [-bellW * 0.5, -bellH * 0.1],
//       [-bellW * 0.4, -bellH * 0.4],
//       [-bellW * 0.2, -bellH * 0.7],
//       [0, -bellH * 0.72],
//       [bellW * 0.2, -bellH * 0.7],
//       [bellW * 0.4, -bellH * 0.4],
//       [bellW * 0.5, -bellH * 0.1],
//       [bellW * 0.65, 0],
//     ];

//     categories.forEach((cat, i) => {
//       const categoryData = data[cat];
//       const x = spacing * (i + 1);
//       const group = bellLayer.append("g").attr("transform", `translate(${x}, ${height})`);
//       const bellData = createBellData(bellWidth, bellHeight);

//       const bellPath = group
//         .append("path")
//         .attr("d", d3.line().curve(d3.curveBasis)(bellData as [number, number][]))
//         .attr("fill", categoryData.color)
//         .attr("fill-opacity", 0.8)
//         .attr("stroke", "#fff")
//         .attr("stroke-width", 2)
//         .attr("filter", "drop-shadow(0px 0px 0px rgba(0,0,0,0))")
//         .style("cursor", "pointer")
//         .attr("opacity", 0);

//       const textGroup = group.append("g").attr("class", "subcategory-text").style("opacity", 0);
//       const items = categoryData.items;
//       const startY = -bellHeight * 0.45;
//       const textX = 0;
//       const maxTextWidth = bellWidth - 20;

//       items.forEach((item, index) => {
//         const text = textGroup
//           .append("text")
//           .attr("x", textX)
//           .attr("y", startY + index * 22)
//           .attr("text-anchor", "middle")
//           .attr("fill", "#000")
//           .attr("font-size", isMobile ? 10 : 14);
//         wrapText(text, `• ${item.title}`, maxTextWidth);
//       });

//       const growBell = () => {
//         group.transition().duration(300).attr("transform", `translate(${x}, ${height}) scale(${growFactor})`);
//         textGroup.transition().duration(300).style("opacity", 1);
//         bellPath.transition().duration(300).attr("filter", "drop-shadow(4px 4px 8px rgba(0,0,0,0.4))");
//       };

//       const shrinkBell = () => {
//         group.transition().duration(300).attr("transform", `translate(${x}, ${height}) scale(1)`);
//         textGroup.transition().duration(300).style("opacity", 0);
//         bellPath.transition().duration(300).attr("filter", "drop-shadow(0px 0px 0px rgba(0,0,0,0))");
//       };

//       bellPath
//         .on("mouseover", growBell)
//         .on("mouseout", shrinkBell)
//         .on("click", (event: any) => {
//           const [mouseX, mouseY] = d3.pointer(event);
//           const clickedItem = categoryData.items[0]; // ✅ Default: first item opens
//           setTooltip({
//             x: mouseX + x,
//             y: mouseY + height,
//             item: clickedItem
//           });
//         });

//       bellPath.transition().duration(800).attr("opacity", 1);

//       bellLayer.append("text")
//         .attr("x", x)
//         .attr("y", height - bellHeight - 50)
//         .attr("text-anchor", "middle")
//         .attr("fill", categoryData.textColor)
//         .attr("font-size", isMobile ? 12 : 16)
//         .attr("font-weight", "bold")
//         .text(cat);
//     });

//     svg.attr("width", width).attr("height", height);
//   }, [data, isMobile]);

//   return (
//     <div className={styles.container}>
//       <svg ref={svgRef} />
//       {tooltip && (
//         <Tooltip
//           x={tooltip.x}
//           y={tooltip.y}
//           item={tooltip.item}
//           onClose={() => setTooltip(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default BellDiagram;




// "use client";

// import * as d3 from "d3";

// import { BellData, Item } from "../../types/BellTypes";
// import React, { useEffect, useRef, useState } from "react";

// import Tooltip from "./Tooltip";
// import mockData from "../../data/mockData.json";
// import styles from "./BellDiagram.module.scss";

// const wrapText = (
//   textElement: d3.Selection<SVGTextElement, unknown, null, undefined>,
//   text: string,
//   width: number
// ) => {
//   const words = text.split(/\s+/);
//   let line: string[] = [];
//   let lineNumber = 0;
//   const lineHeight = 1.1;
//   const y = +textElement.attr("y");
//   const x = +textElement.attr("x");
//   textElement.text(null);
//   let tspan = textElement.append("tspan").attr("x", x).attr("y", y).attr("dy", `0em`);
//   for (let i = 0; i < words.length; i++) {
//     line.push(words[i]);
//     tspan.text(line.join(" "));
//     if (tspan.node()!.getComputedTextLength() > width) {
//       line.pop();
//       tspan.text(line.join(" "));
//       line = [words[i]];
//       tspan = textElement
//         .append("tspan")
//         .attr("x", x)
//         .attr("y", y)
//         .attr("dy", `${++lineNumber * lineHeight}em`)
//         .text(words[i]);
//     }
//   }
// };

// const BellDiagram: React.FC = () => {
//   const svgRef = useRef<SVGSVGElement | null>(null);
//   const data: BellData = mockData;
//   const [tooltip, setTooltip] = useState<{ x: number; y: number; item: Item } | null>(null);
//   const [isMobile, setIsMobile] = useState<boolean>(false);
//   const containerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     if (!svgRef.current || !containerRef.current) return;

//     const containerWidth = containerRef.current.clientWidth;
//     const width = containerWidth;
//     const height = isMobile ? 400 : 500;

//     const bellWidth = isMobile ? 60 : 120;
//     const bellHeight = isMobile ? 220 : 400;
//     const growFactor = isMobile ? 1.1 : 1.15;
//     const categories = Object.keys(data);
//     const spacing = width / (categories.length + 1);
//     const bellLayer = d3.select(svgRef.current).html("").append("g");

//     const createBellData = (bellW: number, bellH: number) => [
//       [-bellW * 0.65, 0],
//       [-bellW * 0.5, -bellH * 0.1],
//       [-bellW * 0.4, -bellH * 0.4],
//       [-bellW * 0.2, -bellH * 0.7],
//       [0, -bellH * 0.72],
//       [bellW * 0.2, -bellH * 0.7],
//       [bellW * 0.4, -bellH * 0.4],
//       [bellW * 0.5, -bellH * 0.1],
//       [bellW * 0.65, 0],
//     ];

//     categories.forEach((cat, i) => {
//       const categoryData = data[cat];
//       const x = spacing * (i + 1);
//       const group = bellLayer.append("g").attr("transform", `translate(${x}, ${height})`);
//       const bellData = createBellData(bellWidth, bellHeight);

//       const bellPath = group
//         .append("path")
//         .attr("d", d3.line().curve(d3.curveBasis)(bellData as [number, number][]))
//         .attr("fill", categoryData.color)
//         .attr("fill-opacity", 0.8)
//         .attr("stroke", "#fff")
//         .attr("stroke-width", 2)
//         .attr("filter", "drop-shadow(0px 0px 0px rgba(0,0,0,0))")
//         .style("cursor", "pointer")
//         .attr("opacity", 0);

//       const textGroup = group.append("g").attr("class", "subcategory-text").style("opacity", 0);
//       const items = categoryData.items;
//       const startY = -bellHeight * 0.45;
//       const textX = 0;
//       const maxTextWidth = bellWidth - 20;

//       items.forEach((item, index) => {
//         const text = textGroup
//           .append("text")
//           .attr("x", textX)
//           .attr("y", startY + index * 22)
//           .attr("text-anchor", "middle")
//           .attr("fill", "#000")
//           .attr("font-size", isMobile ? 10 : 14);
//         wrapText(text, `• ${item.title}`, maxTextWidth);
//       });

//       const growBell = () => {
//         group.transition().duration(300).attr("transform", `translate(${x}, ${height}) scale(${growFactor})`);
//         textGroup.transition().duration(300).style("opacity", 1);
//         bellPath.transition().duration(300).attr("filter", "drop-shadow(4px 4px 8px rgba(0,0,0,0.4))");
//       };

//       const shrinkBell = () => {
//         group.transition().duration(300).attr("transform", `translate(${x}, ${height}) scale(1)`);
//         textGroup.transition().duration(300).style("opacity", 0);
//         bellPath.transition().duration(300).attr("filter", "drop-shadow(0px 0px 0px rgba(0,0,0,0))");
//       };

//       bellPath
//         .on("mouseover", growBell)
//         .on("mouseout", shrinkBell)
//         .on("click", (event: any) => {
//           const [mouseX, mouseY] = d3.pointer(event);
//           const clickedItem = categoryData.items[0];
//           setTooltip({
//             x: mouseX + x,
//             y: mouseY + height,
//             item: clickedItem
//           });
//         });

//       bellPath.transition().duration(800).attr("opacity", 1);

//       bellLayer.append("text")
//         .attr("x", x)
//         .attr("y", height - bellHeight - 50)
//         .attr("text-anchor", "middle")
//         .attr("fill", categoryData.textColor)
//         .attr("font-size", isMobile ? 12 : 16)
//         .attr("font-weight", "bold")
//         .text(cat);
//     });

//     d3.select(svgRef.current).attr("width", width).attr("height", height);
//   }, [data, isMobile]);

//   return (
//     <div className={styles.container} ref={containerRef}>
//       <svg ref={svgRef} />
//       {tooltip && (
//         <Tooltip
//           x={tooltip.x}
//           y={tooltip.y}
//           item={tooltip.item}
//           onClose={() => setTooltip(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default BellDiagram;





// "use client";

// import * as d3 from "d3";

// import { BellData, Item } from "../../types/BellTypes";
// import React, { useEffect, useRef, useState } from "react";

// import Tooltip from "./Tooltip";
// import mockData from "../../data/mockData.json";
// import styles from "./BellDiagram.module.scss";

// /**
//  * wrapText: Custom D3 function to wrap long text within a given width.
//  * SVG text doesn't support auto wrapping, so we manually split words into tspans.
//  */
// const wrapText = (
//   textElement: d3.Selection<SVGTextElement, unknown, null, undefined>,
//   text: string,
//   width: number
// ) => {
//   const words = text.split(/\s+/);
//   let line: string[] = [];
//   let lineNumber = 0;
//   const lineHeight = 1.1; // vertical spacing between lines
//   const y = +textElement.attr("y");
//   const x = +textElement.attr("x");
//   textElement.text(null); // clear previous content

//   let tspan = textElement.append("tspan").attr("x", x).attr("y", y).attr("dy", `0em`);

//   for (let i = 0; i < words.length; i++) {
//     line.push(words[i]);
//     tspan.text(line.join(" "));

//     if (tspan.node()!.getComputedTextLength() > width) {
//       line.pop();
//       tspan.text(line.join(" "));
//       line = [words[i]];
//       tspan = textElement
//         .append("tspan")
//         .attr("x", x)
//         .attr("y", y)
//         .attr("dy", `${++lineNumber * lineHeight}em`)
//         .text(words[i]);
//     }
//   }
// };

// const BellDiagram: React.FC = () => {
//   const svgRef = useRef<SVGSVGElement | null>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const data: BellData = mockData;

//   const [tooltip, setTooltip] = useState<{ x: number; y: number; item: Item } | null>(null);
//   const [isMobile, setIsMobile] = useState<boolean>(false);

//   /**
//    * Responsive check on window resize to set mobile mode
//    */
//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 768);
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   /**
//    * Main rendering logic using D3 inside useEffect.
//    */
//   useEffect(() => {
//     if (!svgRef.current || !containerRef.current) return;

//     const containerWidth = containerRef.current.clientWidth;
//     const width = containerWidth;
//     const height = isMobile ? 400 : 500;
//     const bellWidth = isMobile ? 60 : 120;
//     const bellHeight = isMobile ? 270 : 420;
//     const growFactor = isMobile ? 1.1 : 1.15;
//     const categories = Object.keys(data);
//     const spacing = width / (categories.length + 1);

//     const bellLayer = d3.select(svgRef.current).html("").append("g");

//     /**
//      * Build control points for bell shape.
//      */
//     const createBellData = (bellW: number, bellH: number) => [
//       [-bellW * 0.65, 0],
//       [-bellW * 0.5, -bellH * 0.1],
//       [-bellW * 0.4, -bellH * 0.4],
//       [-bellW * 0.2, -bellH * 0.7],
//       [0, -bellH * 0.71],
//       [bellW * 0.2, -bellH * 0.7],
//       [bellW * 0.4, -bellH * 0.4],
//       [bellW * 0.5, -bellH * 0.1],
//       [bellW * 0.65, 0],
//     ];

//     /**
//      * Loop each category and render corresponding bell
//      */
//     categories.forEach((cat, i) => {
//       const categoryData = data[cat];
//       const x = spacing * (i + 1);

//       const group = bellLayer.append("g").attr("transform", `translate(${x}, ${height})`);
//       const bellData = createBellData(bellWidth, bellHeight);

//       // Bell shape
//       const bellPath = group
//         .append("path")
//         .attr("d", d3.line().curve(d3.curveBasis)(bellData as [number, number][]))
//         .attr("fill", categoryData.color)
//         .attr("fill-opacity", 0.8)
//         .attr("stroke", "#fff")
//         .attr("stroke-width", 2)
//         .attr("filter", "drop-shadow(0px 0px 0px rgba(0,0,0,0))")
//         .style("cursor", "pointer")
//         .attr("opacity", 0);

//       /**
//        * Subcategory text rendering
//        */
//       const textGroup = group.append("g").attr("class", "subcategory-text").style("opacity", 0);
//       const items = categoryData.items;

//       const lineHeight = isMobile ? 16 : 22;
//       const totalHeight = items.length * lineHeight;
//       const startY = -bellHeight * 0.7 + (bellHeight - totalHeight) / 2;

//       items.forEach((item, index) => {
//         const text = textGroup
//           .append("text")
//           .attr("x", 0)
//           .attr("y", startY + index * lineHeight)
//           .attr("text-anchor", "middle")
//           .attr("fill", "#FFFFFF")
//           .attr("font-size", isMobile ? 12 : 16)
//           .attr("font-weight", 400)
//           .style("font-family", "'Nunito', sans-serif");

//         wrapText(text, `• ${item.title}`, bellWidth - 20);
//       });









//       /**
//        * Category main label rendering above the bell
//        */
//       const labelText = group.append("text")
//         .attr("x", 0)
//         .attr("y", -bellHeight * 0.78)
//         .attr("text-anchor", "middle")
//         .attr("fill", categoryData.textColor)
//         .attr("font-size", isMobile ? 12 : 16)
//         .attr("font-weight", "bold");

//       wrapText(labelText, cat, bellWidth - 10);

//       /**
//        * Animation and interaction logic
//        */
//       const growBell = () => {
//         group.transition().duration(300).attr("transform", `translate(${x}, ${height}) scale(${growFactor})`);
//         textGroup.transition().duration(300).style("opacity", 1);
//         bellPath.transition().duration(300).attr("filter", "drop-shadow(4px 4px 8px rgba(0,0,0,0.4))");
//       };

//       const shrinkBell = () => {
//         group.transition().duration(300).attr("transform", `translate(${x}, ${height}) scale(1)`);
//         textGroup.transition().duration(300).style("opacity", 0);
//         bellPath.transition().duration(300).attr("filter", "drop-shadow(0px 0px 0px rgba(0,0,0,0))");
//       };

//       group
//         .on("mouseover", growBell)
//         .on("mouseout", shrinkBell)
//         .on("click", (event: any) => {
//           const [mouseX, mouseY] = d3.pointer(event);
//           const clickedItem = categoryData.items[0]; // show tooltip with first item
//           setTooltip({ x: mouseX + x, y: mouseY + height, item: clickedItem });
//         });

//       // Initial fade-in animation
//       bellPath.transition().duration(800).attr("opacity", 1);
//     });

//     // Set SVG responsive size
//     d3.select(svgRef.current).attr("width", width).attr("height", height);
//   }, [data, isMobile]);

//   return (
//     <div className={styles.container} ref={containerRef}>
//       <svg ref={svgRef} />
//       {tooltip && (
//         <Tooltip
//           x={tooltip.x}
//           y={tooltip.y}
//           item={tooltip.item}
//           onClose={() => setTooltip(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default BellDiagram;


"use client";

import * as d3 from "d3";

import { BellData, Item } from "../../types/BellTypes";
import React, { useEffect, useRef, useState } from "react";

import Tooltip from "./Tooltip";
import mockData from "../../data/mockData.json";
import styles from "./BellDiagram.module.scss";

/** Hybrid pre-wrap function to avoid splitting long words poorly */
const splitTextIntoLines = (text: string, maxCharsPerLine: number): string[] => {
  const words = text.split(/\s+/);
  let lines: string[] = [];
  let currentLine = "";

  words.forEach(word => {
    if ((currentLine + " " + word).trim().length <= maxCharsPerLine) {
      currentLine = (currentLine + " " + word).trim();
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  });

  if (currentLine) lines.push(currentLine);
  return lines;
};

/** Final bullet-safe wrapping inside SVG with true width handling */
const wrapText = (
  textElement: d3.Selection<SVGTextElement, unknown, null, undefined>,
  text: string,
  width: number
): number => {
  const approxCharPerLine = Math.floor(width / 7);  // Width estimation based on font family size
  const lines = splitTextIntoLines(text, approxCharPerLine);
  const y = +textElement.attr("y");
  const x = +textElement.attr("x");
  textElement.text(null);

  lines.forEach((line, idx) => {
    textElement.append("tspan")
      .attr("x", x)
      .attr("y", y)
      .attr("dy", `${idx * 1.2}em`)
      .text(line);
  });

  return lines.length;
};

/** Bell width shrinkage based on height position */
const getAvailableWidthAtY = (y: number, bellW: number, bellH: number) => {
  const relativeHeight = Math.abs(y) / bellH;
  const widthShrinkFactor = 1 - relativeHeight * 0.6;
  return bellW * widthShrinkFactor;
};

const BellDiagram: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const data: BellData = mockData;

  const [tooltip, setTooltip] = useState<{ x: number; y: number; item: Item } | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth;
    const width = containerWidth;
    const height = isMobile ? 400 : 500;
    const bellWidth = isMobile ? 90 : 160;
    const bellHeight = isMobile ? 280 : 430;
    const growFactor = isMobile ? 1.2 : 1.20;
    const categories = Object.keys(data);
    const spacing = width / (categories.length + 1);

    const bellLayer = d3.select(svgRef.current).html("").append("g");

    const createBellData = (bellW: number, bellH: number) => [
      [-bellW * 0.65, 0],
      [-bellW * 0.5, -bellH * 0.1],
      [-bellW * 0.4, -bellH * 0.4],
      [-bellW * 0.2, -bellH * 0.7],
      [0, -bellH * 0.71],
      [bellW * 0.2, -bellH * 0.7],
      [bellW * 0.4, -bellH * 0.4],
      [bellW * 0.5, -bellH * 0.1],
      [bellW * 0.65, 0],
    ];

    categories.forEach((cat, i) => {
      const categoryData = data[cat];
      const x = spacing * (i + 1);
      const group = bellLayer.append("g").attr("transform", `translate(${x}, ${height})`);
      const bellData = createBellData(bellWidth, bellHeight);

      const bellPath = group
        .append("path")
        .attr("d", d3.line().curve(d3.curveBasis)(bellData as [number, number][]))
        .attr("fill", categoryData.color)
        .attr("fill-opacity", 0.8)
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .attr("filter", "drop-shadow(0px 0px 0px rgba(0,0,0,0))")
        .style("cursor", "pointer")
        .attr("opacity", 0);

      const textGroup = group.append("g").attr("class", "subcategory-text").style("opacity", 0);
      const items = categoryData.items;

      const baseFontSize = isMobile ? 12 : 16;
      const maxComfortableItems = isMobile ? 4 : 6;
      const scaleFactor = Math.min(1, maxComfortableItems / items.length);
      const fontSize = Math.max(baseFontSize * scaleFactor, isMobile ? 10 : 12);
      const lineHeight = fontSize * 1.3;

      // Estimate total lines for vertical centering
      let totalLines = 0;
      const lineEstimates: number[] = [];

      items.forEach(item => {
        const estLines = Math.ceil(item.title.length / 18);
        lineEstimates.push(estLines);
        totalLines += estLines;
      });

      const totalHeight = totalLines * lineHeight;
      const shiftUp = Math.min(totalLines * (lineHeight * 0.15), bellHeight * 0.1);
      let runningY = -bellHeight * 0.68 + (bellHeight - totalHeight) / 2 - shiftUp;

      items.forEach((item, idx) => {
        const text = textGroup
          .append("text")
          .attr("x", 0)
          .attr("y", runningY)
          .attr("text-anchor", "middle")
          .attr("fill", "#FFFFFF")
          .attr("font-size", fontSize)
          .attr("font-weight", 400)
          .style("font-family", "'Nunito', sans-serif");

        const availableWidth = getAvailableWidthAtY(runningY, bellWidth - 10, bellHeight);
        const linesWrapped = wrapText(text, `• ${item.title}`, availableWidth);
        runningY += linesWrapped * lineHeight;
      });

      const labelText = group.append("text")
        .attr("x", 0)
        .attr("y", -bellHeight * 0.80)
        .attr("text-anchor", "middle")
        .attr("fill", categoryData.textColor)
        .attr("font-size", isMobile ? 12 : 16)
        .attr("font-weight", "bold");

      wrapText(labelText, cat, bellWidth - 10);

      const growBell = () => {
        group.transition().duration(300).attr("transform", `translate(${x}, ${height}) scale(${growFactor})`);
        textGroup.transition().duration(300).style("opacity", 1);
        bellPath.transition().duration(300).attr("filter", "drop-shadow(4px 4px 8px rgba(0,0,0,0.4))");
      };

      const shrinkBell = () => {
        group.transition().duration(300).attr("transform", `translate(${x}, ${height}) scale(1)`);
        textGroup.transition().duration(300).style("opacity", 0);
        bellPath.transition().duration(300).attr("filter", "drop-shadow(0px 0px 0px rgba(0,0,0,0))");
      };

      group
        .on("mouseover", growBell)
        .on("mouseout", shrinkBell)
        .on("click", (event: any) => {
          const [mouseX, mouseY] = d3.pointer(event);
          const clickedItem = categoryData.items[0];
          setTooltip({ x: mouseX + x, y: mouseY + height, item: clickedItem });
        });

      bellPath.transition().duration(800).attr("opacity", 1);
    });

    d3.select(svgRef.current).attr("width", width).attr("height", height);
  }, [data, isMobile]);

  return (
    <div className={styles.container} ref={containerRef}>
      <svg ref={svgRef} />
      {tooltip && (
        <Tooltip
          x={tooltip.x}
          y={tooltip.y}
          item={tooltip.item}
          onClose={() => setTooltip(null)}
        />
      )}
    </div>
  );
};

export default BellDiagram;
