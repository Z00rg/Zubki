"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
    src: string;
}

/**
 * Упрощённая версия DICOM Viewer без cornerstone-tools
 * Использует только cornerstone-core для базового отображения
 */
export default function DicomViewerSimple({ src }: Props) {
    const elementRef = useRef<HTMLDivElement | null>(null);
    const cornerstoneRef = useRef<any>(null);

    const [imageIds, setImageIds] = useState<string[]>([]);
    const [index, setIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Состояние для ручного управления яркостью/контрастом
    const [windowWidth, setWindowWidth] = useState(0);
    const [windowCenter, setWindowCenter] = useState(0);

    /* ---------------------------------------------
       Init Cornerstone (без tools)
    --------------------------------------------- */
    useEffect(() => {
        let mounted = true;

        async function init() {
            if (!elementRef.current) return;

            try {
                const [cornerstone, dicomParser, wadoLoader] = await Promise.all([
                    import("cornerstone-core"),
                    import("dicom-parser"),
                    import("cornerstone-wado-image-loader")
                ]);

                if (!mounted) return;

                const cs = cornerstone.default || cornerstone;
                const parser = dicomParser.default || dicomParser;
                const loader = wadoLoader.default || wadoLoader;

                cornerstoneRef.current = cs;

                // Настройка загрузчика
                loader.external.cornerstone = cs;
                loader.external.dicomParser = parser;
                loader.configure({
                    useWebWorkers: false,
                    decodeConfig: {
                        convertFloatPixelDataToInt: false
                    }
                });

                const element = elementRef.current;
                if (!element) return;

                cs.enable(element);
                console.log("✅ Cornerstone инициализирован (без tools)");

            } catch (err) {
                console.error("❌ Ошибка инициализации:", err);
                setError("Ошибка инициализации библиотеки");
            }
        }

        init();

        return () => {
            mounted = false;
            const cs = cornerstoneRef.current;
            const el = elementRef.current;
            if (cs && el) {
                try {
                    cs.disable(el);
                } catch (e) {
                    console.warn("Ошибка отключения:", e);
                }
            }
        };
    }, []);

    /* ---------------------------------------------
       Load DICOM list
    --------------------------------------------- */
    useEffect(() => {
        async function loadImages() {
            setIsLoading(true);
            setError(null);

            try {
                const res = await fetch(`/api/list-dicom?path=${encodeURIComponent(src)}`);

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();

                if (!data || !Array.isArray(data) || data.length === 0) {
                    throw new Error("DICOM файлы не найдены");
                }

                const origin = window.location.origin;
                const ids = data.map((file: string) => {
                    const fileName = file.endsWith('.dcm') ? file : `${file}.dcm`;
                    return `wadouri:${origin}${src}/${fileName}`;
                });

                console.log(`📁 Найдено ${ids.length} файлов`);
                setImageIds(ids);
                setIndex(0);
                setIsLoading(false);
            } catch (err) {
                console.error("❌ Ошибка загрузки:", err);
                setError(err instanceof Error ? err.message : "Ошибка загрузки");
                setIsLoading(false);
            }
        }

        loadImages();
    }, [src]);

    /* ---------------------------------------------
       Display image
    --------------------------------------------- */
    useEffect(() => {
        const cs = cornerstoneRef.current;
        const element = elementRef.current;

        if (!cs || !element || !imageIds.length) return;

        let mounted = true;

        cs.loadAndCacheImage(imageIds[index])
            .then((image: any) => {
                if (mounted) {
                    // Получаем оригинальные значения окна
                    const viewport = cs.getDefaultViewportForImage(element, image);

                    // Устанавливаем значения для слайдеров
                    if (windowWidth === 0) {
                        setWindowWidth(viewport.voi.windowWidth);
                        setWindowCenter(viewport.voi.windowCenter);
                    }

                    cs.displayImage(element, image);
                    console.log(`🖼️ Срез ${index + 1}/${imageIds.length}`);
                }
            })
            .catch((err: Error) => {
                console.error("❌ Ошибка загрузки изображения:", err);
                setError(`Ошибка загрузки среза ${index + 1}`);
            });

        return () => {
            mounted = false;
        };
    }, [imageIds, index, windowWidth]);

    /* ---------------------------------------------
       Manual window adjustment
    --------------------------------------------- */
    useEffect(() => {
        const cs = cornerstoneRef.current;
        const element = elementRef.current;

        if (!cs || !element || windowWidth === 0) return;

        try {
            const viewport = cs.getViewport(element);
            if (viewport) {
                viewport.voi.windowWidth = windowWidth;
                viewport.voi.windowCenter = windowCenter;
                cs.setViewport(element, viewport);
            }
        } catch (err) {
            console.error("Ошибка установки viewport:", err);
        }
    }, [windowWidth, windowCenter]);

    /* ---------------------------------------------
       Mouse wheel navigation
    --------------------------------------------- */
    useEffect(() => {
        const el = elementRef.current;
        if (!el) return;

        function onWheel(e: WheelEvent) {
            e.preventDefault();
            if (e.deltaY > 0) {
                setIndex((i) => Math.min(i + 1, imageIds.length - 1));
            } else {
                setIndex((i) => Math.max(i - 1, 0));
            }
        }

        el.addEventListener("wheel", onWheel, { passive: false });
        return () => el.removeEventListener("wheel", onWheel);
    }, [imageIds.length]);

    /* ---------------------------------------------
       Keyboard navigation
    --------------------------------------------- */
    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            if (!imageIds.length) return;

            if (e.key === "ArrowUp" || e.key === "ArrowRight") {
                e.preventDefault();
                setIndex((i) => Math.min(i + 1, imageIds.length - 1));
            } else if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
                e.preventDefault();
                setIndex((i) => Math.max(i - 1, 0));
            } else if (e.key === "Home") {
                e.preventDefault();
                setIndex(0);
            } else if (e.key === "End") {
                e.preventDefault();
                setIndex(imageIds.length - 1);
            }
        }

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [imageIds.length]);

    /* ---------------------------------------------
       Render
    --------------------------------------------- */
    return (
        <div className="flex flex-col gap-4">
            {/* Viewport */}
            <div className="flex justify-center">
                <div
                    ref={elementRef}
                    className="w-124 h-124 bg-black select-none border border-gray-700 rounded-lg overflow-hidden"
                    style={{ imageRendering: 'pixelated' }}
                />

                {/* Loader */}
                {isLoading && (
                    <div className="w-124 h-124 flex items-center justify-center bg-black bg-opacity-70">
                        <div className="text-white text-lg flex flex-col items-center gap-2">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                            <div>Загрузка...</div>
                        </div>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="absolute flex items-center justify-center bg-red-900 bg-opacity-20 p-4">
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md text-center">
                            <div className="font-bold mb-2">Ошибка</div>
                            <div>{error}</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Controls */}
            {imageIds.length > 0 && !error && (
                <div className="flex flex-col gap-4">
                    {/* Slice navigation */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">
                            Срез: {index + 1} / {imageIds.length}
                        </label>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIndex((i) => Math.max(i - 1, 0))}
                                disabled={index === 0}
                                className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                            >
                                ←
                            </button>

                            <input
                                type="range"
                                min="0"
                                max={imageIds.length - 1}
                                value={index}
                                onChange={(e) => setIndex(Number(e.target.value))}
                                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />

                            <button
                                onClick={() => setIndex((i) => Math.min(i + 1, imageIds.length - 1))}
                                disabled={index === imageIds.length - 1}
                                className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                            >
                                →
                            </button>
                        </div>
                    </div>

                    {/* Window Width */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">
                            Контраст: {Math.round(windowWidth)}
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="4000"
                            value={windowWidth}
                            onChange={(e) => setWindowWidth(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
                        />
                    </div>

                    {/* Window Center */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">
                            Яркость: {Math.round(windowCenter)}
                        </label>
                        <input
                            type="range"
                            min="-2000"
                            max="2000"
                            value={windowCenter}
                            onChange={(e) => setWindowCenter(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                        />
                    </div>

                    {/* Reset button */}
                    <button
                        onClick={() => {
                            const cs = cornerstoneRef.current;
                            const element = elementRef.current;
                            if (cs && element) {
                                cs.reset(element);
                                const viewport = cs.getViewport(element);
                                if (viewport) {
                                    setWindowWidth(viewport.voi.windowWidth);
                                    setWindowCenter(viewport.voi.windowCenter);
                                }
                            }
                        }}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                    >
                        Сбросить настройки
                    </button>
                </div>
            )}
        </div>
    );
}