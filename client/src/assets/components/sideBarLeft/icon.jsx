
import { ReactComponent as Home } from '../../Images/icons/home.svg';
import { ReactComponent as LogOut } from '../../Images/icons/logOut.svg';
import { ReactComponent as Bell } from '../../Images/icons/Bell.svg';
import { ReactComponent as Blank } from '../../Images/icons/Blank-file.svg';
import { ReactComponent as Calendar } from '../../Images/icons/Calendar.svg';
import { ReactComponent as ChooseDate } from '../../Images/icons/choose-date.svg';
import { ReactComponent as Contact } from '../../Images/icons/Contact.svg';
import { ReactComponent as Delete } from '../../Images/icons/Delete.svg';
import { ReactComponent as Deny } from '../../Images/icons/Deny.svg';
import { ReactComponent as Filter } from '../../Images/icons/Filter.svg';
import { ReactComponent as HelpInfo } from '../../Images/icons/help-info.svg';
import { ReactComponent as Login } from '../../Images/icons/Login.svg';
import { ReactComponent as Message } from '../../Images/icons/message.svg';
import { ReactComponent as Pencil } from '../../Images/icons/Pencil.svg';
import { ReactComponent as Product } from '../../Images/icons/product.svg';
import { ReactComponent as Search } from '../../Images/icons/Search.svg';
import { ReactComponent as Show } from '../../Images/icons/Show.svg';
import { ReactComponent as Submit } from '../../Images/icons/Submit.svg';
import { ReactComponent as Supplier } from '../../Images/icons/supplier.svg';
import { ReactComponent as Tutorial } from '../../Images/icons/Tutorial.svg';
import { ReactComponent as Update } from '../../Images/icons/update.svg';
import { ReactComponent as Verify } from '../../Images/icons/Verify.svg';
import { ReactComponent as WarningMessage } from '../../Images/icons/Warning-message.svg';
import { ReactComponent as Warning } from '../../Images/icons/warning.svg';

//dictionary of icons
const icons = {
    home: Home,
    logout: LogOut,
    bell: Bell,
    blank: Blank,
    calendar: Calendar,
    chooseDate: ChooseDate,
    contact: Contact,
    delete: Delete,
    deny: Deny,
    filter: Filter,
    helpInfo: HelpInfo,
    login: Login,
    message: Message,
    pencil: Pencil,
    product: Product,
    search: Search,
    show: Show,
    submit: Submit,
    supplier: Supplier,
    tutorial: Tutorial,
    update: Update,
    verify: Verify,
    warningMessage: WarningMessage,
    warning: Warning,
};


//dynamic icon component
export default function Icon({ name, className, ...props }) {
    const IconComponent = icons[name];

        if (!IconComponent) {
        console.warn(`Icono '${name}' no encontrado. Iconos disponibles: ${Object.keys(icons).join(', ')}`);
        return null;

    } // if icon does not exist, it won't render anything
    return <div className='relative w-6 h-6'>
            <IconComponent className={className} {...props}/>
        </div>;
}