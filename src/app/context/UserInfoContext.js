// src/app/context/UserInfoContext.js

import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { fetchPublicUserInfo } from '../services/user';
import { useSession } from './SessionContext';

const UserInfoContext = createContext({});

export const UserInfoProvider = ({ children }) => {
    const { user } = useSession();
    const [userInfo, setUserInfo] = useState(null);
    const value = useMemo(() => ({ userInfo, setUserInfo }), [userInfo]);

    useEffect(() => {
      if (user?.id) {
        const fetchUserInfo = async function () {
          const new_userInfo = await fetchPublicUserInfo(user.id);
          const profilePictureUrlWithVersion = new_userInfo?.profile_picture_url
            ? `${new_userInfo.profile_picture_url}?v=${new Date(new_userInfo.updated_at).getTime()}`
            : null;
            
          setUserInfo({...new_userInfo, profile_picture_url: profilePictureUrlWithVersion});
        };
        fetchUserInfo();
      } else {
        setUserInfo({});
      }
    }, [user]);

    return (
        <UserInfoContext.Provider value={value}>
            {children}
        </UserInfoContext.Provider>
    );
};

export const useUserInfo = () => useContext(UserInfoContext);