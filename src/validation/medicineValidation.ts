import * as yup from 'yup';

export const medicineSchema = yup.object().shape({
    individual: yup.string().required('Velg individ'),
    date: yup.string().required('Velg dato'),
    medicine: yup.string().required('Velg medisin')
});