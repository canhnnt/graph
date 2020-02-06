import { settings } from '../config/setting';

const setLocale = locale => {
  localStorage.setItem('locale', locale);
  return locale;
};

export const getLocale = () => {
  const locale = localStorage.getItem('locale');
  return locale && settings.locales.includes(locale) ? locale : setLocale('en');
}

