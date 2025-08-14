import { $, component$, QRL } from '@builder.io/qwik';

import css from './developer.module.css';

type DeveloperProps = {
  developer: Developer;
  onEdit?: QRL<(id: string) => void>;
  onDelete?: QRL<(id: string) => void>;
};

export default component$<DeveloperProps>(({ developer, onEdit, onDelete }) => {
  const status = developer.isJunior ? 'junior' : 'senior';

  return (
    <div class={css.developer}>
      <h3 class={css.developer__name}>{developer.name}</h3>
      <span class={css.developer__badge} data-status={status}>
        {status}
      </span>
      <div class={css.developer__frameworks}>
        <span>Frameworks & Technologies:</span>
        {developer.frameworks.length > 0 ? (
          <div class={css['developer__framework-list']}>
            {developer.frameworks.map((framework) => (
              <span key={framework.name} class={css.developer__framework}>
                {framework.name}
              </span>
            ))}
          </div>
        ) : (
          <span class={css['developer__no-frameworks']}>
            No frameworks specified
          </span>
        )}
      </div>

      <div class={css.developer__actions}>
        {onEdit && (
          <button
            class={css['developer__actions-edit']}
            onClick$={$(async () => await onEdit(developer.id))}
          >
            edit
          </button>
        )}

        {onDelete && (
          <button
            class={css['developer__actions-delete']}
            onClick$={$(async () => await onDelete(developer.id))}
          >
            remove
          </button>
        )}
      </div>
    </div>
  );
});
