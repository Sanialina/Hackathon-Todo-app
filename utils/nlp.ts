import { Task, Priority } from '../types';

export type ActionType = 'ADD' | 'DELETE' | 'TOGGLE' | 'UPDATE' | 'NONE';

export interface NLPResult {
  action: ActionType;
  taskPayload?: Partial<Task>;
  targetTaskId?: string;
  response: string;
}

// Helper to generate IDs
const generateId = () => crypto.randomUUID();

export const processCommand = (text: string, currentTasks: Task[]): NLPResult => {
  const lowerText = text.toLowerCase();
  
  // --- INTENT: ADD TASK ---
  // English: add, create, new, remind me to
  // Urdu: shamil, naya, banao, likho
  if (
    lowerText.match(/^(add|create|new|remind me to|buy)/) || 
    lowerText.includes('shamil') || 
    lowerText.includes('banao') ||
    lowerText.includes('karna hai')
  ) {
    let title = text
      .replace(/^(add|create|new task|remind me to|buy)\s*/i, '')
      .replace(/\s*(shamil karein|banao|likho|karna hai)$/i, '');
    
    // Extract Priority
    let priority: Priority = 'Medium';
    if (lowerText.includes('high') || lowerText.includes('urgent') || lowerText.includes('important') || lowerText.includes('zaruri')) {
      priority = 'High';
      title = title.replace(/(high priority|high|urgent|important|zaruri)/gi, '');
    } else if (lowerText.includes('low') || lowerText.includes('kam')) {
      priority = 'Low';
      title = title.replace(/(low priority|low|kam)/gi, '');
    }

    // Extract Date (Tomorrow/Kal)
    let dueDate = '';
    if (lowerText.includes('tomorrow') || lowerText.includes('kal')) {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      dueDate = d.toISOString();
      title = title.replace(/(tomorrow|kal)/gi, '');
    }

    // Cleanup title
    title = title.replace(/\s+/g, ' ').trim();
    if (!title) title = "New Task";

    return {
      action: 'ADD',
      taskPayload: {
        id: generateId(),
        title: title.charAt(0).toUpperCase() + title.slice(1),
        priority,
        isCompleted: false,
        recurrence: 'None',
        tags: ['AI-Created'],
        dueDate: dueDate,
        description: 'Created via AI Assistant',
        createdAt: Date.now()
      },
      response: `I've added "${title}" to your list.`
    };
  }

  // --- INTENT: DELETE TASK ---
  // English: delete, remove
  // Urdu: khatam, hatao, delete
  if (lowerText.includes('delete') || lowerText.includes('remove') || lowerText.includes('khatam') || lowerText.includes('hatao')) {
    const target = findTaskByFuzzyName(lowerText, currentTasks);
    if (target) {
      return {
        action: 'DELETE',
        targetTaskId: target.id,
        response: `Deleted task: "${target.title}".`
      };
    }
    return { action: 'NONE', response: "I couldn't find a task with that name to delete." };
  }

  // --- INTENT: COMPLETE TASK ---
  // English: complete, done, finish, check
  // Urdu: mukammal, ho gaya, done
  if (lowerText.includes('complete') || lowerText.includes('done') || lowerText.includes('finish') || lowerText.includes('mukammal') || lowerText.includes('ho gaya')) {
    const target = findTaskByFuzzyName(lowerText, currentTasks);
    if (target) {
      if (target.isCompleted) return { action: 'NONE', response: `"${target.title}" is already completed.` };
      return {
        action: 'TOGGLE',
        targetTaskId: target.id,
        response: `Great job! Marked "${target.title}" as complete.`
      };
    }
    return { action: 'NONE', response: "Which task matches that description?" };
  }

  // --- INTENT: RESCHEDULE / UPDATE ---
  // English: reschedule, move to tomorrow
  // Urdu: aage badhao, kal pe dalo
  if (lowerText.includes('reschedule') || lowerText.includes('tomorrow') || lowerText.includes('kal')) {
    const target = findTaskByFuzzyName(lowerText, currentTasks);
    if (target) {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      return {
        action: 'UPDATE',
        targetTaskId: target.id,
        taskPayload: { ...target, dueDate: d.toISOString() },
        response: `Rescheduled "${target.title}" to tomorrow.`
      };
    }
    return { action: 'NONE', response: "I couldn't identify which task to reschedule." };
  }

  // --- INTENT: CHANGE PRIORITY ---
  if (lowerText.includes('priority')) {
    const target = findTaskByFuzzyName(lowerText, currentTasks);
    if (target) {
      let newPriority: Priority = 'Medium';
      if (lowerText.includes('high')) newPriority = 'High';
      if (lowerText.includes('low')) newPriority = 'Low';
      
      return {
        action: 'UPDATE',
        targetTaskId: target.id,
        taskPayload: { ...target, priority: newPriority },
        response: `Updated "${target.title}" priority to ${newPriority}.`
      };
    }
  }

  // Default Greeting / Unknown
  if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('salam')) {
    return { action: 'NONE', response: "Hello! I am your Todo Assistant. You can ask me to add, complete, or delete tasks." };
  }

  return { action: 'NONE', response: "I didn't quite catch that. Try saying 'Add a task' or 'Delete grocery'." };
};

// Helper: Find a task that vaguely matches the user's spoken words
function findTaskByFuzzyName(text: string, tasks: Task[]): Task | undefined {
  const words = text.toLowerCase().split(' ');
  // Filter out stop words
  const stopWords = ['delete', 'remove', 'complete', 'mark', 'as', 'done', 'task', 'the', 'my', 'khatam', 'karo', 'mukammal', 'reschedule', 'priority', 'change', 'to', 'high', 'low'];
  const searchTerms = words.filter(w => !stopWords.includes(w) && w.length > 2);

  if (searchTerms.length === 0) return undefined;

  // Simple score based matching
  let bestMatch: Task | undefined;
  let bestScore = 0;

  tasks.forEach(task => {
    let score = 0;
    searchTerms.forEach(term => {
      if (task.title.toLowerCase().includes(term)) score += 1;
    });
    if (score > bestScore) {
      bestScore = score;
      bestMatch = task;
    }
  });

  return bestMatch;
}
