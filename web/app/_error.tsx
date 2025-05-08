'use client';
import React from 'react';
import { NextPageContext } from 'next';

type ErrorPageProps = {
  statusCode: number;
};

const ErrorPage = ({ statusCode }: ErrorPageProps) => {
  if (statusCode === 404) {
    return <h1>Page Not Found (404)</h1>;
  }

  return <h1>An error occurred: {statusCode}</h1>;
};

// This function will allow you to capture the error status during SSR or when there's an error
ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorPage;
