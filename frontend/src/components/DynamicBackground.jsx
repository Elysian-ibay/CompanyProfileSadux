import React, { useEffect, useRef } from 'react';

const DynamicBackground = ({ style = 'galaxy' }) => {

    // 1. Galaxy (Original)
    const Galaxy = () => {
        const canvasRef = useRef(null);
        useEffect(() => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            let animationFrameId;

            const resizeCanvas = () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            };

            window.addEventListener('resize', resizeCanvas);
            resizeCanvas();

            const stars = Array.from({ length: 200 }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2,
                alpha: Math.random(),
                speed: Math.random() * 0.5,
            }));

            const animate = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = 'black';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                stars.forEach((star) => {
                    ctx.beginPath();
                    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
                    ctx.fill();
                    star.y -= star.speed;
                    if (star.y < 0) star.y = canvas.height;
                });

                animationFrameId = requestAnimationFrame(animate);
            };

            animate();
            return () => {
                window.removeEventListener('resize', resizeCanvas);
                cancelAnimationFrame(animationFrameId);
            };
        }, []);
        return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full -z-50" />;
    };

    // 2. Starry Night (Deep Blue)
    const StarryNight = () => (
        <div className="fixed inset-0 w-full h-full -z-50 bg-[#0f172a]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-[#0f172a] to-black opacity-80" />
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '50px 50px', opacity: 0.2 }}></div>
        </div>
    );

    // 3. Clouds (Twilight/Senja - 3D Canvas Version)
    const Clouds = () => {
        const canvasRef = useRef(null);
        useEffect(() => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            let animationFrameId;

            const resizeCanvas = () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            };
            window.addEventListener('resize', resizeCanvas);
            resizeCanvas();

            // Cloud Particles for Twilight
            // More particles, slightly tinted to reflect the twilight
            const cloudLayers = [
                { count: 12, speed: 0.1, minR: 120, maxR: 250, opacity: 0.15 }, // Far/Slow/Big background clouds
                { count: 15, speed: 0.25, minR: 60, maxR: 120, opacity: 0.3 },  // Mid clouds
                { count: 6, speed: 0.5, minR: 30, maxR: 70, opacity: 0.5 },   // Near/Fast/Small wisps
            ];

            const particles = [];
            cloudLayers.forEach(layer => {
                for (let i = 0; i < layer.count; i++) {
                    particles.push({
                        x: Math.random() * canvas.width,
                        y: Math.random() * (canvas.height * 0.7), // Concentrate in upper sky
                        radius: Math.random() * (layer.maxR - layer.minR) + layer.minR,
                        speed: layer.speed * (Math.random() * 0.5 + 0.8),
                        baseOpacity: layer.opacity
                    });
                }
            });

            const animate = () => {
                // Background Gradient: Twilight (Purple -> Orange -> Deep Blue)
                const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
                gradient.addColorStop(0, '#4c1d95'); // Deep Violet (Top)
                gradient.addColorStop(0.4, '#a855f7'); // Purple
                gradient.addColorStop(0.7, '#f97316'); // Orange (Sunset Horizon)
                gradient.addColorStop(1, '#fbcfe8'); // Pinkish glow (Bottom)
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Setting Sun Glow (Horizon)
                const sunGrad = ctx.createRadialGradient(canvas.width / 2, canvas.height * 0.7, 50, canvas.width / 2, canvas.height * 0.7, 400);
                sunGrad.addColorStop(0, 'rgba(255, 200, 100, 0.4)');
                sunGrad.addColorStop(1, 'rgba(255, 100, 50, 0)');
                ctx.fillStyle = sunGrad;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                particles.forEach((p) => {
                    ctx.beginPath();
                    // Clouds are slightly tinted purple/pink to match the ambient light
                    const cloudGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
                    cloudGrad.addColorStop(0, `rgba(255, 240, 245, ${p.baseOpacity})`); // Slightly pinkish white
                    cloudGrad.addColorStop(1, 'rgba(255, 240, 245, 0)');
                    ctx.fillStyle = cloudGrad;
                    ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
                    ctx.fill();

                    p.x += p.speed;
                    if (p.x - p.radius * 2 > canvas.width) {
                        p.x = -p.radius * 2;
                        p.y = Math.random() * (canvas.height * 0.7);
                    }
                });
                animationFrameId = requestAnimationFrame(animate);
            };
            animate();
            return () => {
                window.removeEventListener('resize', resizeCanvas);
                cancelAnimationFrame(animationFrameId);
            };
        }, []);
        return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full -z-50" />;
    };

    // 4. Sunset Vibes (Warm)
    const SunsetVibes = () => (
        <div className="fixed inset-0 w-full h-full -z-50 bg-gradient-to-b from-indigo-900 via-purple-800 to-orange-500">
            <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
    );

    // 5. Neon Grid (Cyberpunk)
    const NeonGrid = () => (
        <div className="fixed inset-0 w-full h-full -z-50 bg-gray-900 perspective-1000">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-cyan-500/10"></div>
        </div>
    );

    // 6. Floating Bubbles
    const FloatingBubbles = () => (
        <div className="fixed inset-0 w-full h-full -z-50 bg-gradient-to-br from-blue-900 to-purple-900 overflow-hidden">
            {[...Array(15)].map((_, i) => (
                <div
                    key={i}
                    className="absolute rounded-full bg-white/10 backdrop-blur-sm animate-float"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        width: `${Math.random() * 100 + 50}px`,
                        height: `${Math.random() * 100 + 50}px`,
                        animationDuration: `${Math.random() * 10 + 10}s`,
                        animationDelay: `${Math.random() * 5}s`
                    }}
                />
            ))}
        </div>
    );
    // 7. Geometric Shapes
    const GeometricShapes = () => (
        <div className="fixed inset-0 w-full h-full -z-50 bg-slate-900 overflow-hidden">
            {[...Array(6)].map((_, i) => (
                <div
                    key={i}
                    className="absolute border border-white/10 rotate-45"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        width: '200px',
                        height: '200px',
                    }}
                />
            ))}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-transparent" />
        </div>
    );

    // 8. Soft Gradient (Elegant)
    const SoftGradient = () => (
        <div className="fixed inset-0 w-full h-full -z-50 bg-gradient-to-tr from-[#240b36] via-[#c31432] to-[#240b36] opacity-90" />
    );

    // 9. Aurora (Northern Lights)
    const Aurora = () => (
        <div className="fixed inset-0 w-full h-full -z-50 bg-black">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-green-500/20 via-blue-500/20 to-purple-500/20 blur-[100px] animate-pulse-slow" />
        </div>
    );

    // 10. Minimal Dark (Clean)
    const MinimalDark = () => (
        <div className="fixed inset-0 w-full h-full -z-50 bg-neutral-900">
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
        </div>
    );

    // 11. Snowfall (Christmas/Winter)
    const Snowfall = () => (
        <div className="fixed inset-0 w-full h-full -z-50 bg-[#0b1120] overflow-hidden">
            {[...Array(50)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-2 h-2 bg-white rounded-full opacity-0 animate-snowfall"
                    style={{
                        left: `${Math.random() * 100}%`,
                        animationDuration: `${Math.random() * 5 + 5}s`,
                        animationDelay: `${Math.random() * 5}s`,
                        width: `${Math.random() * 4}px`,
                        height: `${Math.random() * 4}px`
                    }}
                />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120] to-transparent opacity-80" />
        </div>
    );

    // 12. Fireflies (Forest)
    const Fireflies = () => (
        <div className="fixed inset-0 w-full h-full -z-50 bg-[#051a12] overflow-hidden">
            {[...Array(30)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-float blur-[1px]"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDuration: `${Math.random() * 10 + 10}s`,
                        animationDelay: `${Math.random() * 5}s`,
                        boxShadow: '0 0 10px 2px rgba(255, 255, 0, 0.5)'
                    }}
                />
            ))}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
        </div>
    );

    // 13. Digital Rain (Matrix style)
    const DigitalRain = () => {
        const canvasRef = useRef(null);
        useEffect(() => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            let animationFrameId;

            const resizeCanvas = () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            };
            window.addEventListener('resize', resizeCanvas);
            resizeCanvas();

            const columns = Math.floor(canvas.width / 20);
            const drops = Array(columns).fill(1);

            const animate = () => {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.fillStyle = '#0F0';
                ctx.font = '15px monospace';

                for (let i = 0; i < drops.length; i++) {
                    const text = String.fromCharCode(Math.floor(Math.random() * 128));
                    ctx.fillText(text, i * 20, drops[i] * 20);

                    if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
                        drops[i] = 0;
                    }
                    drops[i]++;
                }
                animationFrameId = requestAnimationFrame(animate);
            };
            animate();
            return () => {
                window.removeEventListener('resize', resizeCanvas);
                cancelAnimationFrame(animationFrameId);
            };
        }, []);
        return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full -z-50 bg-black" />;
    };

    // 14. Shooting Stars
    const ShootingStars = () => (
        <div className="fixed inset-0 w-full h-full -z-50 bg-[#020617] overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            {[...Array(10)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-[2px] h-[2px] bg-white rounded-full animate-pulse"
                    style={{
                        top: `${Math.random() * 50}%`,
                        left: `${Math.random() * 100}%`,
                        boxShadow: `0 0 0 4px rgba(255,255,255,0.1), 0 0 0 8px rgba(255,255,255,0.1), 0 0 20px rgba(255,255,255,1)`
                    }}
                />
            ))}
        </div>
    );

    // 15. Animated Gradient Waves
    const GradientWaves = () => (
        <div className="fixed inset-0 w-full h-full -z-50 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 animate-gradient-xy opacity-80 mix-blend-multiply">
            <div className="absolute inset-0 bg-black/50" />
        </div>
    );

    // 16. Sunny Clouds (3D Parallax Canvas Version)
    const SunnyClouds = () => {
        const canvasRef = useRef(null);
        useEffect(() => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            let animationFrameId;

            const resizeCanvas = () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            };
            window.addEventListener('resize', resizeCanvas);
            resizeCanvas();

            // Create multiple layers of clouds for 3D parallax effect
            const cloudLayers = [
                { count: 12, speed: 0.15, minR: 120, maxR: 250, opacity: 0.2 }, // Far/Slow/Big background clouds
                { count: 18, speed: 0.35, minR: 60, maxR: 120, opacity: 0.4 },  // Mid clouds
                { count: 8, speed: 0.7, minR: 30, maxR: 70, opacity: 0.6 },   // Near/Fast/Small wisps
            ];

            const clouds = [];
            cloudLayers.forEach(layer => {
                for (let i = 0; i < layer.count; i++) {
                    clouds.push({
                        x: Math.random() * canvas.width,
                        y: Math.random() * (canvas.height * 0.8), // Keep mostly in sky area
                        radius: Math.random() * (layer.maxR - layer.minR) + layer.minR,
                        speed: layer.speed * (Math.random() * 0.5 + 0.8), // Speed variation
                        baseOpacity: layer.opacity
                    });
                }
            });

            const animate = () => {
                // Sky Gradient
                const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
                skyGrad.addColorStop(0, '#0ea5e9'); // sky-500 deep blue top
                skyGrad.addColorStop(1, '#bae6fd'); // sky-200 brighter bottom horizon
                ctx.fillStyle = skyGrad;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Sun
                const sunX = canvas.width - 120;
                const sunY = 120;
                const sunGrad = ctx.createRadialGradient(sunX, sunY, 20, sunX, sunY, 150);
                sunGrad.addColorStop(0, 'rgba(255, 255, 220, 1)');     // White-hot center
                sunGrad.addColorStop(0.2, 'rgba(255, 230, 100, 0.8)'); // Yellow core
                sunGrad.addColorStop(0.5, 'rgba(255, 200, 0, 0.3)');   // Orange-ish glow
                sunGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');     // Fade out
                ctx.fillStyle = sunGrad;
                ctx.beginPath();
                ctx.arc(sunX, sunY, 150, 0, Math.PI * 2);
                ctx.fill();

                // Draw Clouds
                clouds.forEach(c => {
                    // Soft puff technique
                    const cloudGrad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.radius);
                    cloudGrad.addColorStop(0, `rgba(255, 255, 255, ${c.baseOpacity})`);
                    cloudGrad.addColorStop(0.8, `rgba(255, 255, 255, ${c.baseOpacity * 0.1})`);
                    cloudGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

                    ctx.fillStyle = cloudGrad;
                    ctx.beginPath();
                    ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
                    ctx.fill();

                    // Movement
                    c.x += c.speed;
                    // Reset Loop to left side
                    if (c.x - c.radius > canvas.width) {
                        c.x = -c.radius * 2;
                        c.y = Math.random() * (canvas.height * 0.8);
                    }
                });

                animationFrameId = requestAnimationFrame(animate);
            };
            animate();

            return () => {
                window.removeEventListener('resize', resizeCanvas);
                cancelAnimationFrame(animationFrameId);
            };
        }, []);
        return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full -z-50" />;
    };

    switch (style) {
        case 'starry_night': return <StarryNight />;
        case 'clouds': return <Clouds />;
        case 'sunny_clouds': return <SunnyClouds />;
        case 'sunset_vibes': return <SunsetVibes />;
        case 'neon_grid': return <NeonGrid />;
        case 'floating_bubbles': return <FloatingBubbles />;
        case 'geometric_shapes': return <GeometricShapes />;
        case 'soft_gradient': return <SoftGradient />;
        case 'aurora': return <Aurora />;
        case 'minimal_dark': return <MinimalDark />;
        case 'snowfall': return <Snowfall />;
        case 'fireflies': return <Fireflies />;
        case 'digital_rain': return <DigitalRain />;
        case 'shooting_stars': return <ShootingStars />;
        case 'gradient_waves': return <GradientWaves />;
        case 'galaxy':
        default: return <Galaxy />;
    }
};

export default DynamicBackground;
