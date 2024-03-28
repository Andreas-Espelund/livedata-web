import * as yup from 'yup';


export const deactivationSchema = yup.object().shape({
    date: yup.string().required('Dato er påkrevd'),
    individual: yup.string().required('Velg individ'),
    status: yup.string().required('Velg utmeldingsårsak'),
    note: yup.string()
});