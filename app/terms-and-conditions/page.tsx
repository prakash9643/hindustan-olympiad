// components/Footer.tsx
"use client";

const Terms = () => {
  return (
    <>
      {/* Header */}
      <header className="bg-primary text-white py-5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Terms &amp; Conditions
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="bg-bg text-text py-12 px-4 md:px-8">
        <div className="max-w-4xl mx-auto space-y-10 text-lg leading-relaxed">
          <section>
            <h3 className="text-2xl font-semibold text-primary mb-4">
              1. Introduction
            </h3>
            <p>
              Welcome to <strong>Hindustan Olympiad</strong>. By registering or
              participating, you agree to our terms outlined here. These terms
              govern your access and use of our platform.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-primary mb-4">
              2. Eligibility & Registration
            </h3>
            <ul className="space-y-3 pl-5 list-disc text-gray-800">
              <li>
                <strong>✔ Class 1 to 12 students</strong> are eligible to
                participate.
              </li>
              <li>
                <strong>✔ Accurate details</strong> must be submitted during
                registration.
              </li>
              <li>
                <strong>✔ Registration fee</strong> is mandatory and
                non-refundable (unless otherwise stated).
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-primary mb-4">
              3. Examination Guidelines
            </h3>
            <ul className="space-y-3 pl-5 list-disc text-gray-800">
              <li>
                <strong>✔ Online or offline format</strong> depending on the
                chosen mode.
              </li>
              <li>
                <strong>✔ No unfair means</strong> (e.g., cheating or
                impersonation) allowed.
              </li>
              <li>
                <strong>✔ Single attempt</strong> per student per level.
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-primary mb-4">
              4. Results & Awards
            </h3>
            <ul className="space-y-3 pl-5 list-disc text-gray-800">
              <li>
                <strong>✔ Results</strong> will be published on the official
                website.
              </li>
              <li>
                <strong>✔ Prizes and certificates</strong> will be awarded per
                guidelines.
              </li>
              <li>
                <strong>✔ Disputes</strong> must be reported within 7 days of
                result declaration.
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-primary mb-4">
              5. Privacy & Data Use
            </h3>
            <p>
              We collect and use personal data only for exam management and
              communication purposes. Please refer to our{" "}
              <span className="text-secondary font-medium">Privacy Policy</span>{" "}
              for detailed information.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-primary mb-4">
              6. Intellectual Property
            </h3>
            <p>
              All exam content, branding, and resources are{" "}
              <strong>copyrighted</strong> and owned by Hindustan Olympiad.
              Unauthorized usage is strictly prohibited.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-primary mb-4">
              7. Limitation of Liability
            </h3>
            <p>
              Hindustan Olympiad shall not be held responsible for{" "}
              <strong>technical errors</strong>, <strong>network issues</strong>
              , or participant mistakes. Any liability is limited to the
              registration fee paid.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-primary mb-4">
              8. Amendments
            </h3>
            <p>
              We reserve the right to <strong>update these terms</strong>{" "}
              without prior notice. Continued participation indicates acceptance
              of any changes.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-primary mb-4">
              9. Governing Law
            </h3>
            <p>
              These terms are governed by the laws of India. Any disputes will
              be handled in courts located in <strong>Uttarakhand</strong>.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-primary mb-4">
              10. Contact Us
            </h3>
            <p>
              Have questions? Reach out at{" "}
              <a
                href="mailto:olympiadsupport@livehindustan.com"
                className="text-secondary font-medium underline"
              >
                olympiadsupport@livehindustan.com
              </a>
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white text-center py-6 px-4">
        <div className="max-w-7xl mx-auto">
          &copy; {new Date().getFullYear()} Hindustan Olympiad. All rights
          reserved.
        </div>
      </footer>
    </>
  );
};

export default Terms;
