// UserInfoForm.jsx
import './UserInfoForm.css';
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const countries = [
  { value: 'romania', label: 'România' },
  { value: 'moldova', label: 'Moldova' },
];

const regions = {
  romania: [
    { value: 'bucuresti', label: 'București' },
    { value: 'cluj', label: 'Cluj' },
    { value: 'iasi', label: 'Iași' },
  ],
  moldova: [
    { value: 'chisinau', label: 'Chișinău' },
    { value: 'balti', label: 'Bălți' },
  ],
};

const validationSchema = Yup.object({
  name: Yup.string()
    .matches(/^[a-zA-ZăîâșțĂÎÂȘȚ]+$/, 'Numele poate conține doar litere')
    .required('Numele este obligatoriu')
    .min(2, 'Numele trebuie să conțină cel puțin 2 caractere'),
  firstname: Yup.string()
    .matches(/^[a-zA-ZăîâșțĂÎÂȘȚ]+$/, 'Prenumele poate conține doar litere')
    .required('Prenumele este obligatoriu')
    .min(2, 'Prenumele trebuie să conțină cel puțin 2 caractere'),
  email: Yup.string()
    .email('Adresa de email nu este validă')
    .required('Email-ul este obligatoriu'),
  phone: Yup.string()
    .matches(/^[0-9]+$/, 'Numărul de telefon poate conține doar cifre')
    .min(10, 'Numărul de telefon trebuie să aibă cel puțin 10 cifre')
    .required('Numărul de telefon este obligatoriu'),
  country: Yup.string().required('Selectați o țară'),
  region: Yup.string().required('Selectați un județ'),
});

const UserInfoForm = ({ onSubmit }) => {
  const [selectedCountry, setSelectedCountry] = useState('');

  return (
    <Formik
      initialValues={{
        name: '',
        firstname: '',
        email: '',
        phone: '',
        country: '',
        region: '',
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log('Informații despre utilizator:', values);
        onSubmit(values);
      }}
    >
      {({ setFieldValue }) => (
        <Form className="user-info-form">
          <div className="input-group">
            <div className="form-group">
              <label htmlFor="name">Nume:</label>
              <Field name="name" type="text" />
              <ErrorMessage name="name" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="firstname">Prenume:</label>
              <Field name="firstname" type="text" />
              <ErrorMessage name="firstname" component="div" className="error" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <Field name="email" type="email" />
            <ErrorMessage name="email" component="div" className="error" />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Telefon:</label>
            <Field name="phone" type="text" />
            <ErrorMessage name="phone" component="div" className="error" />
          </div>

          <div className="input-group">
            <div className="form-group">
              <label htmlFor="country">Țară:</label>
              <Field
                as="select"
                name="country"
                onChange={(e) => {
                  const selected = e.target.value;
                  setSelectedCountry(selected);
                  setFieldValue('country', selected);
                  setFieldValue('region', ''); 
                }}
              >
                <option value="" label="Selectați o țară" />
                {countries.map((country) => (
                  <option key={country.value} value={country.value}>
                    {country.label}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="country" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="region">Județ:</label>
              <Field as="select" name="region">
                <option value="" label="Selectați un județ" />
                {selectedCountry &&
                  regions[selectedCountry]?.map((region) => (
                    <option key={region.value} value={region.value}>
                      {region.label}
                    </option>
                  ))}
              </Field>
              <ErrorMessage name="region" component="div" className="error" />
            </div>
          </div>

          <button type="submit">Trimite Informații Utilizator</button>
        </Form>
      )}
    </Formik>
  );
};

export default UserInfoForm;
