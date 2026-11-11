export const profile = {
  name: 'Atharv Lamba',
  roles: ['AI Engineer', 'Speech & Vision ML', 'LLM Systems Builder', 'Hackathon Winner'],
  location: 'New Delhi, India',
  email: 'atharvlamba56@gmail.com',
  github: 'https://github.com/Atharv56-coder',
  linkedin: 'https://www.linkedin.com/in/atharv-lamba-8818032b9/',
  resume: `${import.meta.env.BASE_URL}Atharv_Lamba_Resume.pdf`,
  summary:
    'IT undergraduate at Delhi Technological University (Department Rank II) building applied AI systems in speech, vision and LLMs. Two-time hackathon winner, including the AIMS-DTU × Google DeepMind hackathon, and GSSoC 2026 contributor.',
}

export const stats = [
  { value: 9.65, decimals: 2, suffix: '', label: 'CGPA at DTU' },
  { value: 99.85, decimals: 2, suffix: '%', label: 'Deepfake detection accuracy' },
  { value: 2, decimals: 0, suffix: '×', label: 'Hackathon wins' },
  { value: 99.2, decimals: 1, suffix: '', label: 'JEE Main percentile' },
]

export const education = [
  { school: 'Delhi Technological University', detail: 'B.Tech, Information Technology · CGPA 9.65 · Dept. Rank II', time: '2025 – Present' },
  { school: 'Delhi City School', detail: 'Class XII (CBSE) · 91.2% · JEE Main 99.2 %ile · Qualified JEE Advanced', time: '2025' },
  { school: 'Sachdeva Public School, Rohini', detail: 'Class X (CBSE) · 94.6%', time: '2023' },
]

export const projects = [
  {
    id: 'deepfake',
    featured: true,
    tag: 'speech',
    title: 'Real-Time Voice Deepfake Detection',
    subtitle: 'Smart India Hackathon',
    blurb: 'Live synthetic-voice detection during phone calls, across Indian languages.',
    metrics: [
      { k: '99.85%', v: 'accuracy' },
      { k: '0.16%', v: 'EER' },
      { k: '9', v: 'languages' },
    ],
    points: [
      'Fine-tuned an XLSR-Mamba anti-spoofing model to detect cloned voices in 5 Indian languages, robust even on WhatsApp-style Opus-compressed audio.',
      'Generalised without extra training to 4 more languages (98–100% accuracy).',
      'Built an ASVspoof5 baseline (2.77% EER) and deployed the model in a live call-monitoring system that flags risk in real time.',
    ],
    stack: ['PyTorch', 'XLSR-Mamba', 'FastAPI', 'ONNX'],
    link: 'https://github.com/Atharv56-coder/Gadbad-Ghotala',
  },
  {
    id: 'vcr',
    featured: true,
    tag: 'vision',
    title: 'Visual Commonsense Reasoning',
    subtitle: 'AIMS-DTU',
    blurb: 'Teaching a 7B vision-language model to answer — and justify — questions about images.',
    metrics: [
      { k: '72%', v: 'Q→A' },
      { k: '63.5%', v: 'QA→R' },
      { k: '<1%', v: 'params trained' },
    ],
    points: [
      'Fine-tuned Qwen2.5-VL-7B with QLoRA (<1% of parameters trained): 72% Q→A, 63.5% QA→R, 50% joint accuracy vs a 25% random baseline.',
      'Built a visual-grounding pipeline that draws boxes around the people each question refers to.',
      'Fixed bugs in the training loss and evaluation code.',
    ],
    stack: ['Qwen2.5-VL-7B', 'QLoRA', 'PyTorch'],
    link: 'https://github.com/Atharv56-coder/VCR-AIMS',
  },
  {
    id: 'contramesh',
    featured: true,
    tag: 'llm',
    title: 'ContraMesh — AI Contract Analysis',
    subtitle: 'LLM + formal verification',
    blurb: 'An LLM reads the contract; an SMT solver proves where it contradicts itself.',
    metrics: [
      { k: 'Z3', v: 'SMT proofs' },
      { k: '3-tier', v: 'inference fallback' },
      { k: 'KL', v: 'fairness score' },
    ],
    points: [
      'Gemma 2 extracts contract obligations; a Z3 SMT solver proves which clauses contradict each other.',
      'KL-divergence scores how one-sided each clause is.',
      'Three-tier inference fallback: Google AI Studio API → local vLLM on two GPUs → regex parser.',
    ],
    stack: ['Gemma 2', 'Z3 SMT', 'vLLM', 'FastAPI', 'React'],
    link: 'https://github.com/Atharv56-coder/ContraMesh',
  },
  {
    id: 'beforeyousign',
    tag: 'llm',
    title: 'BeforeYouSign',
    subtitle: '1st Place · AIMS-DTU × Google DeepMind',
    blurb: 'Legal-tech tool that flags risky contract clauses using Gemma 4 running fully locally.',
    stack: ['Gemma 4', 'Local inference'],
    link: 'https://github.com/Atharv56-coder',
  },
  {
    id: 'drone',
    tag: 'vision',
    title: 'Hand-Gesture-Controlled Drone',
    subtitle: 'AIMS-DTU',
    blurb: 'Computer vision + deep learning turn the pilot’s hand into a remote: 8 commands at under 30 ms latency.',
    stack: ['OpenCV', 'MediaPipe', 'Python'],
    link: 'https://github.com/Atharv56-coder/Hand-Gesture-Controlled-Drone-Software_AIMS',
  },
  {
    id: 'gesture-sys',
    tag: 'vision',
    title: 'Gesture-Controlled System Commands',
    subtitle: 'AIMS-DTU',
    blurb: 'Control your desktop — volume, media, windows — with hand gestures tracked from a webcam.',
    stack: ['MediaPipe', 'TypeScript'],
    link: 'https://github.com/Atharv56-coder/Gesture-Controlled-System-Commands-Software-AIMS',
  },
  {
    id: 'resurank',
    tag: 'llm',
    title: 'ResuRank AI',
    subtitle: 'Resume screener',
    blurb: 'AI resume screener that ranks candidates against a job description.',
    stack: ['TypeScript', 'LLMs'],
    link: 'https://github.com/Atharv56-coder/Resume-Screener',
  },
]

export const filters = [
  { id: 'all', label: 'All' },
  { id: 'speech', label: 'Speech' },
  { id: 'vision', label: 'Vision' },
  { id: 'llm', label: 'LLMs' },
]

export const timeline = [
  { time: '2026', title: 'First Place — AIMS-DTU × Google DeepMind Hackathon', body: 'Built BeforeYouSign, a legal-tech tool that flags risky contract clauses using Gemma 4 locally.', kind: 'award' },
  { time: '2026', title: 'Best Real-World Impact Award — Synapse AI Hackathon', body: 'DTU · 640+ participants from 100+ colleges.', kind: 'award' },
  { time: 'May – Aug 2026', title: 'Open Source Contributor — GirlScript Summer of Code', body: 'Contributing to open-source projects as part of GSSoC 2026.', kind: 'work' },
  { time: 'Oct 2025 – Present', title: 'Member — AIMS-DTU, AI/ML Society', body: 'Built the VCR, gesture-drone and gesture-control projects as society work.', kind: 'work' },
  { time: 'Certifications', title: 'Deep Learning & Machine Learning Specializations', body: 'DeepLearning.AI · Stanford & DeepLearning.AI.', kind: 'cert' },
  { time: 'Ongoing', title: 'LeetCode — 221 problems, contest rating 1,480', body: 'Data structures and algorithms practice in C++.', kind: 'cert' },
]

export const skills = [
  { group: 'Languages', items: ['C++', 'Python', 'C', 'JavaScript', 'TypeScript'] },
  { group: 'AI / ML', items: ['PyTorch', 'TensorFlow', 'Scikit-learn', 'QLoRA', 'ONNX', 'vLLM', 'OpenCV', 'MediaPipe', 'NumPy', 'Pandas'] },
  { group: 'Models', items: ['XLSR-Mamba', 'Qwen2.5-VL', 'Gemma 2', 'Gemma 4'] },
  { group: 'Web & Tools', items: ['FastAPI', 'React', 'Tailwind CSS', 'WebSockets', 'Electron', 'Git', 'Z3 SMT Solver'] },
]

export const services = [
  {
    title: 'SPEECH',
    sub: 'Audio & voice AI',
    body: 'Anti-spoofing and voice-deepfake detection that holds up on compressed, real-world call audio, across Indian languages.',
    tags: ['XLSR-Mamba', 'PyTorch', 'ONNX', 'ASVspoof5', 'FastAPI', 'WebSockets'],
  },
  {
    title: 'VISION',
    sub: 'Seeing & reasoning',
    body: 'Vision-language models that answer and justify questions about images, plus real-time hand tracking that drives drones and desktops.',
    tags: ['Qwen2.5-VL', 'QLoRA', 'OpenCV', 'MediaPipe', 'Visual grounding'],
  },
  {
    title: 'LANGUAGE',
    sub: 'LLM systems',
    body: 'LLM pipelines with guarantees: Gemma extracts contract obligations, an SMT solver proves contradictions, and inference falls back gracefully.',
    tags: ['Gemma', 'vLLM', 'Z3 SMT', 'React', 'FastAPI'],
  },
]

export const career = [
  {
    role: 'B.Tech, Information Technology',
    org: 'Delhi Technological University',
    year: '2025',
    body: 'CGPA 9.65/10 and Department Rank II. Joined after a 99.2 percentile in JEE Main and qualifying JEE Advanced.',
  },
  {
    role: 'Member, AI/ML Society',
    org: 'AIMS-DTU',
    year: '2025',
    body: 'Built the Visual Commonsense Reasoning, gesture-controlled drone and gesture-controlled system projects as society work.',
  },
  {
    role: 'Hackathon Winner ×2',
    org: 'Google DeepMind × AIMS-DTU · Synapse AI',
    year: '2026',
    body: 'First place with BeforeYouSign (Gemma 4, fully local). Best Real-World Impact Award among 640+ participants from 100+ colleges.',
  },
  {
    role: 'Open Source Contributor',
    org: 'GirlScript Summer of Code',
    year: 'NOW',
    body: 'Contributing to open-source projects through GSSoC 2026, May to August.',
  },
]
