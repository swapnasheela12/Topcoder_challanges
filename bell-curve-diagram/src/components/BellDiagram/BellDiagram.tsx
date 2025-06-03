"use client";

import * as d3 from "d3";

import { BellData, Item } from "../../types/BellTypes";
import React, { useCallback, useEffect, useRef, useState } from "react";

import Tooltip from "./Tooltip";
import mockData from "../../data/mockData.json";
import styles from "./BellDiagram.module.scss";

/**
 * Utility function to wrap long text into multiple lines within specified width.
 * Used for subcategory bullet text to avoid overflow.
 */
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
    item: Item; direction: "left" | "right";
  } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear tooltip manually or automatically after timer ends
  const clearTooltip = useCallback(() => {
    setTooltip(null);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Close tooltip on outside click
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

    // Responsive behavior based on container width
    const containerWidth = containerRef.current.clientWidth;
    const isMobile = containerWidth < 768;
    const isTablet = containerWidth >= 768 && containerWidth < 1200;

    // Dynamic sizing based on screen size
    const width = containerWidth;
    const height = isMobile ? 400 : isTablet ? 480 : 550;
    const bellWidth = isMobile ? 90 : isTablet ? 140 : 180;
    const bellHeight = isMobile ? 275 : isTablet ? 375 : 450;
    const zoomScale = 1.30;

    const categories = Object.keys(data);
    const spacing = width / (categories.length + 1);
    const bellLayer = d3.select(svgRef.current).html("").append("g");

    // Bell shape coordinates generator
    const createBellData = (bellW: number, bellH: number) => [
      [-bellW * 0.65, 0], [-bellW * 0.5, -bellH * 0.1], [-bellW * 0.4, -bellH * 0.4],
      [-bellW * 0.2, -bellH * 0.7], [0, -bellH * 0.71], [bellW * 0.2, -bellH * 0.7],
      [bellW * 0.4, -bellH * 0.4], [bellW * 0.5, -bellH * 0.1], [bellW * 0.65, 0],
    ];

    const groups: d3.Selection<SVGGElement, unknown, null, undefined>[] = [];

    // Render each bell category
    categories.forEach((cat, i) => {
      const categoryData = data[cat];
      const x = spacing * (i + 1);
      const group = bellLayer.append("g").attr("transform", `translate(${x}, ${height})`);
      groups.push(group);

      /** Draw Bell Shape with opacity **/
      const bellPath = group.append("path")
        .attr("d", d3.line().curve(d3.curveBasis)(createBellData(bellWidth, bellHeight) as [number, number][]))
        .attr("fill", categoryData.color)
        .attr("stroke-width", 2)
        .style("cursor", "pointer")
        .attr("opacity", 0.6);

      /** Create textGroup container inside bell **/
      const textGroup = group.append("g").attr("class", "subcategory-text").style("opacity", 0);
      const items = categoryData.items;
      const fontSize = isMobile ? 8 : isTablet ? 12 : 16;
      const lineHeight = fontSize * 1.1;

      /** Calculate how many lines total for vertical centering **/
      let totalLines = 0;
      const lineEstimates: number[] = [];

      items.forEach(item => {
        const approxLines = Math.ceil(item.title.length / 18);
        lineEstimates.push(approxLines);
        totalLines += approxLines;
      });

      const totalHeight = totalLines * lineHeight;
      const verticalPadding = bellHeight * 0.15;
      const downwardShift = bellHeight * 0.20;

      let runningY = -bellHeight + verticalPadding + (bellHeight - verticalPadding - totalHeight) / 2 + downwardShift;
      const runningYIcon = -bellHeight + verticalPadding + (bellHeight - verticalPadding * 2 - totalHeight) / 2 + downwardShift;

      /** Add Icon image above bullet list **/
      const iconSize = isMobile ? 20 : isTablet ? 20 : 30;
      textGroup.append("image")
        .attr("class", "subcategory-icon")
        .attr("href", categoryData.icon)
        .attr("x", -iconSize / 2)
        .attr("y", runningYIcon - (bellHeight * 0.12))
        .attr("width", iconSize)
        .attr("height", iconSize);

      /** Add bullet list items under icon **/
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

      /** Main label above bell using foreignObject **/
      const labelFontSize = isMobile ? 10 : isTablet ? 16 : 16;
      const labelYOffset = -bellHeight * 0.90;
      const labelWidth = bellWidth * (isMobile ? 0.9 : 0.7);
      const labelHeight = bellHeight * 0.2;

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

      /** Hover interaction: zoom + shadow **/
      group.on("mouseover", () => {
        group.node()?.parentNode?.appendChild(group.node()!);
        groups.forEach((g, j) => {
          const scale = i === j ? zoomScale : 1;
          g.transition().duration(300).ease(d3.easeCubicOut)
            .attr("transform", `translate(${spacing * (j + 1)}, ${height}) scale(${scale})`);
        });
        textGroup.transition().duration(300).style("opacity", 2);
        bellPath.transition().duration(300).style("opacity", 1)
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

      /** Tooltip click handler **/
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

      /** Animate bell appearance **/
      bellPath.transition().duration(800).attr("opacity", 0.6);
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
