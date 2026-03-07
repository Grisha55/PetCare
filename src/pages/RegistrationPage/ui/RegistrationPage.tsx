import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../app/providers/auth-provider'
import { supabase } from '../../../shared/api/supabase'
import { createPet, uploadPetAvatar } from '../../../shared/api/petApi'

export const RegistrationPage = () => {

	const { register, login } = useAuth()
	const navigate = useNavigate()

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [petName, setPetName] = useState('')
	const [photo, setPhoto] = useState<File | null>(null)

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = async e => {
		e.preventDefault()

		try {

			await register(email, password)
			await login(email, password)

			const { data } = await supabase.auth.getUser()
			const user = data.user

			if (!user) throw new Error('User not found')

			const pet = await createPet(user.id, {
				name: petName
			})

			if (photo) {
				await uploadPetAvatar(pet.id, photo)
			}

			navigate('/')

		} catch (e) {
			console.error(e)
			alert('Registration error')
		}
	}

	return (
		<form onSubmit={handleSubmit}>

			<h1>Registration</h1>

			<input
				placeholder="Email"
				onChange={e => setEmail(e.target.value)}
			/>

			<input
				type="password"
				placeholder="Password"
				onChange={e => setPassword(e.target.value)}
			/>

			<input
				placeholder="Pet name"
				onChange={e => setPetName(e.target.value)}
			/>

			<input
				type="file"
				accept="image/*"
				onChange={e => {
					if (e.target.files?.[0]) {
						setPhoto(e.target.files[0])
					}
				}}
			/>

			<button type="submit">
				Register
			</button>

		</form>
	)
}