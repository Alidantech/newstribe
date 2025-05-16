import { QuizDifficulty } from "../routes/quizzes/type";
import { MISTRAL_API_KEY, MISTRAL_URL } from "../config/env.config";
import { PROMPTS } from "../config/prompts";
import { ContentLevel, ContentType } from "../routes/content/type";

// rmove html from content
const removeHtml = (content: string) => {
  return content.replace(/<[^>]*>?/g, "");
};

export class AIGenerator {
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

  public static async generateQuizQuestions(
    contentId: string,
    getContentByIdService: (id: string) => Promise<any>,
    settings: {
      timeLimit: number;
      maxAttempts: number;
      difficulty: QuizDifficulty;
    }
  ): Promise<any> {
    // Get content details
    const content = await getContentByIdService(contentId);

    const prompt = `
    Generate a quiz based on the following content and settings. The quiz should test understanding of the content while being engaging and educational.

    Content Title: ${content.title}
    Content Description: ${content.description}
    Content Type: ${content.type}
    Content Text: ${removeHtml(content.content).slice(0, 200)}

    Quiz Settings:
    - Time Limit: ${settings.timeLimit} seconds
    - Max Attempts: ${settings.maxAttempts}
    - Difficulty Level: ${settings.difficulty}

    Generate a quiz object with the following structure:

    {
      "content": "${contentId}",
      "questions": [
        {
          "question": "A clear, concise question based on the content",
          "options": [
            "Option 1 (correct answer)",
            "Option 2 (plausible but incorrect)",
            "Option 3 (plausible but incorrect)",
            "Option 4 (plausible but incorrect)"
          ], // dont put all correct answers in the same index
          "correctIndex": 0 // correct answer index
        }
      ],
      "points": ${settings.difficulty === "easy" ? 5 : settings.difficulty === "medium" ? 10 : 15},
      "startDate": "${new Date().toISOString()}",
      "endDate": "${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()}",
      "status": "active",
      "settings": ${JSON.stringify(settings)}
    }

    Guidelines for ${settings.difficulty} difficulty:
    ${
      settings.difficulty === "easy"
        ? `
    - Questions should focus on basic understanding and recall
    - Use straightforward language and simple concepts
    - Options should be clearly distinct
    - Avoid complex reasoning or analysis`
        : settings.difficulty === "medium"
          ? `
    - Questions should test both understanding and application
    - Include some questions requiring basic analysis
    - Options should be more nuanced but still distinguishable
    - Mix of recall and comprehension questions`
          : `
    - Questions should test deep understanding and critical thinking
    - Include complex scenarios and analysis
    - Options should be sophisticated and require careful consideration
    - Focus on higher-order thinking skills`
    }

    Question Generation Rules:
    1. Generate 5-10 questions that test different aspects of the content
    2. Questions should be clear and unambiguous
    3. Options should be plausible and well-distributed
    4. Correct answers must be at index 0-3 (correctIndex) and must be the correct answer from the options
    5. Questions should progress from easier to harder
    6. Avoid trick questions or overly complex wording
    7. Ensure questions are directly related to the content
    8. Make sure all questions are answerable based on the content provided
    9. Options should be of similar length and structure
    10. Avoid using "all of the above" or "none of the above" as options
    11. Dont put all correct answers in the same index interchange the index of the correct answers for each question

    Important:
    1. Return ONLY the JSON object with no markdown formatting or backticks
    2. All questions must be answerable based on the provided content
    3. Ensure the correctIndex is between 0-3
    4. Points should be based on difficulty level (easy: 5, medium: 10, hard: 15)
    5. Questions should match the specified difficulty level
    6. Time limit and max attempts should match the provided settings
    `;

    const responseJson = await this.generateFromAI(prompt);

    try {
      // Clean the response in case it contains markdown or backticks
      const cleanJson = responseJson.replace(/```json\n?|\n?```/g, "").trim();
      const quizContent = JSON.parse(cleanJson) as any;

      // Validate quiz structure
      if (
        !quizContent.questions ||
        !Array.isArray(quizContent.questions) ||
        quizContent.questions.length < 5
      ) {
        throw new Error("Invalid quiz structure: must have at least 5 questions");
      }

      // Validate each question
      for (const question of quizContent.questions) {
        if (
          !question.question ||
          !Array.isArray(question.options) ||
          question.options.length !== 4
        ) {
          throw new Error("Invalid question structure");
        }
        if (question.correctIndex < 0 || question.correctIndex >= question.options.length) {
          throw new Error("Correct index must be within the range of options");
        }
      }

      // Validate settings match
      if (
        !quizContent.settings ||
        quizContent.settings.timeLimit !== settings.timeLimit ||
        quizContent.settings.maxAttempts !== settings.maxAttempts ||
        quizContent.settings.difficulty !== settings.difficulty
      ) {
        throw new Error("Generated settings do not match provided settings");
      }

      // Validate points based on difficulty
      const expectedPoints =
        settings.difficulty === "easy" ? 5 : settings.difficulty === "medium" ? 10 : 15;
      if (quizContent.points !== expectedPoints) {
        throw new Error("Points do not match difficulty level");
      }

      return quizContent;
    } catch (error) {
      console.error("Failed to parse generated quiz content:", error);
      throw new Error("Failed to generate valid quiz content");
    }
  }

  public static async generateUserPreferences(userData: {
    name: string;
    email: string;
    viewedContent?: Array<{
      title: string;
      type: string;
      category: string;
    }>;
    completedQuizzes?: Array<{
      title: string;
      score: number;
      difficulty: string;
    }>;
    sharedContent?: Array<{
      title: string;
      type: string;
      category: string;
    }>;
  }): Promise<any> {
    const prompt = `
    Generate personalized user preferences based on the following user data and their content interaction history.

    User Information:
    - Name: ${userData.name}
    - Email: ${userData.email}

    Content Interaction History:
    ${
      userData.viewedContent
        ? `
    Viewed Content:
    ${userData.viewedContent.map((content) => `- ${content.title} (${content.type}, ${content.category})`).join("\n")}`
        : ""
    }
    
    ${
      userData.completedQuizzes
        ? `
    Completed Quizzes:
    ${userData.completedQuizzes.map((quiz) => `- ${quiz.title} (Score: ${quiz.score}, Difficulty: ${quiz.difficulty})`).join("\n")}`
        : ""
    }
    
    ${
      userData.sharedContent
        ? `
    Shared Content:
    ${userData.sharedContent.map((content) => `- ${content.title} (${content.type}, ${content.category})`).join("\n")}`
        : ""
    }

    Generate a preferences object with the following structure:

    {
      "categories": ["array of content categories based on user interests"],
      "preferredFormats": ["array of preferred content formats"],
      "readingLevel": "beginner | intermediate | advanced",
      "notificationPreferences": ["array of notification preferences"],
      "dailyDigest": boolean,
      "weeklyDigest": boolean,
      "language": "preferred language",
      "timezone": "user's timezone"
    }

    Guidelines:
    1. Categories should be selected from: news, sports, entertainment, technology, business, lifestyle, health, education
    2. Preferred formats should be selected from: article, video, audio, image, quiz
    3. Reading level should be determined based on:
       - Quiz performance
       - Content complexity of viewed articles
       - User's content interaction patterns
    4. Notification preferences should be selected from: email, push, sms, none
    5. Digest preferences should be based on:
       - Frequency of content interaction
       - Types of content consumed
       - Time of day for content interaction
    6. Language and timezone should be inferred from:
       - User's email domain
       - Content interaction patterns
       - Regional content preferences

    Important:
    1. Return ONLY the JSON object with no markdown formatting or backticks
    2. All arrays should contain valid values from the allowed options
    3. Make reasonable inferences based on available data
    4. If certain data is missing, make educated guesses based on patterns
    5. Ensure preferences are realistic and personalized
    `;

    const responseJson = await this.generateFromAI(prompt);

    try {
      // Clean the response in case it contains markdown or backticks
      const cleanJson = responseJson.replace(/```json\n?|\n?```/g, "").trim();
      const preferences = JSON.parse(cleanJson) as any;

      // Validate categories
      const validCategories = [
        "news",
        "sports",
        "entertainment",
        "technology",
        "business",
        "lifestyle",
        "health",
        "education",
      ];
      if (!preferences.categories.every((cat: string) => validCategories.includes(cat))) {
        throw new Error("Invalid content categories");
      }

      // Validate formats
      const validFormats = ["article", "video", "audio", "image", "quiz"];
      if (!preferences.preferredFormats.every((format: string) => validFormats.includes(format))) {
        throw new Error("Invalid content formats");
      }

      // Validate reading level
      const validReadingLevels = ["beginner", "intermediate", "advanced"];
      if (!validReadingLevels.includes(preferences.readingLevel)) {
        throw new Error("Invalid reading level");
      }

      // Validate notification preferences
      const validNotifications = ["email", "push", "sms", "none"];
      if (
        !preferences.notificationPreferences.every((notif: string) =>
          validNotifications.includes(notif)
        )
      ) {
        throw new Error("Invalid notification preferences");
      }

      // Validate boolean values
      if (
        typeof preferences.dailyDigest !== "boolean" ||
        typeof preferences.weeklyDigest !== "boolean"
      ) {
        throw new Error("Invalid digest preferences");
      }

      return preferences;
    } catch (error) {
      console.error("Failed to parse generated user preferences:", error);
      throw new Error("Failed to generate valid user preferences");
    }
  }

  public static async generateContent(
    prompt: string,
    options: {
      type: ContentType;
      category: string;
      points: number;
      isSponsored: boolean;
      sponsor?: string;
      tags: string[];
      estimatedReadTime: number;
      level: ContentLevel;
    }
  ): Promise<any> {
    const contentPrompt = `
    Generate engaging content based on the following prompt and specifications.

    User Prompt: ${prompt}

    Content Specifications:
    - Type: ${options.type}
    - Category: ${options.category}
    - Points: ${options.points}
    - Is Sponsored: ${options.isSponsored}
    - Tags: ${options.tags.join(", ")}
    - Estimated Read Time: ${options.estimatedReadTime} minutes

    Generate a content object with the following structure:

    {
      "title": "Engaging and SEO-friendly title",
      "description": "Compelling description that summarizes the content",
      "type": "${options.type}",
      "category": "${options.category}",
      "estimatedReadTime": ${options.estimatedReadTime},
      "points": ${options.points},
      "isSponsored": ${options.isSponsored},
      ${options.sponsor ? `"sponsor": "${options.sponsor}",` : ""}
      "content": "Well-structured content in HTML format",
      "tags": ${JSON.stringify(options.tags)}
    }

    Content Generation Guidelines:
    1. Title should be:
       - Engaging and click-worthy
       - SEO-optimized
       - Clear and concise
       - Relevant to the prompt

    2. Description should:
       - Summarize the main points
       - Be compelling and informative
       - Include relevant keywords
       - Be 2-3 sentences long

    3. Content should:
       - Be well-structured with proper HTML formatting
       - Include headings (h2, h3) for better organization
       - Use paragraphs for readability
       - Include relevant examples and data
       - Be engaging and informative
       - Match the estimated read time
       - Be appropriate for the specified category
       - Include relevant internal links if applicable
       - Use proper formatting (bold, italic, lists) where appropriate

    4. For sponsored content:
       - Naturally integrate sponsor information
       - Maintain editorial integrity
       - Clearly indicate sponsored nature
       - Include relevant sponsor context

    5. HTML Formatting Rules:
       - Use <h2> for main sections
       - Use <h3> for subsections
       - Use <p> for paragraphs
       - Use <ul> and <li> for lists
       - Use <strong> for emphasis
       - Use <em> for italic text
       - Use <blockquote> for quotes
       - Use <a> for links
       - DO NOT use <div> or <span>
       - DO NOT use inline styles
       - DO NOT use JavaScript

    Important:
    1. Return ONLY the JSON object with no markdown formatting or backticks
    2. Content should be original and unique
    3. Ensure all HTML is properly formatted and valid
    4. Content should match the specified type and category
    5. Maintain appropriate tone and style for the category
    6. Include relevant keywords naturally
    7. Ensure content is factually accurate
    8. Keep the content engaging and valuable to readers
    `;

    const responseJson = await this.generateFromAI(contentPrompt);

    try {
      // Clean the response in case it contains markdown or backticks
      const cleanJson = responseJson.replace(/```json\n?|\n?```/g, "").trim();
      const content = JSON.parse(cleanJson) as any;

      return {
        ...content,
        estimatedReadTime: options.estimatedReadTime,
        points: options.points,
        level: options.level,
      };
    } catch (error) {
      console.error("Failed to parse generated content:", error);
      throw new Error("Failed to generate valid content");
    }
  }
}
