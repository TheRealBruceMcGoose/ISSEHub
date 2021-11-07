import React, { useEffect, useRef } from 'react';
import { useTheme } from 'styled-components';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { useHistory, Link } from 'react-router-dom';

import H1 from '../Typography/H1';
import Text from '../Typography/Text';
import FormContainer from './FormContainer';
import { ReCaptcha } from './ReCaptcha';
import { useAuth } from '../../hooks/useAuth';
import Form from './Form';
import Particles from 'react-particles-js';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
  ,
  password: Yup.string().required('Password is required'),
  captchaToken: Yup.string().required('Verify you are a human'),
});

const Login = () => {
  const {
    register,
    handleSubmit,
    errors,
    reset,
    setValue,
    clearErrors,
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const auth = useAuth();

  const theme = useTheme();

  const history = useHistory();

  const submitRef = useRef(null);

  const emailRef = useRef(null);

  const passwordRef = useRef(null);

  // Manually register captchaToken
  useEffect(() => {
    register({ name: 'captchaToken' });
  }, []);

  // Watch for changes to captcha
  const watchCaptcha = watch('captchaToken');

  // Set focus on email
  useEffect(() => {
    emailRef.current.focus();
  }, []);

  const onSubmit = async (data) => {
    try {
      await auth.login('is' + data.email + '@ed.ritsumei.ac.jp', data.password);
      toast('Welcome! 👋');
      reset();
      history.push('/');
    } catch {
      toast.error('Error logging in.');
    }
  };

  const onVerifyCaptcha = (token) => {
    setValue('captchaToken', token);
    clearErrors(['captchaToken']);
    submitRef.current.focus();
  };

  return (
    <FormContainer>
      <H1 textAlign='center' margin='0 0 2rem 0'>
        ISSE Hub
      </H1>
      <Text margin='0 0 1rem 0' textAlign='center'>
        Enter your ISSE email and password.
      </Text>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <label>is
          <input
            type='text'
            name='email'
            placeholder=''
            autoComplete='off'
            ref={(e) => {
              register(e);
              emailRef.current = e;
            }}
          />
          {errors.email && (
            <Text
              color='#F6406C'
              size='small'
              margin='0 0 1rem 0'
              textAlign='center'
            >
              {errors.email.message}
            </Text>
          )}
          @ed.ritsumei.ac.jp
        </label>
        <input
          type='password'
          name='password'
          placeholder='Password'
          ref={(e) => {
            register(e);
            passwordRef.current = e;
          }}
        />
        {errors.password && (
          <Text
            color='#F6406C'
            size='small'
            margin='0 0 1rem 0'
            textAlign='center'
          >
            {errors.password.message}
          </Text>
        )}
        <ReCaptcha
          onVerifyCaptcha={onVerifyCaptcha}
          backgroundColor={
            watchCaptcha ? theme.colors.black1 : theme.colors.black2
          }
          hover={'none'}
          verified={watchCaptcha}
          margin='0 0 1rem 0'
        />
        {errors.captchaToken && (
          <Text
            color='#F6406C'
            size='small'
            margin='0 0 1rem 0'
            textAlign='center'
          >
            {errors.captchaToken.message}
          </Text>
        )}
        <input type='submit' value='Submit' ref={submitRef} />
      </Form>
      <Link to='/forgot-password'>Forgot password?</Link>
      <Particles className="particles"
        params={{
          "particles": {
            "number": {
              "value": 50
            },
            "size": {
              "value": 3
            }
          },
          "interactivity": {
            "events": {
              "onhover": {
                "enable": true,
                "mode": "repulse"
              }
            }
          }
        }} />
    </FormContainer>

  );
};

export default Login;
