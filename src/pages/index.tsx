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
      fullName: "Иванов Иван Иванович",
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
    "/placeholder-ct1.jpg",
    "/placeholder-ct2.jpg",
    "/placeholder-ct3.jpg",
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
      threadPitch: "0.7..1.2 мм",
      threadDepth: "0.3-0.6 мм",
      boneDensity: "Кость D3",
      boneHU: 720,
      chewingLoad: 700, // kgf
      maxStress: 4.18, // kg/mm²
      threadArea: 32.5, // mm²
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            АРМ врача - Планирование дентальных имплантатов
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Доктор Иванов</span>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
              Выход
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          {/* Left sidebar - Patient list with search */}
          <div className="w-1/4 bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Список пациентов</h2>

            {/* Search bar */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Поиск (ФИО, дата, диагноз)"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Patient list */}
            <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className={`p-3 border rounded-md cursor-pointer ${
                    selectedPatient?.id === patient.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    setSelectedPatient(patient);
                    setImplantParams(null); // Reset implant params when changing patient
                  }}
                >
                  <h3 className="font-medium">{patient.fullName}</h3>
                  <p className="text-sm text-gray-600">{patient.visitDate}</p>
                  <p className="text-sm text-gray-800 truncate">
                    {patient.diagnosis}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Main content area */}
          <div className="w-3/4 space-y-6">
            {/* Patient card */}
            {selectedPatient && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">
                  Карточка пациента
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      ФИО
                    </label>
                    <p className="mt-1 text-lg font-medium">
                      {selectedPatient.fullName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Дата обращения
                    </label>
                    <p className="mt-1 text-lg font-medium">
                      {selectedPatient.visitDate}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Диагноз
                    </label>
                    <p className="mt-1 text-lg font-medium">
                      {selectedPatient.diagnosis}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    onClick={calculateImplantParams}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                  >
                    Рассчитать параметры имплантата
                  </button>
                </div>
              </div>
            )}

            {/* CT/MRI Scan Viewer */}
            {selectedPatient && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Снимки КТ/МРТ</h2>

                <div className="flex flex-col md:flex-row gap-6">
                  {/* Image viewer */}
                  <div className="flex-1">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-96 flex items-center justify-center">
                      {/* Placeholder for CT scan image */}
                      <div className="text-center">
                        <div className="text-gray-500 mb-2">Снимок КТ/МРТ</div>
                        <div className="text-sm text-gray-400">
                          Пациент: {selectedPatient.fullName}
                        </div>
                      </div>
                    </div>

                    {/* Image selection controls */}
                    <div className="mt-4 flex justify-between items-center">
                      <button
                        className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
                        disabled={currentImageIndex === 0}
                        onClick={() =>
                          setCurrentImageIndex(currentImageIndex - 1)
                        }
                      >
                        Назад
                      </button>

                      <div className="text-sm text-gray-600">
                        Снимок {currentImageIndex + 1} из {ctImages.length}
                      </div>

                      <button
                        className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
                        disabled={currentImageIndex === ctImages.length - 1}
                        onClick={() =>
                          setCurrentImageIndex(currentImageIndex + 1)
                        }
                      >
                        Вперед
                      </button>
                    </div>
                  </div>

                  {/* Image thumbnails */}
                  <div className="w-32">
                    <h3 className="text-sm font-medium mb-2">Все снимки</h3>
                    <div className="space-y-2">
                      {ctImages.map((_, index) => (
                        <div
                          key={index}
                          className={`bg-gray-100 border rounded cursor-pointer p-2 ${
                            currentImageIndex === index
                              ? "border-blue-500 ring-2 ring-blue-200"
                              : ""
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        >
                          <div className="bg-gray-200 border-2 border-dashed rounded w-full h-16 flex items-center justify-center text-xs">
                            Снимок {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CAD/CAM Implant Design Section */}
            {selectedPatient && implantParams && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">САПР имплантата</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Calculated Parameters */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">
                      Рассчитанные параметры
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">
                          Диаметр имплантата:
                        </span>
                        <span className="font-medium">
                          {implantParams.diameter} мм
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Длина имплантата:</span>
                        <span className="font-medium">
                          {implantParams.length} мм
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Форма резьбы:</span>
                        <span className="font-medium">
                          {implantParams.threadType}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Шаг резьбы:</span>
                        <span className="font-medium">
                          {implantParams.threadPitch}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Глубина резьбы:</span>
                        <span className="font-medium">
                          {implantParams.threadDepth}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Плотность кости:</span>
                        <span className="font-medium">
                          {implantParams.boneDensity}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">
                          Плотность по Хаунсфилду:
                        </span>
                        <span className="font-medium">
                          {implantParams.boneHU} HU
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">
                          Жевательная нагрузка:
                        </span>
                        <span className="font-medium">
                          {implantParams.chewingLoad} кгс
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">
                          Предельное напряжение:
                        </span>
                        <span className="font-medium">
                          {implantParams.maxStress} кг/мм²
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">
                          Площадь поверхности резьбы:
                        </span>
                        <span className="font-medium">
                          {implantParams.threadArea} мм²
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Visualization Area */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">
                      Визуализация имплантата
                    </h3>
                    <div className="bg-gray-100 border-2 border-dashed rounded-xl w-full h-64 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-gray-500 mb-2">
                          3D модель имплантата
                        </div>
                        <div className="text-sm text-gray-400">
                          Сгенерированная по параметрам
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md">
                        Экспортировать модель
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!selectedPatient && (
              <div className="bg-white p-8 rounded-lg shadow text-center">
                <h2 className="text-xl font-semibold mb-2">
                  Добро пожаловать в систему планирования имплантатов
                </h2>
                <p className="text-gray-600">
                  Выберите пациента из списка слева для начала работы
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DentalImplantDashboard;
