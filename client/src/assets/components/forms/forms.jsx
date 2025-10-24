import { useState } from 'react'
import Icon from '../sideBarLeft/icon'
import Inputs from './input'

export default function Forms({ mode = "create", initialData = {}, onSubmitUrl, customInputs, onNotification }) {

    const [formData, setFormData] = useState({
        name: initialData.name || '',
        surname: initialData.surname || '',
        email: initialData.email || '',
        dateOfBirth: initialData.dateOfBirth || '',
        nationalId: initialData.nationalId || '',
        password: initialData.password || ''
    });

    const [errors, setErrors] = useState({});

        // Función de validación
    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }
        
        if (!formData.surname.trim()) {
            newErrors.surname = 'Surname is required';
        } else if (formData.surname.length < 2) {
            newErrors.surname = 'Surname must be at least 2 characters';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        
        if (!formData.dateOfBirth) {
            newErrors.dateOfBirth = 'Date of birth is required';
        } else {
            const birthDate = new Date(formData.dateOfBirth);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            
            if (age < 18) {
                newErrors.dateOfBirth = 'You must be at least 18 years old';
            }
        }
        
        if (!formData.nationalId.trim()) {
            newErrors.nationalId = 'National ID is required';
        } else if (formData.nationalId.length < 6) {
            newErrors.nationalId = 'National ID must be at least 6 characters';
        }
        
        if (!formData.password.trim()) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Password must contain uppercase, lowercase and number';
        }
        
        setErrors(newErrors);
        return newErrors;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar formulario
        const validationErrors = validateForm();

        // Si hay errores, enviar notificaciones
        if (Object.keys(validationErrors).length > 0) {
            Object.entries(validationErrors).forEach(([field, message]) => {
                if (onNotification) {
                    onNotification({
                        type: 'error',
                        title: `Error in ${field}`,
                        message: message
                    });
                }
            });
            return;
        }


        try {
            let method = "POST";
            if (mode === "update") method = "PUT";
            if (mode === "delete") method = "DELETE";

            const res = await fetch(onSubmitUrl, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: method !== "DELETE" ? JSON.stringify(formData) : undefined
            });

            const data = await res.json();

            if (res.ok) {
               // Enviar notificación de éxito
                if (onNotification) {
                    let successMessage = '';
                    if (mode === "create") successMessage = `Welcome ${formData.name} ${formData.surname}!`;
                    if (mode === "update") successMessage = 'User information updated successfully';
                    if (mode === "delete") successMessage = 'User deleted successfully';

                    onNotification({
                        type: 'success',
                        title: mode === "create" ? 'User created successfully' : 
                               mode === "update" ? 'Update successful' : 
                               'Deletion successful',
                        message: successMessage
                    });
                }
                // limpiar campos solo si no es delete
                if (mode !== "delete") {
                    setFormData({
                        name: '',
                        surname: '',
                        email: '',
                        dateOfBirth: '',
                        nationalId: '',
                        password: ''
                    });
                }

            }  else {
                // Enviar notificación de error del servidor
                if (onNotification) {
                    onNotification({
                        type: 'error',
                        title: 'Server error',
                        message: data.error || 'Operation failed'
                    });
                }
            }

        } catch (error) {
            console.error('Error:', error);
            
            // Enviar notificación de error de conexión
            if (onNotification) {
                onNotification({
                    type: 'error',
                    title: 'Connection error',
                    message: 'Could not connect to the database'
                });
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            surname: '',
            email: '',
            dateOfBirth: '',
            nationalId: '',
            password: ''
        });
    };

    const inputProperties = [
        [
            { id: 1, name: "name", type: "text", label: "Name", placeHolder: "Enter your name", onChange: handleChange, value: formData.name,  error: errors.name },
            { id: 2, name: "surname", type: "text", label: "Surname", placeHolder: "Enter your surname", onChange: handleChange, value: formData.surname, error: errors.surname }
        ],
        [
            { id: 3, name: "email", type: "Email", label: "Email", placeHolder: "Enter your email", onChange: handleChange, value: formData.email, error: errors.email },
            {
                id: 4, name: "dateOfBirth", type: "date", label: "Date of birth", onChange: handleChange, value: formData.dateOfBirth, error: errors.dateOfBirth,
                classNameInput: `border-none! w-12 text-transparent cursor-pointer [&::-webkit-datetime-edit]:hidden [&::-webkit-calendar-picker-indicator]:cursor-pointer
        [&::-webkit-calendar-picker-indicator]:w-6 [&::-webkit-calendar-picker-indicator]:h-6 [&::-webkit-calendar-picker-indicator]:brightness-0
        [&::-webkit-calendar-picker-indicator]:saturate-100 [&::-webkit-calendar-picker-indicator]:invert-[0.3]
        [&::-webkit-calendar-picker-indicator]:sepia-[1] [&::-webkit-calendar-picker-indicator]:hue-rotate-[180deg] p-0!`
            }
        ],
        [
            { id: 5, name: "nationalId", type: "text", label: "ID", placeHolder: "Enter your ID", onChange: handleChange, value: formData.nationalId, error: errors.nationalId },
            { id: 6, name: "password", type: "password", label: "Password", placeHolder: "Enter your password", onChange: handleChange, value: formData.password, error: errors.password },
            {
                id: 7, type: "submit", label: "", className: "w-max h-auto",
                classNameInput: `cursor-pointer w-[var(--size-icon-lg)] 
                h-[var(--size-icon-lg)] p-0! bg-[var(--color-icon-success)]`, value: ""
            }
        ],
    ];

    const otherInputs = customInputs || inputProperties;

    return (
        <section className="w-full h-[581px] items-end flex flex-col gap-[var(--marging-section-S)]">
            <div className="flex flex-row justify-between w-full">
                <h2 className='bodyText text-[var(--color-text-black)]'>
                    {mode === "create" && "Please enter your personal information"}
                    {mode === "update" && "Update user information"}
                    {mode === "delete" && "Confirm user deletion"}
                </h2>
                {mode !== "delete" && (
                    <span
                        className='supportingText text-[var(--color-text-no-stock)] cursor-pointer'
                        onClick={resetForm}
                    >
                        Reset fields
                    </span>
                )}
            </div>

            <form onSubmit={handleSubmit} className="w-full bg-white h-auto flex flex-col border-[0.5px] rounded-[var(--radius-lg)]
      border-[var(--color-border-gray)] gap-[var(--marging-S)] pb-[var(--marging-section-M)]">
                {/* header */}
                <div className='w-full flex-row flex justify-between p-[var(--marging-M)] items-center
        border-b-[0.5px] border-[var(--color-border-gray)]'>
                    <p className='heading2 text-[var(--color-text-black)]'>Information</p>
                    <Icon name="blank" className="w-[var(--size-icon-lg)] h-[var(--size-icon-lg)]" />
                </div>

                {/* inputs */}
                <div className='w-full h-auto gap-[var(--marging-section-S)] px-[var(--marging-M)]'>
                    {mode !== "delete" ? (
                        otherInputs.map((row, index) => (
                            <div key={index} className='w-full flex flex-row gap-[var(--marging-M)] items-end'>
                                {row.map((input) => (
                                    <Inputs key={input.id} {...input} />
                                ))}
                            </div>
                        ))
                    ) : (
                        <div className="p-[var(--marging-M)] text-center">
                            <p className="bodyText text-[var(--color-text-black)]">
                                Are you sure you want to delete this user?
                            </p>
                            <button
                                type="submit"
                                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-red-600 transition"
                            >
                                Confirm delete
                            </button>
                        </div>
                    )}
                </div>
            </form>
        </section>
    );
}
