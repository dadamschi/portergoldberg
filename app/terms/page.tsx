import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for PorterGoldberg Residential website. Please read these terms carefully before using our site.',
}

export default function TermsPage() {
  return (
    <main className="pg-page pg-legal-page">
      <section className="pg-page-hero">
        <h1>Terms of Service</h1>
        <p>Last updated: May 2025</p>
      </section>

      <section className="pg-legal-content">
        <h2>Agreement to Terms</h2>
        <p>
          By accessing or using the PorterGoldberg Residential website, you agree to be bound by
          these Terms of Service. If you do not agree to these terms, please do not use our website.
        </p>

        <h2>Property Listings</h2>
        <p>
          Property information displayed on this website is provided for informational purposes only.
          While we strive for accuracy, we cannot guarantee that all information is current or complete.
        </p>
        <ul>
          <li>Listing data is sourced from the Multiple Listing Service (MLS) and is subject to change without notice.</li>
          <li>Property availability, pricing, and features should be verified directly with a PorterGoldberg agent.</li>
          <li>Photos and virtual tours may not reflect the current condition of a property.</li>
        </ul>

        <h2>No Professional Advice</h2>
        <p>
          The content on this website is for general informational purposes and does not constitute
          legal, financial, or professional advice. For specific guidance regarding real estate
          transactions, please consult with appropriate professionals.
        </p>

        <h2>Fair Housing</h2>
        <p>
          PorterGoldberg Residential and Jameson Sotheby&apos;s International Realty fully support the
          principles of the Fair Housing Act and the Equal Opportunity Act. We are committed to
          providing equal housing opportunities regardless of race, color, religion, sex, national
          origin, familial status, or disability.
        </p>

        <h2>Intellectual Property</h2>
        <p>
          All content on this website, including but not limited to text, photographs, graphics,
          logos, and design elements, is the property of PorterGoldberg Residential, Jameson
          Sotheby&apos;s International Realty, or their respective owners and is protected by
          copyright and trademark laws.
        </p>
        <p>
          The Sotheby&apos;s International Realty&reg; name and logo are registered service marks
          licensed to Sotheby&apos;s International Realty Affiliates LLC and used with permission.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          PorterGoldberg Residential shall not be liable for any damages arising from your use of
          this website or reliance on any information provided herein. This includes, but is not
          limited to, direct, indirect, incidental, or consequential damages.
        </p>

        <h2>Third-Party Links</h2>
        <p>
          Our website may contain links to third-party websites. We are not responsible for the
          content, privacy practices, or accuracy of information on external sites.
        </p>

        <h2>Changes to Terms</h2>
        <p>
          We reserve the right to modify these Terms of Service at any time. Changes will be
          effective immediately upon posting to the website. Your continued use of the site
          constitutes acceptance of any modifications.
        </p>

        <h2>Governing Law</h2>
        <p>
          These Terms of Service shall be governed by and construed in accordance with the laws
          of the State of Illinois, without regard to its conflict of law provisions.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have questions about these Terms of Service, please contact us at:
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
