// Navigation links interface
export interface NavigationLinks {
  readonly signIn: string;
  readonly logIn: string;
  readonly product: string;
  readonly cart: string;
}

export type INavbarItem = {
  href: string;
  label: string;
};

export type IHeaderProps = {
  navbarItems: INavbarItem[];
};