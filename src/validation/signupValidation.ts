import * as yup from 'yup';

export const signupSchema = yup.object().shape({
    firstname: yup.string().required("Fornavn er påkrevd"),
    lastname: yup.string().required("Etternavn er påkrevd"),
    birthdate: yup.string().required("Fødselsdato er påkrevd"),
    address: yup.string().required("Adresse er påkrevd"),
    prodno: yup.string()
        .required("Prodno er påkrevd")
        .matches(/^[0-9]{10}$/, "Produsentnummer må være 10 siffer"),
    email: yup.string().email("Ugyldig epostadresse").required("Epost er påkrevd"),
    password: yup.string().required("Passord er påkrevd"),
    validation: yup.string()
        .oneOf([yup.ref('password'), undefined], "Passordene må matche")
        .required("Validering er påkrevd"),
});
