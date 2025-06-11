export default function Footer() {
  return (
    <footer className="bg-purple-800 text-white py-10 mt-10">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h4 className="text-xl font-bold mb-3">FastClaim</h4>
          <p className="text-sm text-purple-100">
            Secure your receipts. Stay ahead of warranty expirations. Fast, reliable & beautifully simple.
          </p>
        </div>

        <div>
          <h5 className="text-lg font-semibold mb-3">Quick Links</h5>
          <ul className="space-y-2 text-sm text-purple-100">
            <li><a href="/" className="hover:text-white transition">Home</a></li>
            <li><a href="/track" className="hover:text-white transition">Track</a></li>
            <li><a href="/about" className="hover:text-white transition">About</a></li>
            <li><a href="/contact" className="hover:text-white transition">Contact</a></li>
          </ul>
        </div>

        <div>
          <h5 className="text-lg font-semibold mb-3">Contact</h5>
          <p className="text-sm text-purple-100">
            Email: support@fastclaim.app<br />
            Phone: +91 90562 08511<br />
            Location: Punjab, India
          </p>
        </div>
      </div>

      <div className="text-center text-purple-200 mt-10 text-xs">
        © {new Date().getFullYear()} FastClaim. All rights reserved.
      </div>
    </footer>
  );
}
