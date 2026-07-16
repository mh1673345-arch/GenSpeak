"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowUpRight, TrendingUp } from "lucide-react";

export interface TrackedNode {
  id: string;
  label: string;
  x: number;
  y: number;
  visible: boolean;
}

interface InternetPlanetProps {
  onTrackNodes?: (nodes: TrackedNode[]) => void;
}

interface SphereNode {
  x: number;
  y: number;
  z: number;
  connections: number[];
  isKey: boolean;
  keyId?: string;
  keyLabel?: string;
}

// ----------------------------------------------------
// DYNAMIC CATEGORY STATS METADATA
// ----------------------------------------------------
// ----------------------------------------------------
// PURE DETERMINISTIC SPACE STARFIELD DATA GENERATORS
// ----------------------------------------------------
const STATIC_STARS = Array.from({ length: 90 }, (_, i) => {
  const x = Math.abs(Math.sin(i * 12.9898)) % 1.0;
  const y = Math.abs(Math.sin(i * 78.233)) % 1.0;
  const size = 0.6 + (Math.abs(Math.sin(i * 4.567)) % 1.0) * 1.0;
  const blinkSpeed = 0.015 + (Math.abs(Math.sin(i * 9.123)) % 1.0) * 0.02;
  const phase = (Math.abs(Math.sin(i * 2.345)) % 1.0) * Math.PI;
  return { x, y, size, blinkSpeed, phase };
});

const STATIC_DRIFT_PARTICLES = Array.from({ length: 45 }, (_, i) => {
  const x = Math.abs(Math.sin(i * 99.12)) % 1.0;
  const y = Math.abs(Math.sin(i * 27.54)) % 1.0;
  const vx = ((Math.abs(Math.sin(i * 3.42)) % 1.0) - 0.5) * 0.0003;
  const vy = ((Math.abs(Math.sin(i * 8.65)) % 1.0) - 0.5) * 0.0003;
  const size = 0.8 + (Math.abs(Math.sin(i * 1.98)) % 1.0) * 0.7;
  return { x, y, vx, vy, size };
});

const categoryStats: Record<string, { words: number; guides: number; trending: string }> = {
  memes: { words: 142, guides: 18, trending: "skibidi" },
  gaming: { words: 186, guides: 24, trending: "sigma" },
  tiktok: { words: 245, guides: 32, trending: "rizz" },
  ai: { words: 89, guides: 15, trending: "agentic" },
  discord: { words: 112, guides: 11, trending: "moderator" },
  music: { words: 98, guides: 9, trending: "loop" },
  youtube: { words: 135, guides: 14, trending: "shorts" },
  instagram: { words: 154, guides: 12, trending: "aesthetic" },
  crypto: { words: 76, guides: 8, trending: "happen" },
  business: { words: 64, guides: 6, trending: "synergy" },
  design: { words: 82, guides: 10, trending: "glassmorphism" },
  programming: { words: 104, guides: 17, trending: "typescript" }
};

export function InternetPlanet({ onTrackNodes }: InternetPlanetProps) {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 600 });
  
  // Interactive hover and zoom animations states
  const [hoveredNode, setHoveredNode] = useState<{
    id: string;
    label: string;
    x: number;
    y: number;
  } | null>(null);

  const [zoomFactor, setZoomFactor] = useState(1.0);
  const currentZoomRef = useRef(1.0);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const [nodesForDOM, setNodesForDOM] = useState<TrackedNode[]>([]);
  const lastNodesRef = useRef<TrackedNode[]>([]);

  // Setup dimension tracking
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: 600,
        });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);



  // 2. GENERATE SPHERICAL NODES (Golden Spiral Distribution)
  const tempNodes = useMemo(() => {
    const N = 280; // Node density
    const nodes: SphereNode[] = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle
    
    // Designated key nodes mapping for 12 categories
    const keyNodesMap = [
      { index: 20, id: "gaming", label: "Gaming" },
      { index: 42, id: "tiktok", label: "TikTok" },
      { index: 68, id: "memes", label: "Memes" },
      { index: 95, id: "ai", label: "AI" },
      { index: 115, id: "discord", label: "Discord" },
      { index: 138, id: "music", label: "Music" },
      { index: 160, id: "youtube", label: "YouTube" },
      { index: 182, id: "instagram", label: "Instagram" },
      { index: 202, id: "crypto", label: "Crypto" },
      { index: 220, id: "business", label: "Business" },
      { index: 238, id: "design", label: "Design" },
      { index: 255, id: "programming", label: "Programming" }
    ];

    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;

      const keyMatch = keyNodesMap.find((item) => item.index === i);

      nodes.push({
        x,
        y,
        z,
        connections: [],
        isKey: !!keyMatch,
        keyId: keyMatch?.id,
        keyLabel: keyMatch?.label,
      });
    }

    // Precompute nearest neighbor connections
    for (let i = 0; i < N; i++) {
      const nodeA = nodes[i];
      const dists: Array<{ index: number; d: number }> = [];

      for (let j = 0; j < N; j++) {
        if (i === j) continue;
        const nodeB = nodes[j];
        const dx = nodeA.x - nodeB.x;
        const dy = nodeA.y - nodeB.y;
        const dz = nodeA.z - nodeB.z;
        const d = dx * dx + dy * dy + dz * dz;
        dists.push({ index: j, d });
      }

      dists.sort((a, b) => a.d - b.d);
      nodeA.connections = dists.slice(0, 3).map((item) => item.index);
    }

    return nodes;
  }, []);

  // 3. CANVAS RENDERING LOOP
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let rotationY = 0;
    const tiltX = -0.28; // Forward tilt angle

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Pulse paths setup
    const pulsePaths: Array<{
      startIdx: number;
      endIdx: number;
      progress: number;
      speed: number;
    }> = [];

    for (let p = 0; p < 12; p++) {
      const start = Math.floor(Math.random() * tempNodes.length);
      const conns = tempNodes[start].connections;
      const end = conns[Math.floor(Math.random() * conns.length)];
      pulsePaths.push({
        startIdx: start,
        endIdx: end,
        progress: Math.random(),
        speed: 0.004 + Math.random() * 0.007,
      });
    }

    const render = () => {
      if (!ctx || !canvas) return;

      // Clear viewport
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth zoom factor interpolation (spring physics simulation)
      currentZoomRef.current += (zoomFactor - currentZoomRef.current) * 0.12;

      const sphereRadius = Math.min(canvas.height * 0.38, 220) * currentZoomRef.current;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      const focalLength = sphereRadius * 1.5;

      // A. DRAW NEBULA CORE AURORA GRADIENTS
      const auroraGrad = ctx.createRadialGradient(
        centerX, centerY, sphereRadius * 0.15,
        centerX, centerY, sphereRadius * 1.9
      );
      auroraGrad.addColorStop(0, "rgba(255, 106, 26, 0.04)"); // Warm orange glow core
      auroraGrad.addColorStop(0.5, "rgba(138, 108, 255, 0.025)"); // Violet boundary glow
      auroraGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = auroraGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, sphereRadius * 2.2, 0, Math.PI * 2);
      ctx.fill();

      // B. DRAW SPACE ENVIRONMENT STARS
      STATIC_STARS.forEach(star => {
        const opacity = 0.2 + Math.abs(Math.sin(Date.now() * star.blinkSpeed + star.phase)) * 0.6;
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity * (1.1 - currentZoomRef.current * 0.1)})`;
        ctx.fillRect(star.x * canvas.width, star.y * canvas.height, star.size, star.size);
      });

      // C. DRAW DRIFTING SPACE PARTICLES
      STATIC_DRIFT_PARTICLES.forEach(part => {
        if (!prefersReducedMotion) {
          part.x += part.vx;
          part.y += part.vy;
          if (part.x < 0) part.x = 1.0;
          if (part.x > 1.0) part.x = 0;
          if (part.y < 0) part.y = 1.0;
          if (part.y > 1.0) part.y = 0;
        }
        ctx.fillStyle = "rgba(255, 179, 71, 0.15)";
        ctx.beginPath();
        ctx.arc(part.x * canvas.width, part.y * canvas.height, part.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // D. UPDATE ROTATION
      if (!prefersReducedMotion) {
        rotationY += 0.00055;
      }

      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      const cosX = Math.cos(tiltX);
      const sinX = Math.sin(tiltX);

      // E. PERSPECTIVE PROJECT ALL NODES
      const projected = tempNodes.map((node) => {
        const x1 = node.x * cosY - node.z * sinY;
        const z1 = node.x * sinY + node.z * cosY;

        const y2 = node.y * cosX - z1 * sinX;
        const z2 = node.y * sinX + z1 * cosX;

        const scale = focalLength / (focalLength + z2 * sphereRadius);
        const screenX = centerX + x1 * sphereRadius * scale;
        const screenY = centerY + y2 * sphereRadius * scale;

        return {
          ...node,
          projX: screenX,
          projY: screenY,
          projZ: z2,
          scale,
        };
      });

      const trackedKeyNodes: TrackedNode[] = [];
      let foundHoveredNode: { id: string; label: string; x: number; y: number } | null = null;

      // F. RENDER CONNECTION LINES
      ctx.lineWidth = 0.95;
      projected.forEach((nodeA) => {
        if (nodeA.projZ > 0.15) return;

        nodeA.connections.forEach((connIdx) => {
          const nodeB = projected[connIdx];
          if (nodeB.projZ > 0.15) return;

          const depthAlpha = Math.max(0, 1 - (nodeA.projZ + nodeB.projZ) / 2);
          
          const distToMouseA = Math.hypot(nodeA.projX - mouseRef.current.x, nodeA.projY - mouseRef.current.y);
          const distToMouseB = Math.hypot(nodeB.projX - mouseRef.current.x, nodeB.projY - mouseRef.current.y);
          const isNearMouse = distToMouseA < 75 || distToMouseB < 75;

          ctx.beginPath();
          ctx.moveTo(nodeA.projX, nodeA.projY);
          ctx.lineTo(nodeB.projX, nodeB.projY);

          if (isNearMouse) {
            ctx.strokeStyle = `rgba(255, 106, 26, ${depthAlpha * 0.42})`;
            ctx.lineWidth = 1.35;
          } else {
            ctx.strokeStyle = `rgba(255, 106, 26, ${depthAlpha * 0.11})`;
            ctx.lineWidth = 0.75;
          }
          ctx.stroke();
        });
      });

      // G. DRAW DATA CONNECTIONS PULSES
      pulsePaths.forEach((pulse) => {
        const nodeA = projected[pulse.startIdx];
        const nodeB = projected[pulse.endIdx];

        if (nodeA.projZ <= 0.08 && nodeB.projZ <= 0.08) {
          const px = nodeA.projX + (nodeB.projX - nodeA.projX) * pulse.progress;
          const py = nodeA.projY + (nodeB.projY - nodeA.projY) * pulse.progress;

          const depthAlpha = Math.max(0, 1 - (nodeA.projZ + nodeB.projZ) / 2);

          ctx.beginPath();
          ctx.arc(px, py, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 179, 71, ${depthAlpha * 0.75})`;
          ctx.fill();
        }

        if (!prefersReducedMotion) {
          pulse.progress += pulse.speed;
          if (pulse.progress >= 1.0) {
            pulse.progress = 0;
            pulse.startIdx = pulse.endIdx;
            const conns = tempNodes[pulse.startIdx].connections;
            pulse.endIdx = conns[Math.floor(Math.random() * conns.length)];
          }
        }
      });

      // H. RENDER KEY CATEGORIES AND NODES DOTS
      projected.forEach((node) => {
        if (node.projZ > 0.12) return;

        const depthAlpha = Math.max(0, 1 - node.projZ);
        
        // Dynamic hovered distance calculations
        const distToMouse = Math.hypot(node.projX - mouseRef.current.x, node.projY - mouseRef.current.y);
        const isHovered = node.isKey && distToMouse < 22;
        const hoverGlow = isHovered ? 1.6 : distToMouse < 60 ? 1.25 : 1.0;

        ctx.beginPath();
        if (node.isKey) {
          // Glow overlay mapping
          ctx.arc(node.projX, node.projY, 4.5 * hoverGlow, 0, Math.PI * 2);
          ctx.fillStyle = isHovered 
            ? `rgba(255, 138, 61, ${depthAlpha * 0.95})` 
            : `rgba(255, 106, 26, ${depthAlpha * 0.95})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(node.projX, node.projY, 11 * hoverGlow, 0, Math.PI * 2);
          ctx.strokeStyle = isHovered 
            ? `rgba(255, 138, 61, ${depthAlpha * 0.65})` 
            : `rgba(255, 138, 61, ${depthAlpha * 0.32})`;
          ctx.lineWidth = isHovered ? 1.6 : 0.85;
          ctx.stroke();

          // Outer visual halo ripple rings
          if (isHovered) {
            ctx.beginPath();
            ctx.arc(node.projX, node.projY, 20, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 106, 26, ${depthAlpha * 0.25})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }

          if (node.keyId && node.keyLabel) {
            trackedKeyNodes.push({
              id: node.keyId,
              label: node.keyLabel,
              x: node.projX,
              y: node.projY,
              visible: node.projZ <= 0.06,
            });

            if (isHovered) {
              foundHoveredNode = {
                id: node.keyId,
                label: node.keyLabel,
                x: node.projX,
                y: node.projY
              };
            }
          }
        } else {
          // Draw simple data node dots
          ctx.arc(node.projX, node.projY, 1.6 * hoverGlow, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 179, 71, ${depthAlpha * 0.42})`;
          ctx.fill();
        }
      });

      // Update Cursor style
      if (foundHoveredNode) {
        canvas.style.cursor = "pointer";
      } else {
        canvas.style.cursor = "crosshair";
      }

      // Update React Tooltip Position States
      Promise.resolve().then(() => {
        setHoveredNode(foundHoveredNode);
      });

      // Pass tracking variables back to navbar connections if active
      if (onTrackNodes && trackedKeyNodes.length > 0) {
        onTrackNodes(trackedKeyNodes);
      }

      // Sync tracked key coordinates to accessible nodes list
      const hasChanged = trackedKeyNodes.length !== lastNodesRef.current.length || 
        trackedKeyNodes.some((n, idx) => {
          const prev = lastNodesRef.current[idx];
          return !prev || Math.abs(n.x - prev.x) > 0.5 || Math.abs(n.y - prev.y) > 0.5;
        });

      if (hasChanged) {
        lastNodesRef.current = trackedKeyNodes;
        Promise.resolve().then(() => {
          setNodesForDOM(trackedKeyNodes);
        });
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [dimensions, onTrackNodes, tempNodes, zoomFactor]);

  // Click handler triggered
  const handleCanvasClick = () => {
    if (hoveredNode) {
      // Zoom animation factor triggered
      setZoomFactor(3.0);
      
      // Delay navigation to let zoom transition slide beautifully
      setTimeout(() => {
        router.push(`/categories/${hoveredNode.id}`);
      }, 350);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const handleMouseLeave = () => {
    mouseRef.current = { x: -1000, y: -1000 };
  };

  const activeStats = hoveredNode ? categoryStats[hoveredNode.id] : null;

  return (
    <div ref={containerRef} className="w-full relative h-[600px] select-none">
      
      {/* Dynamic Floating Glassmorphic Tooltip */}
      {hoveredNode && activeStats && (
        <div 
          className="absolute z-30 pointer-events-none p-4.5 rounded-2xl border border-white/[0.08] bg-[#0B0B0F]/90 backdrop-blur-md shadow-2xl flex flex-col gap-2.5 transition-all duration-300 font-sans"
          style={{
            left: `${hoveredNode.x + 22}px`,
            top: `${hoveredNode.y - 65}px`
          }}
        >
          <div className="flex items-center justify-between gap-6 border-b border-white/5 pb-1.5">
            <span className="text-xs font-black font-display text-white tracking-tight flex items-center gap-1.5 capitalize">
              <Sparkles className="w-3.5 h-3.5 text-[#FF8A3D]" />
              {hoveredNode.label} Map
            </span>
            <span className="text-[9px] font-mono text-slate-500 uppercase flex items-center gap-1">
              Navigate <ArrowUpRight className="w-2.5 h-2.5" />
            </span>
          </div>

          <div className="flex gap-4.5 text-[10px] font-mono uppercase text-slate-400">
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-500 text-[8px]">GLOSSARY</span>
              <span className="text-white font-bold">{activeStats.words} terms</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-500 text-[8px]">GUIDES</span>
              <span className="text-white font-bold">{activeStats.guides} articles</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[9px] font-mono text-[#FF8A3D] bg-[#FF6A1A]/10 px-2 py-1 rounded-lg w-fit border border-[#FF6A1A]/10 mt-0.5">
            <TrendingUp className="w-3 h-3" />
            <span>TRENDING: #{activeStats.trending}</span>
          </div>
        </div>
      )}

      {/* Accessible DOM Button Overlays for Keyboard Nav & ARIA compliance */}
      <div className="absolute inset-0 pointer-events-none select-none z-20">
        {nodesForDOM.map((node) => {
          if (!node.visible) return null;
          return (
            <button
              key={node.id}
              onClick={() => {
                setZoomFactor(3.0);
                setTimeout(() => {
                  router.push(`/categories/${node.id}`);
                }, 350);
              }}
              onFocus={() => {
                setHoveredNode({
                  id: node.id,
                  label: node.label,
                  x: node.x,
                  y: node.y
                });
              }}
              onBlur={() => setHoveredNode(null)}
              onMouseEnter={() => {
                setHoveredNode({
                  id: node.id,
                  label: node.label,
                  x: node.x,
                  y: node.y
                });
              }}
              onMouseLeave={() => setHoveredNode(null)}
              className="absolute pointer-events-auto w-6 h-6 rounded-full border border-dashed border-[#FF8A3D]/40 hover:border-[#FF8A3D] focus:ring-2 focus:ring-[#FF8A3D] focus:bg-[#FF8A3D]/10 focus:scale-125 transition-all flex items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer outline-none bg-transparent"
              style={{
                left: `${node.x}px`,
                top: `${node.y}px`
              }}
              aria-label={`Navigate to ${node.label} subculture category page`}
            >
              <span className="sr-only">{node.label} category portal</span>
            </button>
          );
        })}
      </div>

      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleCanvasClick}
        className="w-full h-full pointer-events-auto block relative"
      />
    </div>
  );
}
