import {
  $,
  component$,
  createContextId,
  QRL,
  Signal,
  Slot,
  useContext,
  useContextProvider,
  useSignal,
  useStore,
} from '@builder.io/qwik';

import { developers } from '~/mock-data/developers';

type DeveloperContext = {
  devStore: DevStore;
  developer: Developer;
  isAddOrEditDeveloperOpen: Signal<boolean>;
  createOrEdit: QRL<() => Promise<boolean>>;
  editDeveloper: QRL<(id: string) => void>;
  removeDeveloper: QRL<(id: string) => void>;
  clearDeveloper: QRL<() => void>;
};

const developerContextId = createContextId<DeveloperContext>('FormContext');

export const DeveloperContextProvider = component$(() => {
  const devStore = useStore<DevStore>({
    developers: developers,
  });

  const developer = useStore<Developer>({
    id: '',
    name: '',
    isJunior: false,
    frameworks: [],
  });

  const isAddOrEditDeveloperOpen = useSignal(false);

  const clearDeveloper = $(() => {
    developer.id = '';
    developer.name = '';
    developer.isJunior = false;
    developer.frameworks = [];
  });

  const closeModal = $(() => {
    isAddOrEditDeveloperOpen.value = false;
  });

  const editDeveloper = $((id: string) => {
    const dev = devStore.developers.find((d) => d.id === id);

    if (dev) {
      developer.id = dev.id;
      developer.name = dev.name;
      developer.isJunior = dev.isJunior;
      developer.frameworks = [...dev.frameworks];
      isAddOrEditDeveloperOpen.value = true;
    } else {
      console.error(`Developer with name ${id} not found.`);
    }
  });

  const createOrEdit = $(async () => {
    let existingDev = devStore.developers.find((d) => d.id === developer.id);

    if (existingDev) {
      const index = devStore.developers.indexOf(existingDev);
      devStore.developers[index] = {
        id: developer.id,
        name: developer.name,
        isJunior: developer.isJunior,
        frameworks: [...developer.frameworks],
      };
      await closeModal();
      await clearDeveloper();
      return true;
    }

    existingDev = devStore.developers.find((d) => d.name === developer.name);

    if (existingDev) {
      console.error(`Developer with name ${developer.name} already exists.`);
      return false;
    }

    devStore.developers.push({
      id: crypto.randomUUID(),
      name: developer.name,
      isJunior: developer.isJunior,
      frameworks: [...developer.frameworks],
    });
    await closeModal();
    await clearDeveloper();
    return true;
  });

  const removeDeveloper = $((id: string) => {
    const index = devStore.developers.findIndex((d) => d.id === id);
    if (index !== -1) {
      devStore.developers.splice(index, 1);
    } else {
      console.error(`Developer with id ${id} not found.`);
    }
  });

  useContextProvider(developerContextId, {
    devStore,
    developer,
    isAddOrEditDeveloperOpen,
    createOrEdit,
    editDeveloper,
    removeDeveloper,
    clearDeveloper,
  });

  return <Slot />;
});

export const useDeveloper = () => {
  const context = useContext(developerContextId);
  if (!context) {
    throw new Error('useForm must be used within a FormContextProvider');
  }
  return context;
};
