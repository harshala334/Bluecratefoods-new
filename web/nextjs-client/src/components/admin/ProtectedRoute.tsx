import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

interface ProtectedRouteProps {
    children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const router = useRouter()
    const [isAuthorized, setIsAuthorized] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('token')
        const userJson = localStorage.getItem('user')
        const user = userJson ? JSON.parse(userJson) : null

        if (!token || !user || (user.email !== 'admin@gmail.com' && user.userType !== 'admin' && user.userType !== 'vendor')) {
            router.push('/login')
        } else {
            setIsAuthorized(true)
        }
    }, [router])

    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    return <>{children}</>
}
