import type { StaticImageData } from "next/image";

import glHero from "@/assets/img/shots/glucosense-hero.jpg";
import glScreener from "@/assets/img/shots/glucosense-screener.jpg";
import glBayes from "@/assets/img/shots/glucosense-bayes.jpg";
import glReport from "@/assets/img/shots/glucosense-report.jpg";
import glFit from "@/assets/img/shots/glucosense-fit.jpg";
import glGraphs from "@/assets/img/shots/glucosense-graphs.jpg";
import slHero from "@/assets/img/shots/strengthlab-hero.jpg";
import slDesigner from "@/assets/img/shots/strengthlab-designer.jpg";
import slRegression from "@/assets/img/shots/strengthlab-regression.jpg";
import slKernels from "@/assets/img/shots/strengthlab-kernels.jpg";
import slClassifiers from "@/assets/img/shots/strengthlab-classifiers.jpg";
import slReport from "@/assets/img/shots/strengthlab-report.jpg";
import kHome from "@/assets/img/shots/kala-01-home.jpg";
import kJourneys from "@/assets/img/shots/kala-02-journeys.jpg";
import kTimeline from "@/assets/img/shots/kala-03-timeline.jpg";
import kArtifact from "@/assets/img/shots/kala-04-artifact.jpg";
import kTrail from "@/assets/img/shots/kala-05-map-trail.jpg";
import kPlace from "@/assets/img/shots/kala-06-map-place.jpg";
import kFusion from "@/assets/img/shots/kala-07-fusion-hero.jpg";
import kArtwork from "@/assets/img/shots/kala-08-artwork.jpg";
import kLayers from "@/assets/img/shots/kala-09-artwork-layers.jpg";
import kStudio from "@/assets/img/shots/kala-10-studio.jpg";
import islTraining from "@/assets/img/shots/isl-training.jpg";

export type Emblem = "hand" | "gauge" | "rain" | "cube" | "warli" | "map";

export type Stat = { value: string; label: string };

export type Shot = { src: StaticImageData; caption: string };

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  year: string;
  context: string;
  role: string;
  team: string;
  stack: string[];
  stat: Stat;
  stats: Stat[];
  emblem: Emblem;
  links: { label: string; href: string }[];
  problem: string[];
  features: { title: string; body: string }[];
  how: string[];
  contribution?: string[];
  results?: string[];
  shots: Shot[];
  wideShot?: Shot;
};

export const projects: Project[] = [
  {
    slug: "isl-recognition",
    name: "ISL Recognition",
    tagline: "Real-time Indian Sign Language recognition in the browser.",
    summary:
      "A full-stack system that reads 296 Indian Sign Language words from a webcam as they're signed, builds them into sentences and learns new signs from four examples.",
    year: "2026",
    context: "Independent project",
    role: "Model, API and interface",
    team: "Solo",
    stack: ["TensorFlow", "MediaPipe", "FastAPI", "WebSockets", "React", "Celery", "Redis", "Docker"],
    stat: { value: "92.2%", label: "Val accuracy · 296 signs" },
    stats: [
      { value: "92.2%", label: "Validation accuracy" },
      { value: "89.9%", label: "Test accuracy" },
      { value: "296", label: "ISL words recognised" },
      { value: "~10 fps", label: "Live recognition" },
    ],
    emblem: "hand",
    links: [{ label: "GitHub", href: "https://github.com/krishkavin7512/Indian-Sign-Language-Detection-System" }],
    problem: [
      "Very few hearing people can read Indian Sign Language, and interpreters are scarce outside big institutions. Everyday conversations, at a counter or in a classroom, still depend on someone in the room knowing the language.",
      "The goal was a recogniser that needs nothing more than a webcam and a browser, runs live, and can be taught a new sign on the spot.",
    ],
    features: [
      { title: "Live recognition", body: "Webcam frames stream to the model over a binary WebSocket and come back as words at around ten frames a second." },
      { title: "Landmark overlay", body: "Both hands and the upper body are tracked and drawn on the video, so you can see exactly what the model sees." },
      { title: "Teach mode", body: "Record four samples of any new sign and it's recognised immediately, matched by cosine similarity with no retraining." },
      { title: "Sentence builder", body: "Recognised words accumulate into sentences, with every sign labelled in English and Hindi." },
    ],
    how: [
      "MediaPipe Holistic turns each frame into 75 landmarks (both hands and the pose), a 258-value feature vector. Missing hands are zero-padded so timing stays aligned.",
      "A sliding window of 45 frames feeds a two-layer bidirectional LSTM (256 units each) with an attention layer over time and a dense classification head.",
      "Temperature scaling (T = 3.0) calibrates the confidence, so the interface only commits to a word when the model is genuinely sure.",
      "FastAPI serves REST and WebSocket endpoints; long video uploads go through a Celery and Redis job queue, and the whole stack starts with one docker compose command.",
    ],
    results: [
      "92.2% validation and 89.9% test accuracy on the INCLUDE dataset (IIT Madras), across 296 word classes.",
      "Trained in about 25 minutes on a laptop RTX 4060, with label smoothing and a cosine learning-rate schedule.",
    ],
    shots: [],
    wideShot: { src: islTraining, caption: "Training history: accuracy and loss over epochs" },
  },
  {
    slug: "glucosense",
    name: "GlucoSense",
    tagline: "Diabetes risk screening from 21 questions, before any blood test.",
    summary:
      "A screener that turns 21 simple health questions into a calibrated diabetes risk, a clear test-or-not recommendation and the reasons behind it. The model is written from scratch in NumPy.",
    year: "2026",
    context: "Machine learning project",
    role: "Modelling, API and interface",
    team: "—",
    stack: ["Python", "NumPy", "FastAPI", "Plotly.js"],
    stat: { value: "253,680", label: "Survey responses · from scratch" },
    stats: [
      { value: "253,680", label: "People in the training data" },
      { value: "0.807", label: "ROC AUC on unseen people" },
      { value: "79.4%", label: "Real cases caught" },
      { value: "0", label: "ML libraries in the model" },
    ],
    emblem: "gauge",
    links: [{ label: "GitHub", href: "https://github.com/krishkavin7512/GlucoSense" }],
    problem: [
      "India had about 101 million adults with diabetes and another 136 million with prediabetes in 2021 (ICMR-INDIAB, The Lancet Diabetes & Endocrinology, 2023). Prediabetes is silent and often reversible, but only if it's caught.",
      "Blood tests don't scale to everyone, so health workers triage with questionnaires first. GlucoSense is that questionnaire, with an honest probability and an explanation instead of a bare score.",
    ],
    features: [
      { title: "Calibrated risk", body: "A live gauge that updates as you answer. When it says 20%, about 20 in 100 people like you have diabetes." },
      { title: "Test recommendation", body: "Get a blood test or not, at a sensitivity you choose, from catching half of cases to catching 95%." },
      { title: "The evidence", body: "Every answer is shown as an odds multiplier, so you can see what pushes your risk up or down." },
      { title: "Labs", body: "A Bayes lab, a distributions lab, live curve fitting and a page explaining all 32 training charts." },
    ],
    how: [
      "A Naive Bayes classifier written from scratch: Bernoulli and categorical likelihoods learned by counting with Laplace smoothing, and a log-normal density for BMI. Everything runs in log space.",
      "Raw Naive Bayes scores are overconfident, so they're calibrated with 30 equal-count bins and pool-adjacent-violators. Log-loss drops from 0.512 to 0.327 with the ranking untouched.",
      "The decision threshold is the highest score that still catches at least 80% of real cases on validation data, because a missed case costs far more than an extra test.",
      "A regularised polynomial fit draws the population risk curve against BMI. The full training pipeline runs in about 30 seconds on a laptop CPU.",
    ],
    results: [
      "Measured once, on 38,052 people the model never saw: ROC AUC 0.807 (5-fold CV 0.811 ± 0.003), 79.4% recall and precision at twice the base rate.",
      "17 automated tests, with scikit-learn used only as a reference to check the from-scratch maths.",
    ],
    shots: [
      { src: glHero, caption: "Landing page" },
      { src: glScreener, caption: "The 21-question screener" },
      { src: glBayes, caption: "Bayes lab" },
      { src: glReport, caption: "Test-set report" },
      { src: glFit, caption: "Live curve fitting" },
      { src: glGraphs, caption: "Training graphs, explained" },
    ],
  },
  {
    slug: "raincheck",
    name: "RainCheck",
    tagline: "Parametric income insurance for India's food-delivery riders.",
    summary:
      "When rain, floods or toxic air stop deliveries, riders stop earning. RainCheck pays out automatically the moment a weather threshold is crossed. No claim forms, no adjusters.",
    year: "2026",
    context: "Guidewire DEVTrails 2026 · Team CEIL",
    role: "Flutter rider app",
    team: "Team CEIL",
    stack: ["Flutter", "Firebase", "Express", "MongoDB", "Flask", "XGBoost", "Razorpay"],
    stat: { value: "< 2 min", label: "Trigger to payout" },
    stats: [
      { value: "< 2 min", label: "From trigger to payout" },
      { value: "₹35–75", label: "Weekly premium" },
      { value: "3", label: "XGBoost models" },
      { value: "0", label: "Claim forms" },
    ],
    emblem: "rain",
    links: [{ label: "GitHub", href: "https://github.com/krishkavin7512/DevTrails" }],
    problem: [
      "India's food-delivery platforms run on millions of gig riders. A single day of heavy rain or flooding can cost a rider ₹500–950, and fewer than 4% of them have any insurance at all.",
      "Traditional insurance can't serve them: lost income is hard to verify, an adjuster costs more than the claim, and a ₹50 weekly premium can't carry the overhead.",
    ],
    features: [
      { title: "Parametric triggers", body: "Live rain, AQI and flood data are checked against thresholds. When one is crossed, claims are created for every covered rider in the zone." },
      { title: "AI underwriting", body: "XGBoost models price the weekly premium, profile each rider's risk and score every claim for fraud." },
      { title: "Anti-spoofing", body: "A behavioural coherence score catches GPS spoofing and coordinated fraud before money moves." },
      { title: "Instant payout", body: "Verified claims are paid straight to UPI in under two minutes, often before the rider thinks to ask." },
    ],
    how: [
      "Phase 1 proved the idea as a web platform: an Express and MongoDB backend, a Python/Flask ML service with three XGBoost models, and a live trigger engine across ten cities.",
      "Phase 2 put it in riders' hands as a native Flutter app, the part I built.",
    ],
    contribution: [
      "Firebase Auth with Google Sign-In and phone OTP, and a six-step onboarding flow with a live ML risk meter.",
      "A real-time dashboard with weather status, a minimap and a community hazard heatmap.",
      "Claims with an appeal flow and earnings-proof upload, plus an emergency SOS with swipe-to-confirm.",
      "Razorpay subscriptions, push notifications, haptics and an offline fallback.",
    ],
    shots: [],
  },
  {
    slug: "strengthlab",
    name: "StrengthLab",
    tagline: "Predict concrete strength from the mix recipe, 28 days early.",
    summary:
      "Type in a concrete mix and get its predicted strength with an honest error band, the chance it passes its IS grade and the IS 456 durability checks, before anything is cast.",
    year: "2026",
    context: "Machine learning project",
    role: "Modelling, API and interface",
    team: "—",
    stack: ["Python", "NumPy", "FastAPI", "Plotly.js"],
    stat: { value: "R² 0.940", label: "12 models from scratch" },
    stats: [
      { value: "1,030", label: "Real lab cube tests" },
      { value: "12", label: "Models written from their equations" },
      { value: "0.940", label: "R², strength explained" },
      { value: "90.7%", label: "Pass/fail accuracy (M30)" },
    ],
    emblem: "cube",
    links: [{ label: "GitHub", href: "https://github.com/krishkavin7512/StrengthLab" }],
    problem: [
      "Indian practice specifies concrete by grade: M30 must reach 30 MPa at 28 days (IS 456:2000). The only way to confirm it is to crush test cubes, and by day 28 the slab above is often already built.",
      "Getting a mix right takes trial batches, cement and time, and every ingredient affects strength non-linearly.",
    ],
    features: [
      { title: "Strength with a band", body: "Predicted MPa at any age with a 95% interval from a Bayesian kernel model." },
      { title: "Grade check", body: "The probability of reaching M20–M40, with seven classifiers voting pass or fail." },
      { title: "Durability", body: "IS 456 Table 5 limits for the chosen exposure: minimum binder, maximum water/binder ratio, minimum grade." },
      { title: "Greener mixes", body: "A rough embodied-CO₂ estimate, so slag and fly ash can be tried in place of cement." },
    ],
    how: [
      "Six regressors and six classifiers, each implemented from its equations in NumPy and trained on 1,030 real laboratory cube tests.",
      "Kernel choice matters: test R² climbs from 0.852 (linear) through 0.934 (cubic) to 0.940 with an RBF kernel.",
      "A kernel lab lets you drag γ and λ while the server refits the model live on 704 mixes, and a decision-boundary explorer shows every classifier.",
      "16 tests, with scikit-learn used only as a reference implementation.",
    ],
    results: [
      "Typical error of 4.3 MPa and R² 0.940 on held-out mixes.",
      "Pass/fail accuracy from 83% to 97% across the five grades; 90.7% for M30.",
    ],
    shots: [
      { src: slHero, caption: "Landing page" },
      { src: slDesigner, caption: "Mix designer" },
      { src: slRegression, caption: "Regression lab" },
      { src: slKernels, caption: "Kernel lab" },
      { src: slClassifiers, caption: "Classifier comparison" },
      { src: slReport, caption: "Test-set report" },
    ],
  },
  {
    slug: "kala",
    name: "KALĀ",
    tagline: "Three interactive journeys through 5,000 years of Indian art.",
    summary:
      "Kalā means art; kāla means time. A museum walk through ten eras, an atlas of where India's art traditions were born, and an original Warli × Kalamkari artwork drawn entirely in code.",
    year: "2026",
    context: "Team project",
    role: "Co-creator",
    team: "Team of 4",
    stack: ["JavaScript", "GSAP", "Lenis", "D3", "SVG"],
    stat: { value: "5,000 yrs", label: "10 eras · 35 places" },
    stats: [
      { value: "28", label: "Artifacts across 10 eras" },
      { value: "35", label: "Places on the atlas" },
      { value: "67", label: "Archival photographs" },
      { value: "0", label: "Frameworks" },
    ],
    emblem: "warli",
    links: [
      { label: "Live site", href: "https://kala-indianart.vercel.app" },
      { label: "GitHub", href: "https://github.com/krishkavin7512/Kala-Indian-Art" },
    ],
    problem: [
      "Indian art is usually presented as a list of names and dates. We wanted it to feel like walking through a museum, reading a map and watching a painting being made.",
    ],
    features: [
      { title: "Kāla, the timeline", body: "Scrolling becomes a sideways walk through ten halls, from the Indus cities to the modern age, with lit display cases, deep zoom and real 3D museum scans." },
      { title: "Deśa, the atlas", body: "A custom SVG map from Survey of India boundaries with 35 places and animated trails showing how styles travelled." },
      { title: "Saṅgam, the fusion", body: "An original artwork fusing Warli and Kalamkari, generated as five SVG layers you can isolate, explode in 3D or remix in a studio." },
    ],
    how: [
      "Hand-written HTML, CSS and JavaScript with no framework. Motion uses GSAP (ScrollTrigger, SplitText, Flip) and Lenis smooth scrolling.",
      "D3 handles the map projection (Lambert conformal conic) and zoom; boundary data is simplified and pre-projected into SVG paths.",
      "The Warli and Kalamkari motifs are procedural SVG functions shared by the artwork, the hero and the studio.",
      "Textures are baked into cached raster patterns, off-screen sections skip rendering, and an optional tanpura drone is synthesised live with the Web Audio API.",
    ],
    shots: [
      { src: kHome, caption: "Home: three journeys" },
      { src: kTimeline, caption: "Kāla: the museum walk" },
      { src: kArtifact, caption: "Artifact detail" },
      { src: kTrail, caption: "Deśa: a trail of influence" },
      { src: kPlace, caption: "Place detail" },
      { src: kFusion, caption: "Saṅgam: split-screen hero" },
      { src: kArtwork, caption: "The Tree of Life and the Tarpa Dance" },
      { src: kLayers, caption: "The artwork, exploded into layers" },
      { src: kStudio, caption: "Fusion studio" },
      { src: kJourneys, caption: "Choosing a journey" },
    ],
  },
  {
    slug: "wsf",
    name: "WSF",
    tagline: "An AI safety system that acts before anyone presses SOS.",
    summary:
      "A women's safety platform that learns where incidents happen, routes people around danger and escalates on its own when something goes wrong, even if the phone is out of reach.",
    year: "2026",
    context: "Team project",
    role: "Location tracking and data layer",
    team: "Team",
    stack: ["Flutter", "FastAPI", "Supabase", "PostGIS", "scikit-learn", "TFLite", "Next.js", "Mapbox"],
    stat: { value: "50 m", label: "Drift → silent check → SOS" },
    stats: [
      { value: "250 m", label: "Threat-zone clustering radius" },
      { value: "50 m", label: "Route drift that starts a check" },
      { value: "30 s", label: "Silent window before escalation" },
      { value: "On-device", label: "Audio threat detection" },
    ],
    emblem: "map",
    links: [{ label: "GitHub", href: "https://github.com/VishaalPillay/WSF" }],
    problem: [
      "Most safety apps are a button. In the moments that matter, pressing it is often impossible.",
      "WSF watches, routes and listens, and acts on its own when the signals say something is wrong.",
    ],
    features: [
      { title: "Threat zones", body: "Incident points are clustered with DBSCAN and wrapped in concave hulls stored in PostGIS. Zones shift with time of day and severity." },
      { title: "SafeNav routing", body: "Routes that pass within 50 m of a red zone are flagged, and the safest of the fastest three is chosen." },
      { title: "Drift protocol", body: "Leave the safe route by more than 50 m for 30 seconds and the app checks in silently. No answer means an automatic SOS." },
      { title: "Edge audio sentinel", body: "YAMNet runs on the phone and listens for screams, impacts or breaking glass. Audio never leaves the device." },
    ],
    how: [
      "Flutter mobile app, FastAPI backend, Supabase with PostGIS for auth, real-time location and geospatial zones, and a Next.js + Mapbox command dashboard for dispatchers.",
      "Battery-first tracking hands location to the native OS geofencing layer, so the CPU only wakes every ten metres.",
    ],
    contribution: [
      "Rebuilt the location-tracking pipeline on top of native background geolocation.",
      "Unified the Supabase schema so the app, the backend and the dashboard share one source of truth.",
    ],
    shots: [],
  },
];

export type Archived = {
  name: string;
  year: string;
  summary: string;
  tags: string[];
  href?: string;
  preview: "ticket" | "wafer" | "goa" | "snake" | "tetris";
  note?: string;
};

export const archive: Archived[] = [
  {
    name: "Pro-Techt",
    year: "2025",
    summary: "Warranty and service-centre portal with product tracking, OCR and barcode capture, chat and SLA analytics.",
    tags: ["React", "TypeScript", "Supabase"],
    href: "https://github.com/GoutamAdityan/PRO-TECHT",
    preview: "ticket",
  },
  {
    name: "Semiconductor Defect Detection",
    year: "2026",
    summary: "EfficientNet-B0 classifier for eight wafer defect types, exported to TFLite for NXP eIQ edge hardware.",
    tags: ["TensorFlow", "Computer vision", "Edge AI"],
    href: "https://github.com/krishkavin7512/Semiconductor-Defect-Detection-System",
    preview: "wafer",
  },
  {
    name: "Goa 13",
    year: "2026",
    summary: "Trip app for 13 people in 4 families: what's on now, the full plan, an expense splitter and a lock-screen tracker.",
    tags: ["React", "Supabase", "PWA"],
    preview: "goa",
    note: "Private",
  },
  {
    name: "Tetris",
    year: "2026",
    summary: "All seven tetrominoes, ghost piece, hold, next queue and level progression.",
    tags: ["Python", "Pygame"],
    href: "https://github.com/krishkavin7512/Tetris",
    preview: "tetris",
  },
  {
    name: "Snake",
    year: "2026",
    summary: "The classic, rebuilt in Python and Pygame.",
    tags: ["Python", "Pygame"],
    href: "https://github.com/krishkavin7512/Snake-Game",
    preview: "snake",
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
