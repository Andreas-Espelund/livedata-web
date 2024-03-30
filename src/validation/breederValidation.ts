import * as yup from 'yup';

export const breederSchema = yup.object().shape({
    id: yup.string()
        .required("ID er påkrevd")
        .matches(/^[0-9]{5}$/, "ID må være 5 siffer"),
    nickname: yup.string().required("Kallenavn er påkrevd"),
    birth_date: yup.string().required("Fødselsdato er påkrevd"),
});