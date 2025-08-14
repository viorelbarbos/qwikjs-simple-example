import { component$ } from '@builder.io/qwik';

import AddOrEditDeveloper from '~/components/add-or-edit-developer/add-or-edit-developer';
import Developers from '~/components/developers/developers';

export default component$(() => {
  return (
    <div>
      <AddOrEditDeveloper />
      <Developers />
    </div>
  );
});
