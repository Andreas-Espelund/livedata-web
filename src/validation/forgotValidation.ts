import * as yup from 'yup';

export const forgotSchema = yup.object().shape({
    email: yup.string().email().required("Epost er påkrevd"),
});