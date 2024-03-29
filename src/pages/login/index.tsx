import {Input, Button, Card} from '@nextui-org/react';
import {CardBody} from "@nextui-org/card";
import {Navigate, NavLink, useNavigate} from "react-router-dom";
import {NoticeBox} from "@/components/NoticeBox";
import {useAppContext} from "@/context/AppContext";
import useStatus from "@/hooks/useStatus";
import {NoticeWrapper} from "@/components";
import {Controller, useForm} from "react-hook-form";
import {signInWithEmailAndPassword} from 'firebase/auth';
import {auth} from "@/api/firebase";


interface LoginFormData {
    email: string;
    password: string;

}

export const LoginPage = () => {
    const {loading, error, success, setSuccessState, setErrorState, startLoading, resetStatus} = useStatus()
    const {control, handleSubmit, formState: {errors}} = useForm<LoginFormData>();

    const navigate = useNavigate()
    const {user} = useAppContext()


    const onSubmit = async (data: LoginFormData) => {
        startLoading()

        signInWithEmailAndPassword(auth, data.email, data.password)
            .then(() => {
                setSuccessState()
                navigate('/')
            })
            .catch(setErrorState)
    };

    if (user) {
        return <Navigate to={"/"}/>
    }
    return (
        <div className={"flex flex-col justify-center items-center h-[100dvh]  p-4 gap-6"}>
            <h1 className={"text-3xl font-medium"}>Logg inn</h1>
            <Card className="w-full max-w-xl">
                <CardBody>
                    <form onSubmit={handleSubmit(onSubmit)} className={"grid gap-4"}>
                        <Controller
                            name="email"
                            control={control}
                            rules={{required: true}} // Add more validation as needed
                            render={({field}) => (
                                <Input errorMessage={errors.email && "Påkrevd"} type="email" {...field} label="Epost"
                                       isRequired/>
                            )}
                        />
                        <Controller
                            name="password"
                            control={control}
                            rules={{required: true}} // Add more validation as needed
                            render={({field}) => (
                                <Input errorMessage={errors.password && "Påkrevd"} type="password" {...field}
                                       label="Passord" isRequired/>
                            )}
                        />
                        <Button isLoading={loading} type="submit" color={"primary"}>Logg inn</Button>
                    </form>
                </CardBody>
            </Card>

            <div className={"grid gap-2"}>
                <NavLink className={"m-auto italic"} to={"/signup"}> Registrer bruker</NavLink>
                <NavLink className={"m-auto italic"} to={"/forgot"}> Glemt passord?</NavLink>
            </div>

            <NoticeWrapper>
                <NoticeBox title={"Logget inn"} message={"Du er no innlogga"} type={"success"} visible={success}
                           onClose={resetStatus}/>
                <NoticeBox title={"Kunne ikkje logge inn"} message={"Sjekk at passord og brukernavn er riktig"}
                           type={"warning"} visible={error !== null} onClose={resetStatus}/>
            </NoticeWrapper>
        </div>
    );
};
