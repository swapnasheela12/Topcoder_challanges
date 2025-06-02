

"use client";

import * as d3 from "d3";

import { BellData, Item } from "../../types/BellTypes";
import React, { useEffect, useRef, useState } from "react";

import Tooltip from "./Tooltip";
import mockData from "../../data/mockData.json";
import styles from "./BellDiagram.module.scss";

/**
 * Text wrapping function that returns total lines used
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

/**
 * Shrinking width near top of bell
 */
const getAvailableWidthAtY = (y: number, bellW: number, bellH: number) => {
  const relativeHeight = Math.abs(y) / bellH;
  const widthShrinkFactor = 1 - relativeHeight * 0.6;
  return bellW * widthShrinkFactor;
};

const BellDiagram: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const data: BellData = mockData;

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
    const categories = Object.keys(data);
    const spacing = width / (categories.length + 1);
    const zoomScale = isMobile ? 1.25 : 1.25; // ✅ zoom scale only for active bell

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

    const groups: d3.Selection<SVGGElement, unknown, null, undefined>[] = [];

    categories.forEach((cat, i) => {
      const categoryData = data[cat];
      const x = spacing * (i + 1);
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
        .attr("opacity", 0);

      const textGroup = group.append("g").attr("class", "subcategory-text").style("opacity", 0);
      const items = categoryData.items;

      const baseFontSize = isMobile ? 12 : 16;
      const maxComfortableItems = isMobile ? 4 : 6;
      const scaleFactor = Math.min(1, maxComfortableItems / items.length);
      const fontSize = Math.max(baseFontSize * scaleFactor, isMobile ? 9 : 12);
      const lineHeight = fontSize * 1.2;

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

      group.on("mouseover", function () {
        group.node()?.parentNode?.appendChild(group.node()!);
        groups.forEach((g, j) => {
          const scale = i === j ? zoomScale : 1;
          g.transition().duration(300)
            .attr("transform", `translate(${spacing * (j + 1)}, ${height}) scale(${scale})`);
        });
        textGroup.transition().duration(300).style("opacity", 1);
        bellPath.transition().duration(300)
          .attr("filter", "drop-shadow(4px 4px 8px rgba(0,0,0,0.4))");
      });

      group.on("mouseout", function () {
        groups.forEach((g, j) => {
          g.transition().duration(300)
            .attr("transform", `translate(${spacing * (j + 1)}, ${height}) scale(1)`);
        });
        textGroup.transition().duration(300).style("opacity", 0);
        bellPath.transition().duration(300)
          .attr("filter", "drop-shadow(0px 0px 0px rgba(0,0,0,0))");
      });

      bellPath.transition().duration(800).attr("opacity", 1);
    });

    d3.select(svgRef.current).attr("width", width).attr("height", height);
  }, [data, isMobile]);

  return (
    <div className={styles.container} ref={containerRef}>
      <svg ref={svgRef} />
    </div>
  );
};

export default BellDiagram;
