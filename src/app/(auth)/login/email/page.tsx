import { redirect } from 'next/navigation';
import { ROUTES } from '@/constants';

/** Legacy route — email login now lives on the main login page. */
export default function LoginEmailRedirect() {
  redirect(ROUTES.LOGIN);
}
