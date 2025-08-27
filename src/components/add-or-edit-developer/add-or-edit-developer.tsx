import { $, component$ } from '@builder.io/qwik';

import { useDeveloper } from '~/contexts/use-developer';

import styles from './add-or-edit-developer.module.css';

import { Modal } from '@qwik-ui/headless';
import Input from '../form/input';

export default component$(() => {
  const { developer, createOrEdit, isAddOrEditDeveloperOpen, clearDeveloper } =
    useDeveloper();

  const saveForm = $(async (event: SubmitEvent) => {
    const success = await createOrEdit();
    if (success) {
      (event.target as HTMLFormElement)?.reset();
    } else {
      console.error('Failed to save developer.');
    }
  });

  return (
    <Modal.Root bind:show={isAddOrEditDeveloperOpen} onClose$={clearDeveloper}>
      <Modal.Trigger class={styles['add-or-edit-developer__trigger']}>
        + Add Developer
      </Modal.Trigger>
      <Modal.Panel class={styles['add-or-edit-developer__panel']}>
        <div class={styles['add-or-edit-developer__container']}>
          <h2 class={styles['add-or-edit-developer__title']}>
            {developer.id ? 'Edit Developer' : 'Add New Developer'}
          </h2>

          <form
            id="add-or-edit-developer-form"
            class={styles['add-or-edit-developer__form']}
            preventdefault:submit
            onSubmit$={saveForm}
          >
            <Input
              label="Developer Name"
              input={{
                type: 'text',
                required: true,
                value: developer.name,
                placeholder: 'Enter developer name (e.g., John Doe)',
                onChange$: $(
                  (e: Event) =>
                    (developer.name = (e.target as HTMLInputElement).value)
                ),
              }}
            />

            <Input
              label="Junior Developer"
              input={{
                type: 'checkbox',
                checked: developer.isJunior,
                onChange$: $(
                  (e: Event) =>
                    (developer.isJunior = (
                      e.target as HTMLInputElement
                    ).checked)
                ),
              }}
            />

            <Input
              label="Add Framework/Technology"
              input={{
                type: 'text',
                placeholder: 'Enter framework name (e.g., React, Vue, Angular)',
                onKeyDown$: $((e: KeyboardEvent) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const value = (e.target as HTMLInputElement).value.trim();
                    if (
                      value &&
                      !developer.frameworks.some(
                        (f) => f.name.toLowerCase() === value.toLowerCase()
                      )
                    ) {
                      developer.frameworks.push({ name: value });
                      (e.target as HTMLInputElement).value = '';
                    }
                  }
                }),
              }}
              helperText='Press "Enter" to add a framework or technology'
            />

            {developer.frameworks.length > 0 ? (
              <div class={styles['add-or-edit-developer__frameworks']}>
                {developer.frameworks.map((framework, index) => (
                  <div
                    key={framework.name}
                    class={styles['add-or-edit-developer__framework-item']}
                  >
                    <p class={styles['add-or-edit-developer__framework-name']}>
                      {framework.name}
                    </p>
                    <button
                      type="button"
                      class={styles['add-or-edit-developer__remove-button']}
                      onClick$={() => {
                        developer.frameworks.splice(index, 1);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div class={styles['add-or-edit-developer__frameworks--empty']}>
                No frameworks added yet. Add some technologies this developer
                works with!
              </div>
            )}
          </form>
        </div>

        <footer class={styles['add-or-edit-developer__footer']}>
          <Modal.Close class={styles['add-or-edit-developer__button']}>
            Cancel
          </Modal.Close>
          <button
            type="submit"
            form="add-or-edit-developer-form"
            class={[
              styles['add-or-edit-developer__button'],
              styles['add-or-edit-developer__button--primary'],
            ]}
          >
            {developer.id ? 'Update Developer' : 'Add Developer'}
          </button>
        </footer>
      </Modal.Panel>
    </Modal.Root>
  );
});
