import ContactForm from "./contact-form";

const contactLinks = [
  {
    label: "email",
    value: "samshulman6@gmail.com",
    url: "mailto:samshulman6@gmail.com",
  },
  {
    label: "linkedin",
    value: "linkedin.com/in/sam-shulman",
    url: "https://www.linkedin.com/in/sam-shulman/",
  },
  {
    label: "github",
    value: "github.com/shulman33",
    url: "https://github.com/shulman33",
  },
];

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="bg-void border-t border-border px-5 py-16 md:px-10 lg:px-16 lg:py-24"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        {/* Left column */}
        <div>
          <div className="flex items-center gap-4 mb-10">
            <span className="font-mono text-[0.72rem] text-green tracking-wider uppercase">
              {"// contact"}
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <h2
            className="font-heading font-extrabold uppercase leading-[1.05] tracking-[-0.03em] mb-6"
            style={{ fontSize: "clamp(2.5rem, 4vw, 4.5rem)" }}
          >
            Let&apos;s
            <br />
            <span className="text-green">Connect</span>
          </h2>

          <p className="font-mono text-[0.72rem] text-text-dim leading-[1.8] mb-8 max-w-[45ch]">
            Open to interesting opportunities, collaborations, and
            conversations. Best response time: email or LinkedIn.
          </p>

          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-mono text-[0.72rem] tracking-wider text-green border border-green px-5 py-3 hover:bg-green-dim hover:shadow-[var(--green-glow)] transition-all"
          >
            ./download_resume
          </a>
        </div>

        {/* Right column */}
        <div>
          {/* Direct links */}
          <div className="mb-10">
            {contactLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target={link.url.startsWith("mailto") ? undefined : "_blank"}
                rel={
                  link.url.startsWith("mailto")
                    ? undefined
                    : "noopener noreferrer"
                }
                className="group flex items-center justify-between border-b border-border py-4 transition-all hover:pl-2.5"
              >
                <div>
                  <span className="block font-mono text-[0.58rem] text-text-muted uppercase tracking-wider mb-1">
                    {link.label}
                  </span>
                  <span className="font-mono text-[0.82rem] text-text-dim group-hover:text-green transition-colors">
                    {link.value}
                  </span>
                </div>
                <span className="font-mono text-text-muted group-hover:text-green transition-colors">
                  &rarr;
                </span>
              </a>
            ))}
          </div>

          {/* Contact form */}
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
