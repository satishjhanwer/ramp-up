import React, { useState, useEffect } from "react";

import "./styles.css";

const fetchDataFromUrl = async (url: string) => {
  if (url === "") {
    return undefined;
  }

  const response = await fetch(url);
  const htmlText = await response.text();

  // Parse the HTML content using DOMParser
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlText, "text/html");

  return doc;
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [characters, setCharacters] = useState<String[]>([]);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  useEffect(() => {
    const fetchFlag = async () => {
      setLoading(true);
      try {
        const doc = await fetchDataFromUrl(
          "https://tns4lpgmziiypnxxzel5ss5nyu0nftol.lambda-url.us-east-1.on.aws/challenge"
        );

        if (doc) {
          const validCharacters: string[] = [];
          const codeElements = doc.querySelectorAll("code[data-class]");
          codeElements.forEach((codeElement) => {
            const charValue = codeElement
              ?.querySelector("div[data-tag] span[data-id] i.char")
              ?.getAttribute("value");
            if (charValue) {
              validCharacters.push(charValue);
            }
          });
          const decodedFlag = validCharacters.join("");
          const anotherDoc = await fetchDataFromUrl(decodedFlag);
          if (anotherDoc?.body?.innerHTML) {
            const decodedFlag: string = anotherDoc.body.innerHTML;
            console.log("decodedFlag", decodedFlag);
            setCharacters(decodedFlag.split(""));
          }
        }
      } catch (error) {
        console.error("Error fetching the flag:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFlag();
  }, []);

  useEffect(() => {
    if (!loading && currentCharIndex < characters.length) {
      const timer = setTimeout(() => {
        setCurrentCharIndex((prevIndex) => prevIndex + 1);
      }, 500); // Half second delay between each character
      return () => clearTimeout(timer);
    }
  }, [currentCharIndex, characters, loading]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {characters.map((char, index) => (
            <li key={index}>{index < currentCharIndex ? char : ""}</li>
          ))}
        </ul>
      )}
    </div>
  );
}



