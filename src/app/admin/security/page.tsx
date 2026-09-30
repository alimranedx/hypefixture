import { redirect } from 'next/navigation';

export default function AdminSecurityRedirect() {
  redirect('/admin/governance');
}
