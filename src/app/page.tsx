/* eslint-disable @next/next/no-img-element */
'use client';

import {useState} from "react";
import {useProfileQuery} from "@/entities/profile";
import {SignOutButton} from "@/features/auth";
import dynamic from "next/dynamic";
import {PatientCard} from "@/shared/ui/PatientCard";
import {PatientCasesList, PatientList} from "@/features/patient";
import {Patient, PatientCase} from "@/shared/api/patientApi";
import {UiModal} from "@/shared/ui/UiModal";
import {Button} from "@/shared/ui/Button";
import {UploadDicomForm} from "@/features/case/ui/uploadDicomForm";

const DicomViewer = dynamic(
    () => import("@/shared/ui/DicomViewer"),
    {ssr: false}
);

export default function DentalImplantDashboard() {

    const profileQuery = useProfileQuery();
    const profileInfo = profileQuery?.data;

    // Selected patient state
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [selectedCase, setSelectedCase] = useState<PatientCase | null>(null);

    // Search term for filtering patients
    const [searchTerm, setSearchTerm] = useState("");

    // Mobile sidebar state
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

            {/* Header */}
            <header className="bg-white shadow-md sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center gap-2 sm:gap-4">
                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M4 6h16M4 12h16M4 18h16"/>
                            </svg>
                        </button>

                        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                            {/* University Logo */}
                            <div className="flex-shrink-0 hidden sm:block">
                                <img
                                    src="/samgmu-logo.jpg"
                                    alt="СамГМУ"
                                    className="h-12 sm:h-16 lg:h-20 w-auto object-contain"
                                />
                            </div>

                            <div className="min-w-0 flex-1">
                                <h1 className="text-sm sm:text-base lg:text-xl font-bold text-[#000000] font-montserrat truncate">
                                    АРМ врача - Планирование дентальных имплантатов
                                </h1>
                                <p className="text-[#006CB4] text-xs sm:text-sm font-open-sans hidden sm:block">
                                    Система автоматизированного проектирования
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                            <div className="hidden md:flex items-center gap-2">
                                <div
                                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#006CB4] flex items-center justify-center text-white font-bold text-sm sm:text-base">
                                    {profileInfo?.surname?.[0] || 'Д'}
                                </div>
                                <span className="text-[#000000] font-medium text-sm hidden xl:inline">
                                    {profileInfo?.surname} {profileInfo?.name}
                                </span>
                            </div>
                            <SignOutButton/>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                    {/* Mobile Sidebar Overlay */}
                    {isMobileSidebarOpen && (
                        <div
                            className="fixed inset-0 bg-black/50 z-15 lg:hidden"
                            onClick={() => setIsMobileSidebarOpen(false)}
                        />
                    )}

                    {/* Left sidebar - Patient list */}
                    <div className={`
                                    fixed lg:relative inset-y-0 left-0 z-15
                                    w-80 sm:w-96 lg:w-1/4
                                    bg-white/95 lg:bg-white/80 backdrop-blur-sm 
                                    rounded-none lg:rounded-xl 
                                    shadow-2xl lg:shadow-lg 
                                    border-r lg:border 
                                    border-gray-200/50 
                                    p-4
                                    transform transition-transform duration-300 ease-in-out
                                    ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                                    overflow-y-auto
                                    max-h-screen lg:max-h-none
                                    pt-20 lg:pt-4
                                `}>
                        {/* Mobile close button */}
                        <button
                            onClick={() => setIsMobileSidebarOpen(false)}
                            className="lg:hidden absolute top-4 right-4 p-2 rounded-md hover:bg-gray-100"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>

                        <div className="flex items-center justify-between mb-4 pr-10 lg:pr-0">
                            <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                                Список пациентов
                            </h2>
                            <span className="flex items-center text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20"
                                     fill="currentColor">
                                    <path fillRule="evenodd"
                                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                          clipRule="evenodd"/>
                                </svg>
                            </span>
                        </div>

                        {/* Search bar */}
                        <div className="mb-4 relative">
                            <input
                                type="text"
                                placeholder="Поиск (ФИО, дата, диагноз)"
                                className="w-full pl-3 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Patient list */}
                        <PatientList onOpenPatient={(patient) => {
                            setSelectedPatient(patient);
                            setSelectedCase(null);
                            setIsMobileSidebarOpen(false); // Close sidebar on mobile after selection
                        }}/>
                    </div>

                    {/* Main content area */}
                    <div className="flex-1 lg:w-3/4 space-y-4 sm:space-y-6">
                        {/* Patient card */}
                        {selectedPatient && <PatientCard patient={selectedPatient}/>}

                        {/* Appointment list */}
                        {selectedPatient && (
                            <PatientCasesList
                                selectedCase={selectedCase}
                                setSelectedCase={setSelectedCase}
                                idPatient={selectedPatient?.id}
                                onOpenCase={setSelectedCase}
                            />
                        )}

                        {/* CT/MRI Scan Viewer */}
                        {selectedCase && (
                            <div
                                className="bg-gradient-to-r from-white to-gray-50 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200/50">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                                        Снимки КТ
                                    </h2>
                                    {/* Кнопка загрузки КТ */}
                                    <UiModal button={
                                        <Button
                                            variant="secondary"
                                            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                                                 viewBox="0 0 20 20"
                                                 fill="currentColor">
                                                <path fillRule="evenodd"
                                                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                                      clipRule="evenodd"/>
                                            </svg>
                                        </Button>
                                    }>
                                        {({close}) => (
                                            <UploadDicomForm closeModal={close} caseId={selectedCase?.id}/>
                                        )}
                                    </UiModal>
                                </div>
                                <div className="flex items-center justify-center">
                                    <DicomViewer key={selectedCase.id} src={selectedCase.dicom_files}/>
                                </div>
                            </div>
                        )}

                        {/* CAD/CAM Implant Design Section */}
                        {selectedCase && (
                            <div
                                className="bg-gradient-to-r from-white to-gray-50 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200/50">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                                        САПР имплантата
                                    </h2>
                                    {selectedCase.implant_data && (
                                        <span
                                            className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800">
                                            Рассчитано
                                        </span>
                                    )}
                                </div>

                                {/* Заглушка если нет данных */}
                                {!selectedCase.implant_data && (
                                    <div
                                        className="flex flex-col items-center justify-center min-h-[400px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-300 p-8">
                                        <div
                                            className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                                            <svg
                                                className="w-10 h-10 text-blue-600"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                                            Расчеты не выполнены
                                        </h3>
                                        <p className="text-gray-600 text-center max-w-md mb-6">
                                            Параметры имплантата будут автоматически рассчитаны системой на основе
                                            загруженных КТ-снимков
                                        </p>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
                                                 stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                            </svg>
                                            <span>Загрузите данные кт в форму выше</span>
                                        </div>
                                    </div>
                                )}

                                {/* Отображение данных */}
                                {selectedCase.implant_data && (
                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
                                        {/* Calculated Parameters */}
                                        <div
                                            className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200/50 shadow-sm">
                                            <div className="flex items-center mb-4">
                                                <div className="bg-blue-100 p-2 rounded-lg mr-3 flex-shrink-0">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600"
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
                                                <h3 className="text-base sm:text-lg font-medium text-gray-800">
                                                    Рассчитанные параметры
                                                </h3>
                                            </div>
                                            <div className="space-y-3 sm:space-y-4">
                                                {/* График плотности */}
                                                <div className="relative w-full aspect-video">
                                                    <img
                                                        src={selectedCase.implant_data.density_graph}
                                                        alt="График плотности кости"
                                                        className="object-contain"
                                                    />
                                                </div>

                                                {/* Параметры */}
                                                {[
                                                    {
                                                        label: 'Диаметр имплантата:',
                                                        value: `${selectedCase.implant_data.diameter} мм`
                                                    },
                                                    {
                                                        label: 'Длина имплантата:',
                                                        value: `${selectedCase.implant_data.length} мм`
                                                    },
                                                    {
                                                        label: 'Форма резьбы:',
                                                        value: selectedCase.implant_data.thread_shape
                                                    },
                                                    {
                                                        label: 'Шаг резьбы:',
                                                        value: `${selectedCase.implant_data.thread_pitch} мм`
                                                    },
                                                    {
                                                        label: 'Глубина резьбы:',
                                                        value: selectedCase.implant_data.thread_depth
                                                    },
                                                    {label: 'Тип кости:', value: selectedCase.implant_data.bone_type},
                                                    {
                                                        label: 'Плотность по Хаунсфилду:',
                                                        value: `${selectedCase.implant_data.hu_density} HU`
                                                    },
                                                    {
                                                        label: 'Жевательная нагрузка:',
                                                        value: `${selectedCase.implant_data.chewing_load} кгс`
                                                    },
                                                    {
                                                        label: 'Предельное напряжение:',
                                                        value: `${selectedCase.implant_data.limit_stress} кг/мм²`
                                                    },
                                                    {
                                                        label: 'Площадь поверхности резьбы:',
                                                        value: `${selectedCase.implant_data.surface_area} мм²`
                                                    }
                                                ].map((param, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2 pb-3 border-b border-gray-100 last:border-0"
                                                    >
                                                        <span className="text-xs sm:text-sm text-gray-600">
                                                            {param.label}
                                                        </span>
                                                        <span
                                                            className="font-semibold text-sm sm:text-base text-gray-800 bg-blue-50 px-2 sm:px-3 py-1 rounded-full inline-block w-fit">
                                                            {param.value}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Visualization Area */}
                                        <div
                                            className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200/50 shadow-sm">
                                            <div className="flex items-center mb-4">
                                                <div
                                                    className="bg-blue-100 text-blue-800 p-2 rounded-lg mr-3 flex-shrink-0">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5 sm:h-6 sm:w-6"
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
                                                <h3 className="text-base sm:text-lg font-medium text-gray-800">
                                                    Визуализация имплантата
                                                </h3>
                                            </div>
                                            <div
                                                className="bg-gradient-to-br border-2 border-dashed border-gray-700/50 rounded-xl w-full h-64 sm:h-96 lg:h-[500px] flex items-center justify-center relative overflow-hidden">
                                                <div className="flex w-full h-full justify-center items-center">
                                                    <img
                                                        src={selectedCase.implant_data.visualization_image}
                                                        alt="Визуализация имплантата"
                                                        className="object-contain p-4"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Welcome screen */}
                        {!selectedPatient && (
                            <div
                                className="bg-gradient-to-br from-white to-blue-50 p-6 sm:p-10 rounded-xl shadow-lg text-center border border-gray-200/50">
                                <div className="max-w-md mx-auto">
                                    <div
                                        className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                             className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" fill="none"
                                             viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                                        </svg>
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">
                                        Добро пожаловать в систему планирования имплантатов
                                    </h2>
                                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                                        Выберите пациента из списка слева для начала работы. Система
                                        автоматически рассчитает оптимальные параметры дентального
                                        имплантата на основе данных компьютерной томографии.
                                    </p>
                                    <button
                                        onClick={() => setIsMobileSidebarOpen(true)}
                                        className="lg:hidden inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <span>Открыть список пациентов</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1"
                                             viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd"
                                                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                                                  clipRule="evenodd"/>
                                        </svg>
                                    </button>
                                    <div className="hidden lg:inline-flex items-center text-blue-600 font-medium">
                                        <span>Выберите пациента</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 animate-pulse"
                                             viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd"
                                                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                                                  clipRule="evenodd"/>
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