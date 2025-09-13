import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto py-8 px-4">
        <p className="text-center text-gray-500 dark:text-gray-400">
          Made with ❤️ by{" "}
          <a
            href="https://github.com/senapati484"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Sayan Senapati
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
