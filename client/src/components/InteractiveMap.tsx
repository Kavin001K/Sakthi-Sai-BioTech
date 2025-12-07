import createGlobe from "cobe";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MapPin, TrendingUp, Users, Wind } from "lucide-react";

interface LocationData {
    id: string;
    name: string;
    region: string;
    coords: [number, number]; // lat, lon
    stats: {
        volume: string;
        partners: number;
        growth: string;
    };
    description: string;
}

const locations: LocationData[] = [
    {
        id: 'in',
        name: 'India (HQ)',
        region: 'South Asia',
        coords: [20.5937, 78.9629],
        stats: { volume: '5000+ Tons', partners: 1200, growth: '+15%' },
        description: "Our global headquarters and primary manufacturing facility. Producing 5000+ tons of bio-inputs annually."
    },
    {
        id: 'et',
        name: 'Ethiopia',
        region: 'East Africa',
        coords: [9.145, 40.4897],
        stats: { volume: '800+ Tons', partners: 45, growth: '+22%' },
        description: "Key distribution hub for East Africa, serving coffee and cereal farmers."
    },
    {
        id: 'id',
        name: 'Indonesia',
        region: 'Southeast Asia',
        coords: [-0.7893, 113.9213],
        stats: { volume: '1200+ Tons', partners: 85, growth: '+18%' },
        description: "Strategic partner for Southeast Asian markets, focusing on oil palm and rice."
    },
    {
        id: 'za',
        name: 'South Africa',
        region: 'Southern Africa',
        coords: [-30.5595, 22.9375],
        stats: { volume: '600+ Tons', partners: 30, growth: '+12%' },
        description: "Serving commercial farming sectors with premium organic certified products."
    },
    {
        id: 'gh',
        name: 'Ghana',
        region: 'West Africa',
        coords: [7.9465, -1.0232],
        stats: { volume: '400+ Tons', partners: 25, growth: '+20%' },
        description: "West African hub for cocoa and vegetable crop solutions."
    },
    {
        id: 'ke',
        name: 'Kenya',
        region: 'East Africa',
        coords: [-1.2921, 36.8219],
        stats: { volume: '550+ Tons', partners: 35, growth: '+25%' },
        description: "Research and distribution center for East African horticulture."
    },
];

export default function InteractiveMap() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pointerInteracting = useRef<number | null>(null);
    const pointerInteractionMovement = useRef(0);
    const phiRef = useRef(0);
    const [focusedLocation, setFocusedLocation] = useState<LocationData | null>(null);
    const targetPhi = useRef(0);

    useEffect(() => {
        let width = 0;
        const onResize = () => canvasRef.current && (width = canvasRef.current.offsetWidth);
        window.addEventListener('resize', onResize);
        onResize();

        if (!canvasRef.current) return;

        const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: width * 2,
            height: width * 2,
            phi: phiRef.current, // Maintain current rotation
            theta: 0.3, // Slight tilt for realism
            dark: 1,
            diffuse: 3,
            mapSamples: 16000,
            mapBrightness: 6,
            baseColor: [0.3, 0.3, 0.3],
            markerColor: [0.1, 0.8, 1],
            glowColor: [1, 1, 1],
            markers: locations.map(loc => ({
                location: loc.coords,
                size: focusedLocation?.id === loc.id ? 0.1 : 0.05
            })),
            onRender: (state) => {
                // Smooth rotation logic
                if (focusedLocation) {
                    // Calculate target phi based on location longitude
                    // Use NEGATIVE direction to align East longitudes correctly.
                    // View = -Phi. To see 78E, Phi must be -78°.
                    const target = -((focusedLocation.coords[1] * Math.PI) / 180);

                    // Shortest path interpolation
                    let current = phiRef.current;
                    let diff = target - current;

                    // Normalize diff to -PI to PI to ensure shortest turn
                    const T = Math.PI * 2;
                    diff = ((diff % T) + T) % T;
                    if (diff > Math.PI) diff -= T;

                    phiRef.current += diff * 0.08;
                } else if (!pointerInteracting.current) {
                    phiRef.current += 0.003; // Auto rotate
                }

                state.phi = phiRef.current + pointerInteractionMovement.current;
            },
        });

        return () => {
            globe.destroy();
            window.removeEventListener('resize', onResize);
        };
    }, [focusedLocation]);

    const handleLocationClick = (loc: LocationData) => {
        // Bake the current drag offset into the base rotation
        // This prevents the map from "jumping" or being offset by previous drags when clicking a target
        phiRef.current = phiRef.current + pointerInteractionMovement.current;
        pointerInteractionMovement.current = 0;
        setFocusedLocation(loc);
    };

    return (
        <div className="w-full h-full min-h-[600px] flex items-center justify-center relative overflow-hidden group">

            {/* Holographic Orbits (CSS Animation) */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-[500px] h-[500px] rounded-full border border-primary/20 animate-[spin_20s_linear_infinite]" />
                <div className="w-[700px] h-[700px] rounded-full border border-dashed border-primary/10 animate-[spin_40s_linear_infinite_reverse]" />
            </div>

            {/* Globe Canvas */}
            <canvas
                ref={canvasRef}
                style={{ width: '100%', height: '100%', maxWidth: '800px', aspectRatio: 1 }}
                className="opacity-100 transition-opacity duration-1000 animate-fade-in cursor-grab active:cursor-grabbing relative z-10"
                onPointerDown={(e) => {
                    pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
                    canvasRef.current!.style.cursor = 'grabbing';
                    setFocusedLocation(null); // Release focus on manual drag
                }}
                onPointerUp={() => {
                    pointerInteracting.current = null;
                    canvasRef.current!.style.cursor = 'grab';
                }}
                onPointerOut={() => {
                    pointerInteracting.current = null;
                    canvasRef.current!.style.cursor = 'grab';
                }}
                onMouseMove={(e) => {
                    if (pointerInteracting.current !== null) {
                        const delta = e.clientX - pointerInteracting.current;
                        pointerInteractionMovement.current = delta * 0.005;
                    }
                }}
            />

            {/* Distributor UI Overlay (Left) */}
            <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-12 z-20 flex flex-col gap-3">
                <h3 className="text-lg font-bold text-primary mb-2 uppercase tracking-widest pl-2 border-l-2 border-primary">
                    Active Hubs
                </h3>
                {locations.map((loc) => (
                    <button
                        key={loc.id}
                        onClick={() => handleLocationClick(loc)}
                        className={`text-left px-4 py-3 rounded-xl border backdrop-blur-md transition-all duration-300 w-64 group/item cursor-pointer
                            ${focusedLocation?.id === loc.id
                                ? 'bg-primary/20 border-primary text-white shadow-[0_0_20px_rgba(0,255,100,0.3)] scale-105'
                                : 'bg-black/40 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/30'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">{loc.name}</span>
                            {focusedLocation?.id === loc.id && <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                        </div>
                        {focusedLocation?.id === loc.id && (
                            <div className="mt-2 text-xs text-blue-200 animate-fade-in">
                                {loc.stats.volume} • {loc.region}
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {/* Info Card Overlay (Bottom Right) */}
            {focusedLocation && (
                <Card className="absolute bottom-8 right-8 z-20 w-80 bg-black/60 backdrop-blur-xl border-primary/50 text-white shadow-2xl animate-slide-up">
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">{focusedLocation.name}</h4>
                                <p className="text-sm text-blue-300">{focusedLocation.region}</p>
                            </div>
                        </div>

                        <p className="text-sm text-gray-300 mb-4 leading-relaxed border-b border-white/10 pb-4">
                            {focusedLocation.description}
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-3 rounded-lg">
                                <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                    <Wind className="w-3 h-3" /> Volume
                                </div>
                                <div className="font-bold text-lg">{focusedLocation.stats.volume}</div>
                            </div>
                            <div className="bg-white/5 p-3 rounded-lg">
                                <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                    <Users className="w-3 h-3" /> Partners
                                </div>
                                <div className="font-bold text-lg">{focusedLocation.stats.partners}</div>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">YoY Growth</span>
                            <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border-0">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                {focusedLocation.stats.growth}
                            </Badge>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}
