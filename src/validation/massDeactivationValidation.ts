import * as yup from 'yup';

export const massDeactivationSchema = yup.object().shape({
    date: yup.string().required('Velg dato'),
    status: yup.string().required('Velg medisin'),
    note: yup.string()
});


