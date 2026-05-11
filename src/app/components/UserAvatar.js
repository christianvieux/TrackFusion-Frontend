import { Avatar } from '@heroui/react'

function getProfilePicture(userInfo) {
    if (!userInfo?.profile_picture_url) return null

    const version = userInfo?.updated_at
        ? new Date(userInfo.updated_at).getTime()
        : Date.now()

    return `${userInfo.profile_picture_url}?v=${version}`
}

function getInitial(username) {
    return username?.charAt(0)?.toUpperCase() || 'N'
}

export default function UserAvatar({
    userInfo,
    username = 'New User',
    className = '',
    ...props
}) {
    const profilePicture = getProfilePicture(userInfo)
    const initial = getInitial(username)

    return (
        <Avatar
            className={`size-9 border-2 border-success bg-muted text-success ${className}`}
            {...props}
        >
            {profilePicture && (
                <Avatar.Image
                    src={profilePicture}
                    alt={`${username}'s profile picture`}
                />
            )}

            <Avatar.Fallback>{initial}</Avatar.Fallback>
        </Avatar>
    )
}