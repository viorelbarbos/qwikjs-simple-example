import { component$, PropsOf } from '@builder.io/qwik';
import { Label } from '@qwik-ui/headless';

import css from './input.module.css';

type InputProps = {
  label: string;
  cssClass?: string;
  helperText?: string;
  input: PropsOf<'input'>;
};

export default component$<InputProps>(
  ({ label, helperText, cssClass, input }) => {
    return (
      <Label
        class={[css['input__label'], cssClass, input?.type && css[input.type]]}
      >
        {label}
        <input {...input} class={[css.input, input.class]} />
        {helperText && (
          <small class={css['input__helper-text']}>{helperText}</small>
        )}
      </Label>
    );
  }
);
