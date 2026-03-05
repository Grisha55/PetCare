import { useState, type ReactNode } from 'react';
import { AuthContext, type User } from './AuthContext';

interface Props {
	children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
	const [user, setUser] = useState<User | null>(() => {
		try {
			const stored = localStorage.getItem('user');
			return stored ? (JSON.parse(stored) as User) : null;
		} catch {
			return null;
		}
	});

	const login = (user: User) => {
		localStorage.setItem('user', JSON.stringify(user));
		setUser(user);
	};

	const logout = () => {
		localStorage.removeItem('user');
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};
