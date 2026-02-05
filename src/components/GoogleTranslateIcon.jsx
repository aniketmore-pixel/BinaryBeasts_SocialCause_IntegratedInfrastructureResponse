import { useEffect } from "react";

export default function GoogleTranslateIcon() {
  useEffect(() => {
    // 1. Check if script already exists to prevent duplicate injection
    if (document.querySelector('script[src*="translate.google.com"]')) {
      return;
    }

    const addScript = document.createElement("script");
    addScript.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    addScript.async = true;
    document.body.appendChild(addScript);

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };
  }, []);

  return (
    <>
      <style>
        {`
          /* Position the widget top-right */
          #google_translate_element {
            position: fixed;
            top: 20px;
            right: 20px; /* Changed from left to right */
            z-index: 9999;
          }

          /* Remove the "Select Language" text to make it an icon only */
          .goog-te-gadget-simple {
            background-color: transparent !important;
            border: none !important;
            padding: 0 !important;
            font-size: 0 !important;
            cursor: pointer;
          }

          /* Style the Google icon */
          .goog-te-gadget-icon {
            margin: 0 !important;
            width: 24px !important;
            height: 24px !important;
            background-image: url("https://upload.wikimedia.org/wikipedia/commons/d/d7/Google_Translate_logo.svg") !important;
            background-position: center !important;
            background-size: cover !important;
            border-radius: 50%;
          }

          /* Hide the default Google dropdown arrow */
          .goog-te-menu-value span {
            display: none !important;
          }
          
          /* Remove "Powered by Google" branding */
          .goog-te-gadget span {
             display: none !important;
          }
          
          /* Ensure the dropdown menu is readable */
          .goog-te-menu-frame {
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          }
        `}
      </style>

      <div id="google_translate_element" />
    </>
  );
}