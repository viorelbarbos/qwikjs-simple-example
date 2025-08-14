import { component$ } from '@builder.io/qwik';

import { useDeveloper } from '~/contexts/use-developer';

import css from './developers.module.css';

import Developer from './developer/developer';

export default component$(() => {
  const { devStore, editDeveloper, removeDeveloper } = useDeveloper();
  return (
    <div class={css.developers}>
      {devStore.developers.map((developer) => (
        <Developer
          key={developer.id}
          developer={developer}
          onEdit={editDeveloper}
          onDelete={removeDeveloper}
        />
      ))}
    </div>
  );
});
