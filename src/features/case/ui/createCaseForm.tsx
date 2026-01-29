import {useCreateCase} from "@/features/case/model/useCreateCase";
import {TextFieldController} from "@/shared/ui/FormFields";
import {CreateCase} from "@/shared/api/caseApi";
import {Button} from "@/shared/ui/Button";
import {Form} from "react-aria-components";

export type CreateCaseFormProps = {
    closeModal: () => void;
    patient: string;
}

export function CreateCaseForm({closeModal, patient}: CreateCaseFormProps) {

    const {errors, handleSubmit, isSubmitting, control} = useCreateCase({closeModal, patient});

    return (
        <div>
            <h3 className="text-xl font-bold mb-4">Добавить прием</h3>
            <Form className="space-y-4" onSubmit={handleSubmit}>

                <TextFieldController<CreateCase>
                    name="diagnosis"
                    control={control}
                    errors={errors}
                    label="Диагноз"
                    placeholder="Введите предварительный диагноз пациента"
                    isRequired
                />

                <div className="flex w-full justify-end gap-3">
                    <Button
                        onPress={closeModal}
                        variant="secondary"
                        isDisabled={isSubmitting}
                    >
                        Отмена
                    </Button>

                    <Button
                        type="submit"
                        isPending={isSubmitting}
                        isDisabled={isSubmitting}
                    >
                        {isSubmitting ? "" : "Добавить прием"}
                    </Button>
                </div>

            </Form>
        </div>
    )
}