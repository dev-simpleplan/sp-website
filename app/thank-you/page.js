import Link from "next/link";
import "./thankYou.css";

export const metadata = {
  title: "Thank You — SimplePlan Media",
};

export default function ThankYouPage() {
  return (
    <section className="thank-you-section">
      <div className="container">
        <div className="thank-you-in">
          <h1 className="thank-you-heading">Thank You</h1>

          <p className="thank-you-quote">&ldquo;We&apos;ve Received Your Request.&rdquo;</p>
          <p className="thank-you-subtext">
            Our team will review your request and get back to you within 1–2
            business days.
          </p>

          <Link href="/" className="custom-btn thank-you-cta">
            <span>Return to Homepage</span>
            <span className="arrow-wrap">
              <svg className="arrow arrow-1" width="12" height="12" viewBox="0 0 12 12" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                <path
                      d="M0.878125 11.6667L0 10.7885L9.53854 1.25H3.75V0H11.6667V7.91667H10.4167V2.12813L0.878125 11.6667Z"
                      fill="currentColor" />
              </svg>
              <svg className="arrow arrow-2" width="12" height="12" viewBox="0 0 12 12" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                <path
                      d="M0.878125 11.6667L0 10.7885L9.53854 1.25H3.75V0H11.6667V7.91667H10.4167V2.12813L0.878125 11.6667Z"
                      fill="currentColor" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
