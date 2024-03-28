import * as yup from 'yup';

export const massMedicineSchema = yup.object().shape({
    date: yup.string().required('Velg dato'),
    medicine: yup.string().required('Velg medisin')
});