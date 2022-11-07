import React, { createContext, useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import app from '../firebase/firebase.config';
//declarinng context here
export const AuthContext = createContext();

// getting the auth(auth means authentication link which send data to firebase by the configuration)
const auth = getAuth(app)

const UserContext = ({ children }) => {

    //all states 
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    //handlers for authentcation
    const createUser = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password)
    }
    const signIn = (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password)
    }
    const signOutHandler = () => {
        return signOut(auth)
    }

    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, currentUser => {
            //console.log('current user inside on auth state change', currentUser);
            setUser(currentUser)
            setLoading(false)
        })

        return () => unSubscribe()
    }, [])


    // the value by which we will send the data through 
    const authInfo = { user, loading, createUser, signIn, setUser, signOutHandler }


    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default UserContext;