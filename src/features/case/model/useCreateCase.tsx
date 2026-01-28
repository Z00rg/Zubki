import {useCreateCaseMutation} from "@/entities/case";
import {useForm} from "react-hook-form";
import {CreateCase} from "@/shared/api/caseApi";

export function useCreateCase({ closeModal }: { closeModal: () => void }) {

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
        createCaseMutation.mutate(data)
    }

    return {
        control,
        errors,
        handleSubmit: handleSubmit(onSubmit),
        isSubmitting: isSubmitting || createCaseMutation.isPending,
    }
}