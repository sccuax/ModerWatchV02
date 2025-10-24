// Importa los SVGs de a poco para encontrar el problemático
// Descomenta línea por línea hasta encontrar cuál falla

import Home from '../../Images/icons/home.svg?react';
import LogOut from '../../Images/icons/logOut.svg?react';
import Bell from '../../Images/icons/Bell.svg?react';
import Blank from '../../Images/icons/Blank-file.svg?react';
import Calendar from '../../Images/icons/Calendar.svg?react';
import ChooseDate from '../../Images/icons/choose-date.svg?react';
// import Contact from '../../Images/icons/Contact.svg?react';
import Delete from '../../Images/icons/Delete.svg?react';
import Deny from '../../Images/icons/Deny.svg?react';
import Filter from '../../Images/icons/Filter.svg?react';
import HelpInfo from '../../Images/icons/help-info.svg?react';
import Login from '../../Images/icons/Login.svg?react';
import Message from '../../Images/icons/message.svg?react';
import Pencil from '../../Images/icons/Pencil.svg?react';
import Product from '../../Images/icons/product.svg?react';
import Search from '../../Images/icons/Search.svg?react';
// import Show from '../../Images/icons/Show.svg?react';
import Submit from '../../Images/icons/Submit.svg?react';
import Supplier from '../../Images/icons/supplier.svg?react';
// import Tutorial from '../../Images/icons/Tutorial.svg?react';
import Update from '../../Images/icons/update.svg?react';
import Verify from '../../Images/icons/Verify.svg?react';
// import WarningMessage from '../../Images/icons/Warning-message.svg?react';
import Warning from '../../Images/icons/warning.svg?react';
import Close from '../../Images/icons/close.svg?react';

// Dictionary of icons - comenta los que no estén importados arriba
const icons = {

  home: Home,
  logout: LogOut,
  bell: Bell,
  blank: Blank,
  calendar: Calendar,
  chooseDate: ChooseDate,
  // contact: Contact,
  delete: Delete,
  deny: Deny,
  filter: Filter,
  helpInfo: HelpInfo,
  login: Login,
  message: Message,
  pencil: Pencil,
  product: Product,
  search: Search,
  // show: Show,
  submit: Submit,
  supplier: Supplier,
  // tutorial: Tutorial,
  update: Update,
  verify: Verify,
  // warningMessage: WarningMessage,
  warning: Warning,
  close: Close
};

// Dynamic icon component
export default function Icon({ name, className, ...props }) {
  const IconComponent = icons[name];

  if (!IconComponent) {
    console.warn(
      `Icono '${name}' no encontrado. Iconos disponibles: ${Object.keys(icons).join(', ')}`
    );
    return null;
  }

  return (
    <div className="relative w-auto h-auto">
      <IconComponent className={className} {...props} />
    </div>
  );
}