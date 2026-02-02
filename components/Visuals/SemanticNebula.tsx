import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { useApp } from '../../contexts/AppContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Node, Link, GraphData } from '../../types';

const SemanticNebula: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { documents } = useApp();
  const { colors } = useTheme();

  // Prepare Data
  const graphData: GraphData = useMemo(() => {
    const nodes: Node[] = [];
    const links: Link[] = [];

    // Create Document Nodes
    documents.forEach(doc => {
      nodes.push({ id: doc.id, group: 'document', radius: 15 });
      
      // Create Keyword Nodes and Links
      doc.keywords.forEach(kw => {
        const kwId = `kw-${kw.toLowerCase().replace(/\s+/g, '-')}`;
        
        // Check if keyword node exists to avoid dupes
        let kwNode = nodes.find(n => n.id === kwId);
        if (!kwNode) {
          kwNode = { id: kwId, group: 'keyword', radius: 5 };
          nodes.push(kwNode);
        }

        links.push({ source: doc.id, target: kwId, value: 1 });
      });
    });

    return { nodes, links };
  }, [documents]);

  useEffect(() => {
    if (!svgRef.current || graphData.nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Clear previous
    svg.selectAll("*").remove();

    const g = svg.append("g");

    // Force Simulation
    const simulation = d3.forceSimulation(graphData.nodes as d3.SimulationNodeDatum[])
      .force("link", d3.forceLink(graphData.links).id((d: any) => d.id).distance(80))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius((d: any) => (d.radius || 10) + 5));

    // Draw Links
    const link = g.append("g")
      .attr("stroke", colors.glass)
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(graphData.links)
      .join("line")
      .attr("stroke-width", (d: any) => Math.sqrt(d.value));

    // Draw Nodes
    const node = g.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(graphData.nodes)
      .join("circle")
      .attr("r", (d) => d.radius || 5)
      .attr("fill", (d) => d.group === 'document' ? colors.accent : colors.node)
      .call(drag(simulation) as any);

    // Labels for Documents only to avoid clutter
    const labels = g.append("g")
        .selectAll("text")
        .data(graphData.nodes.filter(n => n.group === 'document'))
        .join("text")
        .text((d: any) => {
             const doc = documents.find(doc => doc.id === d.id);
             return doc ? (doc.name.length > 15 ? doc.name.substring(0,12)+'...' : doc.name) : '';
        })
        .attr("fill", colors.text)
        .attr("font-size", "10px")
        .attr("text-anchor", "middle")
        .attr("dy", -20);


    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);
      
      labels
        .attr("x", (d: any) => d.x)
        .attr("y", (d: any) => d.y);
    });

    // Zoom behavior
    const zoom = d3.zoom()
        .scaleExtent([0.1, 4])
        .on("zoom", (event) => {
            g.attr("transform", event.transform);
        });

    svg.call(zoom as any);

    return () => {
      simulation.stop();
    };
  }, [graphData, colors, documents]);

  // Drag utility
  function drag(simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>) {
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }

  return (
    <svg ref={svgRef} className="w-full h-full cursor-move" />
  );
};

export default SemanticNebula;