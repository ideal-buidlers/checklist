export default function TermsOfService() {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1>Terms of Service</h1>
        <p style={styles.lastUpdated}>Last updated: {new Date().toLocaleDateString()}</p>

        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using Ideal Builders Checklist ("the Application"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>
        </section>

        <section>
          <h2>2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials (information or software) on Ideal Builders Checklist for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul>
            <li>Modifying or copying the materials</li>
            <li>Using the materials for any commercial purpose or for any public display</li>
            <li>Attempting to decompile or reverse engineer any software contained on the Application</li>
            <li>Removing any copyright or other proprietary notations from the materials</li>
            <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
          </ul>
        </section>

        <section>
          <h2>3. Disclaimer</h2>
          <p>
            The materials on Ideal Builders Checklist are provided on an 'as is' basis. Ideal Builders makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
        </section>

        <section>
          <h2>4. Limitations</h2>
          <p>
            In no event shall Ideal Builders or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Ideal Builders Checklist, even if Ideal Builders or an authorized representative has been notified orally or in writing of the possibility of such damage.
          </p>
        </section>

        <section>
          <h2>5. Accuracy of Materials</h2>
          <p>
            The materials appearing on Ideal Builders Checklist could include technical, typographical, or photographic errors. Ideal Builders does not warrant that any of the materials on the Application are accurate, complete, or current. Ideal Builders may make changes to the materials contained on the Application at any time without notice.
          </p>
        </section>

        <section>
          <h2>6. Links</h2>
          <p>
            Ideal Builders has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Ideal Builders of the site. Use of any such linked website is at the user's own risk.
          </p>
        </section>

        <section>
          <h2>7. Modifications</h2>
          <p>
            Ideal Builders may revise these terms of service for the Application at any time without notice. By using this Application, you are agreeing to be bound by the then current version of these terms of service.
          </p>
        </section>

        <section>
          <h2>8. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of the United States, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
          </p>
        </section>

        <section>
          <h2>9. User Responsibilities</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account or password. You must notify Ideal Builders immediately of any unauthorized uses of your account.
          </p>
        </section>

        <section>
          <h2>10. Data and Content</h2>
          <p>
            You retain all rights to any data or content you create within the Application. By using the Application, you grant Ideal Builders a license to store and process your data as necessary to provide the service. You are responsible for ensuring that your use of the Application complies with all applicable laws and regulations.
          </p>
        </section>

        <section>
          <h2>11. Third-Party Services</h2>
          <p>
            The Application integrates with Google Drive and Gmail APIs. Your use of these services is subject to Google's Terms of Service and Privacy Policy. Ideal Builders is not responsible for the availability or functionality of third-party services.
          </p>
        </section>

        <section>
          <h2>12. Termination</h2>
          <p>
            Ideal Builders may terminate or suspend your account and access to the Application immediately, without prior notice or liability, for any reason whatsoever, including if you breach the Terms of Service.
          </p>
        </section>

        <section>
          <h2>13. Contact Information</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at the email address associated with your account.
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
