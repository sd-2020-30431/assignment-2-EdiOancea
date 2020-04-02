import React from 'react';
import * as Yup from 'yup';
import { withRouter, RouteComponentProps } from 'react-router';

import Button from '../../components/forms/Button';
import TextField from '../../components/forms/TextField';
import SignInComponent from '../../components/forms/SignIn';
import Form from '../../components/forms/Form';
import APIRequests from '../APIRequests';

type Props = RouteComponentProps<{}>;

class SignInPage extends React.Component<Props, {}> {
  private validationSchema: Yup.ObjectSchema<SignInValidationSchema>;
  private fields: FieldType[] = [
    {
      fieldProps: {
        id: 'email',
        label: 'Email',
        name: 'email',
        autoComplete: 'off',
      },
      component: TextField,
    },
    {
      fieldProps: {
        id: 'password',
        label: 'Password',
        name: 'password',
        type: 'password',
        autoComplete: 'nope',
      },
      component: TextField,
    },
  ];

  constructor(props: Props) {
    super(props);

    this.validationSchema = Yup.object<SignInValidationSchema>().shape({
      email: Yup.string().required('This field is required'),
      password: Yup.string().required('This field is required'),
    });
  }

  componentDidMount() {
    if (!localStorage.getItem('token')) {
      return;
    }

    this.props.history.push('/');
  }

  private onSubmit = async (values: SignInValidationSchema) => {
    const { token } = await APIRequests.request('POST', '/auth', values);

    if (token) {
      localStorage.setItem('token', token);

      this.props.history.push('/');
    }
  }

  renderForm = () => (
    <Form
      {...{
        onSubmit: this.onSubmit,
        validationSchema: this.validationSchema,
        fields: this.fields,
        submitButton: { render: () => <Button type="submit">Sign in</Button> },
        errors: null,
      }}
    />
  )

  render() {
    return (
      <SignInComponent renderForm={this.renderForm}/>
    );
  }
}

export default withRouter(SignInPage);
