// scripts/send-test.ts
import { Resend } from 'resend';

(async () => {
  const resend = new Resend(process.env.RESEND_API_KEY!);
  const r = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: 'julian.siwek+emx@gmail.com', // or any inbox you control
    subject: 'Resend direct test',
    text: 'If you read this, Resend is working end-to-end.',
  });
  console.log(r);
})();
