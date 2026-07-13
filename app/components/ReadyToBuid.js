export default function ReadyToBuild({id}) {
  return (
    <section className="ready-to-build" id={id}>
      <div className="container">
        <div className="ready-to-build-in gap-left">
            <h2 className="reveal-heading">Ready to build your brand the right way?</h2>
            <p>Start with clarity, then build a brand that doesn’t need to be reworked every time you grow.</p>
            <a href="#!" className="custom-btn">
              <span>Book a Call</span>
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
            </a>
        </div>
      </div>
    </section>
  );
}
