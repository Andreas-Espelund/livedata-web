import * as yup from 'yup';

export const exportSchema = yup.object().shape({
    title: yup.string().required("Tittel er påkrevd")
});