import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {NextUIProvider, Spinner} from "@nextui-org/react";
import {protectRoute} from "@/context/AuthenticatedRoute";
import {useAppContext} from "@/context/AppContext";
import {HomePage} from "@/pages/homePage";
import {IndividualsPage} from "@/pages/individuals";
import {RegistrationPage} from "@/pages/registration";
import {SignUpPage} from "@/pages/signup";
import {LoginPage} from "@/pages/login";
import {ForgotPage} from "@/pages/forgotPassword";
import {InfoPage} from "@/pages/info";
import {BreedersPage} from "@/pages/breeders";
import {SettingsPage} from "@/pages/settings";
import {DocumentView} from "@/pages/documentView";
import IndividualProfile from "@/pages/individualProfile";


function App() {

    const {loading} = useAppContext()

    if (loading) {
        return <div className={"grid place-content-center h-screen"}><Spinner size={"lg"} color={"primary"}/></div>
    }

    const router = createBrowserRouter([
        {
            path: '/',
            element: protectRoute(<HomePage/>)
        },
        {
            path: '/individuals',
            element: protectRoute(<IndividualsPage/>)
        },
        {
            path: '/individuals/:id',
            element: protectRoute(<IndividualProfile/>)
        },
        {
            path: '/register',
            element: protectRoute(<RegistrationPage/>)
        },
        {
            path: '/register/:id/:tab',
            element: protectRoute(<RegistrationPage/>)
        },
        {
            path: '/signup',
            element: <SignUpPage/>
        },
        {
            path: '/login',
            element: <LoginPage/>
        },
        {
            path: '/forgot',
            element: <ForgotPage/>
        },
        {
            path: '/info',
            element: <InfoPage/>
        },
        {
            path: '/breeders',
            element: protectRoute(<BreedersPage/>)
        },
        {
            path: '/settings',
            element: protectRoute(<SettingsPage/>)
        },
        {
            path: '/document',
            element: protectRoute(<DocumentView/>)
        }
    ])
    return (
        <NextUIProvider>
            <RouterProvider router={router}/>
        </NextUIProvider>
    )
}

export default App
