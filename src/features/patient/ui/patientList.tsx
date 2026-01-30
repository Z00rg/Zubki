import {UiModal} from "@/shared/ui/UiModal";
import {Button} from "@/shared/ui/Button";
import {useGetPatientList} from "@/features/patient/model/useGetPatientList";
import {Patient} from "@/shared/api/patientApi";
import {PatientCardSkeleton} from "@/shared/ui/Skeleton";
import {CreatePatientForm} from "@/features/patient";

export function PatientList({ onOpenPatient }: { onOpenPatient: (patient: Patient) => void }) {

    const { patientList, selectedPatient, setSelectedPatient, isLoading, isError } = useGetPatientList();

    const handlePatientClick = (patient: Patient) => {
        setSelectedPatient(patient);
        onOpenPatient(patient);
    };

    return (
        <div className="space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto">
            {/* Состояние загрузки */}
            {isLoading && (
                <>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <PatientCardSkeleton key={index} />
                    ))}
                </>
            )}

            {/* Состояние ошибки */}
            {isError && !isLoading && (
                <div className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-3">
                        <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                        Ошибка загрузки
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                        Не удалось загрузить список пациентов
                    </p>
                    <Button
                        variant="secondary"
                        onPress={() => window.location.reload()}
                    >
                        Попробовать снова
                    </Button>
                </div>
            )}

            {/* Пустой список */}
            {!isLoading && !isError && patientList && patientList.length === 0 && (
                <div className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-3">
                        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                        Пациенты не найдены
                    </h3>
                    <p className="text-sm text-gray-500">
                        Добавьте первого пациента, нажав кнопку ниже
                    </p>
                </div>
            )}

            {/* Список пациентов */}
            {!isLoading && !isError && patientList && patientList.map((patient: Patient) => (
                <div
                    key={patient.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedPatient?.id === patient.id
                            ? "border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-inner"
                            : "border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => handlePatientClick(patient)}
                >
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="font-medium text-gray-800">
                            {patient.fio}
                        </h3>
                    </div>
                    <div className="flex justify-between mt-1">
                        <p className="text-sm text-gray-600">{patient.birth_date}</p>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {patient.gender === 0 ? "Мужской" : "Женский"}
                        </span>
                    </div>
                </div>
            ))}

            {/* Кнопка добавления пациента */}
            <UiModal button={
                <Button
                    variant="secondary"
                    className="w-full min-h-18 text-4xl text-blue-800 font-medium bg-blue-100 hover:border hover:border-blue-500 hover:bg-blue-100">
                    +
                </Button>
            }>
                {({close}) => (
                    <CreatePatientForm closeModal={close}/>
                )}
            </UiModal>
        </div>
    );
}