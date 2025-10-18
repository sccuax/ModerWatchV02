import Icon from '../sideBarLeft/icon'
import Inputs from './input'

export default function Forms(){

    const inputProperties = [
        //row 1
    [
        { id: 1, type: "text", label: "Name", placeHolder: "Enter your name" },
        { id: 2, type: "text", label: "Surname", placeHolder: "Enter your surname" }
    ],
        //row 2
    [
        { id: 3, type: "Email", label: "Email", placeHolder: "Enter your email" },
        { id: 4, type: "date", label: "Date of birht", placeHolder: "", className: "items-center w-auto! flex flex-row pt-0! items-center",
            classNameInput: ` border-none! w-12 text-transparent cursor-pointer [&::-webkit-datetime-edit]:hidden [&::-webkit-calendar-picker-indicator]:cursor-pointer     [&::-webkit-calendar-picker-indicator]:w-6
    [&::-webkit-calendar-picker-indicator]:h-6
    [&::-webkit-calendar-picker-indicator]:brightness-0
    [&::-webkit-calendar-picker-indicator]:saturate-100
    [&::-webkit-calendar-picker-indicator]:invert-[0.3]
    [&::-webkit-calendar-picker-indicator]:sepia-[1]
    [&::-webkit-calendar-picker-indicator]:hue-rotate-[180deg] p-0!`
        }
    ],
        ]

    return (
        <section className="w-full h-[581px] items-end flex flex-col gap-[var(--marging-section-S)]">
            <div className="flex flex-row justify-between w-full">
                <h2 className='bodyText text-[var(--color-text-black)]'>Please enter your personal informatino</h2>
                <span className='supportingText text-[var(--color-text-no-stock)]'>Reset fields</span>
            </div>
            <form action="POST" className="w-full h-auto flex flex-col border-[0.5px] rounded-[var(--radius-lg)]
            border-[var(--color-border-gray)] gap-[var(--marging-S)] pb-[var(--marging-section-M)]">
                {/*---------------header's forms--------------- */}
                <div className='w-full flex-row flex justify-between p-[var(--marging-M)] items-center
                border-b-[0.5px] border-[var(--color-border-gray)]'>
                    <p className='heading2 text-[var(--color-text-black)]'>Information</p>
                    <Icon
                    name="blank"
                    className="w-[var(--size-icon-lg)] h-[var(--size-icon-lg)]"
                    />
                </div>
                {/*---------------input container--------------- */}
                <div className='w-full h-auto gap-[var(--marging-section-S)] px-[var(--marging-M)]'>
                    {/*--------input row------- */}
                    {inputProperties.map((row, index) => (
                        <div key={index} className='w-full flex flex-row gap-[var(--marging-M)] items-end'>
                            {row.map((input) => (
                                <Inputs
                                    key={input.id}
                                    {...input}  // Spread todas las props
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </form>
        </section>
    )
}