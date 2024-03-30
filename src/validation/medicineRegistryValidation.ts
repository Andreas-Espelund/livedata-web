import * as yup from 'yup'

export const medicineRegistrySchema = yup.object().shape({
    name: yup.string().required("Navn er påkrevd"),
})