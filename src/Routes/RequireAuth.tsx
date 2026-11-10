import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@/Redux/hooks'
import { RoutePath } from '@/types/Enums/routes'

export function RequireAuth() {
  const token = useAppSelector((state) => state.auth.token)
  if (!token) return <Navigate to={RoutePath.Login} replace />
  return <Outlet />
}
