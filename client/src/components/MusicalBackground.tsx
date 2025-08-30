import { FC } from "react";

interface MusicalBackgroundProps {
  density?: "light" | "medium" | "heavy";
  variant?: "notes" | "instruments" | "mixed";
}

export const MusicalBackground: FC<MusicalBackgroundProps> = ({ 
  density = "medium", 
  variant = "mixed" 
}) => {
  const noteElements = ["♪", "♫", "♬", "♩", "♭", "♯"];
  const instrumentElements = ["🎸", "🎹", "🥁", "🎺", "🎻", "🎤", "🎧", "🎷"];
  
  const getElements = () => {
    switch (variant) {
      case "notes":
        return noteElements;
      case "instruments":
        return instrumentElements;
      case "mixed":
        return [...noteElements, ...instrumentElements];
      default:
        return [...noteElements, ...instrumentElements];
    }
  };

  const getElementCount = () => {
    switch (density) {
      case "light":
        return 12;
      case "medium":
        return 20;
      case "heavy":
        return 30;
      default:
        return 20;
    }
  };

  const elements = getElements();
  const elementCount = getElementCount();

  // Fixed positions for musical elements with better left-right distribution
  const fixedPositions = [
    { left: "3%", top: "8%" },
    { left: "8%", top: "25%" },
    { left: "12%", top: "45%" },
    { left: "6%", top: "80%" },
    { left: "18%", top: "65%" },
    { left: "22%", top: "12%" },
    { left: "15%", top: "88%" },
    { left: "28%", top: "35%" },
    { left: "10%", top: "55%" },
    { left: "35%", top: "70%" },
    { left: "5%", top: "18%" },
    { left: "42%", top: "92%" },
    { left: "45%", top: "15%" },
    { left: "38%", top: "75%" },
    { left: "25%", top: "38%" },
    { left: "55%", top: "85%" },
    { left: "32%", top: "22%" },
    { left: "62%", top: "58%" },
    { left: "20%", top: "95%" },
    { left: "68%", top: "42%" },
    { left: "15%", top: "5%" },
    { left: "75%", top: "60%" },
    { left: "30%", top: "28%" },
    { left: "82%", top: "82%" },
    { left: "25%", top: "10%" },
    { left: "88%", top: "48%" },
    { left: "40%", top: "72%" },
    { left: "92%", top: "32%" },
    { left: "35%", top: "78%" },
    { left: "97%", top: "52%" }
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: elementCount }).map((_, index) => {
        const element = elements[index % elements.length];
        const position = fixedPositions[index % fixedPositions.length];
        const isEmoji = element.length > 1;
        const size = isEmoji ? "text-2xl md:text-3xl lg:text-4xl" : "text-3xl md:text-4xl lg:text-5xl";
        const opacity = density === "light" ? "opacity-40" : density === "medium" ? "opacity-50" : "opacity-60";
        
        return (
          <div
            key={index}
            className={`absolute ${size} ${opacity} text-primary/70 select-none`}
            style={{
              left: position.left,
              top: position.top,
            }}
          >
            {element}
          </div>
        );
      })}
      
      {/* Fixed decorative dots */}
      {Array.from({ length: Math.floor(elementCount / 3) }).map((_, index) => {
        const position = fixedPositions[(index + 6) % fixedPositions.length];
        return (
          <div
            key={`dot-${index}`}
            className="absolute w-1 h-1 bg-primary/40 rounded-full"
            style={{
              left: position.left,
              top: position.top,
              transform: `translate(${20 + index * 10}px, ${10 + index * 5}px)`
            }}
          />
        );
      })}
    </div>
  );
};