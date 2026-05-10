import React, { useEffect, useState } from 'react'
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Avatar,
    User,
} from '@heroui/react'
import Link from 'next/link'
import { fetchPublicUserInfo } from '../services/userService'
import UserPill from './UserPill'

export default function UserCard({ userId, className, UserPillProps = {},...props }) {
    const [userInfo, setUserInfo] = useState({})
    const [loading, setLoading] = useState(true)

    const profilePictureUrlWithVersion = userInfo.profile_picture_url
        ? `${userInfo.profile_picture_url}?v=${new Date(userInfo.updated_at).getTime()}`
        : null

    // Fetch user info
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetchPublicUserInfo(userId)
                setUserInfo(response)
                setLoading(false)
            } catch (error) {
                console.error('Error fetching user info:', userId, error)
            }
        }

        fetchUserInfo()
    }, [userId])

    return (
        <Link
        id="user_card"
            href={userInfo.id ? `/profile/${userInfo.id}` : '#'}
            className={`size-full ${className}`}
            {...props}
        >
            <UserPill
                userInfo={userInfo}
                username={userInfo.username || 'New User'}
                className={`hover:text-green-light bg-black ${UserPillProps.className}`}
                avatarClassName="size-10 border-green-light text-green-light"
                {...UserPillProps}
            />
        </Link>
    )
}
