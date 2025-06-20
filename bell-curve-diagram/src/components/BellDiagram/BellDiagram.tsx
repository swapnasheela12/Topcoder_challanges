// // // "use client";

// // // // Import D3.js for SVG rendering and manipulation
// // // import * as d3 from "d3";

// // // import { BellData, Item } from "../../types/BellTypes";
// // // import React, { useCallback, useEffect, useRef, useState } from "react";

// // // import Tooltip from "./Tooltip";
// // // import mockData from "../../data/mockData.json";
// // // import styles from "./BellDiagram.module.scss";

// // // /**
// // //  * Utility function to wrap text inside bell shapes
// // //  * to prevent text overflow and break long text into multiple lines dynamically.
// // //  */
// // // const wrapText = (
// // //   textElement: d3.Selection<SVGTextElement, unknown, null, undefined>,
// // //   text: string,
// // //   width: number
// // // ): number => {
// // //   const words = text.split(/\s+/);
// // //   let line: string[] = [];
// // //   let lineNumber = 0;
// // //   const lineHeight = 0.8;
// // //   const y = +textElement.attr("y");
// // //   const x = +textElement.attr("x");
// // //   textElement.text(null);
// // //   let tspan = textElement.append("tspan").attr("x", x).attr("y", y).attr("dy", `0em`);

// // //   for (let i = 0; i < words.length; i++) {
// // //     line.push(words[i]);
// // //     tspan.text(line.join(" "));
// // //     if (tspan.node()!.getComputedTextLength() > width) {
// // //       line.pop();
// // //       tspan.text(line.join(" "));
// // //       line = [words[i]];
// // //       tspan = textElement.append("tspan")
// // //         .attr("x", x)
// // //         .attr("y", y)
// // //         .attr("dy", `${++lineNumber * lineHeight}em`)
// // //         .text(words[i]);
// // //     }
// // //   }
// // //   return lineNumber + 1;
// // // };

// // // const BellDiagram: React.FC = () => {
// // //   const svgRef = useRef<SVGSVGElement | null>(null);
// // //   const containerRef = useRef<HTMLDivElement>(null);
// // //   const data: BellData = mockData;

// // //   // Tooltip state management
// // //   const [tooltip, setTooltip] = useState<{
// // //     x: number; y: number; absoluteX: number; absoluteY: number;
// // //     item: Item; direction: "left" | "right" | "top"; arrowOffset?: number;
// // //   } | null>(null);

// // //   const [isTooltipHovered, setIsTooltipHovered] = useState(false);
// // //   const timerRef = useRef<NodeJS.Timeout | null>(null);
// // //   const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

// // //   // Helper function to safely clear tooltip and timers
// // //   const clearTooltip = useCallback(() => {
// // //     setTooltip(null);
// // //     if (timerRef.current) {
// // //       clearTimeout(timerRef.current);
// // //       timerRef.current = null;
// // //     }
// // //   }, []);

// // //   useEffect(() => {
// // //     if (!svgRef.current || !containerRef.current) return;

// // //     // Responsiveness breakpoints
// // //     const containerWidth = containerRef.current.clientWidth;
// // //     const isMobile = containerWidth < 768;
// // //     const isTablet = containerWidth >= 768 && containerWidth < 1200;

// // //     // Dynamic sizes based on screen size
// // //     const width = containerWidth;
// // //     const height = isMobile ? 575 : isTablet ? 480 : 550;
// // //     const bellWidth = isMobile ? 80 : isTablet ? 140 : 170;
// // //     const bellHeight = isMobile ? 230 : isTablet ? 375 : 430;
// // //     const zoomScale = 1.3;
// // //     const sidePadding = isMobile ? 20 : isTablet ? 40 : 60;

// // //     const categories = Object.keys(data);
// // //     const usableWidth = width - (sidePadding * 2);
// // //     // const spacing = usableWidth / (categories.length + 1);
// // //     const spacing = (usableWidth * 2)/ (categories.length + 0.8);

// // //     const bellLayer = d3.select(svgRef.current).html("").append("g");

// // //     // Drop shadow definition for bell hover effect
// // //     const defs = bellLayer.append("defs");
// // //     const shadow = defs.append("filter")
// // //       .attr("id", "bellShadow")
// // //       .attr("x", "-50%").attr("y", "-50%")
// // //       .attr("width", "200%").attr("height", "200%");
// // //     shadow.append("feDropShadow")
// // //       .attr("dx", "0").attr("dy", "4")
// // //       .attr("stdDeviation", "6")
// // //       .attr("flood-color", "#000")
// // //       .attr("flood-opacity", "0.4");

// // //     // Bell shape generator (custom curved bell path)
// // //     const createBellData = (bellW: number, bellH: number) => [
// // //       [-bellW * 0.65, 0], [-bellW * 0.5, -bellH * 0.1], [-bellW * 0.4, -bellH * 0.4],
// // //       [-bellW * 0.2, -bellH * 0.7], [0, -bellH * 0.71], [bellW * 0.2, -bellH * 0.7],
// // //       [bellW * 0.4, -bellH * 0.4], [bellW * 0.5, -bellH * 0.1], [bellW * 0.65, 0],
// // //     ];

// // //     // Iterate through each bell category
// // //     categories.forEach((cat, i) => {
// // //       const categoryData = data[cat];
// // //       const x = sidePadding + spacing * (i + 1);
// // //       const group = bellLayer.append("g").attr("transform", `translate(${x}, ${height})`);
// // //       const zoomableGroup = group.append("g").attr("class", "zoomable");

// // //       // Draw bell path shape
// // //       const bellPath = zoomableGroup.append("path")
// // //         .attr("d", d3.line().curve(d3.curveBasis)(createBellData(bellWidth, bellHeight) as [number, number][]))
// // //         .attr("fill", categoryData.color)
// // //         .attr("stroke-width", 2)
// // //         .attr("opacity", 0.6)
// // //         .style("cursor", "pointer");

// // //       // // Draw main label text on top of each bell
// // //       // const labelFontSize = isMobile ? 10 : 16;
// // //       // const labelYOffset = -bellHeight * 0.90;
// // //       // const labelWidth = bellWidth * (isMobile ? 0.9 : 0.7);
// // //       // const labelHeight = bellHeight * 0.2;

// // //       // zoomableGroup.append("foreignObject")
// // //       //   .attr("x", -labelWidth / 2)
// // //       //   .attr("y", labelYOffset)
// // //       //   .attr("width", labelWidth)
// // //       //   .attr("height", labelHeight)
// // //       //   .append("xhtml:div")
// // //       //   .style("width", `${labelWidth}px`)
// // //       //   .style("height", `${labelHeight}px`)
// // //       //   .style("display", "flex")
// // //       //   .style("justify-content", "center")
// // //       //   .style("align-items", "center")
// // //       //   .style("text-align", "center")
// // //       //   .style("font-family", "'Figtree-Bold', sans-serif")
// // //       //   .style("font-weight", "bold")
// // //       //   .style("font-size", `${labelFontSize}px`)
// // //       //   .style("color", categoryData.textColor)
// // //       //   .style("line-height", "1.3")
// // //       //   .style("word-break", "break-word")
// // //       //   .text(cat);

// // //       // Draw main label text on top of each bell
// // //       const labelFontSize = isMobile
// // //         ? (cat.length > 10 ? 8 : 10)
// // //         : 16;

// // //       const labelYOffset = -bellHeight * 0.90;
// // //       const labelWidth = bellWidth * (isMobile ? 0.95 : 0.7);
// // //       const labelHeight = bellHeight * 0.25;

// // //       zoomableGroup.append("foreignObject")
// // //         .attr("x", -labelWidth / 2)
// // //         .attr("y", labelYOffset)
// // //         .attr("width", labelWidth)
// // //         .attr("height", labelHeight)
// // //         .append("xhtml:div")
// // //         .style("width", `${labelWidth}px`)
// // //         .style("height", `${labelHeight}px`)
// // //         .style("display", "flex")
// // //         .style("justify-content", "center")
// // //         .style("align-items", "center")
// // //         .style("text-align", "center")
// // //         .style("font-family", "'Figtree-Bold', sans-serif")
// // //         .style("font-weight", "bold")
// // //         .style("font-size", `${labelFontSize}px`)
// // //         .style("color", categoryData.textColor)
// // //         .style("line-height", "1.3")
// // //         .style("white-space", "normal")  // 🔥 allow multi-line wrap
// // //         .style("word-break", "break-word")  // 🔥 force wrapping on long words
// // //         .text(cat);


// // //       // Mouse enter event to handle bell hover logic
// // //       group.on("mouseenter", () => {
// // //         if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);

// // //         hoverTimerRef.current = setTimeout(() => {
// // //           group.node()?.parentNode?.appendChild(group.node()!); // bring hovered bell to top layer
// // //           bellPath.attr("filter", "url(#bellShadow)").attr("opacity", 1);
// // //           zoomableGroup.transition().duration(300).ease(d3.easeCubicOut).attr("transform", `scale(${zoomScale})`);

// // //           /** ✅ Draw subcategory text inside bell shape **/
// // //           const textGroup = group.append("g").attr("class", "subcategory-text");
// // //           const items = categoryData.items;
// // //           const fontSize = isMobile ? 8 : isTablet ? 12 : 16;
// // //           const lineHeight = fontSize * 1.1;

// // //           let totalLines = 0;
// // //           items.forEach(item => totalLines += Math.ceil(item.title.length / 18));
// // //           const totalTextHeight = totalLines * lineHeight;

// // //           const iconSize = isMobile ? 20 : isTablet ? 30 : 35;
// // //           const iconMarginTop = 10;
// // //           const iconMarginBottom = 50;
// // //           const totalBlockHeight = iconMarginTop + iconSize + iconMarginBottom + totalTextHeight;

// // //           const downwardShift = bellHeight * 0.08;
// // //           const availableSpace = bellHeight * 0.75;
// // //           const startY = -bellHeight + (bellHeight - availableSpace) / 2 + (availableSpace - totalBlockHeight) / 2 + downwardShift;

// // //           // Draw category icon image
// // //           textGroup.append("image")
// // //             .attr("href", categoryData.icon)
// // //             .attr("x", -iconSize / 2)
// // //             .attr("y", startY + iconMarginTop)
// // //             .attr("width", iconSize)
// // //             .attr("height", iconSize);

// // //           let runningY = startY + iconMarginTop + iconSize + iconMarginBottom;

// // //           // Dynamically wrap subcategory text lines
// // //           const availableWidthAtY = (yPosition: number) => {
// // //             const relativeY = Math.abs(yPosition) / bellHeight;
// // //             const minWidth = bellWidth * 0.4;
// // //             const maxWidth = bellWidth * 1.09;
// // //             return minWidth + (maxWidth - minWidth) * (1 - relativeY);
// // //           };

// // //           items.forEach(item => {
// // //             const availableWidth = availableWidthAtY(runningY);
// // //             const text = textGroup.append("text")
// // //               .attr("x", 0)
// // //               .attr("y", runningY)
// // //               .attr("text-anchor", "middle")
// // //               .attr("fill", "#fff")
// // //               .attr("font-size", fontSize)
// // //               .style("font-family", "'Nunito-Regular', sans-serif");

// // //             const linesWrapped = wrapText(text, `• ${item.title}`, availableWidth);
// // //             runningY += linesWrapped * lineHeight;
// // //           });

// // //           /** ✅ Calculate tooltip positioning **/
// // //           const tooltipWidth = 290;
// // //           const containerRect = containerRef.current!.getBoundingClientRect();
// // //           const svgRect = svgRef.current!.getBoundingClientRect();

// // //           const bellCenterX = svgRect.left + x;
// // //           const zoomOffsetY = bellHeight * (zoomScale - 1) / 2;
// // //           const verticalAdjustment = bellHeight * 0.10;
// // //           const bellCenterY = svgRect.top + (height - bellHeight) + (bellHeight / 2) - zoomOffsetY + verticalAdjustment;

// // //           const containerCenterX = containerRect.left + containerRect.width / 2;
// // //           const tooltipLeft = (containerRect.width - tooltipWidth) / 2;
// // //           const bellXInContainer = bellCenterX - containerRect.left;
// // //           const arrowOffset = bellXInContainer - tooltipLeft;

// // //           const clickedItem = categoryData.items[0];

// // //           setTooltip({
// // //             x: bellCenterX - containerRect.left,
// // //             y: bellCenterY - containerRect.top,
// // //             absoluteX: bellCenterX,
// // //             absoluteY: bellCenterY,
// // //             item: clickedItem,
// // //             direction: isMobile ? "top" : (bellCenterX < containerCenterX ? "right" : "left"),
// // //             arrowOffset: isMobile ? arrowOffset : 0
// // //           });

// // //           if (timerRef.current) clearTimeout(timerRef.current);
// // //           timerRef.current = setTimeout(() => {
// // //             setTooltip(null);
// // //             timerRef.current = null;
// // //           }, 4000);
// // //         }, 100);
// // //       });

// // //       // Mouse leave event to gracefully hide bell tooltip & zoom back
// // //       group.on("mouseleave", () => {
// // //         if (hoverTimerRef.current) {
// // //           clearTimeout(hoverTimerRef.current);
// // //           hoverTimerRef.current = null;
// // //         }
// // //         setTimeout(() => {
// // //           if (!isTooltipHovered) {
// // //             zoomableGroup.transition()
// // //               .duration(300)
// // //               .ease(d3.easeCubicOut)
// // //               .attr("transform", "scale(1)");

// // //             bellPath.attr("filter", null).attr("opacity", 0.6);
// // //             group.select(".subcategory-text").remove();
// // //             clearTooltip();
// // //           }
// // //         }, 100);
// // //       });

// // //     });

// // //     // Set responsive viewbox and svg scaling behavior
// // //     d3.select(svgRef.current)
// // //       .attr("width", "100%").attr("height", "100%")
// // //       .attr("viewBox", `0 0 ${width} ${height}`)
// // //       .attr("preserveAspectRatio", "xMidYMid meet");

// // //   }, [data, clearTooltip, isTooltipHovered]);

// // //   return (
// // //     <div className={styles.container} ref={containerRef}>
// // //       <svg ref={svgRef} />
// // //       {tooltip && (
// // //         <Tooltip
// // //           x={tooltip.x}
// // //           y={tooltip.y}
// // //           absoluteX={tooltip.absoluteX}
// // //           absoluteY={tooltip.absoluteY}
// // //           item={tooltip.item}
// // //           direction={tooltip.direction}
// // //           arrowOffset={tooltip.arrowOffset}
// // //           onClose={clearTooltip}
// // //           onMouseEnter={() => setIsTooltipHovered(true)}
// // //           onMouseLeave={() => setIsTooltipHovered(false)}
// // //         />
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default BellDiagram;














// // "use client";

// // import * as d3 from "d3";

// // import { BellData, Item } from "../../types/BellTypes";
// // import React, { useCallback, useEffect, useRef, useState } from "react";

// // import Tooltip from "./Tooltip";
// // import mockData from "../../data/mockData.json";
// // import styles from "./BellDiagram.module.scss";

// // // Text wrapping utility
// // const wrapText = (
// //   textElement: d3.Selection<SVGTextElement, unknown, null, undefined>,
// //   text: string,
// //   width: number
// // ): number => {
// //   const words = text.split(/\s+/);
// //   let line: string[] = [];
// //   let lineNumber = 0;
// //   const lineHeight = 0.8;
// //   const y = +textElement.attr("y");
// //   const x = +textElement.attr("x");
// //   textElement.text(null);
// //   let tspan = textElement.append("tspan").attr("x", x).attr("y", y).attr("dy", `0em`);

// //   for (let i = 0; i < words.length; i++) {
// //     line.push(words[i]);
// //     tspan.text(line.join(" "));
// //     if (tspan.node()!.getComputedTextLength() > width) {
// //       line.pop();
// //       tspan.text(line.join(" "));
// //       line = [words[i]];
// //       tspan = textElement.append("tspan")
// //         .attr("x", x)
// //         .attr("y", y)
// //         .attr("dy", `${++lineNumber * lineHeight}em`)
// //         .text(words[i]);
// //     }
// //   }
// //   return lineNumber + 1;
// // };

// // const BellDiagram: React.FC = () => {
// //   const svgRef = useRef<SVGSVGElement | null>(null);
// //   const containerRef = useRef<HTMLDivElement>(null);
// //   const data: BellData = mockData;

// //   const [tooltip, setTooltip] = useState<{
// //     x: number; y: number; absoluteX: number; absoluteY: number;
// //     item: Item; direction: "left" | "right" | "top"; arrowOffset?: number;
// //   } | null>(null);

// //   const [isTooltipHovered, setIsTooltipHovered] = useState(false);
// //   const timerRef = useRef<NodeJS.Timeout | null>(null);
// //   const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

// //   const clearTooltip = useCallback(() => {
// //     setTooltip(null);
// //     if (timerRef.current) {
// //       clearTimeout(timerRef.current);
// //       timerRef.current = null;
// //     }
// //   }, []);

// //   useEffect(() => {
// //     if (!svgRef.current || !containerRef.current) return;

// //     const containerWidth = containerRef.current.clientWidth;
// //     const isMobile = containerWidth < 768;
// //     const isTablet = containerWidth >= 768 && containerWidth < 1200;

// //     const extraWidth = isMobile ? 400 : 0;
// //     const width = containerWidth + extraWidth;
// //     const height = isMobile ? 575 : isTablet ? 480 : 550;
// //     const bellWidth = isMobile ? 100 : isTablet ? 140 : 170;
// //     const bellHeight = isMobile ? 250 : isTablet ? 375 : 430;
// //     const zoomScale = 1.3;
// //     const sidePadding = isMobile ? 20 : isTablet ? 40 : 60;

// //     const categories = Object.keys(data);
// //     const usableWidth = width - (sidePadding * 2);
// //     const spacing = usableWidth / (categories.length + 0.8);

// //     const bellLayer = d3.select(svgRef.current).html("").append("g");

// //     const defs = bellLayer.append("defs");
// //     const shadow = defs.append("filter")
// //       .attr("id", "bellShadow")
// //       .attr("x", "-50%").attr("y", "-50%")
// //       .attr("width", "200%").attr("height", "200%");
// //     shadow.append("feDropShadow")
// //       .attr("dx", "0").attr("dy", "4")
// //       .attr("stdDeviation", "6")
// //       .attr("flood-color", "#000")
// //       .attr("flood-opacity", "0.4");

// //     const createBellData = (bellW: number, bellH: number) => [
// //       [-bellW * 0.65, 0], [-bellW * 0.5, -bellH * 0.1], [-bellW * 0.4, -bellH * 0.4],
// //       [-bellW * 0.2, -bellH * 0.7], [0, -bellH * 0.71], [bellW * 0.2, -bellH * 0.7],
// //       [bellW * 0.4, -bellH * 0.4], [bellW * 0.5, -bellH * 0.1], [bellW * 0.65, 0],
// //     ];

// //     categories.forEach((cat, i) => {
// //       const categoryData = data[cat];
// //       const x = sidePadding + spacing * (i + 1);
// //       const group = bellLayer.append("g").attr("transform", `translate(${x}, ${height})`);
// //       const zoomableGroup = group.append("g").attr("class", "zoomable");

// //       const bellPath = zoomableGroup.append("path")
// //         .attr("d", d3.line().curve(d3.curveBasis)(createBellData(bellWidth, bellHeight) as [number, number][]))
// //         .attr("fill", categoryData.color)
// //         .attr("stroke-width", 2)
// //         .attr("opacity", 0.6)
// //         .style("cursor", "pointer");

// //       const labelFontSize = isMobile ? 10 : 16;
// //       const labelYOffset = -bellHeight * 0.90;
// //       const labelWidth = bellWidth * (isMobile ? 0.95 : 0.7);

// //       const labelText = zoomableGroup.append("text")
// //         .attr("x", 0)
// //         .attr("y", labelYOffset)
// //         .attr("text-anchor", "middle")
// //         .attr("fill", categoryData.textColor)
// //         .attr("font-family", "'Figtree-Bold', sans-serif")
// //         .attr("font-weight", "bold")
// //         .attr("font-size", labelFontSize);

// //       wrapText(labelText, cat, labelWidth);

// //       const triggerTooltip = () => {
// //         group.node()?.parentNode?.appendChild(group.node());
// //         bellPath.attr("filter", "url(#bellShadow)").attr("opacity", 1);
// //         zoomableGroup.transition().duration(300).ease(d3.easeCubicOut).attr("transform", `scale(${zoomScale})`);

// //         const textGroup = group.append("g").attr("class", "subcategory-text");
// //         const items = categoryData.items;
// //         const fontSize = isMobile ? 8 : isTablet ? 12 : 16;
// //         const lineHeight = fontSize * 1.1;

// //         let totalLines = 0;
// //         items.forEach(item => totalLines += Math.ceil(item.title.length / 18));
// //         const totalTextHeight = totalLines * lineHeight;

// //         const iconSize = isMobile ? 20 : isTablet ? 30 : 35;
// //         const iconMarginTop = 10;
// //         const iconMarginBottom = 50;
// //         const totalBlockHeight = iconMarginTop + iconSize + iconMarginBottom + totalTextHeight;

// //         const downwardShift = bellHeight * 0.08;
// //         const availableSpace = bellHeight * 0.75;
// //         const startY = -bellHeight + (bellHeight - availableSpace) / 2 + (availableSpace - totalBlockHeight) / 2 + downwardShift;

// //         textGroup.append("image")
// //           .attr("href", categoryData.icon)
// //           .attr("x", -iconSize / 2)
// //           .attr("y", startY + iconMarginTop)
// //           .attr("width", iconSize)
// //           .attr("height", iconSize);

// //         let runningY = startY + iconMarginTop + iconSize + iconMarginBottom;

// //         const availableWidthAtY = (yPosition: number) => {
// //           const relativeY = Math.abs(yPosition) / bellHeight;
// //           const minWidth = bellWidth * 0.4;
// //           const maxWidth = bellWidth * 1.09;
// //           return minWidth + (maxWidth - minWidth) * (1 - relativeY);
// //         };

// //         items.forEach(item => {
// //           const availableWidth = availableWidthAtY(runningY);
// //           const text = textGroup.append("text")
// //             .attr("x", 0)
// //             .attr("y", runningY)
// //             .attr("text-anchor", "middle")
// //             .attr("fill", "#fff")
// //             .attr("font-size", fontSize)
// //             .style("font-family", "'Nunito-Regular', sans-serif");

// //           const linesWrapped = wrapText(text, `• ${item.title}`, availableWidth);
// //           runningY += linesWrapped * lineHeight;
// //         });

// //         // ✅ Corrected Tooltip positioning with zoom adjustment
// //         const tooltipWidth = 290;
// //         const containerRect = containerRef.current!.getBoundingClientRect();
// //         const svgRect = svgRef.current!.getBoundingClientRect();

// //         const zoomOffsetX = bellWidth * (zoomScale - 1) / 2;
// //         const zoomOffsetY = bellHeight * (zoomScale - 1) / 2;

// //         const bellCenterX = svgRect.left + x - zoomOffsetX;
// //         const bellCenterY = svgRect.top + (height - bellHeight) + (bellHeight / 2) - zoomOffsetY + (bellHeight * 0.10);

// //         const containerCenterX = containerRect.left + containerRect.width / 2;
// //         const tooltipLeft = (containerRect.width - tooltipWidth) / 2;
// //         const bellXInContainer = bellCenterX - containerRect.left;
// //         const arrowOffset = bellXInContainer - tooltipLeft;

// //         const clickedItem = categoryData.items[0];

// //         setTooltip({
// //           x: bellCenterX - containerRect.left,
// //           y: bellCenterY - containerRect.top,
// //           absoluteX: bellCenterX,
// //           absoluteY: bellCenterY,
// //           item: clickedItem,
// //           direction: isMobile ? "top" : (bellCenterX < containerCenterX ? "right" : "left"),
// //           arrowOffset: isMobile ? arrowOffset : 0
// //         });

// //         if (timerRef.current) clearTimeout(timerRef.current);
// //         timerRef.current = setTimeout(() => {
// //           setTooltip(null);
// //           timerRef.current = null;
// //         }, 4000);
// //       };

// //       // Bind click for mobile and hover for desktop
// //       if (isMobile) {
// //         group.on("click", () => triggerTooltip());
// //       } else {
// //         group.on("mouseenter", () => {
// //           if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
// //           hoverTimerRef.current = setTimeout(() => {
// //             triggerTooltip();
// //           }, 100);
// //         });

// //         group.on("mouseleave", () => {
// //           if (hoverTimerRef.current) {
// //             clearTimeout(hoverTimerRef.current);
// //             hoverTimerRef.current = null;
// //           }
// //           setTimeout(() => {
// //             if (!isTooltipHovered) {
// //               zoomableGroup.transition().duration(300).ease(d3.easeCubicOut).attr("transform", "scale(1)");
// //               bellPath.attr("filter", null).attr("opacity", 0.6);
// //               group.select(".subcategory-text").remove();
// //               clearTooltip();
// //             }
// //           }, 100);
// //         });
// //       }
// //     });

// //     d3.select(svgRef.current)
// //       .attr("width", width)
// //       .attr("height", height)
// //       .attr("viewBox", `0 0 ${width} ${height}`)
// //       .attr("preserveAspectRatio", "xMidYMid meet");

// //   }, [data, clearTooltip, isTooltipHovered]);

// //   return (
// //     <div className={styles.container} ref={containerRef}>
// //       <div style={{ overflowX: 'auto', overflowY: 'hidden' }}>
// //         <svg ref={svgRef} />
// //       </div>
// //       {tooltip && (
// //         <Tooltip
// //           x={tooltip.x}
// //           y={tooltip.y}
// //           absoluteX={tooltip.absoluteX}
// //           absoluteY={tooltip.absoluteY}
// //           item={tooltip.item}
// //           direction={tooltip.direction}
// //           arrowOffset={tooltip.arrowOffset}
// //           onClose={clearTooltip}
// //           onMouseEnter={() => setIsTooltipHovered(true)}
// //           onMouseLeave={() => setIsTooltipHovered(false)}
// //         />
// //       )}
// //     </div>
// //   );
// // };

// // export default BellDiagram;







// "use client";

// import * as d3 from "d3";

// import { BellData, Item } from "../../types/BellTypes";
// import React, { useCallback, useEffect, useRef, useState } from "react";

// import Tooltip from "./Tooltip";
// import mockData from "../../data/mockData.json";
// import styles from "./BellDiagram.module.scss";

// // Text wrapping utility
// const wrapText = (
//   textElement: d3.Selection<SVGTextElement, unknown, null, undefined>,
//   text: string,
//   width: number
// ): number => {
//   const words = text.split(/\s+/);
//   let line: string[] = [];
//   let lineNumber = 0;
//   const lineHeight = 0.8;
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
//       tspan = textElement.append("tspan")
//         .attr("x", x)
//         .attr("y", y)
//         .attr("dy", `${++lineNumber * lineHeight}em`)
//         .text(words[i]);
//     }
//   }
//   return lineNumber + 1;
// };

// const BellDiagram: React.FC = () => {
//   const svgRef = useRef<SVGSVGElement | null>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const data: BellData = mockData;

//   const [tooltip, setTooltip] = useState<{
//     x: number; y: number; absoluteX: number; absoluteY: number;
//     item: Item; direction: "left" | "right" | "top"; arrowOffset?: number;
//   } | null>(null);
//   const [isTooltipHovered, setIsTooltipHovered] = useState(false);
//   const timerRef = useRef<NodeJS.Timeout | null>(null);
//   const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

//   const clearTooltip = useCallback(() => {
//     setTooltip(null);
//     if (timerRef.current) {
//       clearTimeout(timerRef.current);
//       timerRef.current = null;
//     }
//   }, []);

//   useEffect(() => {
//     if (!svgRef.current || !containerRef.current) return;

//     const containerWidth = containerRef.current.clientWidth;
//     const isMobile = containerWidth < 768;
//     const isTablet = containerWidth >= 768 && containerWidth < 1200;
//     const extraWidth = isMobile ? 400 : 0;
//     const width = containerWidth + extraWidth;
//     const height = isMobile ? 575 : isTablet ? 480 : 550;
//     const bellWidth = isMobile ? 100 : isTablet ? 140 : 170;
//     const bellHeight = isMobile ? 250 : isTablet ? 375 : 430;
//     const zoomScale = 1.3;
//     const sidePadding = isMobile ? 20 : isTablet ? 40 : 60;

//     const categories = Object.keys(data);
//     const usableWidth = width - (sidePadding * 2);
//     const spacing = usableWidth / (categories.length + 0.8);

//     const bellLayer = d3.select(svgRef.current).html("").append("g");

//     const defs = bellLayer.append("defs");
//     const shadow = defs.append("filter")
//       .attr("id", "bellShadow")
//       .attr("x", "-50%").attr("y", "-50%")
//       .attr("width", "200%").attr("height", "200%");
//     shadow.append("feDropShadow")
//       .attr("dx", "0").attr("dy", "4")
//       .attr("stdDeviation", "6")
//       .attr("flood-color", "#000")
//       .attr("flood-opacity", "0.4");

//     const createBellData = (bellW: number, bellH: number) => [
//       [-bellW * 0.65, 0], [-bellW * 0.5, -bellH * 0.1], [-bellW * 0.4, -bellH * 0.4],
//       [-bellW * 0.2, -bellH * 0.7], [0, -bellH * 0.71], [bellW * 0.2, -bellH * 0.7],
//       [bellW * 0.4, -bellH * 0.4], [bellW * 0.5, -bellH * 0.1], [bellW * 0.65, 0],
//     ];

//     categories.forEach((cat, i) => {
//       const categoryData = data[cat];
//       const x = sidePadding + spacing * (i + 1);
//       const group = bellLayer.append("g").attr("transform", `translate(${x}, ${height})`);
//       const zoomableGroup = group.append("g").attr("class", "zoomable");

//       const bellPath = zoomableGroup.append("path")
//         .attr("d", d3.line().curve(d3.curveBasis)(createBellData(bellWidth, bellHeight) as [number, number][]))
//         .attr("fill", categoryData.color)
//         .attr("stroke-width", 2)
//         .attr("opacity", 0.6)
//         .style("cursor", "pointer");

//       const labelFontSize = isMobile ? 10 : 16;
//       const labelYOffset = -bellHeight * 0.90;
//       const labelWidth = bellWidth * (isMobile ? 0.95 : 0.7);
//       const labelText = zoomableGroup.append("text")
//         .attr("x", 0)
//         .attr("y", labelYOffset)
//         .attr("text-anchor", "middle")
//         .attr("fill", categoryData.textColor)
//         .attr("font-family", "'Figtree-Bold', sans-serif")
//         .attr("font-weight", "bold")
//         .attr("font-size", labelFontSize);
//       wrapText(labelText, cat, labelWidth);

//       const triggerTooltip = () => {
//         group.node()?.parentNode?.appendChild(group.node());
//         bellPath.attr("filter", "url(#bellShadow)").attr("opacity", 1);
//         zoomableGroup.transition().duration(300).ease(d3.easeCubicOut).attr("transform", `scale(${zoomScale})`);

//         const textGroup = group.append("g").attr("class", "subcategory-text");
//         const items = categoryData.items;
//         const fontSize = isMobile ? 8 : isTablet ? 12 : 16;
//         const lineHeight = fontSize * 1.1;

//         let totalLines = 0;
//         items.forEach(item => totalLines += Math.ceil(item.title.length / 18));
//         const totalTextHeight = totalLines * lineHeight;

//         const iconSize = isMobile ? 20 : isTablet ? 30 : 35;
//         const iconMarginTop = 10;
//         const iconMarginBottom = 50;
//         const totalBlockHeight = iconMarginTop + iconSize + iconMarginBottom + totalTextHeight;

//         const downwardShift = bellHeight * 0.08;
//         const availableSpace = bellHeight * 0.75;
//         const startY = -bellHeight + (bellHeight - availableSpace) / 2 + (availableSpace - totalBlockHeight) / 2 + downwardShift;

//         textGroup.append("image")
//           .attr("href", categoryData.icon)
//           .attr("x", -iconSize / 2)
//           .attr("y", startY + iconMarginTop)
//           .attr("width", iconSize)
//           .attr("height", iconSize);

//         let runningY = startY + iconMarginTop + iconSize + iconMarginBottom;
//         const availableWidthAtY = (yPosition: number) => {
//           const relativeY = Math.abs(yPosition) / bellHeight;
//           const minWidth = bellWidth * 0.4;
//           const maxWidth = bellWidth * 1.09;
//           return minWidth + (maxWidth - minWidth) * (1 - relativeY);
//         };

//         items.forEach(item => {
//           const availableWidth = availableWidthAtY(runningY);
//           const text = textGroup.append("text")
//             .attr("x", 0)
//             .attr("y", runningY)
//             .attr("text-anchor", "middle")
//             .attr("fill", "#fff")
//             .attr("font-size", fontSize)
//             .style("font-family", "'Nunito-Regular', sans-serif");
//           const linesWrapped = wrapText(text, `• ${item.title}`, availableWidth);
//           runningY += linesWrapped * lineHeight;
//         });

//         /** ✅ Tooltip position merged **/
//         const tooltipWidth = 290;
//         const containerRect = containerRef.current!.getBoundingClientRect();
//         const svgRect = svgRef.current!.getBoundingClientRect();

//         const bellCenterX = svgRect.left + x;
//         const zoomOffsetY = bellHeight * (zoomScale - 1) / 2;
//         const bellCenterY = svgRect.top + (height - bellHeight) + (bellHeight / 2) - zoomOffsetY + (bellHeight * 0.10);

//         const containerCenterX = containerRect.left + containerRect.width / 2;
//         const tooltipLeft = (containerRect.width - tooltipWidth) / 2;
//         const bellXInContainer = bellCenterX - containerRect.left;
//         const arrowOffset = bellXInContainer - tooltipLeft;

//         const clickedItem = categoryData.items[0];
//         setTooltip({
//           x: bellCenterX - containerRect.left,
//           y: bellCenterY - containerRect.top,
//           absoluteX: bellCenterX,
//           absoluteY: bellCenterY,
//           item: clickedItem,
//           direction: isMobile ? "top" : (bellCenterX < containerCenterX ? "right" : "left"),
//           arrowOffset: isMobile ? arrowOffset : 0
//         });

//         if (timerRef.current) clearTimeout(timerRef.current);
//         timerRef.current = setTimeout(() => {
//           setTooltip(null);
//           timerRef.current = null;
//         }, 4000);
//       };

//       if (isMobile) {
//         group.on("click", () => triggerTooltip());
//       } else {
//         group.on("mouseenter", () => {
//           if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
//           hoverTimerRef.current = setTimeout(() => { triggerTooltip(); }, 100);
//         });
//         group.on("mouseleave", () => {
//           if (hoverTimerRef.current) {
//             clearTimeout(hoverTimerRef.current);
//             hoverTimerRef.current = null;
//           }
//           setTimeout(() => {
//             if (!isTooltipHovered) {
//               zoomableGroup.transition().duration(300).ease(d3.easeCubicOut).attr("transform", "scale(1)");
//               bellPath.attr("filter", null).attr("opacity", 0.6);
//               group.select(".subcategory-text").remove();
//               clearTooltip();
//             }
//           }, 100);
//         });
//       }
//     });

//     d3.select(svgRef.current)
//       .attr("width", width)
//       .attr("height", height)
//       .attr("viewBox", `0 0 ${width} ${height}`)
//       .attr("preserveAspectRatio", "xMidYMid meet");

//   }, [data, clearTooltip, isTooltipHovered]);

//   return (
//     <div className={styles.container} ref={containerRef}>
//       <div style={{ overflowX: 'auto', overflowY: 'hidden' }}>
//         <svg ref={svgRef} />
//       </div>
//       {tooltip && (
//         <Tooltip
//           x={tooltip.x}
//           y={tooltip.y}
//           absoluteX={tooltip.absoluteX}
//           absoluteY={tooltip.absoluteY}
//           item={tooltip.item}
//           direction={tooltip.direction}
//           arrowOffset={tooltip.arrowOffset}
//           onClose={clearTooltip}
//           onMouseEnter={() => setIsTooltipHovered(true)}
//           onMouseLeave={() => setIsTooltipHovered(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default BellDiagram;





"use client";

import * as d3 from "d3";

import { BellData, Item } from "../../types/BellTypes";
import React, { useCallback, useEffect, useRef, useState } from "react";

import Tooltip from "./Tooltip";
import mockData from "../../data/mockData.json";
import styles from "./BellDiagram.module.scss";

// Text wrapping utility
const wrapText = (
  textElement: d3.Selection<SVGTextElement, unknown, null, undefined>,
  text: string,
  width: number
): number => {
  const words = text.split(/\s+/);
  let line: string[] = [];
  let lineNumber = 0;
  const lineHeight = 0.8;
  const y = +textElement.attr("y");
  const x = +textElement.attr("x");
  textElement.text(null);
  let tspan = textElement.append("tspan").attr("x", x).attr("y", y).attr("dy", `0em`);
  for (let i = 0; i < words.length; i++) {
    line.push(words[i]);
    tspan.text(line.join(" "));
    if (tspan.node()!.getComputedTextLength() > width) {
      line.pop();
      tspan.text(line.join(" "));
      line = [words[i]];
      tspan = textElement.append("tspan")
        .attr("x", x)
        .attr("y", y)
        .attr("dy", `${++lineNumber * lineHeight}em`)
        .text(words[i]);
    }
  }
  return lineNumber + 1;
};

const BellDiagram: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const data: BellData = mockData;

  const [tooltip, setTooltip] = useState<{
    x: number; y: number; absoluteX: number; absoluteY: number;
    item: Item; direction: "left" | "right" | "top"; arrowOffset?: number;
  } | null>(null);
  const [isTooltipHovered, setIsTooltipHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTooltip = useCallback(() => {
    setTooltip(null);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth;
    const isMobile = containerWidth < 768;
    const isTablet = containerWidth >= 768 && containerWidth < 1200;
    const extraWidth = isMobile ? 400 : 0;
    const width = containerWidth + extraWidth;
    const height = isMobile ? 875 : isTablet ? 480 : 550;
    const bellWidth = isMobile ? 100 : isTablet ? 140 : 170;
    const bellHeight = isMobile ? 300 : isTablet ? 375 : 430;
    const zoomScale = 1.3;
    const sidePadding = isMobile ? 20 : isTablet ? 40 : 60;

    const categories = Object.keys(data);
    const usableWidth = width - (sidePadding * 2);
    const spacing = usableWidth / (categories.length + 0.8);

    const bellLayer = d3.select(svgRef.current).html("").append("g");

    const defs = bellLayer.append("defs");
    const shadow = defs.append("filter")
      .attr("id", "bellShadow")
      .attr("x", "-50%").attr("y", "-50%")
      .attr("width", "200%").attr("height", "200%");
    shadow.append("feDropShadow")
      .attr("dx", "0").attr("dy", "4")
      .attr("stdDeviation", "6")
      .attr("flood-color", "#000")
      .attr("flood-opacity", "0.4");

    const createBellData = (bellW: number, bellH: number) => [
      [-bellW * 0.65, 0], [-bellW * 0.5, -bellH * 0.1], [-bellW * 0.4, -bellH * 0.4],
      [-bellW * 0.2, -bellH * 0.7], [0, -bellH * 0.71], [bellW * 0.2, -bellH * 0.7],
      [bellW * 0.4, -bellH * 0.4], [bellW * 0.5, -bellH * 0.1], [bellW * 0.65, 0],
    ];

    categories.forEach((cat, i) => {
      const categoryData = data[cat];
      const x = sidePadding + spacing * (i + 1);
      const group = bellLayer.append("g").attr("transform", `translate(${x}, ${height})`);
      const zoomableGroup = group.append("g").attr("class", "zoomable");

      const bellPath = zoomableGroup.append("path")
        .attr("d", d3.line().curve(d3.curveBasis)(createBellData(bellWidth, bellHeight) as [number, number][]))
        .attr("fill", categoryData.color)
        .attr("stroke-width", 2)
        .attr("opacity", 0.6)
        .style("cursor", "pointer");

      const labelFontSize = isMobile ? 10 : 16;
      const labelYOffset = -bellHeight * 0.90;
      const labelWidth = bellWidth * (isMobile ? 0.95 : 0.7);
      const labelText = zoomableGroup.append("text")
        .attr("x", 0)
        .attr("y", labelYOffset)
        .attr("text-anchor", "middle")
        .attr("fill", categoryData.textColor)
        .attr("font-family", "'Figtree-Bold', sans-serif")
        .attr("font-weight", "bold")
        .attr("font-size", labelFontSize);
      wrapText(labelText, cat, labelWidth);

      const triggerTooltip = () => {
        group.node()?.parentNode?.appendChild(group.node());
        bellPath.attr("filter", "url(#bellShadow)").attr("opacity", 1);
        zoomableGroup.transition().duration(300).ease(d3.easeCubicOut).attr("transform", `scale(${zoomScale})`);

        const textGroup = group.append("g").attr("class", "subcategory-text");
        const items = categoryData.items;
        const fontSize = isMobile ? 8 : isTablet ? 12 : 16;
        const lineHeight = fontSize * 1.1;

        let totalLines = 0;
        items.forEach(item => totalLines += Math.ceil(item.title.length / 18));
        const totalTextHeight = totalLines * lineHeight;

        const iconSize = isMobile ? 20 : isTablet ? 30 : 35;
        const iconMarginTop = 10;
        const iconMarginBottom = 50;
        const totalBlockHeight = iconMarginTop + iconSize + iconMarginBottom + totalTextHeight;

        const downwardShift = bellHeight * 0.08;
        const availableSpace = bellHeight * 0.75;
        const startY = -bellHeight + (bellHeight - availableSpace) / 2 + (availableSpace - totalBlockHeight) / 2 + downwardShift;

        textGroup.append("image")
          .attr("href", categoryData.icon)
          .attr("x", -iconSize / 2)
          .attr("y", startY + iconMarginTop)
          .attr("width", iconSize)
          .attr("height", iconSize);

        let runningY = startY + iconMarginTop + iconSize + iconMarginBottom;
        const availableWidthAtY = (yPosition: number) => {
          const relativeY = Math.abs(yPosition) / bellHeight;
          const minWidth = bellWidth * 0.4;
          const maxWidth = bellWidth * 1.09;
          return minWidth + (maxWidth - minWidth) * (1 - relativeY);
        };

        items.forEach(item => {
          const availableWidth = availableWidthAtY(runningY);
          const text = textGroup.append("text")
            .attr("x", 0)
            .attr("y", runningY)
            .attr("text-anchor", "middle")
            .attr("fill", "#fff")
            .attr("font-size", fontSize)
            .style("font-family", "'Nunito-Regular', sans-serif");
          const linesWrapped = wrapText(text, `• ${item.title}`, availableWidth);
          runningY += linesWrapped * lineHeight;
        });

        const tooltipWidth = 290;
        const containerRect = containerRef.current!.getBoundingClientRect();
        const svgRect = svgRef.current!.getBoundingClientRect();

        const bellCenterX = svgRect.left + x;
        const zoomOffsetY = bellHeight * (zoomScale - 1) / 2;
        const bellCenterY = svgRect.top + (height - bellHeight) + (bellHeight / 2) - zoomOffsetY + (bellHeight * 0.10);

        let tooltipX = bellCenterX - containerRect.left - tooltipWidth / 2;
        tooltipX = Math.max(10, Math.min(tooltipX, containerRect.width - tooltipWidth - 10));
        const arrowOffset = (bellCenterX - containerRect.left) - tooltipX;

        const clickedItem = categoryData.items[0];
        setTooltip({
          x: tooltipX,
          y: isMobile ? (bellCenterY - containerRect.top - bellHeight * 0.9) : (bellCenterY - containerRect.top),
          absoluteX: bellCenterX,
          absoluteY: bellCenterY,
          item: clickedItem,
          direction: isMobile ? "top" : (bellCenterX < (containerRect.left + containerRect.width / 2) ? "right" : "left"),
          arrowOffset: isMobile ? arrowOffset : 0
        });

        // setTooltip({
        //   x: tooltipX,
        //   y: isMobile ? (bellCenterY - containerRect.top - bellHeight * 0.9) : (bellCenterY - containerRect.top),
        //   absoluteX: bellCenterX,
        //   absoluteY: bellCenterY,
        //   item: clickedItem,
        //   direction: isMobile ? "top" : (bellCenterX < (containerRect.left + containerRect.width / 2) ? "right" : "left"),
        //   arrowOffset: isMobile ? arrowOffset : 0
        // });

        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          setTooltip(null);
          timerRef.current = null;
        }, 4000);
      };

      if (isMobile) {
        group.on("click", () => triggerTooltip());
      } else {
        group.on("mouseenter", () => {
          if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
          hoverTimerRef.current = setTimeout(() => { triggerTooltip(); }, 100);
        });
        group.on("mouseleave", () => {
          if (hoverTimerRef.current) {
            clearTimeout(hoverTimerRef.current);
            hoverTimerRef.current = null;
          }
          setTimeout(() => {
            if (!isTooltipHovered) {
              zoomableGroup.transition().duration(300).ease(d3.easeCubicOut).attr("transform", "scale(1)");
              bellPath.attr("filter", null).attr("opacity", 0.6);
              group.select(".subcategory-text").remove();
              clearTooltip();
            }
          }, 100);
        });
      }
    });

    d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

  }, [data, clearTooltip, isTooltipHovered]);

  return (
    <div className={styles.container} ref={containerRef}>
      <div style={{ overflowX: 'auto', overflowY: 'hidden' }}>
        <svg ref={svgRef} />
      </div>
      {tooltip && (
        <Tooltip
          x={tooltip.x}
          y={tooltip.y}
          absoluteX={tooltip.absoluteX}
          absoluteY={tooltip.absoluteY}
          item={tooltip.item}
          direction={tooltip.direction}
          arrowOffset={tooltip.arrowOffset}
          onClose={clearTooltip}
          onMouseEnter={() => setIsTooltipHovered(true)}
          onMouseLeave={() => setIsTooltipHovered(false)}
        />
      )}
    </div>
  );
};

export default BellDiagram;
