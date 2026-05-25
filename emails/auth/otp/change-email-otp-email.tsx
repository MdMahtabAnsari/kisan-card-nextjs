import * as React from 'react';
import {
    Html,
    Head,
    Preview,
    Body,
    Container,
    Section,
    Heading,
    Text,
    Hr,
    Tailwind,
} from 'react-email';

import { OTPEmailProps } from '@/emails/auth/otp/sign-in-otp-email';

export default function ChangeEmailOTPEmail({
    email,
    otp,
}: OTPEmailProps) {
    const brand = 'KisanCard';
    const year = new Date().getFullYear();

    return (
        <Html>
            <Head />
            <Preview>Your email change verification code</Preview>

            <Tailwind>
                <Body className="bg-[#f6f9fc] py-10 font-sans">
                    <Container className="mx-auto max-w-125 rounded-lg border border-gray-200 bg-white p-8">
                        <Section>
                            <Heading className="m-0 mb-4 text-2xl font-bold text-gray-900">
                                Confirm your email change
                            </Heading>

                            <Text className="mb-4 text-sm leading-6 text-gray-700">
                                Hi {email},
                            </Text>

                            <Text className="mb-4 text-sm leading-6 text-gray-700">
                                We received a request to change the email
                                address associated with your {brand} account.
                            </Text>

                            <Text className="mb-2 text-sm leading-6 text-gray-700">
                                Use the verification code below to continue:
                            </Text>

                            <Section className="my-6 rounded-lg bg-gray-100 py-4 text-center">
                                <Text className="m-0 text-3xl font-bold tracking-[8px] text-gray-900">
                                    {otp}
                                </Text>
                            </Section>

                            <Text className="mb-4 text-sm leading-6 text-gray-700">
                                This OTP will expire in 10 minutes.
                            </Text>

                            <Hr className="my-6 border-gray-200" />

                            <Text className="m-0 text-xs leading-5 text-gray-500">
                                If you didn’t request this email change,
                                you can safely ignore this email.
                            </Text>

                            <Text className="mt-4 text-xs text-gray-400">
                                © {year} {brand}. All rights reserved.
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}