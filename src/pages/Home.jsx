import React from 'react';
import TestResult from '../components/TestResult';
import SendEmailForm from '../components/SendEmailForm';

export default function Home() {
  return (
    <div className="container">
      <div className="test-result">
        <TestResult />
      </div>
      <div className="send-email-form">
        <SendEmailForm />
      </div>
    </div>
  );
}
