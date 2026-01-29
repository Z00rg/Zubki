import {useState} from "react";
import {Button} from "@/shared/ui/Button";
import {Form} from "@/shared/ui/Form";
import {FileTrigger} from "react-aria-components";
import {useUploadDicomMutation} from "@/entities/case/queries";
import {queue} from "@/shared/ui/Toast";

type UploadDicomFormProps = {
    caseId: number;
    closeModal: () => void;
}

const MAX_FILE_SIZE = 2048 * 1024 * 1024; // 2048 МБ в байтах

export function UploadDicomForm({ caseId, closeModal }: UploadDicomFormProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const uploadMutation = useUploadDicomMutation({ onSuccessActions: [closeModal] });

    const handleFileSelect = (fileList: FileList | null) => {
        if (!fileList || fileList.length === 0) return;

        const file = fileList[0];

        // Проверка размера файла
        if (file.size > MAX_FILE_SIZE) {
            queue.add({
                title: 'Файл слишком большой',
                description: `Максимальный размер файла: 2 Гб. Ваш файл: ${formatFileSize(file.size)}`,
                type: 'error'
            }, { timeout: 5000 });
            return;
        }

        // Проверка, что это архив
        const validExtensions = ['.zip'];
        const validTypes = ['application/zip', 'application/x-zip-compressed', 'application/x-rar-compressed', 'application/x-7z-compressed'];

        const hasValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
        const hasValidType = validTypes.includes(file.type);

        if (!hasValidExtension && !hasValidType) {
            queue.add({
                title: 'Неверный формат',
                description: 'Пожалуйста, выберите архив .zip',
                type: 'warning'
            }, { timeout: 3000 });
            return;
        }

        setSelectedFile(file);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedFile) {
            queue.add({
                title: 'Файл не выбран',
                description: 'Пожалуйста, выберите файл для загрузки',
                type: 'warning'
            }, { timeout: 3000 });
            return;
        }

        uploadMutation.mutate({
            case_id: caseId,
            file: selectedFile
        });
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' Б';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' КБ';
        return (bytes / (1024 * 1024)).toFixed(2) + ' МБ';
    };

    return (
        <div>
            <h3 className="text-xl font-bold mb-4">Загрузить DICOM архив</h3>
            <Form className="space-y-6" onSubmit={handleSubmit}>

                {/* File selection area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg
                                className="w-8 h-8 text-blue-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                            </svg>
                        </div>

                        {selectedFile ? (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                                    <svg
                                        className="w-5 h-5 text-blue-600"
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
                                    <div className="text-left">
                                        <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                                        <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                                    </div>
                                </div>
                                <FileTrigger
                                    acceptedFileTypes={[
                                        "application/zip",
                                        "application/x-zip-compressed",
                                        "application/x-rar-compressed",
                                        "application/x-7z-compressed"
                                    ]}
                                    onSelect={handleFileSelect}
                                >
                                    <Button variant="secondary" className="text-sm">
                                        Выбрать другой файл
                                    </Button>
                                </FileTrigger>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-1">
                                        Выберите DICOM архив
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Поддерживаются форматы: ZIP
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Максимальный размер: 2 Гб
                                    </p>
                                </div>
                                <FileTrigger
                                    acceptedFileTypes={[
                                        "application/zip",
                                    ]}
                                    onSelect={handleFileSelect}
                                >
                                    <Button>
                                        Выбрать файл
                                    </Button>
                                </FileTrigger>
                            </>
                        )}
                    </div>
                </div>

                {/* Progress indicator for upload */}
                {uploadMutation.isPending && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Загрузка файла...</span>
                            <span>Пожалуйста, подождите</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div className="bg-blue-600 h-2 rounded-full animate-pulse w-full"></div>
                        </div>
                        <p className="text-xs text-center text-gray-500">
                            Большие файлы могут загружаться несколько минут
                        </p>
                    </div>
                )}

                {/* Action buttons */}
                <div className="flex w-full justify-end gap-3">
                    <Button
                        type="button"
                        onPress={closeModal}
                        variant="secondary"
                        isDisabled={uploadMutation.isPending}
                    >
                        Отмена
                    </Button>

                    <Button
                        type="submit"
                        isPending={uploadMutation.isPending}
                        isDisabled={uploadMutation.isPending || !selectedFile}
                    >
                        {uploadMutation.isPending ? "" : "Загрузить"}
                    </Button>
                </div>

            </Form>
        </div>
    );
}