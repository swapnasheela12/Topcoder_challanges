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
      tspan = textElement.append("tspan").attr("x", x).attr("y", y).attr("dy", `${++lineNumber * lineHeight}em`).text(words[i]);
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
    item: Item; direction: "left" | "right";
  } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTooltip = useCallback(() => {
    setTooltip(null);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (tooltip && !containerRef.current?.contains(event.target as Node)) {
        clearTooltip();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [tooltip, clearTooltip]);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth;
    const isMobile = containerWidth < 768;
    const isTablet = containerWidth >= 768 && containerWidth < 1200;

    const width = containerWidth;
    const height = isMobile ? 400 : isTablet ? 480 : 550;
    const bellWidth = isMobile ? 90 : isTablet ? 140 : 180;
    const bellHeight = isMobile ? 275 : isTablet ? 375 : 450;
    const zoomScale = 1.25;
    const categories = Object.keys(data);
    const spacing = width / (categories.length + 1);
    const bellLayer = d3.select(svgRef.current).html("").append("g");

    const createBellData = (bellW: number, bellH: number) => [
      [-bellW * 0.65, 0], [-bellW * 0.5, -bellH * 0.1], [-bellW * 0.4, -bellH * 0.4],
      [-bellW * 0.2, -bellH * 0.7], [0, -bellH * 0.71], [bellW * 0.2, -bellH * 0.7],
      [bellW * 0.4, -bellH * 0.4], [bellW * 0.5, -bellH * 0.1], [bellW * 0.65, 0],
    ];

    const groups: d3.Selection<SVGGElement, unknown, null, undefined>[] = [];

    categories.forEach((cat, i) => {
      const categoryData = data[cat];
      const x = spacing * (i + 1);
      const group = bellLayer.append("g").attr("transform", `translate(${x}, ${height})`);
      groups.push(group);

      // Draw Bell Shape
      const bellPath = group.append("path")
        .attr("d", d3.line().curve(d3.curveBasis)(createBellData(bellWidth, bellHeight) as [number, number][]))
        .attr("fill", categoryData.color)
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .style("cursor", "pointer")
        .attr("opacity", 0);

      // Sub-category text group (VERTICAL CENTERED BLOCK)
      const textGroup = group.append("g").attr("class", "subcategory-text").style("opacity", 0);
      const items = categoryData.items;
      const fontSize = isMobile ? 8 : isTablet ? 12 : 14;
      const lineHeight = fontSize * 1.1;

      // Vertical center calculation for bullet list
      let totalLines = 0;
      const lineEstimates: number[] = [];

      items.forEach(item => {
        const approxLines = Math.ceil(item.title.length / 18);
        lineEstimates.push(approxLines);
        totalLines += approxLines;
      });

      const totalHeight = totalLines * lineHeight;
      const verticalPadding = bellHeight * 0.15;
      const downwardShift = bellHeight * 0.25;  // shift 5% down (you can adjust this)
      let runningY = -bellHeight + verticalPadding + (bellHeight - verticalPadding * 2 - totalHeight) / 2 + downwardShift;
      const runningYIcon = -bellHeight + verticalPadding + (bellHeight - verticalPadding * 2 - totalHeight) / 2 + downwardShift;
     
      // ---- Add image icon at the top of textGroup ----
      const iconSize = isMobile ? 10 : isTablet ? 20 : 30;  // responsive icon size
      textGroup.append("image")
        .attr("class", "subcategory-icon")
        .attr("href", categoryData.icon)
        .attr("x", -iconSize / 2)
        .attr("y", runningYIcon - 80)  // slight downward offset from top of bell
        .attr("width", iconSize)
        .attr("height", iconSize);

      // ------------------------------------------------
      items.forEach(item => {
        const text = textGroup.append("text")
          .attr("class", "subcategory-text-list")
          .attr("x", 0)
          .attr("y", runningY)
          .attr("text-anchor", "middle")
          .attr("fill", "#fff")
          .attr("font-size", fontSize)
          .style("font-family", "'Nunito-Regular', sans-serif");

        const availableWidth = bellWidth * 0.75;
        const linesWrapped = wrapText(text, `• ${item.title}`, availableWidth);
        runningY += linesWrapped * lineHeight;
      });

      // Main label (directly above bell)
      // Responsive font size and bell positioning
      const labelFontSize = isMobile ? 9 : isTablet ? 12 : 16;
      const labelYOffset = -bellHeight * 0.85;

      // Dynamic width/height for foreignObject label
      const labelWidth = bellWidth * (isMobile ? 0.9 : 0.7);
      const labelHeight = bellHeight * 0.2;

      // Add foreignObject for label
      const labelGroup = group.append("foreignObject")
        .attr("x", -labelWidth / 2)
        .attr("y", labelYOffset)
        .attr("width", labelWidth)
        .attr("height", labelHeight);

      labelGroup.append("xhtml:div")
        .style("width", `${labelWidth}px`)
        .style("height", `${labelHeight}px`)
        .style("display", "flex")
        .style("justify-content", "center")
        .style("align-items", "center")
        .style("text-align", "center")
        .style("font-family", "'Figtree-Bold', sans-serif")
        .style("font-weight", "bold")
        .style("font-size", `${labelFontSize}px`)
        .style("color", categoryData.textColor)
        .style("line-height", "1.3")
        .style("word-break", "break-word")
        .text(cat);



      // const labelFontSize = isMobile ? 8 : isTablet ? 12 : 16;
      // const labelYOffset = -bellHeight * 0.85;
      // const labelWidth = bellWidth * 0.7;
      // const labelHeight = bellHeight * 0.15;

      // const labelGroup = group.append("foreignObject")
      //   .attr("x", -labelWidth / 2)
      //   .attr("y", labelYOffset)
      //   .attr("width", labelWidth)
      //   .attr("height", labelHeight);

      // labelGroup.append("xhtml:div")
      //   .style("width", `${labelWidth}px`)
      //   .style("height", `${labelHeight}px`)
      //   .style("display", "flex")
      //   .style("justify-content", "center")
      //   .style("align-items", "center")
      //   .style("text-align", "center")
      //   .style("font-family", "'Figtree-Bold', sans-serif")
      //   .style("font-weight", "bold")
      //   .style("font-size", `${labelFontSize}px`)
      //   .style("color", categoryData.textColor)
      //   .style("line-height", "1.2")
      //   .style("word-break", "break-word")
      //   .text(cat);



      // // For controlled wrapping
      // const displayLabel = (cat === "Dashboards & Visualizations")
      //   ? "Dashboards\n&\nVisualizations"
      //   : cat;

      // // Main label (directly above bell)
      // const labelFontSize = isMobile ? 8 : isTablet ? 12 : 16;
      // const labelYOffset = -bellHeight * 0.85;

      // const labelText = group.append("text")
      //   .attr("x", 0)
      //   .attr("y", labelYOffset)
      //   .attr("text-anchor", "middle")
      //   .attr("fill", categoryData.textColor)
      //   .attr("font-size", labelFontSize)
      //   .attr("font-weight", "bold")
      //   .style("font-family", "'Figtree-Bold', sans-serif");

      // // Apply controlled wrap
      // const lines = displayLabel.split("\n");

      // lines.forEach((line, idx) => {
      //   labelText.append("tspan")
      //     .attr("x", 0)
      //     .attr("dy", idx === 0 ? "0em" : "1.1em")
      //     .text(line);
      // });

      // // Apply slight vertical adjustment upwards for multi-line labels
      // const verticalAdjustment = -(lines.length - 1) * (labelFontSize * 0.8) / 2 - (labelFontSize * 0.2);
      // labelText.attr("dy", verticalAdjustment);





      // const labelFontSize = isMobile ? 8 : isTablet ? 12 : 16;
      // const labelText = group.append("text")
      //   .attr("x", 0)
      //   .attr("y", -bellHeight * 0.80)
      //   .attr("text-anchor", "middle")
      //   .attr("fill", categoryData.textColor)
      //   .attr("font-size", labelFontSize)
      //   .attr("font-weight", "bold")
      //   .style("font-family", "'Figtree-Bold', sans-serif");

      // wrapText(labelText, cat, bellWidth * 0.5);

      // Hover animations
      group.on("mouseover", () => {
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

      group.on("mouseout", () => {
        groups.forEach((g, j) => {
          g.transition().duration(300).ease(d3.easeCubicOut)
            .attr("transform", `translate(${spacing * (j + 1)}, ${height}) scale(1)`);
        });
        textGroup.transition().duration(300).style("opacity", 0);
        bellPath.transition().duration(300)
          .attr("filter", "drop-shadow(0px 0px 0px rgba(0,0,0,0))");
      });

      // Tooltip logic
      group.on("click", () => {
        const clickedItem = categoryData.items[0];
        const containerRect = containerRef.current?.getBoundingClientRect();
        const svgRect = svgRef.current?.getBoundingClientRect();

        const bellCenterX = svgRect!.left + x;
        const bellCenterY = svgRect!.top + (height - bellHeight * 0.8);
        const containerCenterX = containerRect!.left + containerRect!.width / 2;
        const direction = bellCenterX < containerCenterX ? "right" : "left";

        setTooltip({
          x: bellCenterX - containerRect!.left,
          y: bellCenterY - containerRect!.top,
          absoluteX: bellCenterX,
          absoluteY: bellCenterY,
          item: clickedItem,
          direction,
        });

        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          setTooltip(null);
          timerRef.current = null;
        }, 5000);
      });

      bellPath.transition().duration(800).attr("opacity", 1);
    });

    d3.select(svgRef.current).attr("width", width).attr("height", height);
  }, [data, clearTooltip]);

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
          direction={tooltip.direction}
          onClose={clearTooltip}
        />
      )}
    </div>
  );
};

export default BellDiagram;
