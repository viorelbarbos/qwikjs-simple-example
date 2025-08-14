import { $, component$, useStore } from '@builder.io/qwik';
import { Link, type DocumentHead } from '@builder.io/qwik-city';
import { Modal, Label, Tabs } from '@qwik-ui/headless';
import AddOrEditModal from '~/components/add-or-edit-developer/add-or-edit-developer';
import { useDeveloper } from '~/contexts/use-developer';
export default component$(() => {
  const { devStore: dataStore } = useDeveloper();

  return (
    <>
      Go to{' '}
      <Link href="/developers" class="text-blue-500 hover:underline">
        Developers
      </Link>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Welcome to Qwik',
  meta: [
    {
      name: 'description',
      content: 'Qwik site description',
    },
  ],
};
