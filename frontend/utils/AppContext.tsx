import { ReactPropTypes, createContext, useEffect, useState } from 'react';
import React from 'react';

const AuthContext = createContext(null!);

//export const getToken = () => {

//}


export const useAuth = () => React.useContext(AuthContext);
//export const AuthConsumer = AuthContext.Consumer;
