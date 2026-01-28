import {Patient} from "@/shared/api/patientApi";

type PatientCardProps = {
    patient: Patient;
    actions?: React.ReactNode; // Слот для кнопок редактирования/удаления
};

export function PatientCard({ patient, actions }: PatientCardProps) {
    const fullName = patient.fio;

    return (
        <div className="bg-gradient-to-r from-white to-gray-50 p-6 rounded-xl shadow-lg border border-gray-200/50">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                    Карточка пациента
                </h2>
                {actions && (
                    <div className="flex space-x-2">
                        {actions}
                    </div>
                )}
            </div>
            <div className="grid grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200/50 shadow-sm">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        ФИО
                    </label>
                    <p className="mt-1 text-lg font-semibold text-gray-800">
                        {fullName}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200/50 shadow-sm">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Дата рождения
                    </label>
                    <p className="mt-1 text-lg font-semibold text-gray-800">
                        {patient.birth_date}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200/50 shadow-sm">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Пол
                    </label>
                    <p className="mt-1 text-lg font-semibold text-gray-800">
                        {patient.gender === 0 ? "Мужской" : "Женский"}
                    </p>
                </div>
            </div>
        </div>
    );
}