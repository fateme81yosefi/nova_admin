import { Navigate, createBrowserRouter } from 'react-router-dom'
import { CreateProductPage } from '@/Pages/CreateProductPage'
import { CreateUserPage } from '@/Pages/CreateUserPage'
import { DashboardPage } from '@/Pages/DashboardPage'
import { LoginPage } from '@/Pages/LoginPage'
import { ProductsPage } from '@/Pages/ProductsPage'
import { UsersPage } from '@/Pages/UsersPage'
import { AdminLayout } from '@/Shared/AdminLayout'
import { RoutePath } from '@/types/Enums/routes'
import { RequireAuth } from './RequireAuth'

export const router = createBrowserRouter([
  {
    path: RoutePath.Login,
    element: <LoginPage />,
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: RoutePath.Dashboard, element: <DashboardPage /> },
          { path: RoutePath.Products, element: <ProductsPage /> },
          { path: RoutePath.CreateProduct, element: <CreateProductPage /> },
          { path: RoutePath.Users, element: <UsersPage /> },
          { path: RoutePath.CreateUser, element: <CreateUserPage /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to={RoutePath.Dashboard} replace />,
  },
])
