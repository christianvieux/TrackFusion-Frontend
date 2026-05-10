import UserAvatar from './UserAvatar'

export default function UserPill({
    userInfo,
    username = 'New User',
    className = '',
    classNames= {},
}) {
    return (
        <div
            className={`w-max pr-2 flex items-center gap-2 rounded-full text-success transition hover:bg-secondary-hover ${className}`}
        >
            <UserAvatar
                userInfo={userInfo}
                username={username}
                className={classNames.UserAvatar}
            />

            <span className={`max-w-32 truncate text-lg font-semibold ${classNames.Username}`}>
                {username}
            </span>
        </div>
    )
}