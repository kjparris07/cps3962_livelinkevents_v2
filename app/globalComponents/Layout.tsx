export default function Layout({ children }) {
  return (
    <body className="homepage">
      <div className="page">

        {/* Top bar */}
        <div className="top-bar">
          <a href="/" className="logo">
            LiveLink Events<span></span>
          </a>

          <a href="/login" className="auth-btn">
            <span className="auth-btn-icon"></span>
            Sign in/Log in
          </a>
        </div>

        {children}
      </div>
    </body>
  );
}
