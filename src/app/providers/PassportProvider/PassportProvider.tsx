import { PassportProvider } from '../../../entities/passport/context';

export const withPassport = (component: () => React.ReactNode) => () => (
	<PassportProvider>{component()}</PassportProvider>
);
