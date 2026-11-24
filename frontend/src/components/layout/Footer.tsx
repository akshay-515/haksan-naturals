
import { Link } from "react-router-dom";
import {
  Leaf,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import logoMark from "../../assets/haksan-logo-mark.png";
import { PRODUCT_CATEGORIES } from "../../types/constants/productCategories";

const COMPANY_ADDRESS =
  "Door No.43-106/1-11, Indiranayaknagar, Ajith Singh Nagar, Vijayawada-520015, Andhra Pradesh, India";

const COMPANY_PHONE = "+919014006882";
const COMPANY_EMAIL = "haksannaturals@gmail.com";

const Footer = () => {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    COMPANY_ADDRESS
  )}`;

  return (
    <footer className="border-t border-green-900/10 bg-green-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">

          {/* Brand and Address */}
          <div className="sm:col-span-2 lg:col-span-2 lg:pr-10">
            <Link to="/" className="inline-flex items-center gap-3">
              <img
                src={logoMark}
                alt="Haksan Naturals"
                className="h-12 w-12 object-contain"
              />

              <div>
                <p className="text-lg font-bold">
                  Haksan Naturals
                </p>

                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-green-300">
                  Pure Goodness, Naturally
                </p>
              </div>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-6 text-green-100/70">
              Discover our range of fruit powders, vegetable powders,
              dry fruits and natural oils for everyday needs.
            </p>

            <div className="mt-4 mb-4 flex items-center gap-2 text-sm text-green-100/70">
              <Leaf size={17} className="shrink-0 text-green-300" />
              <span>Naturally inspired products.</span>
            </div>

            {/* Company Address */}
            <h3 className=" text-sm font-semibold uppercase tracking-wider text-green-300">
              Address
            </h3>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex max-w-md items-start gap-3 text-sm leading-6 text-green-100/70 transition hover:text-white"
            >
              {/* <MapPin
                size={18}
                className="mt-1 shrink-0 text-green-300"
              /> */}

              <span>
                {COMPANY_ADDRESS}
                <span className="mt-1 block text-xs font-medium text-green-300">
                  View on Google Maps
                </span>
              </span>
            </a>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-green-300">
              Shop
            </h3>

            <nav className="mt-4 flex flex-col gap-3">
              <Link
                to="/products"
                className="text-sm text-green-100/70 transition hover:text-white"
              >
                All Products
              </Link>

              {PRODUCT_CATEGORIES.map((category) => (
                <Link
                  key={category}
                  to={`/products?category=${encodeURIComponent(category)}`}
                  className="text-sm text-green-100/70 transition hover:text-white"
                >
                  {category}
                </Link>
              ))}
            </nav>
          </div>

          {/* Customer */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-green-300">
              Customer
            </h3>

            <nav className="mt-4 flex flex-col gap-3">
              <Link
                to="/login"
                className="text-sm text-green-100/70 transition hover:text-white"
              >
                Login
              </Link>

              <Link
                to="/cart"
                className="text-sm text-green-100/70 transition hover:text-white"
              >
                Cart
              </Link>

              <Link
                to="/orders"
                className="text-sm text-green-100/70 transition hover:text-white"
              >
                My Orders
              </Link>

              <Link
                to="/addresses"
                className="text-sm text-green-100/70 transition hover:text-white"
              >
                Addresses
              </Link>

              <Link
                to="/admin/login"
                className="text-sm text-green-100/70 transition hover:text-white"
              >
                Admin Login
              </Link>
            </nav>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-green-300">
              Contact Us
            </h3>

            <div className="mt-4 flex flex-col gap-5">
              <a
                href={`tel:${COMPANY_PHONE}`}
                className="flex items-center gap-3 text-sm text-green-100/70 transition hover:text-white"
              >
                <Phone
                  size={18}
                  className="shrink-0 text-green-300"
                />

                +91 90140 06882
              </a>

              <a
                href={`mailto:${COMPANY_EMAIL}`}
                className="flex items-start gap-3 break-all text-sm text-green-100/70 transition hover:text-white"
              >
                <Mail
                  size={18}
                  className="shrink-0 text-green-300"
                />

                {COMPANY_EMAIL}
              </a>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-green-100/50">
            © {new Date().getFullYear()} Haksan Naturals. All rights reserved.
          </p>

          <div className="flex items-center gap-2 text-xs text-green-100/50">
            <Leaf size={14} />
            Pure Goodness, Naturally.
          </div>
        </div>

      </div>
    </footer>
  );
};

export { Footer };
