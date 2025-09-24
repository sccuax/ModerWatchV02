import { ReactComponent as Home } from '../../Images/home.svg';
import { ReactComponent as Users } from '../../Images/users.svg';
import { ReactComponent as Settings } from '../../Images/settings.svg';
import { ReactComponent as LogOut } from '../../Images/log-out.svg';
import { ReactComponent as Bell } from '../../Images/Bell.svg'; 
import { ReactComponent as Blank } from '../../Images/Blnak-file.svg'; 
import { ReactComponent as Calendar } from '../../Images/Calendar.svg';
import { ReactComponent as ChooseDate } from '../../Images/choose-date.svg';
import { ReactComponent as Contact } from '../../Images/Contact.svg';
import { ReactComponent as Delete } from '../../Images/Delete.svg';
import { ReactComponent as Deny } from '../../Images/Deny.svg';
import { ReactComponent as Filter } from '../../Images/Filter.svg';
import { ReactComponent as helpInfo } from '../../Images/help-info.svg';
import { ReactComponent as Login } from '../../Images/Login.svg';
import { ReactComponent as message } from '../../Images/message.svg';
import { ReactComponent as Pencil } from '../../Images/Pencil.svg';
import { ReactComponent as product } from '../../Images/product.svg';
import { ReactComponent as Search } from '../../Images/Search.svg';
import { ReactComponent as Show } from '../../Images/Show.svg';
import { ReactComponent as Submit } from '../../Images/Submit.svg';
import { ReactComponent as supplier } from '../../Images/supplier.svg';
import { ReactComponent as Tutorial } from '../../Images/Tutorial.svg';
import { ReactComponent as update } from '../../Images/update.svg';
import { ReactComponent as Verify } from '../../Images/Verify.svg';
import { ReactComponent as WarningMessage } from '../../Images/Warning-message.svg';
import { ReactComponent as warning } from '../../Images/warning.svg';

//dictionary of icons
const icons = {
    home: Home,
    users: Users,
    settings: Settings,
    logout: LogOut,
    bell: Bell,
    blank: Blank,
    calendar: Calendar,
    chooseDate: ChooseDate,
    contact: Contact,
    delete: Delete,
    deny: Deny,
    filter: Filter,
    helpInfo: helpInfo,
    login: Login,
    message: message,
    pencil: Pencil,
    product: product,
    search: Search,
    show: Show,
    submit: Submit,
    supplier: supplier,
    tutorial: Tutorial,
    update: update,
    verify: Verify,
    warningMessage: WarningMessage,
    warning: warning,
};


//dynamic icon component
export default function Icon({ name, className }) {
    const IconComponent = icons[name];
        if (!IconComponent) return null; // if icon does not exist, it won't render anything
    return <div className='relative w-6 h-6'>
            <IconComponent className={className} />
        </div>;
}