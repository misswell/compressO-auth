import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { event } from '@tauri-apps/api'
import { useEffect } from 'react'

import LoginScreen from '@/components/Auth'
import Spinner from '@/components/Spinner'
import { Toaster } from '@/components/Toast'
import AuthProvider, {
  isAuthConfigured,
  useAuth,
} from '@/providers/AuthProvider'
import Titlebar from '@/tauri/components/Titlebar'
import { getPlatform } from '@/utils/fs'
import UIProvider from '../providers/UIProvider'

export const Route = createRootRoute({
  component: RootComponent,
})

const isDev = import.meta.env.DEV

const { isMacOS } = getPlatform()

function AuthGate() {
  const { session, isLoading } = useAuth()

  if (!isAuthConfigured) {
    return <Outlet />
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white1 dark:bg-black1">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!session) {
    return <LoginScreen />
  }

  return <Outlet />
}

function RootComponent() {
  useEffect(() => {
    event.emit('frontend-ready')
  }, [])

  return (
    <>
      <AuthProvider>
        <UIProvider className={isMacOS ? 'pt-4' : ''}>
          {isMacOS ? <Titlebar /> : null}
          <AuthGate />
        </UIProvider>
      </AuthProvider>
      <Toaster />
      {isDev ? <TanStackRouterDevtools position="bottom-right" /> : null}
    </>
  )
}
