export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-border px-5 py-6 md:px-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="font-mono text-[0.65rem] text-text-muted">
          &copy; {currentYear} Sam Shulman
        </span>

        <div className="flex items-center gap-3 font-mono text-[0.65rem] text-text-muted">
          <span className="flex items-center gap-2">
            <span
              className="inline-block w-[5px] h-[5px] rounded-full bg-green"
              style={{ boxShadow: "0 0 6px var(--green)" }}
              aria-hidden="true"
            />
            all systems nominal
          </span>
          <span aria-hidden="true">|</span>
          <a
            href="https://github.com/shulman33"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green transition-colors"
          >
            view source &rarr;
          </a>
        </div>
      </div>
    </footer>
  );
}
