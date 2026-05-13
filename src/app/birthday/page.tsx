'use client'

import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';

export default function BirthdayPage() {
    // 0 - закрыто, 1 - письмо открыто, 2 - показан сертификат
    const [step, setStep] = useState(0);

    const handleInteraction = () => {
        if (step < 2) {
            setStep(step + 1);
        }
    };

    return (
        <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4 font-sans overflow-hidden">
            <Head>
                <title>С Днем Рождения, Мама!</title>
            </Head>

            <div
                className="relative w-full max-w-md aspect-[4/3] cursor-pointer"
                style={{ perspective: '1200px' }}
                onClick={handleInteraction}
            >
                {/* Конверт */}
                <div className={`relative w-full h-full transition-all duration-1000 ease-in-out ${step > 0 ? 'translate-y-32 scale-95' : ''}`}>

                    {/* Задняя часть конверта */}
                    <div className="absolute inset-0 bg-pink-200 shadow-xl rounded-lg border-2 border-pink-300">
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                            {/* Верхний клапан */}
                            <div className="absolute top-0 left-0 w-full h-1/2 bg-pink-100 origin-top transform transition-transform duration-700 z-40"
                                 style={{
                                     clipPath: 'polygon(0 0, 50% 50%, 100% 0)',
                                     transform: step > 0 ? 'rotateX(180deg)' : 'rotateX(0deg)',
                                     backfaceVisibility: 'hidden'
                                 }}
                            />
                        </div>
                    </div>

                    {/* Письмо с поздравлением */}
                    <div className={`absolute inset-x-4 bottom-10 bg-white p-6 shadow-md rounded-lg transition-all duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1) z-10 
                        ${step === 1 ? '-translate-y-72 scale-105 opacity-100' : step === 2 ? '-translate-y-96 opacity-0 scale-50' : 'translate-y-0 opacity-0'}`}>
                        <h1 className="text-xl md:text-2xl font-serif text-pink-600 mb-4 text-center">С Днем Рождения, Мамочка! 🌸</h1>
                        <div className="text-gray-700 leading-relaxed text-center space-y-3 text-sm md:text-base">
                            <p>Любимая моя мама! Желаю тебе бесконечного счастья, тепла и улыбок.</p>
                            <p>Пусть каждый день радует тебя приятными сюрпризами.</p>
                            <p>Чтобы каждый день твой был самым лучшим, чтобы тебя радовал наш Махоня!)</p>
                            <p className="font-semibold text-pink-500 pt-1 text-lg">Люблю тебя, мамуль ❤️❤️❤️</p>
                            <div className="pt-4">
                                <span className="inline-block px-4 py-1 bg-pink-50 border border-pink-100 rounded-full text-xs text-pink-400 animate-pulse">
                                    Нажми еще раз для подарка
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Сертификат */}
                    <div className={`absolute inset-0 transition-all duration-1000 ease-out z-50 
                        ${step === 2 ? 'opacity-100 scale-110 md:scale-125 -translate-y-48' : 'opacity-0 scale-50 pointer-events-none'}`}>
                        <div className="relative w-full aspect-[1/1] shadow-2xl rounded-xl overflow-hidden border-4 border-white transform hover:scale-105 transition-transform">
                            <Image
                                src="/certificate.jpg"
                                alt="Подарочный сертификат"
                                fill
                                className="object-contain bg-white"
                                priority
                            />
                        </div>
                        <p className="text-center mt-6 text-pink-600 font-bold text-2xl animate-bounce drop-shadow-md">
                            ❤️❤️️❤️❤️❤️
                        </p>
                    </div>

                    {/* Передние грани конверта (визуальный объем) */}
                    <div className="absolute inset-0 bg-pink-200 z-30 shadow-[inset_0_-10px_20px_rgba(0,0,0,0.05)]" style={{ clipPath: 'polygon(0 100%, 50% 50%, 100% 100%)' }} />
                    <div className="absolute inset-0 bg-pink-100 z-30" style={{ clipPath: 'polygon(0 0, 0 100%, 50% 50%)' }} />
                    <div className="absolute inset-0 bg-pink-100 z-30" style={{ clipPath: 'polygon(100% 0, 100% 100%, 50% 50%)' }} />
                </div>

                {/* Подсказка в начале */}
                {step === 0 && (
                    <div className="absolute -bottom-20 left-0 w-full text-center">
                        <div className="bg-white/80 backdrop-blur px-6 py-2 rounded-full inline-block shadow-sm border border-pink-100 text-pink-500 animate-bounce font-medium">
                            Открыть конверт ✨
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}