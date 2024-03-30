import * as yup from 'yup';

export const userSettingsSchema = yup.object().shape({
    firstname: yup.string().required("Fornavn er påkrevd"),
    lastname: yup.string().required("Etternavn er påkrevd"),
    birthdate: yup.string().required("Fødselsdato er påkrevd"),
    address: yup.string().required("Adresse er påkrevd"),
    prodno: yup.string()
        .required("Prodno er påkrevd")
        .matches(/^[0-9]{10}$/, "Produsentnummer må være 10 siffer"),
});