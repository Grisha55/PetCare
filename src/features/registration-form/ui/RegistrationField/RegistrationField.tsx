import cls from './RegistrationField.module.scss';

interface RegistrationFieldProps {
	id: string;
	label: string;
	type: string;
	placeholder: string;
	value: string;
	onChange: (value: string) => void;
	disabled: boolean;
	required?: boolean;
}

export const RegistrationField = ({
	id,
	label,
	type,
	placeholder,
	value,
	onChange,
	disabled,
	required
}: RegistrationFieldProps) => {
	return (
		<div className={cls.field}>
			<label htmlFor={id}>{label}</label>
			<input
				id={id}
				type={type}
				placeholder={placeholder}
				value={value}
				onChange={e => onChange(e.target.value)}
				disabled={disabled}
				required={required}
			/>
		</div>
	);
};
