



"use client";

import * as d3 from 'd3';

import { BellData, Item } from '../../types/BellTypes';
import React, { useEffect, useRef } from 'react';

import mockData from '../../data/mockData.json';
import styles from './BellDiagram.module.scss';

// ✅ Add this function OUTSIDE the component
const wrapText = (textElement: d3.Selection<SVGTextElement, unknown, null, undefined>, text: string, width: number) => {
  const words = text.split(/\s+/);
  let line: string[] = [];
  let lineNumber = 0;
  const lineHeight = 1.1;

  const y = +textElement.attr("y");
  const x = +textElement.attr("x");
  const dy = 0;

  textElement.text(null);

  let tspan = textElement.append("tspan")
    .attr("x", x)
    .attr("y", y)
    .attr("dy", `${dy}em`);

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
};

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
    const bellHeight = 400; // SAME HEIGHT FOR ALL BELLS
    const categories = Object.keys(data);
    const total = categories.length;
    const spacing = width / (total + 1);
    const bellLayer = svg.append("g");

    categories.forEach((cat, i) => {
      const categoryData = data[cat];
      const x = spacing * (i + 1);

      // const bellData = [
      //   [x - bellWidth, height],
      //   [x - bellWidth / 2, height - bellHeight],
      //   [x, height - bellHeight - 50],
      //   [x + bellWidth / 2, height - bellHeight],
      //   [x + bellWidth, height],
      // ];



      const bellData = [
        [x - bellWidth * 0.65, height],                      // far left base
        [x - bellWidth * 0.5, height - bellHeight * 0.1],    // lower outward
        [x - bellWidth * 0.4, height - bellHeight * 0.4],    // mid-left inward
        [x - bellWidth * 0.2, height - bellHeight * 0.7],    // upper-left slope (widened)
        [x, height - bellHeight * 0.72],                     // top (slightly wider & lower)
        [x + bellWidth * 0.2, height - bellHeight * 0.7],    // upper-right slope (widened)
        [x + bellWidth * 0.4, height - bellHeight * 0.4],    // mid-right inward
        [x + bellWidth * 0.5, height - bellHeight * 0.1],    // lower outward
        [x + bellWidth * 0.65, height]                       // far right base
      ];

      const path = d3.line().curve(d3.curveBasis);
      const group = bellLayer.append("g");

      const bellPath = group.append("path")
        .attr("d", path(bellData as [number, number][]))
        .attr("fill", categoryData.color)
        .attr("fill-opacity", 0.6)  // <-- This makes the color transparent
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .attr("opacity", 0)
        .style("cursor", "pointer")
        .on("mouseover", () => {
          group.selectAll(".subcategory-text").remove();

          const items = categoryData.items;
          const startY = height - bellHeight + 40; // start slightly below top of bell
          const textX = x - bellWidth / 2 + 10;    // shift inside left of bell
          const maxTextWidth = bellWidth - 20;     // leave padding on both sides

          items.forEach((item, index) => {
            const textGroup = group.append("text")
              .attr("class", "subcategory-text")
              .attr("x", textX)
              .attr("y", startY + index * 40)  // vertical spacing
              .attr("text-anchor", "start")
              .attr("fill", "#000")
              .attr("font-size", 14);

            wrapText(textGroup, `• ${item.title}`, maxTextWidth);
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
