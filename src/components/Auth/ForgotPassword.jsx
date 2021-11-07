import React, { useEffect, useRef } from 'react';
import { useTheme } from 'styled-components';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';

import Text from '../Typography/Text';
import H1 from '../Typography/H1';
import FormContainer from './FormContainer';
import { ReCaptcha } from './ReCaptcha';
import { useAuth } from '../../hooks/useAuth';
import Form from './Form';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
  ,
  captchaToken: Yup.string().required('Verify you are a human'),
});

const ForgotPassword = () => {
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

  const submitRef = useRef(null);

  const emailRef = useRef(null);

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
      await auth.sendPasswordResetEmail('is' + data.email + '@ed.ritsumei.ac.jp');
      toast('Check email to complete. 📧');
      reset();
    } catch {
      toast.error('Error resetting password.');
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
        Forgot Password
      </H1>
      <Text margin='0 0 1rem 0' textAlign='center'>
        Enter your email.
      </Text>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <label>is
          <input
            type='text'
            name='email'
            placeholder='Email'
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
    </FormContainer>
  );
};

export default ForgotPassword;
