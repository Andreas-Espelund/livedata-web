import * as yup from 'yup';

export const noteSchema = yup.object().shape({
    individual: yup.string().required('Velg individ'),
    date: yup.string().required('Velg dato'),
    note: yup.string().required('Skriv notat')
});