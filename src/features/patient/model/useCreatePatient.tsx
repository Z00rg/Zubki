import {useCreatePatientMutation} from "@/entities/patient";
import {CreatePatient} from "@/shared/api/patientApi";
import {useForm} from "react-hook-form";

export function useCreatePatient({ closeModal }: { closeModal: () => void }) {

    const {
        handleSubmit,
        control,
        formState: { errors, isSubmitting }
    } = useForm<CreatePatient>({
        defaultValues: {
            name: "",
            surname: "",
            patronymic: "",
            birth_date: "",
            gender: 0,
        }
    });

    const createPatientMutation = useCreatePatientMutation({ onSuccessActions: [closeModal] });

    const onSubmit = (data: CreatePatient) => {
        createPatientMutation.mutate(data);
    };

    return {
        control,
        errors,
        handleSubmit: handleSubmit(onSubmit),
        isSubmitting: isSubmitting || createPatientMutation.isPending,
    }
}