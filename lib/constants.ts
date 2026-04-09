export const SURVEY_QUESTIONS = [
  {
    id: "play_frequency",
    question: "How often do you build with LEGO?",
    options: ["Every day", "Every week", "Sometimes", "First time!"],
  },
  {
    id: "fav_theme",
    question: "Which LEGO theme excites you most?",
    options: ["LEGO City", "LEGO Technic", "LEGO Star Wars", "LEGO Friends"],
  },
  {
    id: "discovery",
    question: "How did you discover My Play Festival?",
    options: ["Social Media", "Friends & Family", "LEGO Store", "Advertisement"],
  },
] as const;

export const INACTIVITY_TIMEOUT_MS = 60_000;
export const AUTO_RESET_TIMEOUT_MS = 45_000;
export const AI_GENERATION_TIMEOUT_MS = 120_000;
export const POLL_INTERVAL_MS = 3_000;
export const COUNTDOWN_SECONDS = 5;

export const LEGO_COLORS = [
  "#E3000B", // red
  "#FFCF00", // yellow
  "#006CB7", // blue
  "#92BF3A", // green
  "#F68215", // orange
] as const;

export const PDPA_TEXT = `By proceeding, you consent to the following:

1. Your photo will be captured and processed using artificial intelligence (AI) to generate a personalised LEGO Minifigure image.

2. We will collect and store the following personal data: your name, email address, gender selection, and survey responses.

3. Your photo and generated image will be stored securely for a maximum of 24 hours, after which they will be permanently and automatically deleted from our servers.

4. Your personal data is collected solely for the purpose of this My Play Festival experience and will not be shared with any third parties for marketing purposes.

5. This data collection and processing is conducted in compliance with Malaysia's Personal Data Protection Act 2010 (PDPA).

6. By tapping "I Agree & Continue", you confirm that you have read, understood, and consent to the above terms.`;
