import {useCreatePatientMutation} from "@/entities/patient";
import {CreatePatient} from "@/shared/api/patientApi";
import {useForm} from "react-hook-form";

export function useCreatePatient({ closeModal }: { closeModal: () => void }) {

    const { register, handleSubmit } = useForm<CreatePatient>();

    const createPatientMutation = useCreatePatientMutation({ onSuccessActions: [closeModal] });

    const onSubmit = (data: CreatePatient) => {
        createPatientMutation.mutate(data);
    };

    return {
        register,
        handleSubmit: handleSubmit(onSubmit),
        createPatientMutation,
    }
}