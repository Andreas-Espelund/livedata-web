import * as yup from 'yup';

export const feedbackSchema = yup.object().shape({
    name: yup.string().required('Skriv navn'),
    subject: yup.string().required('Skriv emne'),
    message: yup.string().required('Skriv melding'),
    date: yup.string().required()
})