import * as d3 from "d3";

// ZoomControls is a functional component that adds zoom control elements to an SVG
export default function ZoomControls(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  zoom: d3.ZoomBehavior<SVGSVGElement, unknown>
) {
  // Add zoom controls group
  const zoomControls = svg.append("g")
    .attr("class", "zoom-controls")
    .attr("transform", "translate(20, 20)");

  // Zoom in button
  zoomControls.append("circle")
    .attr("cx", 15)
    .attr("cy", 15)
    .attr("r", 15)
    .attr("fill", "white")
    .attr("stroke", "#ccc");

  zoomControls.append("text")
    .attr("x", 15)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .attr("font-size", "20px")
    .text("+")
    .style("pointer-events", "none");

  // Zoom out button
  zoomControls.append("circle")
    .attr("cx", 15)
    .attr("cy", 55)
    .attr("r", 15)
    .attr("fill", "white")
    .attr("stroke", "#ccc");

  zoomControls.append("text")
    .attr("x", 15)
    .attr("y", 60)
    .attr("text-anchor", "middle")
    .attr("font-size", "20px")
    .text("-")
    .style("pointer-events", "none");

  // Reset button
  zoomControls.append("circle")
    .attr("cx", 15)
    .attr("cy", 95)
    .attr("r", 15)
    .attr("fill", "white")
    .attr("stroke", "#ccc");

  zoomControls.append("text")
    .attr("x", 15)
    .attr("y", 100)
    .attr("text-anchor", "middle")
    .attr("font-size", "14px")
    .text("↺")
    .style("pointer-events", "none");

  // Add click handlers for zoom controls
  zoomControls.select("circle:nth-child(1)")
    .on("click", () => {
      svg.transition().duration(300).call(zoom.scaleBy, 1.3);
    });

  zoomControls.select("circle:nth-child(3)")
    .on("click", () => {
      svg.transition().duration(300).call(zoom.scaleBy, 0.7);
    });

  zoomControls.select("circle:nth-child(5)")
    .on("click", () => {
      svg.transition().duration(300).call(
        zoom.transform,
        d3.zoomIdentity.translate(0, 0).scale(1)
      );
    });

  return zoomControls;
}
