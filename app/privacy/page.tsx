import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for PorterGoldberg Residential. Learn how we collect, use, and protect your personal information.',
}

export default function PrivacyPage() {
  return (
    <main className="pg-page pg-legal-page">
      <section className="pg-page-hero">
        <h1>Privacy Policy</h1>
        <p>Last updated: May 2025</p>
      </section>

      <section className="pg-legal-content">
        <h2>Introduction</h2>
        <p>
          PorterGoldberg Residential (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your privacy and is
          committed to protecting your personal information. This Privacy Policy explains how we collect,
          use, and safeguard information when you visit our website or use our services.
        </p>

        <h2>Information We Collect</h2>
        <p>We may collect the following types of information:</p>
        <ul>
          <li><strong>Contact Information:</strong> Name, email address, phone number, and mailing address when you submit a contact form or sign up for our newsletter.</li>
          <li><strong>Property Preferences:</strong> Information about the type of property you&apos;re seeking, budget, and neighborhood preferences.</li>
          <li><strong>Usage Data:</strong> Information about how you interact with our website, including pages visited, time spent, and referring sources.</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Respond to your inquiries and provide real estate services</li>
          <li>Send market updates, property listings, and newsletters you&apos;ve requested</li>
          <li>Improve our website and services</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2>Third-Party Services</h2>
        <p>
          We use third-party services to help operate our website and business. These services may
          have access to your information only to perform specific tasks on our behalf:
        </p>
        <ul>
          <li><strong>HubSpot:</strong> Customer relationship management and email communications</li>
          <li><strong>Google Analytics:</strong> Website analytics and traffic analysis</li>
        </ul>

        <h2>Cookies</h2>
        <p>
          Our website uses cookies to enhance your experience and analyze site traffic. You can
          control cookie settings through your browser preferences.
        </p>

        <h2>Data Security</h2>
        <p>
          We implement reasonable security measures to protect your personal information. However,
          no method of transmission over the internet is 100% secure, and we cannot guarantee
          absolute security.
        </p>

        <h2>Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Request access to the personal information we hold about you</li>
          <li>Request correction of inaccurate information</li>
          <li>Request deletion of your personal information</li>
          <li>Opt out of marketing communications at any time</li>
        </ul>

        <h2>Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy or wish to exercise your rights,
          please contact us at:
        </p>
        <p>
          <strong>PorterGoldberg Residential</strong><br />
          Jameson Sotheby&apos;s International Realty<br />
          Email: team@portergoldberg.com
        </p>
      </section>
    </main>
  )
}
