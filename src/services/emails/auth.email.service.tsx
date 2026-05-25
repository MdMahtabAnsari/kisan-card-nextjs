import { EmailService } from "@/services/emails/email.service";
import { render, pretty } from 'react-email';
import { VerifyEmail, OTPEmail, UserUrlEmail, UserOTP, UserUrl } from "@/lib/types/email";
import VerificationEmail from "@/emails/auth/verification-email";
import SignInOTPEmail from "@/emails/auth/otp/sign-in-otp-email";
import VerificationOTPEmail from "@/emails/auth/otp/email-verification-otp-email";
import ResetPasswordOTPEmail from "@/emails/auth/otp/reset-password-otp-email";
import ChangeEmailOTPEmail from "@/emails/auth/otp/change-email-otp-email";
import ChangeEmailEmail from "@/emails/auth/change-email-email";
import ResetPasswordEmail from "@/emails/auth/reset-password-email";
import MagicLinkEmail from "@/emails/auth/magic-link-email";
import OTPEmailEmail from "@/emails/auth/otp/otp-email";
import WelcomeEmail from "@/emails/auth/welcome-email";
import {User} from "better-auth";


class AuthEmailService {
    private readonly emailService: EmailService;

    constructor() {
        this.emailService = EmailService.getInstance();
    }

    async sendVerificationEmail({ user, url }: VerifyEmail) {
        try {
            const html = await render(
                <VerificationEmail user={user} url={url} />
            );

            const emailContent = await pretty(html);
            await this.emailService.sendEmail({
                to: user.email,
                subject: "Verify your email address",
                html: emailContent,
            });
        } catch (error) {
            console.error("Error sending verification email:", error);
        }
    }

    async sendSignInOTPEmail({ email, otp }: OTPEmail) {
        try {
            const html = await render(
                <SignInOTPEmail email={email} otp={otp} />
            );

            const emailContent = await pretty(html);
            await this.emailService.sendEmail({
                to: email,
                subject: "Your Sign-In OTP",
                html: emailContent,
            });
        } catch (error) {
            console.error("Error sending sign-in OTP email:", error);
        }
    }

    async sendEmailVerificationOTPEmail({ email, otp }: OTPEmail) {
        try {
            const html = await render(
                <VerificationOTPEmail email={email} otp={otp} />
            );

            const emailContent = await pretty(html);
            await this.emailService.sendEmail({
                to: email,
                subject: "Your Email Verification OTP",
                html: emailContent,
            });
        } catch (error) {
            console.error("Error sending email verification OTP email:", error);
        }
    }

    async sendResetPasswordOTPEmail({ email, otp }: OTPEmail) {
        try {
            const html = await render(
                <ResetPasswordOTPEmail email={email} otp={otp} />
            );

            const emailContent = await pretty(html);
            await this.emailService.sendEmail({
                to: email,
                subject: "Your Password Reset OTP",
                html: emailContent,
            });
        } catch (error) {
            console.error("Error sending password reset OTP email:", error);
        }
    }

    async sendChangeEmailOTPEmail({ email, otp }: OTPEmail) {
        try {
            const html = await render(
                <ChangeEmailOTPEmail email={email} otp={otp} />
            );

            const emailContent = await pretty(html);
            await this.emailService.sendEmail({
                to: email,
                subject: "Your Email Change Verification OTP",
                html: emailContent,
            });
        } catch (error) {
            console.error("Error sending email change OTP email:", error);
        }
    }

    async sendChangeEmailEmail({ email, url, user }: UserUrlEmail) {
        try {
            const html = await render(
                <ChangeEmailEmail newEmail={email} url={url} user={user} />
            );

            const emailContent = await pretty(html);
            await this.emailService.sendEmail({
                to: email,
                subject: "Confirm Your Email Change",
                html: emailContent,
            });
        }
        catch (error) {
            console.error("Error sending email change confirmation email:", error);
        }
    }

    async sendResetPasswordEmail({ user, url }: UserUrl) {
        try {
            const html = await render(
                <ResetPasswordEmail url={url} user={user} />
            );

            const emailContent = await pretty(html);
            await this.emailService.sendEmail({
                to: user.email,
                subject: "Reset Your Password",
                html: emailContent,
            });
        }
        catch (error) {
            console.error("Error sending password reset email:", error);
        }
    }

    async sendMagicLinkEmail({ email, url }: { email: string; url: string }) {
        try {
            const html = await render(
                <MagicLinkEmail url={url} />
            );

            const emailContent = await pretty(html);
            await this.emailService.sendEmail({
                to: email,
                subject: "Your Magic Link",
                html: emailContent,
            });
        } catch (error) {
            console.error("Error sending magic link email:", error);
        }
    }

    async sendOTPEmail({ user, otp }: UserOTP) {
        try {
            const html = await render(
                <OTPEmailEmail user={user} otp={otp} />
            );

            const emailContent = await pretty(html);
            await this.emailService.sendEmail({
                to: user.email,
                subject: "Your OTP Code",
                html: emailContent,
            });
        } catch (error) {
            console.error("Error sending OTP email:", error);
        }
    }

    async sendWelcomeEmail({ user }: { user: User }) {
        try {
            const html = await render(
                <WelcomeEmail user={user}  />
            );

            const emailContent = await pretty(html);
            await this.emailService.sendEmail({
                to: user.email,
                subject: "Welcome to Kisan Card!",
                html: emailContent,
            });
        } catch (error) {
            console.error("Error sending welcome email:", error);
        }
    }

}

export const authEmailService = new AuthEmailService();


