'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Overlay from './Overlay'

export default function Legal({ initialTab = 'terms' }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(initialTab)

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `/${tab}`)
    }
  }

  const tabTitles = {
    terms: 'Terms of Service',
    privacy: 'Privacy Policy',
    cookies: 'Cookie Policy',
    gdpr: 'GDPR Compliance & Data Rights',
  }

  const buttons = (
    <div className="legal-buttons">
      <button
        type="button"
        className="btn btn-secondary btn-sm legal-btn-print"
        onClick={() => {
          if (typeof window !== 'undefined') window.print()
        }}
      >
        <i className="icon icon-file-text"></i> Print
      </button>
      <button
        type="button"
        className="btn btn-primary btn-sm"
        onClick={() => {
          if (typeof window !== 'undefined' && window.history.length > 1) {
            router.back()
          } else {
            router.push('/')
          }
        }}
      >
        Done
      </button>
    </div>
  )

  return (
    <Overlay
      title={tabTitles[activeTab] || 'Legal Policies'}
      className="legal-overlay-wrapper"
      buttons={buttons}
    >
      {/* Tab Switcher */}
      <div className="legal-tabs" role="tablist" aria-label="Legal Documents">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'terms'}
          className={`legal-tab-btn ${activeTab === 'terms' ? 'active' : ''}`}
          onClick={() => handleTabChange('terms')}
        >
          <i className="icon icon-shield"></i> Terms of Service
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'privacy'}
          className={`legal-tab-btn ${activeTab === 'privacy' ? 'active' : ''}`}
          onClick={() => handleTabChange('privacy')}
        >
          <i className="icon icon-lock"></i> Privacy Policy
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'cookies'}
          className={`legal-tab-btn ${activeTab === 'cookies' ? 'active' : ''}`}
          onClick={() => handleTabChange('cookies')}
        >
          <i className="icon icon-sliders"></i> Cookie Policy
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'gdpr'}
          className={`legal-tab-btn ${activeTab === 'gdpr' ? 'active' : ''}`}
          onClick={() => handleTabChange('gdpr')}
        >
          <i className="icon icon-check-circle"></i> GDPR &amp; Rights
        </button>
      </div>

      <div className="legal-content">
        {/* TERMS OF SERVICE */}
        {activeTab === 'terms' && (
          <article aria-label="Terms of Service">
            <div className="legal-badge">21+ Nightlife & Drink Discovery</div>
            <div className="legal-meta">
              <span><strong>Effective Date:</strong> September 1, 2026</span>
              <span><strong>Version:</strong> 2.4</span>
            </div>

            <div className="legal-callout warning">
              <strong>Notice Regarding Alcohol & Responsible Drinking:</strong> kwenchr is a nightlife directory and discovery platform intended exclusively for responsible adults of legal drinking age (21 years of age or older in the United States). kwenchr does not sell alcoholic beverages, encourage excessive alcohol consumption, or condone driving under the influence. Please drink responsibly and always arrange for a designated driver or rideshare service.
            </div>

            <section className="legal-section">
              <h4>1. Acceptance of Terms</h4>
              <p>
                By accessing or using the kwenchr website, web applications, or related services (collectively, the &ldquo;Service&rdquo;), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, you must not access or use the Service.
              </p>
            </section>

            <section className="legal-section">
              <h4>2. Eligibility & Age Verification</h4>
              <p>
                You represent and warrant that you are at least twenty-one (21) years of age (or the legal drinking age in your jurisdiction, whichever is greater). If you are under the legal drinking age, you are prohibited from creating an account, browsing drink specials, or contributing content to kwenchr. We reserve the right to request proof of age or terminate any account suspected of belonging to an underage user.
              </p>
            </section>

            <section className="legal-section">
              <h4>3. User Accounts & Security</h4>
              <p>
                When creating an account, you agree to provide accurate, current, and complete information. You are responsible for safeguarding your password and account credentials and for all activities that occur under your account. You agree to immediately notify kwenchr of any unauthorized use or security breach.
              </p>
            </section>

            <section className="legal-section">
              <h4>4. Accuracy of Specials, Happy Hours & Venue Information</h4>
              <p>
                Drink specials, happy hours, pricing, performance schedules, and venue operating hours listed on kwenchr are subject to frequent changes by venue owners and event promoters. While we strive for accuracy:
              </p>
              <ul>
                <li><strong>No Pricing Guarantee:</strong> kwenchr does not guarantee that listed prices or drink deals will be honored by individual venues.</li>
                <li><strong>Independent Verification:</strong> Users are advised to confirm specials, admission fees, and age requirements directly with the venue before attending.</li>
                <li><strong>No Endorsement:</strong> Inclusion of any venue or promotion on kwenchr does not imply endorsement or partnership by kwenchr.</li>
              </ul>
            </section>

            <section className="legal-section">
              <h4>5. User-Generated Content & Code of Conduct</h4>
              <p>
                kwenchr enables registered users to post, edit, and share nightlife events and drink deals. By submitting content, you grant kwenchr a worldwide, royalty-free license to display, modify, and distribute your submissions. You agree not to post content that:
              </p>
              <ul>
                <li>Is fraudulent, misleading, or promotes illegal alcohol sales or underage drinking.</li>
                <li>Infringes any third party&rsquo;s copyright, trademark, or proprietary rights.</li>
                <li>Contains hate speech, harassment, defamation, obscenity, or malicious software.</li>
              </ul>
              <p>
                We reserve the right, in our sole discretion, to remove, edit, or reject any user submission without prior notice.
              </p>
            </section>

            <section className="legal-section">
              <h4>6. Geolocation & Location Services</h4>
              <p>
                Our Service relies on geolocation data to calculate distances to venues and display nearby events. Geolocation calculations are estimates and should not be relied upon for emergency navigation or high-precision measurements.
              </p>
            </section>

            <section className="legal-section">
              <h4>7. Intellectual Property</h4>
              <p>
                All software, designs, trademarks, service marks, graphics, and proprietary icons comprising kwenchr are the property of kwenchr, inc. or its licensors. You may not copy, reverse engineer, or redistribute our code or branding without written authorization.
              </p>
            </section>

            <section className="legal-section">
              <h4>8. Disclaimer of Warranties & Limitation of Liability</h4>
              <p>
                THE SERVICE IS PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. TO THE MAXIMUM EXTENT PERMITTED BY LAW, KWENCHR DISCLAIMS ALL LIABILITY FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES, INCLUDING LOSS OF PROFITS, VENUE DISPUTES, OR PERSONAL INJURY RESULTING FROM YOUR USE OF THE SERVICE OR ATTENDANCE AT ANY LISTED EVENT.
              </p>
            </section>

            <section className="legal-section">
              <h4>9. Contact & Inquiries</h4>
              <div className="legal-contact-box">
                Questions regarding these Terms of Service should be directed to our legal team at <a href="mailto:legal@kwenchr.com">legal@kwenchr.com</a> or via mail:
                <br />
                <strong>kwenchr, inc.</strong> &bull; Legal Department &bull; 1200 Avenue of the Americas, New York, NY 10036.
              </div>
            </section>
          </article>
        )}

        {/* PRIVACY POLICY */}
        {activeTab === 'privacy' && (
          <article aria-label="Privacy Policy">
            <div className="legal-badge">Privacy & Data Governance</div>
            <div className="legal-meta">
              <span><strong>Effective Date:</strong> September 1, 2026</span>
              <span><strong>Version:</strong> 2.4</span>
            </div>

            <div className="legal-callout">
              <strong>Our Commitment to Privacy:</strong> kwenchr collects only the data necessary to provide you with fast, location-based nightlife and drink specials. We do not sell your personal data or precise location history to data brokers.
            </div>

            <section className="legal-section">
              <h4>1. Information We Collect</h4>
              <p>We collect information in the following categories when you use kwenchr:</p>
              <ul>
                <li>
                  <strong>Geolocation Data:</strong> With your explicit browser permission, we access your device&rsquo;s latitude and longitude to find venues and specials within your chosen radius. We also process manual search queries (cities, neighborhoods, or postal codes).
                </li>
                <li>
                  <strong>Account Information:</strong> If you register an account, we collect your chosen username, email address, and an encrypted hash of your password (stored securely using bcrypt).
                </li>
                <li>
                  <strong>User Submissions & Preferences:</strong> Information you submit when creating or editing events (event titles, descriptions, venue details, drink specials, and tags) or setting search filters.
                </li>
                <li>
                  <strong>Technical & Log Data:</strong> Standard internet log data including your IP address, browser type, device specifications, operating system, and referral headers.
                </li>
              </ul>
            </section>

            <section className="legal-section">
              <h4>2. How We Use Your Information</h4>
              <p>We use your information to operate, improve, and secure kwenchr:</p>
              <ul>
                <li>Calculate real-time distances between your current location and nightlife venues.</li>
                <li>Filter and display events by date, distance, category (e.g., Happy Hour, Specials, Comedy).</li>
                <li>Authenticate your account session and manage your created events.</li>
                <li>Prevent fraudulent postings, spam, and abuse of the platform.</li>
              </ul>
            </section>

            <section className="legal-section">
              <h4>3. Third-Party Services & Integrations</h4>
              <p>We utilize select third-party service providers to deliver essential features:</p>
              <ul>
                <li>
                  <strong>Google Maps & Places API:</strong> Powers our venue search and map displays. Google processes location queries in accordance with the <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="legal-gold-link">Google Privacy Policy</a>.
                </li>
                <li>
                  <strong>Database & Hosting Providers:</strong> Secure cloud infrastructure (such as MongoDB Atlas) with industry-standard encryption at rest and in transit.
                </li>
                <li>
                  <strong>Advertising Partners:</strong> Display sponsors may collect anonymous engagement statistics via standard tracking technologies.
                </li>
              </ul>
            </section>

            <section className="legal-section">
              <h4>4. Data Retention & Security</h4>
              <p>
                We implement robust administrative, technical, and physical safeguards to protect your personal information against unauthorized access, destruction, or disclosure. User passwords are encrypted using one-way bcrypt cryptographic hashing. We retain account data for as long as your account remains active or as needed to comply with legal obligations.
              </p>
            </section>

            <section className="legal-section">
              <h4>5. Your Privacy Rights & Choices</h4>
              <p>You have full control over your personal data:</p>
              <ul>
                <li><strong>Location Control:</strong> You can disable geolocation access at any time through your browser settings or choose manual address search instead.</li>
                <li><strong>Account Updates:</strong> You may edit your profile information or delete your submitted events directly in the app.</li>
                <li><strong>Data Deletion Requests:</strong> You may request complete deletion of your account and personal data by emailing <a href="mailto:privacy@kwenchr.com" className="legal-gold-link">privacy@kwenchr.com</a>.</li>
              </ul>
            </section>

            <section className="legal-section">
              <h4>6. Age Policy (21+)</h4>
              <p>
                kwenchr is strictly intended for individuals aged 21 and older. We do not knowingly collect or solicit personal information from anyone under the age of 21. If we discover that personal data of a minor has been collected, we will promptly delete that information.
              </p>
            </section>

            <section className="legal-section">
              <h4>7. Privacy Inquiries</h4>
              <div className="legal-contact-box">
                If you have questions or concerns regarding our privacy practices, please email <a href="mailto:privacy@kwenchr.com">privacy@kwenchr.com</a>.
              </div>
            </section>
          </article>
        )}

        {/* COOKIE POLICY */}
        {activeTab === 'cookies' && (
          <article aria-label="Cookie Policy">
            <div className="legal-badge">Cookies & Local Storage</div>
            <div className="legal-meta">
              <span><strong>Effective Date:</strong> September 1, 2026</span>
              <span><strong>Version:</strong> 2.4</span>
            </div>

            <div className="legal-callout">
              <strong>Transparent Storage Practices:</strong> kwenchr uses browser storage technologies (such as Cookies and SessionStorage) to remember your sign-in state and cache your location search results so you do not have to repeatedly grant GPS permissions.
            </div>

            <section className="legal-section">
              <h4>1. What Are Cookies and Storage Technologies?</h4>
              <p>
                Cookies are small text files placed on your device by websites you visit. In addition to cookies, modern web applications utilize client storage technologies such as <code>sessionStorage</code> and <code>localStorage</code> to store temporary data directly within your web browser.
              </p>
            </section>

            <section className="legal-section">
              <h4>2. How kwenchr Uses Browser Storage</h4>
              <p>We classify our use of storage into the following categories:</p>
              <ul>
                <li>
                  <strong>Strictly Necessary (Authentication):</strong> We use <code>sessionStorage</code> (e.g., <code>kwenchr_user</code>) to securely maintain your authenticated session while browsing the application. This data expires when you close your browser tab or sign out.
                </li>
                <li>
                  <strong>Functional (Location & Performance Caching):</strong> To avoid prompting your browser repeatedly for GPS coordinates on every page interaction, kwenchr temporarily caches your coordinates (e.g., <code>kwenchr_coords</code>, <code>kwenchr_loc</code>) for up to 5 minutes. This dramatically improves page load times and battery life.
                </li>
                <li>
                  <strong>Third-Party Cookies (Maps & Display Ads):</strong> Third-party services embedded on our site (such as Google Maps API and display advertisers) may set their own cookies to deliver maps or evaluate banner performance.
                </li>
              </ul>
            </section>

            <section className="legal-section">
              <h4>3. Summary of Storage Keys</h4>
              <ul>
                <li><strong><code>kwenchr_user</code>:</strong> Stores the authenticated user profile for session persistence (SessionStorage).</li>
                <li><strong><code>kwenchr_coords</code> / <code>kwenchr_loc</code>:</strong> Caches user coordinates and location label for 5 minutes (SessionStorage).</li>
                <li><strong><code>Google Maps API</code>:</strong> Essential session cookies used to render map tiles and venue search results.</li>
              </ul>
            </section>

            <section className="legal-section">
              <h4>4. How to Manage or Disable Cookies</h4>
              <p>
                Most modern web browsers allow you to control cookies and site storage through their preference settings:
              </p>
              <ul>
                <li><strong>Google Chrome:</strong> Settings &rarr; Privacy and security &rarr; Third-party cookies.</li>
                <li><strong>Apple Safari:</strong> Settings &rarr; Safari &rarr; Advanced &rarr; Block all cookies.</li>
                <li><strong>Mozilla Firefox:</strong> Settings &rarr; Privacy &amp; Security &rarr; Enhanced Tracking Protection.</li>
              </ul>
              <p>
                Please note that disabling session storage may prevent you from signing in or adding new events on kwenchr.
              </p>
            </section>

            <section className="legal-section">
              <h4>5. Contact Us</h4>
              <div className="legal-contact-box">
                For inquiries regarding our Cookie Policy, reach out to us at <a href="mailto:privacy@kwenchr.com">privacy@kwenchr.com</a>.
              </div>
            </section>
          </article>
        )}

        {/* GDPR COMPLIANCE & DATA RIGHTS */}
        {activeTab === 'gdpr' && (
          <article aria-label="GDPR Compliance & Data Rights">
            <div className="legal-badge">GDPR / UK GDPR Compliance</div>
            <div className="legal-meta">
              <span><strong>Effective Date:</strong> September 1, 2026</span>
              <span><strong>Applicability:</strong> European Economic Area (EEA) &amp; United Kingdom</span>
            </div>

            <div className="legal-callout success">
              <strong>Your Data Protection Rights:</strong> Under the General Data Protection Regulation (GDPR) and UK Data Protection Act, you possess clear, enforceable rights over your personal data. kwenchr is committed to complete transparency, privacy by design, and empowering you with effortless control over your information.
            </div>

            <section className="legal-section">
              <h4>1. Data Controller Identification</h4>
              <p>
                The data controller responsible for the processing of your personal data on kwenchr is:
              </p>
              <div className="legal-contact-box">
                <strong>kwenchr, inc. Data Protection Office</strong><br />
                Attn: Data Protection Officer (DPO)<br />
                Email: <a href="mailto:dpo@kwenchr.com">dpo@kwenchr.com</a> / <a href="mailto:privacy@kwenchr.com">privacy@kwenchr.com</a>
              </div>
            </section>

            <section className="legal-section">
              <h4>2. Lawful Bases for Processing</h4>
              <p>
                In accordance with Article 6 of the GDPR, kwenchr processes personal data only when a recognized lawful basis applies:
              </p>
              <ul>
                <li>
                  <strong>Consent (Art. 6(1)(a)):</strong> We request your explicit consent before accessing your device&apos;s real-time GPS coordinates to find nearby nightlife venues, and before storing non-essential cookies. You may withdraw consent at any time via the Cookie Preferences footer link.
                </li>
                <li>
                  <strong>Contractual Necessity (Art. 6(1)(b)):</strong> Processing necessary to provide you with an account, authenticate your login session, and allow you to submit, edit, or manage drink special listings.
                </li>
                <li>
                  <strong>Legitimate Interests (Art. 6(1)(f)):</strong> Processing necessary to maintain platform security, detect fraudulent activities, prevent denial-of-service attacks, and troubleshoot technical errors.
                </li>
              </ul>
            </section>

            <section className="legal-section">
              <h4>3. Your Individual Rights Under GDPR</h4>
              <p>
                As a data subject in the EEA or UK, you are entitled to exercise the following statutory rights without fee:
              </p>
              <ul>
                <li>
                  <strong>Right of Access (Article 15):</strong> You have the right to obtain confirmation as to whether personal data concerning you is being processed, and to receive a copy of your data.
                </li>
                <li>
                  <strong>Right to Rectification (Article 16):</strong> You may update or correct inaccurate or incomplete profile data at any time through your Account Profile page or by contacting us.
                </li>
                <li>
                  <strong>Right to Erasure / &ldquo;Right to be Forgotten&rdquo; (Article 17):</strong> You have the right to request the deletion of your account and associated event listings. You can trigger deletion directly from your profile settings or by emailing our DPO.
                </li>
                <li>
                  <strong>Right to Restriction of Processing (Article 18):</strong> You may request restriction of data processing if you contest accuracy or the lawfulness of processing.
                </li>
                <li>
                  <strong>Right to Data Portability (Article 20):</strong> You have the right to receive your personal data in a structured, commonly used, and machine-readable format (JSON).
                </li>
                <li>
                  <strong>Right to Object (Article 21):</strong> You may object at any time to processing based on legitimate interests.
                </li>
              </ul>
            </section>

            <section className="legal-section">
              <h4>4. Data Minimization &amp; Retention</h4>
              <p>
                kwenchr adheres strictly to data minimization principles:
              </p>
              <ul>
                <li><strong>Geolocation:</strong> Raw GPS coordinates are never stored in our permanent database for non-authenticated searches; they reside solely in temporary client-side session storage (5-minute cache).</li>
                <li><strong>Passwords:</strong> Passwords are cryptographically salted and hashed using bcrypt; plain-text passwords are never visible or stored.</li>
                <li><strong>Account Deletion:</strong> When an account is deleted, personal profile data is purged from our production database within 30 days.</li>
              </ul>
            </section>

            <section className="legal-section">
              <h4>5. How to Exercise Your Rights</h4>
              <p>
                To exercise any of your GDPR rights, or if you have questions about our data governance practices, please contact us at:
              </p>
              <div className="legal-contact-box">
                Email: <a href="mailto:privacy@kwenchr.com">privacy@kwenchr.com</a> (Response timeframe: within 30 calendar days).
              </div>
              <p className="legal-paragraph-spaced">
                You also hold the right to lodge a formal complaint with your local EU Data Protection Supervisory Authority (e.g., the Information Commissioner&apos;s Office in the UK, CNIL in France, or BfDI in Germany).
              </p>
            </section>
          </article>
        )}
      </div>
    </Overlay>
  )
}
