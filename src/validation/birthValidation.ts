import * as yup from 'yup';

// Validation schema for each lamb in the lambs array
const lambSchema = yup.object().shape({
    id: yup.string(),
    gender: yup.string().required('Kjønn er påkrevd'),
    bottle: yup.string().required('Flaskelam er påkrevd'),
    tag: yup.string().required('Øremerke er påkrevd').matches(/^\d{5}$/, 'ID må være et 5-sifret tall'),
});

// Main validation schema for the form
export const birthSchema = yup.object().shape({
    lambs: yup.array().of(lambSchema).required('Minst ett lam må legges til'),
    mother: yup.string().required('Mor er påkrevd'),
    father: yup.string().required('Far er påkrevd'),
    date: yup.string().required('Dato er påkrevd'),
    note: yup.string()
});