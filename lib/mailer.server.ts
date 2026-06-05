import nodemailer from "nodemailer"
import { MailOptions } from "nodemailer/lib/sendmail-transport"

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASSWORD },
})

export class Mailer {
  static async send(
    template: string,
    subject: string,
    user: { email: string }
  ) {
    const mailOptions: MailOptions = {
      from: `Gintoki Salkata <${process.env.GMAIL_USER}>`,
      to: user.email,
      subject,
      html: template,
    }

    await transporter.sendMail(mailOptions)
  }
  // lib/emails/invite.email.ts
  static async sendInvite({
    email,
    username,
    companyName,
    inviteLink,
  }: {
    email: string
    username: string
    companyName: string
    inviteLink: string
  }) {
    const template = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to ${companyName}, ${username}!</h2>
      <p>Your account has been created. Click the button below to set your password and get started.</p>

      <a href="${inviteLink}" 
         style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; 
                text-decoration: none; border-radius: 6px; margin: 16px 0;">
        Set Your Password
      </a>

      <p style="color: #e00; font-size: 14px;">⚠️ This link expires in 24 hours.</p>
      <p style="color: #666; font-size: 14px;">If you didn't expect this email, contact your administrator.</p>
    </div>
  `

    await transporter.sendMail({
      from: `next dashboard <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `You've been invited to join ${companyName}`,
      html: template,
    })
  }
  static async hrSendPasswordReset({
    email,
    username,
    companyName,
    tempPassword,
  }: {
    email: string
    username: string
    companyName: string
    tempPassword: string
  }) {
    const template = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Password Reset - ${companyName}</h2>
      <p>Hi ${username}, your password has been reset by your administrator.</p>
      
      <div style="background: #f4f4f4; padding: 16px; border-radius: 6px; margin: 16px 0;">
        <p style="margin: 0;"><strong>Email:</strong> ${email}</p>
        <p style="margin: 8px 0 0;"><strong>Temporary Password:</strong> ${tempPassword}</p>
      </div>

      <p style="color: #e00; font-size: 14px;">⚠️ This password expires in 24 hours. Please login and change it immediately.</p>
      <p style="color: #666; font-size: 14px;">If you did not request this reset, contact your administrator immediately.</p>
    </div>
  `

    await transporter.sendMail({
      from: `next dashboard <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `Your password has been reset - ${companyName}`,
      html: template,
    })
  }
  static async sendForgotPassword({
    email,
    username,
    companyName,
    resetLink,
  }: {
    email: string
    username: string
    companyName: string
    resetLink: string
  }) {
    const template = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Password Reset Request - ${companyName}</h2>
      <p>Hi ${username}, we received a request to reset your password.</p>
      
      <a href="${resetLink}" 
         style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; 
                text-decoration: none; border-radius: 6px; margin: 16px 0;">
        Reset Password
      </a>

      <p style="color: #e00; font-size: 14px;">⚠️ This link expires in 24 hours.</p>
      <p style="color: #666; font-size: 14px;">If you didn't request a password reset, ignore this email.</p>
    </div>
  `

    await transporter.sendMail({
      from: `next dashboard <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `Password Reset Request - ${companyName}`,
      html: template,
    })
  }
}
