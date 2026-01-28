/* eslint-disable @next/next/no-img-element */
'use client';

import Image from "next/image";
import {useState} from "react";
import {useProfileQuery} from "@/entities/profile";
import {SignOutButton} from "@/features/auth";
import dynamic from "next/dynamic";

// Define types for our data
type Patient = {
    id: number;
    name: string;
    surname: string;
    patronymic: string;
    birth_date: string;
    gender: string;
}

type Appointment = {
    id: number;
    date: string;
}

type ImplantParams = {
    diameter: number;
    length: number;
    threadType: string;
    threadPitch: string;
    threadDepth: string;
    boneDensity: string;
    boneHU: number;
    chewingLoad: number;
    maxStress: number;
    threadArea: number;
}

type CreatePatient = {
    name: string;
    surname: string;
    patronymic: string;
    birth_date: string;
    gender: 0 | 1;
}

type UpdatePatient = Partial<CreatePatient>

const DicomViewer = dynamic(
    () => import("@/shared/ui/DicomViewer"),
    { ssr: false }
);

export default function DentalImplantDashboard() {

    const profileQuery = useProfileQuery();

    const profileInfo = profileQuery?.data;

    // const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);

    // Mock patient data
    const [patients] = useState<Patient[]>([
        {
            id: 1,
            name: "Козлова",
            surname: "Илона",
            patronymic: "Ивановна",
            birth_date: "2001-12-09",
            gender: "Женский",
        },
        {
            id: 2,
            name: "Петрова",
            surname: "Мария",
            patronymic: "Сергеевна",
            birth_date: "2001-10-02",
            gender: "Женский",
        },
    ]);

    // Appointment data
    const [appointment] = useState<Appointment[]>([
        {
            id: 1,
            date: "2025-12-09",
        },
        {
            id: 2,
            date: "2025-10-02",
        },
    ]);

    // Selected patient state
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

    // Selected appointment state
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    // Search term for filtering patients
    const [searchTerm, setSearchTerm] = useState("");

    // Calculated implant parameters
    const [implantParams, setImplantParams] = useState<ImplantParams | null>(
        null
    );

    // Calculate implant parameters based on algorithm
    const calculateImplantParams = () => {
        if (!selectedPatient) return;

        // Mock calculations based on the algorithm described
        const calculatedParams: ImplantParams = {
            diameter: 4.2, // mm
            length: 10.3, // mm
            threadType: "V-образная",
            threadPitch: "1.2 мм",
            threadDepth: "0.35-0.47 мм",
            boneDensity: "Кость D3",
            boneHU: 510,
            chewingLoad: 700, // kgf
            maxStress: 2.79, // kg/mm²
            threadArea: 46.83, // mm²
        };

        setImplantParams(calculatedParams);
    };

    // Filter patients based on search term
    const filteredPatients = patients.filter((patient) => {
        const fullName = `${patient.surname} ${patient.name} ${patient.patronymic}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
    });


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <header className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        {/* University Logo */}
                        <div className="flex items-center">
                            <img
                                src="/samgmu-logo.jpg"
                                alt="Самарский Государственный Медицинский Университет"
                                className="h-20 w-auto object-contain"
                            />
                        </div>

                        <div>
                            <h1 className="text-xl font-bold text-[#000000] font-montserrat">
                                АРМ врача - Планирование дентальных имплантатов
                            </h1>
                            <p className="text-[#006CB4] text-sm font-open-sans">
                                Система автоматизированного проектирования
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <div
                                className="w-10 h-10 rounded-full bg-[#006CB4] flex items-center justify-center text-white font-bold">
                                Д
                            </div>
                            <span
                                className="text-[#000000] font-medium">{profileInfo?.surname} {profileInfo?.name} {profileInfo?.patronymic}</span>
                        </div>
                        <SignOutButton/>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex gap-6">
                    {/* Left sidebar - Patient list with search */}
                    <div
                        className="w-1/4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Список пациентов
                            </h2>
                            <span className="flex items-center text-gray-400">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                              <path
                                  fillRule="evenodd"
                                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                  clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        </div>

                        {/* Search bar */}
                        <div className="mb-4 relative">
                            <input
                                type="text"
                                placeholder="Поиск (ФИО, дата, диагноз)"
                                className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Patient list */}
                        <div className="space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto">
                            {filteredPatients.map((patient) => (
                                <div
                                    key={patient.id}
                                    className={`p-3 border rounded-lg cursor-pointer transition-all duration-200   ${
                                        selectedPatient?.id === patient.id
                                            ? "border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-inner"
                                            : "border-gray-200 hover:bg-gray-50"
                                    }`}
                                    onClick={() => {
                                        setSelectedPatient(patient);
                                        setImplantParams(null); // Reset implant params when changing patient
                                    }}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-medium text-gray-800">
                                            {patient.surname} {patient.name} {patient.patronymic}
                                        </h3>
                                    </div>
                                    <div className="flex justify-between mt-1">
                                        <p className="text-sm text-gray-600">{patient.birth_date}</p>
                                        <span
                                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {patient.gender}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            <div
                                className="flex items-center justify-center p-3 rounded-lg text-4xl font-medium bg-blue-100 text-blue-800 cursor-pointer hover:border hover:border-blue-500 "
                                onClick={() => {
                                    alert("Формочка добавления пациента")
                                }}
                            >
                                +
                            </div>
                        </div>
                    </div>

                    {/* Main content area */}
                    <div className="w-3/4 space-y-6">
                        {/* Patient card */}
                        {selectedPatient && (
                            <div
                                className="bg-gradient-to-r from-white to-gray-50 p-6 rounded-xl shadow-lg border border-gray-200/50">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        Карточка пациента
                                    </h2>
                                    <div className="flex space-x-2">
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="bg-white p-4 rounded-lg border border-gray-200/50 shadow-sm">
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            ФИО
                                        </label>
                                        <p className="mt-1 text-lg font-semibold text-gray-800">
                                            {selectedPatient.surname} {selectedPatient.name} {selectedPatient.patronymic}
                                        </p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border border-gray-200/50 shadow-sm">
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            Дата рождения
                                        </label>
                                        <p className="mt-1 text-lg font-semibold text-gray-800">
                                            {selectedPatient.birth_date}
                                        </p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border border-gray-200/50 shadow-sm">
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            Пол
                                        </label>
                                        <p className="mt-1 text-lg font-semibold text-gray-800">
                                            {selectedPatient.gender}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Appointment list */}
                        {selectedPatient && (
                            <div
                                className="bg-gradient-to-r from-white to-gray-50 p-6 rounded-xl shadow-lg border border-gray-200/50">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        Список приемов
                                    </h2>
                                </div>
                                <div className="grid grid-cols-3 gap-6">
                                    {appointment.map((appoint) => (
                                        <div
                                            key={appoint.id}
                                            className={`p-3 border rounded-lg cursor-pointer transition-all duration-200   ${
                                                selectedAppointment?.id === appoint.id
                                                    ? "border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-inner"
                                                    : "border-gray-200 hover:bg-gray-50"
                                            }`}
                                            onClick={() => {
                                                setSelectedAppointment(appoint);
                                                setImplantParams(null); // Reset implant params when changing patient
                                                calculateImplantParams();
                                            }}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <h3 className="font-medium text-gray-800">
                                                    Прием от {appoint.date}
                                                </h3>
                                            </div>
                                        </div>
                                    ))}
                                    <div
                                        className="flex items-center justify-center p-3 rounded-lg text-4xl font-medium bg-blue-100 text-blue-800 cursor-pointer hover:border hover:border-blue-500 "
                                        onClick={() => {
                                            alert("Формочка добавления приема")
                                        }}
                                    >
                                        +
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* CT/MRI Scan Viewer */}
                        {selectedPatient && implantParams && (
                            <div
                                className="bg-gradient-to-r from-white to-gray-50 p-6 rounded-xl shadow-lg border border-gray-200/50">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        Снимки КТ
                                    </h2>
                                    <div className="flex space-x-2">
                                        <button
                                            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
                                            onClick={() => alert("Формочка загрузки мрт")}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <DicomViewer src="/KT" />
                            </div>
                        )}

                        {/* CAD/CAM Implant Design Section */}
                        {selectedPatient && implantParams && (
                            <div
                                className="bg-gradient-to-r from-white to-gray-50 p-6 rounded-xl shadow-lg border border-gray-200/50">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        САПР имплантата
                                    </h2>
                                    <div className="flex space-x-2">
                                        <span
                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                          Рассчитано
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Calculated Parameters */}
                                    <div className="bg-white p-5 rounded-xl border border-gray-200/50 shadow-sm">
                                        <div className="flex items-center mb-4">
                                            <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-6 w-6 text-blue-600"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                    />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-800">
                                                Рассчитанные параметры
                                            </h3>
                                        </div>
                                        <div className="space-y-4">
                                            <Image
                                                src="/image_5.png"
                                                alt="image_1"
                                                width={350}
                                                height={200}
                                                className="object-scale-down w-full"
                                            ></Image>
                                            <div
                                                className="flex justify-between items-center pb-3 border-b border-gray-100">
                        <span className="text-gray-600">
                          Диаметр имплантата:
                        </span>
                                                <span
                                                    className="font-semibold text-gray-800 bg-blue-50 px-3 py-1 rounded-full">
                          {implantParams.diameter} мм
                        </span>
                                            </div>
                                            <div
                                                className="flex justify-between items-center pb-3 border-b border-gray-100">
                                                <span className="text-gray-600">Длина имплантата:</span>
                                                <span
                                                    className="font-semibold text-gray-800 bg-blue-50 px-3 py-1 rounded-full">
                          {implantParams.length} мм
                        </span>
                                            </div>
                                            <div
                                                className="flex justify-between items-center pb-3 border-b border-gray-100">
                                                <span className="text-gray-600">Форма резьбы:</span>
                                                <span
                                                    className="font-semibold text-gray-800 bg-blue-50 px-3 py-1 rounded-full">
                          {implantParams.threadType}
                        </span>
                                            </div>
                                            <div
                                                className="flex justify-between items-center pb-3 border-b border-gray-100">
                                                <span className="text-gray-600">Шаг резьбы:</span>
                                                <span
                                                    className="font-semibold text-gray-800 bg-blue-50 px-3 py-1 rounded-full">
                          {implantParams.threadPitch}
                        </span>
                                            </div>
                                            <div
                                                className="flex justify-between items-center pb-3 border-b border-gray-100">
                                                <span className="text-gray-600">Глубина резьбы:</span>
                                                <span
                                                    className="font-semibold text-gray-800 bg-blue-50 px-3 py-1 rounded-full">
                          {implantParams.threadDepth}
                        </span>
                                            </div>
                                            <div
                                                className="flex justify-between items-center pb-3 border-b border-gray-100">
                                                <span className="text-gray-600">Плотность кости:</span>
                                                <span
                                                    className="font-semibold text-gray-800 bg-blue-50 px-3 py-1 rounded-full">
                          {implantParams.boneDensity}
                        </span>
                                            </div>
                                            <div
                                                className="flex justify-between items-center pb-3 border-b border-gray-100">
                        <span className="text-gray-600">
                          Плотность по Хаунсфилду:
                        </span>
                                                <span
                                                    className="font-semibold text-gray-800 bg-blue-50 px-3 py-1 rounded-full">
                          {implantParams.boneHU} HU
                        </span>
                                            </div>
                                            <div
                                                className="flex justify-between items-center pb-3 border-b border-gray-100">
                        <span className="text-gray-600">
                          Жевательная нагрузка:
                        </span>
                                                <span
                                                    className="font-semibold text-gray-800 bg-blue-50 px-3 py-1 rounded-full">
                          {implantParams.chewingLoad} кгс
                        </span>
                                            </div>
                                            <div
                                                className="flex justify-between items-center pb-3 border-b border-gray-100">
                        <span className="text-gray-600">
                          Предельное напряжение:
                        </span>
                                                <span
                                                    className="font-semibold text-gray-800 bg-blue-50 px-3 py-1 rounded-full">
                          {implantParams.maxStress} кг/мм²
                        </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                        <span className="text-gray-600">
                          Площадь поверхности резьбы:
                        </span>
                                                <span
                                                    className="font-semibold text-gray-800 bg-blue-50 px-3 py-1 rounded-full">
                          {implantParams.threadArea} мм²
                        </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Visualization Area */}
                                    <div>
                                        <div className="bg-white p-5 rounded-xl border border-gray-200/50 shadow-sm">
                                            <div className="flex items-center mb-4">
                                                <div className="bg-blue-100 text-blue-800 p-2 rounded-lg mr-3">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-6 w-6 "
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                                                        />
                                                    </svg>
                                                </div>
                                                <h3 className="text-lg font-medium text-gray-800">
                                                    Визуализация имплантата
                                                </h3>
                                            </div>
                                            <div
                                                className="bg-gradient-to-br  border-2 border-dashed border-gray-700/50 rounded-xl w-full h-128 flex items-center justify-center relative overflow-hidden">
                                                {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-purple-900/10"></div>
                        <div className="text-center z-10">
                          <div className="text-gray-300 mb-2 text-lg font-medium">
                            3D модель имплантата
                          </div>
                          <div className="text-sm text-gray-400">
                            Сгенерированная по параметрам
                          </div>
                          <div className="mt-4 flex justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                          </div>
                        </div> */}
                                                <Image
                                                    src="/image_6.png"
                                                    alt="image_1"
                                                    width={400}
                                                    height={500}
                                                    className="object-scale-down w-full"
                                                ></Image>
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            {/*<button className="w-full bg-gradient-to-r bg-[#006CB4] hover:bg-[#005A94] text-white py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center">*/}
                                            {/*  <svg*/}
                                            {/*    xmlns="http://www.w3.org/2000/svg"*/}
                                            {/*    className="h-5 w-5 mr-2"*/}
                                            {/*    viewBox="0 0 20 20"*/}
                                            {/*    fill="currentColor"*/}
                                            {/*  >*/}
                                            {/*    <path*/}
                                            {/*      fillRule="evenodd"*/}
                                            {/*      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"*/}
                                            {/*      clipRule="evenodd"*/}
                                            {/*    />*/}
                                            {/*  </svg>*/}
                                            {/*  Экспортировать модель*/}
                                            {/*</button>*/}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!selectedPatient && (
                            <div
                                className="bg-gradient-to-br from-white to-blue-50 p-10 rounded-xl shadow-lg text-center border border-gray-200/50">
                                <div className="max-w-md mx-auto">
                                    <div
                                        className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-10 w-10 text-blue-600"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                            />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-3">
                                        Добро пожаловать в систему планирования имплантатов
                                    </h2>
                                    <p className="text-gray-600 mb-6 leading-relaxed">
                                        Выберите пациента из списка слева для начала работы. Система
                                        автоматически рассчитает оптимальные параметры дентального
                                        имплантата на основе данных компьютерной томографии.
                                    </p>
                                    <div className="inline-flex items-center text-blue-600 font-medium">
                                        <span>Выберите пациента</span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 ml-1 animate-pulse"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
