import {useCreateCaseMutation} from "@/entities/case";
import {useForm} from "react-hook-form";
import {CreateCase} from "@/shared/api/caseApi";

export type useCreateCaseMutationProps = {
    closeModal: () => void;
    patient: string;
}

export function useCreateCase({ closeModal, patient }: useCreateCaseMutationProps) {

    const {
        handleSubmit,
        control,
        formState: { errors, isSubmitting }
    } = useForm<CreateCase>({
        defaultValues: {
            diagnosis: "",
        }
    });

    const createCaseMutation = useCreateCaseMutation({onSuccessActions: [closeModal]});

    const onSubmit = (data: CreateCase) => {
        const payload: CreateCase = {
            ...data,
            patient: patient
        };

        createCaseMutation.mutate(payload);
    };

    return {
        control,
        errors,
        handleSubmit: handleSubmit(onSubmit),
        isSubmitting: isSubmitting || createCaseMutation.isPending,
    }
}