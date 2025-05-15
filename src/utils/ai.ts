import { MISTRAL_API_KEY, MISTRAL_URL } from "../config/env.config";
import { PROMPTS } from "../config/prompts";

export class EventAIGenerator {
  private static readonly ALLOWED_TIMEZONES = [
    "America/Los_Angeles",
    "America/Denver",
    "America/Chicago",
    "America/New_York",
  ];

  private static async generateFromAI(prompt: string): Promise<string> {
    const response = await fetch(MISTRAL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        messages: [
          { role: "system", content: PROMPTS.system },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      console.error("Failed to generate AI response");
      throw new Error("Failed to generate AI response");
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "";
  }

  public static async generateEventDetails(
    description: string,
    eventType: "general admissions" | "livestream" | "seated"
  ): Promise<any> {
    const prompt = `
    Generate a structured event listing for a ticketing platform called Defy Tickets. The event should be well-organized for both ticket sellers and buyers, ensuring clarity in ticketing, scheduling, and attendee management.

    Event Type: ${eventType}
    Description to base the event on: ${description}

    FORMATTING GUIDELINES:
    1. About Section Markdown:
       - Use ## for subheaders (e.g., "## What to Expect")
       - Use _ for italics (e.g., _VIP experience_)
       - Use ** for bold (e.g., **Limited time offer**)
       - Use - for bullet points
       - Use 1. 2. 3. for numbered lists
       - DO NOT use HTML tags
       - if necessary add emojis or images to make the description more engaging  refer to images guidelines below
       - Include sections for: Overview, Details, Schedule, What to Expect, and Additional Information
       - Make the description engaging and well-structured
       - Use catchy and engaging language to make the event more appealing
       - Dont add to long descriptions and also too much time info add good and very relevant info
       - Add good and very relevant info about the event
       - Ensure to follow the event type and category
       - Ensure to use info that is provided in the description
       - DONT ADD IMAGES TO THE DESCRIPTION
       
    2. Time Formats:
       - Use 12-hour clock format with AM/PM suffix (e.g., "7:30 PM" not "19:30")
       - AM/PM must be capitalized and separated by a space
       - Examples: "10:00 AM", "2:30 PM", "12:00 PM" (noon), "12:00 AM" (midnight)
       - Opening time must be before starting time
       - Closing time must be after starting time
       - Set endsAtMidnight to true if the event ends at 12:00 AM
       - Do not use leading zeros for hours (use "2:30 PM" not "02:30 PM")

    IMPORTANT TIMEZONE INFORMATION:
    You must use ONLY one of these exact timezone values:
    - America/Los_Angeles
    - America/Denver
    - America/Chicago
    - America/New_York

    Generate a complete event object with the following structure. Make sure all values are realistic and appropriate for the event type:

    {
      "title": "Event title based on description (keep it concise and catchy)",
      "slug": "[event-name-slug]",
      "subtitle": "A catchy subtitle for the event (one short sentence)",
      "shortName": "Short name for the event (max 20 characters)",
      "category": "One of: entertainment, music, sports, theater, comedy, conference, festival, other",
      "tags": ["3-5 relevant tags", "based on", "event type and category", "use lowercase"],
      "location": "Venue name (real venue if possible)",
      "sublocation": "Specific area in venue if applicable (e.g., 'Main Hall', 'Field Level')",
      "address": "Street address (use realistic US address format)",
      "city": "City name (major US city)",
      "country": "United States",
      "cordinates": {
         "latitude": 1,
        "longitude": 1
       },
      "timezone": "MUST BE ONE OF THE ALLOWED TIMEZONE VALUES LISTED ABOVE",
      "startDate": "YYYY-MM-DD (use ${new Date().getFullYear()} if year not specified)",
      "durationInDays": "Number of days (typically 1-3, only return a one digit number eg 1, 2 or 3 as an integer) ",
      "openingTime": "H:MM AM/PM format (when doors open, before startingTime)",
      "startingTime": "H:MM AM/PM format (when event begins)",
      "closingTime": "H:MM AM/PM format (when event ends)",
      "endsAtMidnight": "Boolean (true if closingTime is 12:00 AM)",
      "about": "Detailed markdown description following the formatting guidelines above"${
        eventType === "seated"
          ? `,seating:{
      "totalSeats": "Realistic number based on venue size (100-5000)",
      "description": "Detailed description of seating layout and sections",
      "namingConvention": "Clear explanation of how seats are numbered (e.g., 'Sections A-F, Rows 1-20, Seats 1-30 per row')"
  }}`
          : ""
      }

    Important: 
    1. Return ONLY the JSON object with no markdown formatting or backticks
    2. All dates and times should be in valid formats (remember: 12-hour clock with AM/PM)
    3. Make sure the content is realistic and matches the event type
    4. Only include seating information if the event type is "seated"
    5. Generate appropriate values based on the provided description
    6. MUST use one of the specified timezone values exactly as shown above
    7. If the year is not provided, use the current year which is: ${new Date().getFullYear()}
    8. Ensure all text content is professional and free of placeholder text
    `;

    const responseJson = await this.generateFromAI(prompt);

    try {
      // Clean the response in case it contains markdown or backticks
      const cleanJson = responseJson.replace(/```json\n?|\n?```/g, "").trim();
      const eventContent = JSON.parse(cleanJson) as any;

      // Validate timezone
      if (!this.ALLOWED_TIMEZONES.includes(eventContent.timezone)) {
        throw new Error("Invalid timezone generated");
      }

      // Validate time format (12-hour with AM/PM)
      const timeFormatRegex = /^(1[0-2]|[1-9]):[0-5][0-9] (AM|PM)$/;
      if (
        !timeFormatRegex.test(eventContent.openingTime) ||
        !timeFormatRegex.test(eventContent.startingTime) ||
        !timeFormatRegex.test(eventContent.closingTime)
      ) {
        throw new Error("Invalid time format. Must be in 12-hour format with AM/PM");
      }

      return eventContent;
    } catch (error) {
      console.error("Failed to parse generated event details:", error);
      throw new Error("Failed to generate valid event content");
    }
  }
}
