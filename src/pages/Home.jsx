import React, { useState } from 'react';
import TestResult from '../components/TestResult';
import SendEmailForm from '../components/SendEmailForm';

export default function Home() {
  const [result, setResult] = useState({
    message: "Emails sent",
    totalSenders: 6,
    senderFailures: 0,
    totalReceivers: 6,
    receiverFailures: 0,
    responseTime: "21.468 seconds",
  });
  return (
    
    <div className="container">
      <div className="test-result">
        <TestResult  result={result}/>
      </div>
      <div className="send-email-form">
        <SendEmailForm setResult={setResult}/>
      </div>
    </div>
  );
}
