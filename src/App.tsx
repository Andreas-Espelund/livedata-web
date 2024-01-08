import React, {createContext, useEffect, useState}  from 'react'

import './App.css'
import {BrowserRouter, createBrowserRouter, Route, RouterProvider, Routes} from "react-router-dom";
import RegistrationPage from "./pages/RegistrationPage";
import {Breeder, Individual} from "@/types/types";
import TopNavBar from "@/components/Navbar";
import {NextUIProvider} from "@nextui-org/react";
import IndividualsPage from "@/pages/IndividualsPage";
import HomePage from "@/pages/HomePage";
import SignUpForm from "@/pages/CreateUser";
import LoginPage from "@/pages/Login";
import { onAuthStateChanged } from 'firebase/auth';
import {auth} from "@/api/firebase";
import { User } from "firebase/auth";
import AuthenticatedRoute from "@/components/AuthenticatedRoute";
import {Spinner} from "@nextui-org/react";
import {getAllIndividuals, getBreeders} from "@/api/firestore";
import Info from "@/pages/Info";
import Bucks from "@/pages/Bucks";
import MainLayout from "@/components/MainLayout";
import ForgotPassword from "@/pages/ForgotPassword";
import SettingsPage from "@/pages/SettingsPage";

export const Context = createContext<ContextType>({individuals: [], breeders: [], user: undefined});

interface ContextType {
  individuals: Individual[];
  breeders: Breeder[];
  user: User | undefined;
  getIndividual: (doc: string)=>Individual | undefined;
  size: "sm" | "md" | "lg";
}
function App() {
  const [individuals, setIndividuals] = useState<Individual[]>([])
  const [breeders, setBreeders] = useState<Breeder[]>([])
  const [user, setUser] = useState<User>(undefined)
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [size, setScreenSize] = useState<"sm" | "md" | "lg">("md")


  useEffect(() => {
    const updateScreenSize = () => {
      // Add logic to determine screen size based on window.innerWidth
      // You can use window.innerWidth and define your own breakpoints.
      if (window.innerWidth < 640) {
        setScreenSize('sm');
      } else if (window.innerWidth < 1024) {
        setScreenSize('md');
      } else {
        setScreenSize('lg');
      }
    };

    // Initial screen size update
    updateScreenSize();

    // Listen for window resize events
    window.addEventListener('resize', updateScreenSize);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', updateScreenSize);
    };
  }, []);


  const getIndividual = (doc: string): Individual | undefined => {
      return individuals.find(e => e.doc === doc)
  }
  useEffect(() => {
    if (user){
      getAllIndividuals(user.uid).then(res => {
        console.log("Fetching individuals")
        console.log(res)
        setIndividuals(res)

      })

      getBreeders(user.uid).then(res => {
        setBreeders(res)
      })
    }


    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set the logged-in user or null
      setIsLoading(false); // Set loading to false once the auth state is determined

    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [user])

  if (isLoading) {
    return <div className={"grid place-content-center h-screen"}> <Spinner size={"lg"} color={"primary"}/> </div>
  }


  const router = createBrowserRouter([
    {
      path: '/',
      element: <AuthenticatedRoute user={user} element={<HomePage/>}/>
    },
    {
      path:'/individuals',
      element: <AuthenticatedRoute user={user} element={<IndividualsPage/>}/>
    },
    {
      path: '/register',
      element: <AuthenticatedRoute user={user} element={<RegistrationPage/>}/>
    },
    {
      path: '/signup',
      element: <SignUpForm/>
    },
    {
      path: '/login',
      element: <LoginPage/>
    },
    {
      path: '/forgot',
      element: <ForgotPassword/>
    },
    {
      path: '/info',
      element: <Info/>
    },
    {
      path: '/bucks',
      element: <AuthenticatedRoute user={user} element={<Bucks/>}/>
    },
    {
      path: '/settings',
      element: <AuthenticatedRoute user={user} element={<SettingsPage/>}/>
    }
  ])
  return (

      <Context.Provider value={{individuals, breeders, user, getIndividual, size}}>
        <NextUIProvider>
          <RouterProvider router={router}/>
        </NextUIProvider>
      </Context.Provider>
  )
}

export default App
