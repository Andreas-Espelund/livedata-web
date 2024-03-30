import * as yup from 'yup';

export const loginSchema = yup.object().shape({
    email: yup.string().email().required("Epost er påkrevd"),
    password: yup.string().required("Passord er påkrevd"),
});