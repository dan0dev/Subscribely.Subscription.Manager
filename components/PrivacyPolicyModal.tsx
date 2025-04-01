import Modal from "./DynamicModal";

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicyModal = ({ isOpen, onClose }: PrivacyPolicyModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6 max-h-[80vh] overflow-y-auto hide-scrollbar w-full px-4">
        <h2 className="text-2xl font-semibold text-light-1  00">Privacy Policy</h2>

        <div className="space-y-4 text-light-400 text-sm">
          <section>
            <h3 className="text-lg font-medium text-light-100 mb-2">Introduction</h3>
            <p>
              Welcome to our website! This privacy policy provides information about how we handle your personal data
              during this development project. Please note that this is a development project, and anyone accessing it
              is aware of its nature.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-medium text-light-100 mb-2">Data Controller</h3>
            <p>Name: Dano</p>
            <p>
              Email:{" "}
              <a href="mailto:subscribely.noreply@gmail.com" className="text-primary-200 hover:underline">
                subscribely.noreply@gmail.com
              </a>
            </p>
            <p>
              GitHub:{" "}
              <a
                href="https://github.com/dan0dev"
                className="text-primary-200 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                dan0dev
              </a>
            </p>
          </section>

          <section>
            <h3 className="text-lg font-medium text-light-100 mb-2">What Data We Collect</h3>
            <p>Our website collects the following data:</p>
            <ul className="list-disc list-inside ml-4">
              <li>Email address</li>
              <li>Username</li>
              <li>In-app virtual currency purchase history</li>
              <li>Cookies (JWT authentication token)</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-medium text-light-100 mb-2">Purpose of Data Collection</h3>
            <p>We collect your data for the following purposes:</p>
            <ul className="list-disc list-inside ml-4">
              <li>Registration and user account creation</li>
              <li>Providing login functionality</li>
              <li>
                Sending email notifications related to subscriptions (purchases, refunds, administrative cancellations)
              </li>
              <li>Authentication and session management using JWT cookies</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-medium text-light-100 mb-2">Cookies and Authentication</h3>
            <p>
              We use JWT (JSON Web Token) cookies for authentication and session management. These cookies are necessary
              for the platform to function properly and allow you to stay logged in during your session. The JWT cookie
              contains encrypted authentication information and does not store any personal data beyond what is
              necessary for identifying your session.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-medium text-light-100 mb-2">Legal Basis for Processing</h3>
            <p>
              The legal basis for processing your data is your voluntary consent, which you provide during registration
              (GDPR Article 6(1)(a)), and the performance of a contract, as the data is necessary to provide the
              platform&apos;s services (GDPR Article 6(1)(b)).
            </p>
          </section>

          <section>
            <h3 className="text-lg font-medium text-light-100 mb-2">Data Retention Period</h3>
            <p>
              We store your personal data for the duration of your user account. Your email address also appears in the
              in-app purchase data and is stored along with the purchase information. JWT cookies are session-based and
              expire after you log out or after a set period of inactivity.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-medium text-light-100 mb-2">Data Transfer and Processing</h3>
            <p>
              We do not transfer your personal data to third parties. Our website is hosted on Vercel, which acts as a
              data processor. Email notifications are sent through our own service (selfProvide method).
            </p>
          </section>

          <section>
            <h3 className="text-lg font-medium text-light-100 mb-2">Email Notifications</h3>
            <p>
              The system sends email notifications after registration, when purchasing subscriptions, requesting
              refunds, or when an administrator revokes a subscription. You can turn off these email notifications at
              any time in your user settings.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-medium text-light-100 mb-2">Your Rights</h3>
            <p>Under data protection laws, you have the following rights:</p>
            <ul className="list-disc list-inside ml-4">
              <li>
                Right of access: You have the right to confirm whether we process your personal data and, if so, request
                access to this data.
              </li>
              <li>Right to rectification: You can request the correction of inaccurate or incomplete data.</li>
              <li>
                Right to erasure: In certain circumstances, you can request the deletion of your personal data, for
                example by deleting your user account.
              </li>
              <li>
                Right to restriction of processing: In certain circumstances, you can request the restriction of data
                processing.
              </li>
              <li>
                Right to data portability: You have the right to receive your provided data in a structured,
                machine-readable format.
              </li>
              <li>Right to object: You have the right to object to data processing in certain cases.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-medium text-light-100 mb-2">How to Exercise Your Rights</h3>
            <p>To exercise your rights, you have the following options:</p>
            <ul className="list-disc list-inside ml-4">
              <li>
                Account settings: You can modify most settings directly in your account, including turning off email
                notifications.
              </li>
              <li>Account deletion: You can delete your user account under the &quot;Settings&quot; section.</li>
              <li>
                Contact: You can contact the data controller at the contact information provided above regarding your
                privacy requests.
              </li>
            </ul>
            <p className="mt-2">We will respond to all requests within 30 days at the latest.</p>
          </section>

          <section>
            <h3 className="text-lg font-medium text-light-100 mb-2">Data Security</h3>
            <p>
              We implement appropriate technical and organizational measures to protect personal data against accidental
              or unlawful destruction, loss, alteration, unauthorized disclosure, or access.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-medium text-light-100 mb-2">Changes to This Privacy Policy</h3>
            <p>
              We reserve the right to modify this privacy policy at any time. Users will be notified of changes through
              the website.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-medium text-light-100 mb-2">Final Provisions</h3>
            <p>
              This privacy policy is for development purposes only and does not replace legal advice. Please note that
              the project is under development, and data processing practices may change in the final version.
            </p>
          </section>

          <p className="text-xs text-light-600">Last updated: April 1, 2025</p>
        </div>
      </div>
    </Modal>
  );
};

export default PrivacyPolicyModal;
