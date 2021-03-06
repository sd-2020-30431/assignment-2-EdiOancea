import React from 'react';
import { TextField as MuiTextField } from '@material-ui/core';
import { Field, FieldRenderProps } from 'react-final-form';

import Error from '../Error';

type Props = FieldRenderProps<string, any> & {
  variant: 'outlined';
  margin?: 'normal' | 'none' | 'dense';
  fullWidth?: boolean;
  id: string;
  label: string;
  name: string;
  autoComplete: string | undefined;
  autoFocus?: boolean;
  type: string;
  defaultValue?: string;
};

const TextField: React.FC<Props> = ({
  variant,
  margin = 'normal',
  fullWidth = true,
  id,
  label,
  name,
  autoComplete,
  autoFocus = false,
  type,
  defaultValue,
}) => (
  <Field
    {...{
      name,
      defaultValue,
      render: ({ input, meta: { error, touched } }) => (
        <>
          <MuiTextField
            {...{
              variant,
              margin,
              fullWidth,
              id,
              label,
              autoComplete,
              autoFocus,
              type,
              ...input,
            }}
          />
          <Error error={error} touched={touched} />
        </>
      ),
    }}
  />
);

export default TextField;
