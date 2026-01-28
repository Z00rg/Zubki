import {useCreatePatient} from "@/features/patient/model/useCreatePatient";
import {Button} from "@/shared/ui/Button";
import {Select, SelectItem} from "@/shared/ui/Select";
import {DatePicker} from "@/shared/ui/DataPicker";
import {Form} from "@/shared/ui/Form";
import {TextField} from "@/shared/ui/TextField";

export function CreatePatientForm({closeModal}: { closeModal: () => void }) {

    const {createPatientMutation, handleSubmit, register} = useCreatePatient({closeModal})

    return (
        <div>
            <h3 className="text-xl font-bold mb-4">Добавить пациента</h3>
            <Form className="space-y-4">

                <TextField isRequired name="surname" label="Фамилия" placeholder="Введите свою фамилию" />

                <TextField isRequired name="name" label="Имя" placeholder="Введите свое имя" />

                <TextField isRequired name="patronymic" label="Отчество" placeholder="Введите свое отчество" />

                <DatePicker label="Дата рождения" name="birth_date" isRequired/>

                <Select form="gender" name="gender" isRequired label="Выберите пол">
                    <SelectItem id={0}>Мужской</SelectItem>
                    <SelectItem id={1}>Женский</SelectItem>
                </Select>

                <div className="flex w-full justify-end gap-3">
                    <Button
                        slot="close"
                        variant="secondary"
                        isDisabled={createPatientMutation.isPending}
                    >
                        Отмена
                    </Button>

                    <Button
                        type="submit"
                        isPending={createPatientMutation.isPending}
                        isDisabled={createPatientMutation.isPending}
                    >
                        {createPatientMutation.isPending ? "" : "Добавить пациента"}
                    </Button>
                </div>

            </Form>
        </div>
    )
}