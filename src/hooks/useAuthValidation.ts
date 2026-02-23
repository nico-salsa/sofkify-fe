import { useState, useCallback, type ChangeEvent, type FocusEvent, type FormEvent } from 'react';

interface UseAuthValidationProps<T> {
    initialState: T;
    validate: (data: T) => Record<string, string>;
    onSubmit: (data: T) => Promise<void> | void;
}

export function useAuthValidation<T extends Record<string, unknown>>({
    initialState,
    validate,
    onSubmit,
}: UseAuthValidationProps<T>) {
    const [formData, setFormData] = useState<T>(initialState);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setFormData((prev) => {
                const newData = { ...prev, [name]: value };

                // Si el campo ya fue tocado, validamos en tiempo real para limpiar el error
                if (touched[name]) {
                    const validationErrors = validate(newData);
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        [name]: validationErrors[name] || '', // Limpia el error si ya no existe
                    }));
                }

                return newData;
            });
        },
        [touched, validate]
    );

    const handleBlur = useCallback(
        (e: FocusEvent<HTMLInputElement>) => {
            const { name } = e.target;
            setTouched((prev) => ({ ...prev, [name]: true }));

            const validationErrors = validate(formData);
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: validationErrors[name] || '',
            }));
        },
        [formData, validate]
    );

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Validar todo
        const validationErrors = validate(formData);
        setErrors(validationErrors);

        // Marcar todo como tocado
        const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
        setTouched(allTouched);

        if (Object.keys(validationErrors).length === 0) {
            try {
                await onSubmit(formData);
            } catch {
                // Manejo de errores externos (API) si fuera necesario
            }
        }

        setIsSubmitting(false);
    };

    return {
        formData,
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
    };
}
