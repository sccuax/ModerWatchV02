import { useState } from 'react'
import Icon from '../sideBarLeft/icon'
import Inputs from './input'

export default function Forms({ mode = "create", initialData = {}, onSubmitUrl, customInputs }) {

    const [formData, setFormData] = useState({
        name: initialData.name || '',
        surname: initialData.surname || '',
        email: initialData.email || '',
        dateOfBirth: initialData.dateOfBirth || '',
        nationalId: initialData.nationalId || '',
        password: initialData.password || ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
                if (mode === "create") alert('✅ User created successfully');
                if (mode === "update") alert('✅ User updated successfully');
                if (mode === "delete") alert('🗑️ User deleted successfully');

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

            } else {
                alert(`⚠️ Error: ${data.error || 'Operation failed'}`);
            }

        } catch (error) {
            console.error('Error:', error);
            alert('❌ Error connecting to the database');
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
            { id: 1, name: "name", type: "text", label: "Name", placeHolder: "Enter your name", onChange: handleChange, value: formData.name },
            { id: 2, name: "surname", type: "text", label: "Surname", placeHolder: "Enter your surname", onChange: handleChange, value: formData.surname }
        ],
        [
            { id: 3, name: "email", type: "Email", label: "Email", placeHolder: "Enter your email", onChange: handleChange, value: formData.email },
            {
                id: 4, name: "dateOfBirth", type: "date", label: "Date of birth", onChange: handleChange, value: formData.dateOfBirth,
                classNameInput: `border-none! w-12 text-transparent cursor-pointer [&::-webkit-datetime-edit]:hidden [&::-webkit-calendar-picker-indicator]:cursor-pointer
        [&::-webkit-calendar-picker-indicator]:w-6 [&::-webkit-calendar-picker-indicator]:h-6 [&::-webkit-calendar-picker-indicator]:brightness-0
        [&::-webkit-calendar-picker-indicator]:saturate-100 [&::-webkit-calendar-picker-indicator]:invert-[0.3]
        [&::-webkit-calendar-picker-indicator]:sepia-[1] [&::-webkit-calendar-picker-indicator]:hue-rotate-[180deg] p-0!`
            }
        ],
        [
            { id: 5, name: "nationalId", type: "text", label: "ID", placeHolder: "Enter your ID", onChange: handleChange, value: formData.nationalId },
            { id: 6, name: "password", type: "password", label: "Password", placeHolder: "Enter your password", onChange: handleChange, value: formData.password },
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

            <form onSubmit={handleSubmit} className="w-full h-auto flex flex-col border-[0.5px] rounded-[var(--radius-lg)]
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
