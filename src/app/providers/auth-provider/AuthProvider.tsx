import type { User } from '@supabase/supabase-js'
import { useEffect, useState, type ReactNode } from 'react'
import { supabase } from '../../../shared/api/supabase'
import { AuthContext } from './AuthContext'

interface Props {
	children: ReactNode
}

export const AuthProvider = ({ children }: Props) => {

	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {

		const initAuth = async () => {

			const { data } = await supabase.auth.getSession()

			setUser(data.session?.user ?? null)
			setLoading(false)

		}

		initAuth()

		const { data: listener } = supabase.auth.onAuthStateChange(
			(event, session) => {

				if (event === 'SIGNED_OUT') {
					setUser(null)
				} else {
					setUser(session?.user ?? null)
				}

				setLoading(false)

			}
		)

		return () => {
			listener.subscription.unsubscribe()
		}

	}, [])

	const login = async (email: string, password: string) => {

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password
		})

		if (error) throw error

	}

	const register = async (email: string, password: string) => {

		const { error } = await supabase.auth.signUp({
			email,
			password
		})

		if (error) throw error

	}

	const logout = async () => {

		await supabase.auth.signOut()

	}

	return (
		<AuthContext.Provider
			value={{
				user,
				loading,
				login,
				register,
				logout
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}