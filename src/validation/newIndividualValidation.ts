import * as yup from "yup";

export const newIndividualSchema = yup.object().shape({
    id: yup.string()
        .required('ID er påkrevd')
        .matches(/^\d{5}$/, 'ID må være et 5-sifret tall'),
    gender: yup.string().required('Kjønn er påkrevd'),
    birth_date: yup.string().required('Fødselsdato er påkrevd'),
    bottle: yup.boolean().required('Flaskelam er påkrevd'),
    mother: yup.string().nullable(),
    father: yup.string().nullable(),
});