import React from 'react'

import Button from '@/components/Button'
import TextInput from '@/components/TextInput'
import { toast } from '@/components/Toast'
import { useAuth } from '@/providers/AuthProvider'

type AuthMode = 'signin' | 'signup'

function LoginScreen() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = React.useState<AuthMode>('signin')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const isSignUp = mode === 'signup'

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      if (isSignUp) {
        const needsEmailConfirmation = await signUp(email, password)
        if (needsEmailConfirmation) {
          toast.info(
            'Check your inbox to confirm your email, then sign in here.',
          )
          setMode('signin')
        }
        // Otherwise onAuthStateChange picks up the new session and the gate opens.
      } else {
        await signIn(email, password)
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Something went wrong.'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-white1 dark:bg-black1">
      <div className="w-[24rem] bg-zinc-100 dark:bg-zinc-800 rounded-2xl p-8 flex flex-col items-center gap-5 shadow-sm">
        <img
          src="/logo.png"
          alt="CompressO logo"
          className="w-16 h-16"
          draggable={false}
        />
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {isSignUp ? 'Create your account' : 'Sign in to CompressO'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Compression still happens locally on your device.
          </p>
        </div>
        <form className="w-full flex flex-col gap-3" onSubmit={handleSubmit}>
          <TextInput
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onValueChange={setEmail}
            isRequired
          />
          <TextInput
            label="Password"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onValueChange={setPassword}
            minLength={6}
            isRequired
          />
          <Button
            color="primary"
            type="submit"
            fullWidth
            isLoading={isSubmitting}
            className="mt-1"
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </Button>
        </form>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            className="text-primary font-medium"
            onClick={() => setMode(isSignUp ? 'signin' : 'signup')}
          >
            {isSignUp ? 'Sign In' : 'Create one'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default LoginScreen
