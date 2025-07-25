import { useState } from "react";

type ValidateFn<T> = (
  name: keyof T,
  value: T[keyof T],
  values: T
) => string | null;

function useForm<T extends Record<string, any>>(
  initialValues: T,
  validate?: ValidateFn<T>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string | null>>>(
    {}
  );
  const [dirty, setDirty] = useState(false);

  const handleChange = (name: keyof T, value: T[keyof T]) => {
    setValues({ ...values, [name]: value });
    if (dirty && validate) {
      setErrors({ ...errors, [name]: validate(name, value, values) });
    }
  };

  const handleSubmit = (onSubmit: (values: T) => void) => {
    setDirty(true);
    const newErrors: Partial<Record<keyof T, string | null>> = {};
    Object.keys(values).forEach((key) => {
      if (validate) {
        newErrors[key as keyof T] = validate(
          key as keyof T,
          values[key as keyof T],
          values
        );
      }
    });
    setErrors(newErrors);
    const hasError = Object.values(newErrors).some((e) => e);
    if (!hasError) {
      onSubmit(values);
    }
  };

  return {
    values,
    errors: dirty ? errors : {},
    handleChange,
    handleSubmit,
    setValues,
    setErrors,
    dirty,
  };
}

export default useForm;
