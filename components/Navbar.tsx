"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { ChevronDown, Menu, User, X } from "lucide-react";
import { is } from "date-fns/locale";
import { useRouter, usePathname } from "next/navigation";
import { regions } from "@/utils/constants";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userType, setUserType] = useState<any>(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const type = localStorage.getItem("type");

    if (userData && userData !== "undefined" && type) {
      setUser(JSON.parse(userData));
      setUserType(type);
    } else {
      setUser(null);
      setUserType(null);
    }
  }, [router, pathname]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("type");
    router.push("/phone-login");
  };

  const handleLoginClick = () => {
    if (user) {
      handleLogout();
    } else {
      router.push("/phone-login");
    }
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen)
  }

  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserDropdownOpen(false)
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest(".user-dropdown-container")) {
        setIsUserDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <nav className="bg-white shadow-md fixed top-0 w-full left-0 right-0 z-50 h-[80px]">
      <div className={`${isMenuOpen ? "pb-4" : "pb-0"} bg-white px-4  flex items-center justify-between flex-wrap w-full max-w-7xl mx-auto bg-white shadow-[0_2px_4px_0_rgba(0,0,0,0.1)] md:shadow-none`}>
        {/* Logo and Sponsor Logos (Left Side) */}
        <div className="flex items-center w-full md:w-auto justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/">
              <div className="flex items-center h-[80px] cursor-pointer">
                <Image
                  src="/images/navbar/hindustan-olympiad-logo.png"
                  alt="Hindustan Olympiad Logo"
                  width={125}
                  height={125}
                  className="object-contain"
                />
              </div>
            </Link>
            {/* Sponsor Logos */}

          </div>

          {/* Hamburger Menu for Mobile (Visible on Small Screens) */}
          <button
            className="md:hidden text-gray-600 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Navigation Links (Right Side) */}
        <div
          className={`w-full md:w-auto flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-center pt-4 md:pt-0 ${isMenuOpen ? "block" : "hidden md:block"
            }`}
        >
          <div className="relative group inline-block">
            <Link href="/#about" className="flex items-center text-gray-700 hover:text-orange-600 text-base py-2">
              About Olympiad
              <ChevronDown className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180" />
            </Link>

            {/* Dropdown Menu for About */}
            <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-2">
                <Link
                  href="/#journey"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  Journey So Far
                </Link>
                <Link
                  href="/#why-olympiad"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  Why Olympiad
                </Link>
                <Link
                  href="/#testimonials"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  Testimonials
                </Link>
                <Link
                  href="/#glimpses"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  Glimpses of Past Olympiad
                </Link>
              </div>
            </div>
          </div>
          {/* Olympiad 2025 Dropdown */}
          <div className="relative group inline-block">
            <Link
              href="/#olympiad-2025"
              className="flex items-center text-gray-700 hover:text-orange-600 text-base py-2"
            >
              Olympiad 2025
              <ChevronDown className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180" />
            </Link>

            {/* Dropdown Menu for Olympiad 2025 */}
            <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-2">
                <Link
                  href="/#olympiad-2025"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  What&apos;s New - Campaign Videos
                </Link>
                <Link
                  href="/#advisory-panel"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  Our Advisory Panel
                </Link>
                <Link
                  href="/#format"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  Format
                </Link>
                <Link
                  href="/#classes-subjects"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  Classes & Subjects
                </Link>
                <Link
                  href="/#rewards"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  Rewards & Recognitions
                </Link>
                <Link
                  href="/#schedule"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  Schedule
                </Link>
              </div>
            </div>
          </div>

          {/* <Link href="/sample-papers" className="block md:inline text-gray-700 hover:text-orange-600 text-base pr-4">
            Sample Papers
          </Link> */}
          {pathname === "/" && user && userType ? (
            <Link href={userType === "school-coordinator" ? "/school" : "/team"} className="h-10 block md:inline">
              <Button>
                {userType === "school-coordinator" ? "School Dashboard" : "Team Dashboard"}
              </Button>
            </Link>
          ) : null}

          {/* User Dropdown or Login Button */}
          {user ? (
            <div className="relative user-dropdown-container inline-block">
              <button
                onClick={toggleUserDropdown}
                className="flex items-center justify-center w-10 h-10 bg-[#B2252A] hover:bg-[#A62828] text-white rounded-full transition-colors"
              >
                <User className="h-5 w-5" />
              </button>

              {/* User Dropdown Menu */}
              {isUserDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="py-3 px-4 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      Logged in as {user.name || user.username || "User"}
                    </p>
                    <p className="text-sm text-gray-500">({user.email || user.phone || "No email"})</p>
                  </div>
                  <div className="py-2 px-4 border-b border-gray-100">
                    <p className="text-sm text-gray-700 font-medium">You have access to:</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {userType === "school-coordinator" ? "Single school" : `Regions: ${user?.region?.split(",")?.map((region: string) => regions.find((r) => r.value === region)?.label).join(", ")}`}
                    </p>
                  </div>
                  <div className="py-2">
                    <Button
                      onClick={handleLogout}
                      className="ml-4 text-left px-4 py-2 text-sm transition-colors"
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button className="text-base text-white" onClick={handleLoginClick}>
              Login
            </Button>
          )}

        </div>
      </div>
    </nav>
  );
}
