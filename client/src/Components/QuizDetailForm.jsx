import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const QuizDetailForm = ({ initialValues, onSubmit }) => {
  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    pass_mark: Yup.number().required('Pass mark is required').min(0, 'Pass mark must be at least 0').max(100, 'Pass mark cannot exceed 100'),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched }) => (
        <Form className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <Field id="title" name="title" type="text" className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${errors.title && touched.title ? 'border-red-500' : ''}`} />
            {errors.title && touched.title && <div className="text-red-500 text-sm">{errors.title}</div>}
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <Field id="description" name="description" type="text" as="textarea" className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${errors.description && touched.description ? 'border-red-500' : ''}`} />
            {errors.description && touched.description && <div className="text-red-500 text-sm">{errors.description}</div>}
          </div>
          <div>
            <label htmlFor="pass_mark" className="block text-sm font-medium text-gray-700">Pass Mark (%)</label>
            <Field id="pass_mark" name="pass_mark" type="number" className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${errors.pass_mark && touched.pass_mark ? 'border-red-500' : ''}`} />
            {errors.pass_mark && touched.pass_mark && <div className="text-red-500 text-sm">{errors.pass_mark}</div>}
          </div>
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out">Save</button>
        </Form>
      )}
    </Formik>
  );
};

export default QuizDetailForm;
