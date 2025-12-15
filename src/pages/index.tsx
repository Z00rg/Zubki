/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { useState } from "react";

// Define types for our data
interface Patient {
  id: number;
  fullName: string;
  visitDate: string;
  diagnosis: string;
}

interface ImplantParams {
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

const DentalImplantDashboard = () => {
  // Mock patient data
  const [patients] = useState<Patient[]>([
    {
      id: 1,
      fullName: "Козлова Илона Ивановна",
      visitDate: "2025-12-01",
      diagnosis: "Отсутствие зуба 16",
    },
    {
      id: 2,
      fullName: "Петрова Мария Сергеевна",
      visitDate: "2025-12-05",
      diagnosis: "Отсутствие зубов 35, 36",
    },
    {
      id: 3,
      fullName: "Сидоров Алексей Петрович",
      visitDate: "2025-12-10",
      diagnosis: "Периодонтит 24",
    },
    {
      id: 4,
      fullName: "Козлова Екатерина Андреевна",
      visitDate: "2025-12-12",
      diagnosis: "Отсутствие зуба 48",
    },
  ]);

  // Selected patient state
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // CT scan images for patients
  const [ctImages] = useState<string[]>([
    "/image_1.png",
    "/image_2.jpg",
    "/image_3.jpg",
    "/image_4.jpg",
  ]);

  // Currently selected CT image
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
  const filteredPatients = patients.filter(
    (patient) =>
      patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.visitDate.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header with Samara State Medical University logo */}
      <header className="bg-white shadow-md border-b-2 border-[#006CB4]">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* University Logo */}
            <div className="flex items-center">
              <img 
                src="/image.png" 
                alt="Самарский Государственный Медицинский Университет" 
                className="h-12 w-auto object-contain"
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
              <div className="w-10 h-10 rounded-full bg-[#006CB4] flex items-center justify-center text-white font-bold">
                Д
              </div>
              <span className="text-[#000000] font-medium">Доктор Иванов</span>
            </div>
            <button className="bg-[#006CB4] hover:bg-[#005A94] text-white px-4 py-2 rounded-lg text-sm transition-all duration-200">
              Выход
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          {/* Left sidebar - Patient list with search */}
          <div className="w-1/4 bg-white rounded-xl shadow-md border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#000000] font-montserrat">
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
                className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006CB4] focus:border-[#006CB4] transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Patient list */}
            <div className="space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedPatient?.id === patient.id
                      ? "border-[#006CB4] bg-[#E4F0FA] shadow-inner"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    setSelectedPatient(patient);
                    setImplantParams(null); // Reset implant params when changing patient
                  }}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-[#000000]">
                      {patient.fullName}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#006CB4] text-white">
                      #{patient.id}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <p className="text-sm text-gray-600">{patient.visitDate}</p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#3091D1] text-white">
                      {patient.diagnosis}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main content area */}
          <div className="w-3/4 space-y-6">
            {/* Patient card */}
            {selectedPatient && (
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-[#000000] font-montserrat">
                    Карточка пациента
                  </h2>
                  <div className="flex space-x-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#006CB4] text-white">
                      Активен
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <label className="block text-sm font-medium text-gray-600 mb-1 font-open-sans">
                      ФИО
                    </label>
                    <p className="mt-1 text-lg font-semibold text-[#000000] font-open-sans">
                      {selectedPatient.fullName}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <label className="block text-sm font-medium text-gray-600 mb-1 font-open-sans">
                      Дата обращения
                    </label>
                    <p className="mt-1 text-lg font-semibold text-[#000000] font-open-sans">
                      {selectedPatient.visitDate}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <label className="block text-sm font-medium text-gray-600 mb-1 font-open-sans">
                      Диагноз
                    </label>
                    <p className="mt-1 text-lg font-semibold text-[#000000] font-open-sans">
                      {selectedPatient.diagnosis}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <div className="flex space-x-3">
                    <button className="bg-white border border-[#006CB4] text-[#006CB4] px-4 py-2 rounded-lg shadow-sm hover:bg-[#E4F0FA] transition-all duration-200 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Загрузить
                    </button>
                    <button className="bg-white border border-[#006CB4] text-[#006CB4] px-4 py-2 rounded-lg shadow-sm hover:bg-[#E4F0FA] transition-all duration-200 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Сохранить
                    </button>
                  </div>
                  
                  <button
                    onClick={calculateImplantParams}
                    className="bg-[#006CB4] hover:bg-[#005A94] text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Рассчитать параметры имплантата
                  </button>
                </div>
              </div>
            )}

            {/* CT/MRI Scan Viewer */}
            {selectedPatient && (
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-[#000000] font-montserrat">
                    Снимки КТ/МРТ
                  </h2>
                  <div className="flex space-x-2">
                    <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
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

                <div className="flex flex-col md:flex-row gap-6">
                  {/* Image viewer */}
                  <div className="flex-1">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-dashed border-gray-700/50 rounded-xl w-full h-[413px] flex items-center justify-center relative overflow-hidden">
                      {/* Placeholder for CT scan image */}
                      <Image
                        src={ctImages[currentImageIndex]}
                        alt="CT Scan"
                        width={200}
                        height={200}
                        className="object-scale-down w-full max-h-4/5"
                      ></Image>
                    </div>

                    {/* Image selection controls */}
                    <div className="mt-4 flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                      <button
                        className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg disabled:opacity-50 transition-colors duration-200 flex items-center"
                        disabled={currentImageIndex === 0}
                        onClick={() =>
                          setCurrentImageIndex(currentImageIndex - 1)
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Назад
                      </button>

                      <div className="text-sm text-gray-600 font-medium">
                        Снимок {currentImageIndex + 1} из {ctImages.length}
                      </div>

                      <button
                        className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg disabled:opacity-50 transition-colors duration-200 flex items-center"
                        disabled={currentImageIndex === ctImages.length - 1}
                        onClick={() =>
                          setCurrentImageIndex(currentImageIndex + 1)
                        }
                      >
                        Вперед
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Image thumbnails */}
                  <div className="w-32">
                    <h3 className="text-sm font-medium mb-2 text-gray-700 font-open-sans">
                      Все снимки
                    </h3>
                    <div className="space-y-2">
                      {ctImages.map((item, index) => (
                        <div
                          key={index}
                          className={`bg-white border-2 rounded-lg cursor-pointer p-2 shadow-sm transition-all duration-200 ${
                            currentImageIndex === index
                              ? "border-[#006CB4] ring-2 ring-[#E4F0FA] shadow-md"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        >
                          <Image
                            src={item}
                            alt={`CT Scan ${index + 1}`}
                            width={680}
                            height={500}
                          ></Image>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CAD/CAM Implant Design Section */}
            {selectedPatient && implantParams && (
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-[#000000] font-montserrat">
                    САПР имплантата
                  </h2>
                  <div className="flex space-x-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#3091D1] text-white">
                      Рассчитано
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Calculated Parameters */}
                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center mb-4">
                      <div className="bg-[#E4F0FA] p-2 rounded-lg mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-[#006CB4]"
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
                      <h3 className="text-lg font-medium text-[#000000] font-montserrat">
                        Рассчитанные параметры
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                        <span className="text-gray-600 font-open-sans">
                          Диаметр имплантата:
                        </span>
                        <span className="font-semibold text-[#000000] bg-[#E4F0FA] px-3 py-1 rounded-full font-open-sans">
                          {implantParams.diameter} мм
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                        <span className="text-gray-600 font-open-sans">Длина имплантата:</span>
                        <span className="font-semibold text-[#000000] bg-[#E4F0FA] px-3 py-1 rounded-full font-open-sans">
                          {implantParams.length} мм
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                        <span className="text-gray-600 font-open-sans">Форма резьбы:</span>
                        <span className="font-semibold text-[#000000] bg-[#E4F0FA] px-3 py-1 rounded-full font-open-sans">
                          {implantParams.threadType}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                        <span className="text-gray-600 font-open-sans">Шаг резьбы:</span>
                        <span className="font-semibold text-[#000000] bg-[#E4F0FA] px-3 py-1 rounded-full font-open-sans">
                          {implantParams.threadPitch}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                        <span className="text-gray-600 font-open-sans">Глубина резьбы:</span>
                        <span className="font-semibold text-[#000000] bg-[#E4F0FA] px-3 py-1 rounded-full font-open-sans">
                          {implantParams.threadDepth}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                        <span className="text-gray-600 font-open-sans">Плотность кости:</span>
                        <span className="font-semibold text-[#000000] bg-[#E4F0FA] px-3 py-1 rounded-full font-open-sans">
                          {implantParams.boneDensity}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                        <span className="text-gray-600 font-open-sans">
                          Плотность по Хаунсфилду:
                        </span>
                        <span className="font-semibold text-[#000000] bg-[#E4F0FA] px-3 py-1 rounded-full font-open-sans">
                          {implantParams.boneHU} HU
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                        <span className="text-gray-600 font-open-sans">
                          Жевательная нагрузка:
                        </span>
                        <span className="font-semibold text-[#000000] bg-[#E4F0FA] px-3 py-1 rounded-full font-open-sans">
                          {implantParams.chewingLoad} кгс
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                        <span className="text-gray-600 font-open-sans">
                          Предельное напряжение:
                        </span>
                        <span className="font-semibold text-[#000000] bg-[#E4F0FA] px-3 py-1 rounded-full font-open-sans">
                          {implantParams.maxStress} кг/мм²
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-open-sans">
                          Площадь поверхности резьбы:
                        </span>
                        <span className="font-semibold text-[#000000] bg-[#E4F0FA] px-3 py-1 rounded-full font-open-sans">
                          {implantParams.threadArea} мм²
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Visualization Area */}
                  <div>
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                      <div className="flex items-center mb-4">
                        <div className="bg-[#F0F7FC] p-2 rounded-lg mr-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-[#3091D1]"
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
                        <h3 className="text-lg font-medium text-[#000000] font-montserrat">
                          Визуализация имплантата
                        </h3>
                      </div>
                      <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-dashed border-gray-700/50 rounded-xl w-full h-64 flex items-center justify-center relative overflow-hidden">
                        <Image
                          src="/image_5.png"
                          alt="Implant visualization"
                          width={200}
                          height={200}
                          className="object-scale-down w-full"
                        ></Image>
                      </div>
                    </div>

                    <div className="mt-4">
                      <button className="w-full bg-[#006CB4] hover:bg-[#005A94] text-white py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Экспортировать модель
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!selectedPatient && (
              <div className="bg-white p-10 rounded-xl shadow-md text-center border border-gray-200">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-[#E4F0FA] rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-[#006CB4]"
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
                  <h2 className="text-2xl font-bold text-[#000000] mb-3 font-montserrat">
                    Добро пожаловать в систему планирования имплантатов
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed font-open-sans">
                    Выберите пациента из списка слева для начала работы. Система
                    автоматически рассчитает оптимальные параметры дентального
                    имплантата на основе данных компьютерной томографии.
                  </p>
                  <div className="inline-flex items-center text-[#006CB4] font-medium font-open-sans">
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

export default DentalImplantDashboard;
