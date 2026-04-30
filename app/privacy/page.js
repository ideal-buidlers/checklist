export default function PrivacyPolicy() {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1>Privacy Policy</h1>
        <p style={styles.lastUpdated}>Last updated: {new Date().toLocaleDateString()}</p>

        <section>
          <h2>Introduction</h2>
          <p>
            Ideal Builders Checklist ("we", "our", or "us") operates the application. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our application and the choices you have associated with that data.
          </p>
        </section>

        <section>
          <h2>Information Collection and Use</h2>
          <p>We collect several different types of information for various purposes to provide and improve our application:</p>
          <ul>
            <li><strong>Google Account Information:</strong> When you authenticate with Google, we receive your email address and profile information to verify your identity.</li>
            <li><strong>Google Drive Access:</strong> We request access to your Google Drive to help you manage and organize construction documents related to your projects.</li>
            <li><strong>Gmail Access:</strong> We request read-only access to your Gmail to help you track project-related communications.</li>
            <li><strong>Application Data:</strong> We store checklist items, notes, and project information you create within the application.</li>
          </ul>
        </section>

        <section>
          <h2>Use of Data</h2>
          <p>Ideal Builders Checklist uses the collected data for various purposes:</p>
          <ul>
            <li>To provide and maintain our application</li>
            <li>To notify you about changes to our application</li>
            <li>To allow you to participate in interactive features of our application</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information so that we can improve our application</li>
            <li>To monitor the usage of our application</li>
          </ul>
        </section>

        <section>
          <h2>Security of Data</h2>
          <p>
            The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.
          </p>
        </section>

        <section>
          <h2>Google API Scopes</h2>
          <p>We use the following Google API scopes:</p>
          <ul>
            <li><code>https://www.googleapis.com/auth/drive</code> - To access and manage your Google Drive files</li>
            <li><code>https://www.googleapis.com/auth/gmail.readonly</code> - To read your Gmail messages</li>
            <li><code>https://www.googleapis.com/auth/userinfo.email</code> - To access your email address</li>
            <li><code>https://www.googleapis.com/auth/userinfo.profile</code> - To access your profile information</li>
          </ul>
          <p>
            We only use these scopes for the purposes described above and will not share your data with third parties without your explicit consent.
          </p>
        </section>

        <section>
          <h2>Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
          </p>
        </section>

        <section>
          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at the email address associated with your account.
          </p>
        </section>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#fafafa",
    padding: "40px 20px",
  },
  content: {
    maxWidth: "800px",
    margin: "0 auto",
    background: "#ffffff",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    lineHeight: "1.6",
    color: "#333",
    fontSize: "14px",
  },
  lastUpdated: {
    fontSize: "12px",
    color: "#666",
    fontStyle: "italic",
    marginBottom: "20px",
  },
};
