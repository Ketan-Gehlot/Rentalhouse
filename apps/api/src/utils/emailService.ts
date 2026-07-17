import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendAdminMeetingRequestEmail = async (userName: string, userEmail: string, userId: string) => {
  const mailOptions = {
    from: `"RentMate System" <${process.env.EMAIL_USER}>`,
    to: 'mandrisk371@gmail.com',
    subject: 'New Super Trusted Meeting Request',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #0F172A; padding: 24px; text-align: center;">
          <h2 style="color: #FFC107; margin: 0;">👑 Super Trusted Request</h2>
        </div>
        <div style="padding: 32px;">
          <p style="font-size: 16px;">Hello Admin,</p>
          <p style="font-size: 16px;">A user has requested a meeting to get the Super Trusted badge.</p>
          
          <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 24px 0;">
            <p style="margin: 0 0 8px 0;"><strong>Name:</strong> ${userName}</p>
            <p style="margin: 0 0 8px 0;"><strong>Email:</strong> ${userEmail}</p>
            <p style="margin: 0;"><strong>User ID:</strong> ${userId}</p>
          </div>

          <p style="font-size: 14px; color: #6b7280;">Please arrange a meeting with them. Once the meeting is done, you can approve their status.</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Admin request email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending admin request email:', error);
    return false;
  }
};

export const sendWelcomeEmail = async (userName: string, userEmail: string) => {
  const mailOptions = {
    from: `"RentMate Team" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: 'Welcome to RentMate! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #0F172A; padding: 24px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0;">Welcome to RentMate!</h2>
        </div>
        <div style="padding: 32px;">
          <p style="font-size: 16px;">Hello ${userName},</p>
          <p style="font-size: 16px;">We are thrilled to have you join RentMate India! Your account has been successfully created.</p>
          
          <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 24px 0;">
            <p style="margin: 0 0 8px 0;"><strong>What's next?</strong></p>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Explore premium verified properties</li>
              <li>List your own property securely</li>
              <li>Connect directly with owners and tenants</li>
            </ul>
          </div>

          <p style="font-size: 16px;">If you have any questions, feel free to reply to this email.</p>
          <br/>
          <p style="font-size: 14px; color: #6b7280;">Best regards,<br/>The RentMate Team</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
};

export const sendUserApprovalEmail = async (userName: string, userEmail: string) => {
  const mailOptions = {
    from: `"RentMate Admin" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: 'Congratulations! You are now Super Trusted 👑',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #FFC107; padding: 24px; text-align: center;">
          <h2 style="color: #78350f; margin: 0;">👑 Super Trusted Badge Unlocked!</h2>
        </div>
        <div style="padding: 32px;">
          <p style="font-size: 16px;">Hi ${userName},</p>
          <p style="font-size: 16px;">Congratulations! Following our meeting, your account has been upgraded to <strong>Super Trusted</strong>.</p>
          
          <p style="font-size: 16px;">Your listings will now feature the exclusive Golden Crown badge, making your properties stand out and instantly signaling high trust to potential tenants.</p>
          
          <p style="font-size: 16px;">Thank you for being an exceptional owner on RentMate!</p>
          
          <div style="margin-top: 32px; text-align: center;">
            <a href="http://localhost:3000/profile" style="background-color: #0F172A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">View Your Profile</a>
          </div>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('User approval email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending user approval email:', error);
    return false;
  }
};

export const sendOwnerContactEmail = async (
  ownerEmail: string,
  ownerName: string,
  propertyTitle: string,
  buyerName: string,
  buyerEmail: string,
  buyerPhone: string | null
) => {
  const mailOptions = {
    from: `"RentMate System" <${process.env.EMAIL_USER}>`,
    to: ownerEmail,
    subject: `New Lead for Your Property: ${propertyTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #0F172A; padding: 24px; text-align: center;">
          <h2 style="color: #fff; margin: 0;">🏡 Someone is interested in your property!</h2>
        </div>
        <div style="padding: 32px;">
          <p style="font-size: 16px;">Hi ${ownerName},</p>
          <p style="font-size: 16px;">Great news! A user on RentMate has requested to contact you regarding your listing: <strong>${propertyTitle}</strong>.</p>
          
          <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 24px 0;">
            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px; text-transform: uppercase; font-weight: bold;">User Details</p>
            <p style="margin: 0 0 8px 0;"><strong>Name:</strong> ${buyerName}</p>
            <p style="margin: 0 0 8px 0;"><strong>Email:</strong> ${buyerEmail}</p>
            ${buyerPhone ? `<p style="margin: 0;"><strong>Phone:</strong> ${buyerPhone}</p>` : ''}
          </div>

          <p style="font-size: 16px;">You can reach out to them directly using the contact information provided above to discuss the details.</p>
          
          <p style="font-size: 14px; color: #6b7280; margin-top: 32px;">Thank you for listing with RentMate!</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Owner contact email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending owner contact email:', error);
    return false;
  }
};
