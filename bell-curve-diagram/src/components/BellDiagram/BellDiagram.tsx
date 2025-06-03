"use client";

import * as d3 from "d3";

import { BellData, Item } from "../../types/BellTypes";
import React, { useCallback, useEffect, useRef, useState } from "react";

import Tooltip from "./Tooltip";
import mockData from "../../data/mockData.json";
import styles from "./BellDiagram.module.scss";

// -------------------------------------------------------------
// Utility function to wrap long text inside SVG <text> element
// Ensures text stays inside bell width properly.
// -------------------------------------------------------------
const wrapText = (
  textElement: d3.Selection<SVGTextElement, unknown, null, undefined>,
  text: string,
  width: number
): number => {
  const words = text.split(/\s+/);
  let line: string[] = [];
  let lineNumber = 0;
  const lineHeight = 0.8;  // spacing between wrapped lines
  const y = +textElement.attr("y");
  const x = +textElement.attr("x");
  textElement.text(null);
  let tspan = textElement.append("tspan").attr("x", x).attr("y", y).attr("dy", `0em`);

  for (let i = 0; i < words.length; i++) {
    line.push(words[i]);
    tspan.text(line.join(" "));
    if (tspan.node()!.getComputedTextLength() > width) {
      // If current line exceeds width, wrap to next line
      line.pop();
      tspan.text(line.join(" "));
      line = [words[i]];
      tspan = textElement
        .append("tspan")
        .attr("x", x)
        .attr("y", y)
        .attr("dy", `${++lineNumber * lineHeight}em`)
        .text(words[i]);
    }
  }
  return lineNumber + 1;
};

// -------------------------------------------------------------
// Used to calculate available horizontal width dynamically
// at any vertical Y position inside bell
// -------------------------------------------------------------
const getAvailableWidthAtY = (y: number, bellW: number, bellH: number) => {
  const relativeHeight = Math.abs(y) / bellH;
  const widthShrinkFactor = 1 - relativeHeight * 0.6;
  return bellW * widthShrinkFactor;
};

// -------------------------------------------------------------
// Main React component for the BellDiagram
// -------------------------------------------------------------
const BellDiagram: React.FC = () => {
  // SVG & container refs for D3 rendering and positioning calculations
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const data: BellData = mockData;

  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Tooltip state stores both relative (x, y) and absolute (absoluteX, absoluteY) positions
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    absoluteX: number;
    absoluteY: number;
    item: Item;
  } | null>(null);

  // Timer reference to handle 5-second auto-close of tooltip
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // -------------------------------------------------------------
  // Cleanup function to clear tooltip and timer
  // -------------------------------------------------------------
  const clearTooltip = useCallback(() => {
    setTooltip(null);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // -------------------------------------------------------------
  // Handle responsive behavior for mobile view detection
  // -------------------------------------------------------------
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();  // call initially to set current state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // -------------------------------------------------------------
  // Handle outside click to close tooltip when clicking outside bell
  // -------------------------------------------------------------
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (tooltip && !containerRef.current?.contains(event.target as Node)) {
        clearTooltip();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [tooltip, clearTooltip]);

  // -------------------------------------------------------------
  // Main D3 rendering effect — re-renders on data or resize
  // -------------------------------------------------------------
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    // Dynamic sizing based on container width and device type
    const containerWidth = containerRef.current.clientWidth;
    const width = containerWidth;
    const height = isMobile ? 400 : 500;
    const bellWidth = isMobile ? 90 : 160;
    const bellHeight = isMobile ? 280 : 430;
    const zoomScale = 1.25;  // zoom effect on hover
    const categories = Object.keys(data);
    const spacing = width / (categories.length + 1);

    const bellLayer = d3.select(svgRef.current).html("").append("g");

    // Generate bezier path data for each bell
    const createBellData = (bellW: number, bellH: number) => [
      [-bellW * 0.65, 0], [-bellW * 0.5, -bellH * 0.1], [-bellW * 0.4, -bellH * 0.4],
      [-bellW * 0.2, -bellH * 0.7], [0, -bellH * 0.71], [bellW * 0.2, -bellH * 0.7],
      [bellW * 0.4, -bellH * 0.4], [bellW * 0.5, -bellH * 0.1], [bellW * 0.65, 0],
    ];

    const groups: d3.Selection<SVGGElement, unknown, null, undefined>[] = [];

    // -------------------------------------------------------------
    // Loop through each category to draw bells dynamically
    // -------------------------------------------------------------
    categories.forEach((cat, i) => {
      const categoryData = data[cat];
      const x = spacing * (i + 1);  // center X of each bell
      const group = bellLayer.append("g").attr("transform", `translate(${x}, ${height})`);
      groups.push(group);

      const bellData = createBellData(bellWidth, bellHeight);
      const bellPath = group
        .append("path")
        .attr("d", d3.line().curve(d3.curveBasis)(bellData as [number, number][]))
        .attr("fill", categoryData.color)
        .attr("fill-opacity", 0.9)
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .attr("filter", "drop-shadow(0px 0px 0px rgba(0,0,0,0))")
        .style("cursor", "pointer")
        .attr("opacity", 0);  // initially fade-in animation

      // Subcategory text group inside each bell (hidden until hover)
      const textGroup = group.append("g").attr("class", "subcategory-text").style("opacity", 0);
      const items = categoryData.items;

      // Font scaling logic based on number of items
      // const baseFontSize = isMobile ? 12 : 16;
      // const maxComfortableItems = isMobile ? 4 : 6;
      // const scaleFactor = Math.min(1, maxComfortableItems / items.length);
      // const fontSize = Math.max(baseFontSize * scaleFactor, isMobile ? 9 : 12);
      const fontSize = isMobile ? 12 : 14;
      const lineHeight = fontSize * 1.1;

      // Calculate vertical centering of subcategory items inside bell
      let totalLines = 0;
      const lineEstimates: number[] = [];
      items.forEach(item => {
        const approxLines = Math.ceil(item.title.length / 18);
        lineEstimates.push(approxLines);
        totalLines += approxLines;
      });

      const totalHeight = totalLines * lineHeight;
      const shiftUp = Math.min(totalLines * (lineHeight * 0.15), bellHeight * 0.1);
      let runningY = -bellHeight * 0.68 + (bellHeight - totalHeight) / 2 - shiftUp;

      // Render wrapped text for each subcategory title
      items.forEach((item) => {
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

      // Main category label on top of bell
      const labelText = group.append("text")
        .attr("x", 0)
        .attr("y", -bellHeight * 0.80)
        .attr("text-anchor", "middle")
        .attr("fill", categoryData.textColor)
        .attr("font-size", isMobile ? 12 : 16)
        .attr("font-weight", "bold");

      wrapText(labelText, cat, bellWidth - 10);

      // -------------------------------------------------------------
      // Hover interaction: scale zoom and fade text
      // -------------------------------------------------------------
      group.on("mouseover", function () {
        group.node()?.parentNode?.appendChild(group.node()!);
        groups.forEach((g, j) => {
          const scale = i === j ? zoomScale : 1;
          g.transition().duration(300).ease(d3.easeCubicOut)
            .attr("transform", `translate(${spacing * (j + 1)}, ${height}) scale(${scale})`);
        });
        textGroup.transition().duration(300).style("opacity", 1);
        bellPath.transition().duration(300)
          .attr("filter", "drop-shadow(4px 4px 8px rgba(0,0,0,0.4))");
      });

      group.on("mouseout", function () {
        groups.forEach((g, j) => {
          g.transition().duration(300).ease(d3.easeCubicOut)
            .attr("transform", `translate(${spacing * (j + 1)}, ${height}) scale(1)`);
        });
        textGroup.transition().duration(300).style("opacity", 0);
        bellPath.transition().duration(300)
          .attr("filter", "drop-shadow(0px 0px 0px rgba(0,0,0,0))");
      });

      // -------------------------------------------------------------
      // Tooltip logic: calculate bell center for tooltip positioning
      // -------------------------------------------------------------
      group.on("click", () => {
        const clickedItem = categoryData.items[0];
        const containerRect = containerRef.current?.getBoundingClientRect();
        const svgRect = svgRef.current?.getBoundingClientRect();

        // Bell center position (relative to screen)
        const bellCenterX = svgRect!.left + x;
        const bellCenterY = svgRect!.top + (height - bellHeight * 0.8);

        // Store both absolute and container-relative coordinates
        setTooltip({
          x: bellCenterX - containerRect!.left,
          y: bellCenterY - containerRect!.top,
          absoluteX: bellCenterX,
          absoluteY: bellCenterY,
          item: clickedItem,
        });

        // 5-second auto-close timer
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          setTooltip(null);
          timerRef.current = null;
        }, 5000);
      });

      // Animate bell entrance
      bellPath.transition().duration(800).attr("opacity", 1);
    });

    // Update SVG dimensions after rendering
    d3.select(svgRef.current).attr("width", width).attr("height", height);
  }, [data, isMobile, clearTooltip]);

  return (
    <div className={styles.container} ref={containerRef}>
      <svg ref={svgRef} />
      {tooltip && (
        <Tooltip
          x={tooltip.x}
          y={tooltip.y}
          absoluteX={tooltip.absoluteX}
          absoluteY={tooltip.absoluteY}
          item={tooltip.item}
          onClose={clearTooltip}
        />
      )}
    </div>
  );
};

export default BellDiagram;
