import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// AI Endpoint: Generate Assessment Questions & Outline
app.post('/api/ai/generate-assessment', async (req, res) => {
  try {
    const { subjectName, gradeLevel, topic, assessmentType, questionCount = 5, difficulty = 'medium' } = req.body;

    if (!topic || !subjectName) {
      return res.status(400).json({ error: 'Subject name and topic are required' });
    }

    const prompt = `Generate a high-quality ${assessmentType || 'quiz'} assessment for ${subjectName} (${gradeLevel || 'Secondary Level'}).
Topic: ${topic}
Difficulty: ${difficulty}
Number of questions: ${questionCount}

Provide clear, pedagogically sound questions along with point allocations and sample answers.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an expert curriculum design assistant creating high-quality school assessments. Return structured JSON.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Catchy title for the assessment' },
            instructions: { type: Type.STRING, description: 'Clear student instructions' },
            totalPoints: { type: Type.NUMBER, description: 'Sum of all question points' },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING, description: 'Question stem' },
                  questionType: {
                    type: Type.STRING,
                    description: 'multiple_choice, short_answer, essay, or problem'
                  },
                  points: { type: Type.NUMBER },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Array of 4 options if multiple choice, otherwise empty'
                  },
                  sampleAnswer: { type: Type.STRING, description: 'Correct answer or grading model solution' }
                },
                required: ['text', 'questionType', 'points', 'sampleAnswer']
              }
            }
          },
          required: ['title', 'instructions', 'totalPoints', 'questions']
        }
      }
    });

    const jsonText = response.text || '{}';
    const parsed = JSON.parse(jsonText);
    res.json({ success: true, assessmentData: parsed });
  } catch (error: any) {
    console.error('Error generating assessment with Gemini:', error);
    res.status(500).json({
      error: 'Failed to generate assessment',
      message: error?.message || 'Server error'
    });
  }
});

// AI Endpoint: Generate Evaluation Rubric Matrix
app.post('/api/ai/generate-rubric', async (req, res) => {
  try {
    const { title, subjectName, assessmentGoal, criteriaCount = 4 } = req.body;

    const prompt = `Create a comprehensive grading rubric for:
Subject: ${subjectName || 'General'}
Title/Goal: ${title || assessmentGoal}
Number of evaluation criteria: ${criteriaCount}

Define 4 levels for each criterion: Exemplary (4), Proficient (3), Developing (2), Novice (1).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an educational assessment rubrics specialist. Return structured rubric JSON.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rubricTitle: { type: Type.STRING },
            description: { type: Type.STRING },
            criteria: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: 'Name of the criterion, e.g. Analytical Reasoning' },
                  description: { type: Type.STRING, description: 'What this criterion evaluates' },
                  weight: { type: Type.NUMBER, description: 'Weighting percentage e.g. 25' },
                  levels: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        levelIndex: { type: Type.NUMBER, description: '4 = Exemplary, 3 = Proficient, 2 = Developing, 1 = Novice' },
                        levelName: { type: Type.STRING },
                        points: { type: Type.NUMBER },
                        description: { type: Type.STRING, description: 'Clear descriptor for this performance tier' }
                      },
                      required: ['levelIndex', 'levelName', 'points', 'description']
                    }
                  }
                },
                required: ['title', 'description', 'weight', 'levels']
              }
            }
          },
          required: ['rubricTitle', 'description', 'criteria']
        }
      }
    });

    const jsonText = response.text || '{}';
    const parsed = JSON.parse(jsonText);
    res.json({ success: true, rubricData: parsed });
  } catch (error: any) {
    console.error('Error generating rubric with Gemini:', error);
    res.status(500).json({
      error: 'Failed to generate rubric',
      message: error?.message || 'Server error'
    });
  }
});

// AI Endpoint: Generate Student Report Card Feedback & Learning Plan
app.post('/api/ai/student-feedback', async (req, res) => {
  try {
    const { studentName, subjectName, percentageScore, letterGrade, assessmentTitle, strengths, weaknesses } = req.body;

    const prompt = `Write constructive teacher report card feedback and a personalized learning growth tip for:
Student: ${studentName}
Assessment: ${assessmentTitle} (${subjectName})
Score: ${percentageScore}% (${letterGrade})
Known Strengths: ${strengths || 'Consistent effort, good participation'}
Areas for Improvement: ${weaknesses || 'Attention to detail, time management'}

Provide encouraging, actionable, and professional pedagogical feedback.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an empathetic school counselor and senior teacher crafting student report comments.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            feedbackText: { type: Type.STRING, description: '2-3 sentences of formal teacher report feedback' },
            highlightStrengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: '2 bullet points of key strengths' },
            growthAreas: { type: Type.ARRAY, items: { type: Type.STRING }, description: '2 bullet points for target improvement' },
            actionableTip: { type: Type.STRING, description: '1 specific homework/study strategy for next term' }
          },
          required: ['feedbackText', 'highlightStrengths', 'growthAreas', 'actionableTip']
        }
      }
    });

    const jsonText = response.text || '{}';
    const parsed = JSON.parse(jsonText);
    res.json({ success: true, feedbackData: parsed });
  } catch (error: any) {
    console.error('Error generating student feedback:', error);
    res.status(500).json({
      error: 'Failed to generate feedback',
      message: error?.message || 'Server error'
    });
  }
});

// Start Express + Vite Middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`School Assessment Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
